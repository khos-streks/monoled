import { ApiError } from '@/app/api/exceptions/apiError'
import { handleApiError } from '@/app/api/exceptions/handleApiError'
import { deleteFile } from '@/app/api/utils/deleteFile'
import { saveFile } from '@/app/api/utils/saveFile'
import { prisma } from '@/prisma/prisma-client'
import slugify from '@sindresorhus/slugify'
import Joi from 'joi'
import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../admin/auth/utils/checkIsAdmin'

const productSchema = Joi.object({
	name: Joi.string().optional(),
	description: Joi.string().optional(),
	categorySlug: Joi.string().optional(),
	modelUrl: Joi.string().optional(),
	isNew: Joi.boolean().optional(),
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

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) {
	try {
		const { productId } = await params
		const formData = await req.formData()
		const body = Object.fromEntries(formData)
		const productData = JSON.parse(body.productData as string)

		const isAdmin = await checkIsAdmin(req)
		if (!isAdmin) throw new ApiError('You are not admin', 403)

		const { error, value } = productSchema.validate(productData, { abortEarly: false })

		if (error) {
			const errorDetails = error.details.map(err => err.message).join(', ')
			throw new ApiError(`Validation error: ${errorDetails}`, 400)
		}

		if (value.name) {
			value.slug = slugify(value.name)
			value.slug = await generateUniqueSlug(value.slug)
		}

		// Get existing product to check current images
		const existingProduct = await prisma.product.findUnique({
			where: { id: Number(productId) }
		})

		if (!existingProduct) {
			throw new ApiError('Product not found', 404)
		}

		// Extract info data
		const infoData = value.info
		delete value.info

		await prisma.product.update({
			where: { id: Number(productId) },
			data: value
		})

		// Update info if provided
		if (infoData && infoData.length > 0) {
			// Delete existing info
			await prisma.productInfo.deleteMany({
				where: { productId: Number(productId) }
			})

			// Create new info
			for (const info of infoData) {
				await prisma.productInfo.create({
					data: {
						title: info.title,
						value: info.value,
						order: info.order,
						productId: Number(productId)
					}
				})
			}
		}

		// Get updated product with info
		const updatedProduct = await prisma.product.findUnique({
			where: { id: Number(productId) },
			include: { info: true }
		})

		return NextResponse.json(
			{ ok: true, product: updatedProduct },
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		)
	} catch (error) {
		return handleApiError(error)
	}
}
