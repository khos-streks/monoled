import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import Joi from 'joi'
import { ApiError } from '@/app/api/exceptions/apiError'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'

const textFieldSchema = Joi.object({
	text: Joi.string().min(1).required().messages({
		'string.empty': 'Text is required',
		'any.required': 'Text is required'
	})
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const id = Number((await params).id)
		const body = await req.json()
		const { error, value } = textFieldSchema.validate(body, { abortEarly: false })

		if (error) {
			const errorDetails = error.details.map(err => err.message).join(', ')
			throw new ApiError(`Validation error: ${errorDetails}`, 400)
		}

		const isAdmin = await checkIsAdmin(req)

		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const textField = await prisma.textField.update({ where: { id }, data: { text: value.text } })

		return NextResponse.json(
			{ ok: true, text: textField },
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
