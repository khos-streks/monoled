import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const admins = await prisma.admin.findMany()
		return NextResponse.json(admins, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
