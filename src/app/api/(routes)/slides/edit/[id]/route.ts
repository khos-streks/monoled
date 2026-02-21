import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'
import Joi from 'joi'
import { ApiError } from '@/app/api/exceptions/apiError'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'
import { saveFile } from '@/app/api/utils/saveFile'
import { deleteFile } from '@/app/api/utils/deleteFile'

const slideSchema = Joi.object({
	text: Joi.string(),
	url: Joi.string()
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const id = Number((await params).id)
		if (isNaN(id)) throw new ApiError('Invalid ID parameter', 400)

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const formData = await req.formData()
		const body = Object.fromEntries(formData)

		const productInfo = JSON.parse(body.info as string)
		const background = formData.get('background') as File

		const { error, value } = slideSchema.validate(productInfo, { abortEarly: false })

		if (error) {
			const errorDetails = error.details.map(err => err.message).join(', ')
			throw new ApiError(`Validation error: ${errorDetails}`, 400)
		}

		const existingSlide = await prisma.slide.findUnique({ where: { id } })
		if (!existingSlide) throw new ApiError('Slide not found', 404)

		if (background) {
			let savedImage = ''

			if (background.type?.startsWith('image/')) {
				if (existingSlide.background) {
					try {
						await deleteFile(existingSlide.background, req)
					} catch (error) {
						console.warn(`Failed to delete file: ${existingSlide.background}`, error)
					}
				}

				const savedPath = await saveFile(background, req)
				savedImage = savedPath
			} else {
				throw new ApiError('Each image must be of type image/*', 400)
			}

			value.background = savedImage
		}

		const updatedSlide = await prisma.slide.update({ where: { id }, data: value })

		return NextResponse.json(
			{ ok: true, slide: updatedSlide },
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
