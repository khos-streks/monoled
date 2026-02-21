import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const slides = await prisma.slide.findMany()
		return NextResponse.json(slides, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
