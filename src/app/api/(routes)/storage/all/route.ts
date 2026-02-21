import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../admin/auth/utils/checkIsAdmin'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { ApiError } from '@/app/api/exceptions/apiError'
import { getFiles } from '@/app/api/utils/getFiles'

export async function GET(req: NextRequest) {
	try {
		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const files = await getFiles(req)

		return NextResponse.json(files, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
