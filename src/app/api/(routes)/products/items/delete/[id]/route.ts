import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../../admin/auth/utils/checkIsAdmin'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const id = parseInt((await params).id)
		if (isNaN(id)) throw new ApiError('Invalid product item ID', 400)

		// Delete the product item
		await prisma.productItem.delete({
			where: { id }
		})

		return NextResponse.json(
			{ ok: true },
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
	} catch (error) {
		return handleApiError(error)
	}
}
