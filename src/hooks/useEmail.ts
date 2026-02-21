import { emailService } from '@/services/email.service'
import { useMutation } from '@tanstack/react-query'

export const useContactUs = () => {
	return useMutation({
		mutationKey: ['contact us'],
		mutationFn: async (data: {
			firstName: string
			lastName: string
			tel: string
			companyName: string
			country: string
			city: string
			email: string
			message: string
		}) => {
			const res = await emailService.contactUs(data)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}
