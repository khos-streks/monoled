import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'
import { ApiError } from '@/app/api/exceptions/apiError'
import { prisma } from '@/prisma/prisma-client'
import { api } from '@/services/axios'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const id = parseInt((await params).id, 10)
		if (isNaN(id)) throw new ApiError('Invalid ID parameter', 400)

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const slide = await prisma.slide.findUnique({ where: { id } })
		if (!slide) throw new ApiError('Slide not found', 404)

		if (slide.background) {
			try {
				await api.delete(slide.background)
			} catch (error) {
				console.warn(`Failed to delete file: ${slide.background}`, error)
			}
		}

		await prisma.slide.delete({ where: { id } })

		return NextResponse.json({ ok: true }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
