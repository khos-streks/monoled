import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const categories = await prisma.category.findMany()
		return NextResponse.json(categories, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
