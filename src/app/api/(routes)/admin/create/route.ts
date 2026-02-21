import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import Joi from 'joi'
import { ApiError } from '@/app/api/exceptions/apiError'
import { checkIsAdmin } from '../../admin/auth/utils/checkIsAdmin'
import bcrypt from 'bcrypt'

const adminSchema = Joi.object({
	email: Joi.string().email().min(1).required().messages({
		'string.empty': 'Name is required',
		'any.required': 'Name is required'
	}),
	password: Joi.string().min(1).required().messages({
		'string.empty': 'Password is required',
		'any.required': 'Password is required'
	})
})

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { error, value } = adminSchema.validate(body, { abortEarly: false })

		if (error) {
			const errorDetails = error.details.map(err => err.message).join(', ')
			throw new ApiError(`Validation error: ${errorDetails}`, 400)
		}

		const isAdmin = await checkIsAdmin(req)

		if (!isAdmin) throw new ApiError('You are not admin', 403)

		value.password = await bcrypt.hash(value.password, 3)

		const admin = await prisma.admin.create({
			data: { login: value.email, password: value.password }
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
