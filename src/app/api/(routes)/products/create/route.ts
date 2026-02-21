import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { saveFile } from '@/app/api/utils/saveFile'
import { prisma } from '@/prisma/prisma-client'
import slugify from '@sindresorhus/slugify'
import Joi from 'joi'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../admin/auth/utils/checkIsAdmin'

const productSchema = Joi.object({
	name: Joi.string().min(1).required().messages({
		'string.empty': 'Name is required',
		'any.required': 'Name is required'
	}),
	description: Joi.string().min(1).required().messages({
		'string.empty': 'Description is required',
		'any.required': 'Description is required'
	}),
	categorySlug: Joi.string().min(1).required().messages({
		'string.empty': 'Category slug is required',
		'any.required': 'Category slug is required'
	}),
	modelUrl: Joi.string().optional(),
	isNew: Joi.boolean().optional(),
	mainImage: Joi.string().required().messages({
		'string.empty': 'Main image is required',
		'any.required': 'Main image is required'
	}),
	hoverImage: Joi.string().required().messages({
		'string.empty': 'Hover image is required',
		'any.required': 'Hover image is required'
	}),
	info: Joi.array()
		.items(
			Joi.object({
				title: Joi.string().required(),
				value: Joi.string().required(),
				order: Joi.number().required()
			})
		)
		.optional()
})

async function generateUniqueSlug(slug: string): Promise<string> {
	let uniqueSlug = slug
	let counter = 1

	while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
		uniqueSlug = `${slug}-${counter}`
		counter++
	}

	return uniqueSlug
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()
		const body = Object.fromEntries(formData)

		const productData = JSON.parse(body.productData as string)
		const mainImage = formData.get('mainImage') as File
		const hoverImage = formData.get('hoverImage') as File

		const { error, value } = productSchema.validate(productData, { abortEarly: false })

		if (error) {
			const errorDetails = error.details.map(err => err.message).join(', ')
			throw new ApiError(`Validation error: ${errorDetails}`, 400)
		}

		value.slug = slugify(value.name)
		value.slug = await generateUniqueSlug(value.slug)

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		// Save images
		if (!mainImage || !hoverImage) {
			throw new ApiError('Both main and hover images are required', 400)
		}

		const savedMainImage = await saveFile(mainImage, req)
		const savedHoverImage = await saveFile(hoverImage, req)

		// Create product without info
		const product = await prisma.product.create({
			data: {
				name: value.name,
				slug: value.slug,
				description: value.description,
				categorySlug: value.categorySlug,
				isNew: value.isNew,
				modelUrl: value.modelUrl,
				mainImage: savedMainImage,
				hoverImage: savedHoverImage
			}
		})

		// Create info records if provided
		if (value.info && value.info.length > 0) {
			for (const info of value.info) {
				await prisma.productInfo.create({
					data: {
						title: info.title,
						value: info.value,
						order: info.order,
						productId: product.id
					}
				})
			}
		}

		// Get updated product with info
		const updatedProduct = await prisma.product.findUnique({
			where: { id: product.id },
			include: { info: true }
		})

		return NextResponse.json(
			{ ok: true, product: updatedProduct },
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
