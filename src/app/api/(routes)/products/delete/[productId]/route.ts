import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { deleteFile } from '@/app/api/utils/deleteFile'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) {
	try {
		const productId = parseInt((await params).productId, 10)
		if (isNaN(productId)) throw new ApiError('Invalid product ID parameter', 400)

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: { items: true }
		})

		if (!product) throw new ApiError('Product not found', 404)

		// Delete all product items and their associated images
		for (const item of product.items) {
			// Delete item images
			if (item.images && Array.isArray(item.images)) {
				for (const image of item.images) {
					if (image) {
						try {
							await deleteFile(image, req)
						} catch (error) {
							console.warn(`Failed to delete file: ${image}`, error)
						}
					}
				}
			}
		}

		// Delete product info
		await prisma.productInfo.deleteMany({
			where: { productId }
		})

		// Delete all product items
		await prisma.productItem.deleteMany({
			where: { productId }
		})

		// Delete the product itself
		await prisma.product.delete({ where: { id: productId } })

		return NextResponse.json({ ok: true }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
