import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'
import { ApiError } from '@/app/api/exceptions/apiError'
import { prisma } from '@/prisma/prisma-client'

export async function DELETE(
	req: NextRequest,
	params: {
		params: Promise<{ id: string }>
	}
) {
	try {
		const id = Number((params.params as any).id)

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		await prisma.admin.delete({ where: { id } })
		return NextResponse.json({ ok: true }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
