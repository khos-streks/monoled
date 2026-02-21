import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { ApiError } from '@/app/api/exceptions/apiError'
import { deleteFile } from '@/app/api/utils/deleteFile'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ title: string }> }) {
	try {
		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const title = (await params).title
		await deleteFile(`${process.env.NEXT_PUBLIC_STORAGE_URL}/uploads/${title}`, req)

		return NextResponse.json({ ok: true }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
