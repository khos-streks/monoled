import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { saveFile } from '@/app/api/utils/saveFile'
import { prisma } from '@/prisma/prisma-client'
import Joi from 'joi'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../../admin/auth/utils/checkIsAdmin'

const productItemSchema = Joi.object({
	price: Joi.number().positive().required().messages({
		'number.base': 'Price must be a number',
		'number.positive': 'Price must be greater than zero',
		'any.required': 'Price is required'
	}),
	quantityLeft: Joi.number().min(0).required().messages({
		'string.empty': 'Quantity is required',
		'any.required': 'Quantity is required'
	}),
	colorTemperature: Joi.string().optional().allow(''),
	color: Joi.string().optional().allow(''),
	dimmable: Joi.string().optional().allow(''),
	scatteringAngle: Joi.string().optional().allow(''),
	deleteImages: Joi.array().optional()
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const formData = await req.formData()
		const body = Object.fromEntries(formData)

		const productItemData = JSON.parse(body.productItemData as string)
		const images = formData.getAll('images') as File[]

		const { error, value } = productItemSchema.validate(productItemData, { abortEarly: false })

		if (error) {
			const errorDetails = error.details.map(err => err.message).join(', ')
			throw new ApiError(`Validation error: ${errorDetails}`, 400)
		}

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const id = parseInt((await params).id)
		if (isNaN(id)) throw new ApiError('Invalid product item ID', 400)

		const existingProductItem = await prisma.productItem.findUnique({
			where: { id }
		})

		if (!existingProductItem) throw new ApiError('Product item not found', 404)

		// Handle image updates
		let updatedImages = [...existingProductItem.images]

		// Remove images if deleteImages array is provided
		if (value.deleteImages && value.deleteImages.length > 0) {
			updatedImages = updatedImages.filter(img => !value.deleteImages.includes(img))
		}

		// Add new images
		for (const file of images) {
			if (file && file.type?.startsWith('image/')) {
				const savedPath = await saveFile(file, req)
				updatedImages.push(savedPath)
			} else {
				throw new ApiError('Each image must be of type image/*', 400)
			}
		}

		// Update the product item
		const updatedProductItem = await prisma.productItem.update({
			where: { id },
			data: {
				price: value.price,
				quantityLeft: value.quantityLeft,
				colorTemperature: value.colorTemperature,
				color: value.color,
				dimmable: value.dimmable,
				scatteringAngle: value.scatteringAngle,
				images: updatedImages
			}
		})

		return NextResponse.json(
			{ ok: true, productItem: updatedProductItem },
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
