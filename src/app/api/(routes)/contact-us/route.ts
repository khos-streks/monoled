import Joi from 'joi'
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '../../exceptions/handleApiError'
import { ApiError } from '../../exceptions/apiError'
import { Resend } from 'resend'

const validationSchema = Joi.object({
	firstName: Joi.string().required().min(1).messages({
		'any.required': "Ім'я є обов'язковим"
	}),
	lastName: Joi.string().required().min(1).messages({
		'any.required': "Прізвище є обов'язковим"
	}),
	tel: Joi.string().required().min(1).messages({
		'any.required': 'Телефон є обовязковим'
	}),
	companyName: Joi.string().min(1).required().messages({
		'any.required': "Ім'я компанії є обовязковою"
	}),
	country: Joi.string().min(1).required().messages({
		'any.required': 'Країна є обовязковою'
	}),
	city: Joi.string().min(1).required().messages({
		'any.required': 'Місто є обовязковим'
	}),
	email: Joi.string().min(1).email().required().messages({
		'any.required': 'Email є обовязковим'
	}),
	message: Joi.string().min(1).required().messages({
		'any.required': 'Повідомлення є обовязковим'
	})
})

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { error, value } = validationSchema.validate(body)

		if (error) {
			throw new ApiError(error.message, 400)
		}

		const resend = new Resend(process.env.RESEND_API_KEY)

		await resend.emails.send({
			from: 'MONOLED <onboarding@resend.dev>',
			to: [process.env.CONTACT_US_EMAIL ?? 'delivered@resend.dev'],
			subject: 'Нове повідомлення з сайту!',
			html: `<ul>
				<li>Ім'я: ${value.firstName}</li>
				<li>Прізвише: ${value.lastName}</li>
				<li>Номер телефону: ${value.tel}</li>
				<li>Назва компанії: ${value.companyName}</li>
				<li>Країна: ${value.country}</li>
				<li>Місто: ${value.city}</li>
				<li>EMail: ${value.email}</li>
				<li>Повідомлення: ${value.message}</li>
			</ul>`
		})

		return NextResponse.json({ message: 'success' }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
