import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'

export async function POST(request: Request) {
	try {
		const { token } = await request.json()
		if (!token) throw new ApiError('JWT must be provided', 400)
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { login: string }

		if (!decoded || !decoded.login) {
			return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
		}

		return NextResponse.json({ login: decoded.login })
	} catch (error) {
		console.error('JWT Error:', error)
		return handleApiError(error)
	}
}
