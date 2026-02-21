import jwt from 'jsonwebtoken'
import { TOKEN } from '@/typing/enums'
import { NextRequest } from 'next/server'
import { prisma } from '@/prisma/prisma-client'

export async function checkIsAdmin(req: NextRequest): Promise<boolean> {
	try {
		const token = req.cookies.get(TOKEN.ADMIN_ACCESS_TOKEN)?.value

		if (!token) {
			console.error('Token is missing or undefined')
			return false
		}

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as {
			login: string
		} | null
		const user = await prisma.admin.findUnique({ where: { login: decoded?.login } })

		if (!decoded || !decoded.login || !user) {
			console.error('Decoded token is invalid or missing login')
			return false
		}

		return true
	} catch (error: any) {
		console.error('Error verifying token:', error.message)
		return false
	}
}
