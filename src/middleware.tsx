import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOKEN } from './typing/enums'
import { prisma } from '@/prisma/prisma-client'
import axios from 'axios'
import { Admin } from '@prisma/client'

const protectedRoutes = ['/admin', '/admin/:path*']

export async function middleware(request: NextRequest) {
	if (protectedRoutes.includes(request.nextUrl.pathname)) {
		try {
			const token = request.cookies.get(TOKEN.ADMIN_ACCESS_TOKEN)?.value
			const decoded = (
				await axios.post<{ login: string }>(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify`, {
					token
				})
			).data
			const admins = (await axios.get<Admin[]>(`${process.env.NEXT_PUBLIC_API_URL}/admin/all`)).data
			const admin = admins.find(admin => admin.login === decoded.login)
			if (admin) return NextResponse.next()
			return NextResponse.redirect(new URL('/admin-login', request.url))
		} catch {
			return NextResponse.redirect(new URL('/admin-login', request.url))
		}
	}

	const isLoginPage = request.nextUrl.pathname.includes('admin-login')

	if (isLoginPage) {
		const token = request.cookies.get(TOKEN.ADMIN_ACCESS_TOKEN)?.value
		if (!token) return NextResponse.next()
		return NextResponse.redirect(new URL('/admin', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/admin/:path*', '/admin-login/:path*']
}
