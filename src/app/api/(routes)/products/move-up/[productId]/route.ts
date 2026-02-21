import { ApiError } from '@/app/api/exceptions/apiError'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'
import { handleApiError } from '@/app/api/exceptions/handleApiError'

const prisma = new PrismaClient()

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) {
	try {
		const productId = Number((await params).productId)

		if (!productId) throw new ApiError('Product ID is required', 400)

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const product = await prisma.product.findUnique({
			where: { id: productId },
			select: { order: true }
		})

		if (!product) throw new ApiError('Product not found', 404)

		const higherProduct = await prisma.product.findFirst({
			where: { order: { lt: product.order } },
			orderBy: { order: 'desc' }
		})

		if (!higherProduct) throw new ApiError('Цей товар вже найвищий в списку', 400)

		await prisma.$transaction([
			prisma.product.update({
				where: { id: higherProduct.id },
				data: { order: product.order }
			}),
			prisma.product.update({
				where: { id: productId },
				data: { order: higherProduct.order }
			})
		])

		return NextResponse.json({ ok: true }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
