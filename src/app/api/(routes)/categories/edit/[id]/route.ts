import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import Joi from 'joi'
import { ApiError } from '@/app/api/exceptions/apiError'
import slugify from '@sindresorhus/slugify'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'

const catSchema = Joi.object({
	name: Joi.string().min(1).required().messages({
		'string.empty': 'Name is required',
		'any.required': 'Name is required'
	})
})

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const id = Number((await params).id)
		const body = await req.json()
		const { error, value } = catSchema.validate(body, { abortEarly: false })

		if (error) {
			const errorDetails = error.details.map(err => err.message).join(', ')
			throw new ApiError(`Validation error: ${errorDetails}`, 400)
		}

		value.slug = slugify(value.name)

		const isAdmin = await checkIsAdmin(req)

		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const cat = await prisma.category.update({ where: { id }, data: value })

		return NextResponse.json(
			{ ok: true, category: cat },
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
