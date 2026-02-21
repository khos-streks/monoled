import { api } from './axios'

class EmailService {
	async contactUs(data: {
		firstName: string
		lastName: string
		tel: string
		companyName: string
		country: string
		city: string
		email: string
		message: string
	}) {
		return await api.post('/contact-us', data)
	}
}

export const emailService = new EmailService()
