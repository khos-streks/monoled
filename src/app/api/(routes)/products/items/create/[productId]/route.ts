import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { saveFile } from '@/app/api/utils/saveFile'
import { prisma } from '@/prisma/prisma-client'
import slugify from '@sindresorhus/slugify'
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
	scatteringAngle: Joi.string().optional().allow('')
})

async function generateUniqueSlug(productSlug: string, itemName: string): Promise<string> {
	const baseSlug = `${productSlug}-${slugify(itemName || 'variant')}`
	let uniqueSlug = baseSlug
	let counter = 1

	while (await prisma.productItem.findUnique({ where: { slug: uniqueSlug } })) {
		uniqueSlug = `${baseSlug}-${counter}`
		counter++
	}

	return uniqueSlug
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) {
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

		const productId = parseInt((await params).productId)
		if (isNaN(productId)) throw new ApiError('Invalid product ID', 400)

		const product = await prisma.product.findUnique({ where: { id: productId } })
		if (!product) throw new ApiError('Product not found', 404)

		const savedImages: string[] = []

		for (const file of images) {
			if (file && file.type?.startsWith('image/')) {
				const savedPath = await saveFile(file, req)
				savedImages.push(savedPath)
			} else {
				throw new ApiError('Each image must be of type image/*', 400)
			}
		}

		// Generate a slug based on the product slug and variant details
		const itemSlug = await generateUniqueSlug(product.slug, value.color || '')

		const productItem = await prisma.productItem.create({
			data: {
				slug: itemSlug,
				price: value.price,
				quantityLeft: value.quantityLeft,
				colorTemperature: value.colorTemperature,
				color: value.color,
				dimmable: value.dimmable,
				scatteringAngle: value.scatteringAngle,
				images: savedImages,
				productId
			}
		})

		return NextResponse.json(
			{ ok: true, productItem },
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
