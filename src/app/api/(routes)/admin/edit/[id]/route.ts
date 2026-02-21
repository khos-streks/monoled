import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import Joi from 'joi'
import { ApiError } from '@/app/api/exceptions/apiError'
import bcrypt from 'bcrypt'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const id = Number((await params).id)
		const body = await req.json()

		const isAdmin = await checkIsAdmin(req)

		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const hashedPassword = await bcrypt.hash(body.password, 3)

		const admin = await prisma.admin.update({
			where: { id },
			data: { login: body.email, password: hashedPassword }
		})

		return NextResponse.json(
			{ ok: true, admin },
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
