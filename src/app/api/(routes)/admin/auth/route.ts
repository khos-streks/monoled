import { AdminDto } from '@/app/api/dtos/adminDto'
import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { TOKEN } from '@/typing/enums'
import { tokenService } from './tokens'

const MAX_ATTEMPTS = 5
const LOCK_TIME = 30 * 60 * 1000

const getIp = (req: Request) => {
	const forwarded = req.headers.get('x-forwarded-for')
	return forwarded
		? forwarded.split(',')[0]
		: req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || 'unknown'
}

export async function POST(req: Request) {
	try {
		const ip = getIp(req)
		if (!ip) throw new ApiError('Не вдалося визначити IP', 400)

		const failedAttempt = await prisma.failedLoginAttempt.findUnique({
			where: { ip }
		})

		const isLocked = failedAttempt && failedAttempt.attempts + 1 >= MAX_ATTEMPTS
		const newLockUntil = isLocked ? new Date(Date.now() + LOCK_TIME) : null

		if (
			failedAttempt &&
			failedAttempt.attempts >= MAX_ATTEMPTS &&
			failedAttempt.lockUntil &&
			new Date() < failedAttempt.lockUntil
		) {
			throw new ApiError('Занадто багато спроб входу. Спробуйте пізніше', 429)
		}

		let userData
		try {
			const body = await req.json()
			const { email, password } = body
			if (!email || !password) throw new ApiError('Пароль або пошта відсутня', 400)
			userData = await loginFunc({ login: email, password })
		} catch (error) {
			await prisma.failedLoginAttempt.upsert({
				where: { ip },
				update: {
					attempts: { increment: 1 },
					lockUntil: newLockUntil
				},
				create: { ip, attempts: 1, lockUntil: null }
			})
			throw new ApiError('Логін або пароль не вірний', 400)
		}

		await prisma.failedLoginAttempt.deleteMany({ where: { ip } })

		const res = NextResponse.json(userData, { status: 200 })
		res.cookies.set({
			name: TOKEN.ADMIN_ACCESS_TOKEN,
			value: userData.accessToken,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			sameSite: 'lax',
			maxAge: 60 * 30
		})

		return res
	} catch (error) {
		return handleApiError(error)
	}
}

const loginFunc = async ({ login, password }: { login: string; password: string }) => {
	// check if admin exists
	const admin = await prisma.admin.findUnique({
		where: { login }
	})
	if (!admin) throw new ApiError('Логін або пароль не вірний', 400)

	// check if password is correct
	const isPasswordCorrect = await bcrypt.compare(password, admin.password)
	if (!isPasswordCorrect) throw new ApiError('Логін або пароль не вірний', 400)

	// create tokens
	const adminDto = new AdminDto(admin)
	const tokens = tokenService.generateAdminAccessToken({ ...adminDto })

	// Return
	return {
		...tokens,
		user: adminDto
	}
}
