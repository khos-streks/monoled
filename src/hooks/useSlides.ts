import { slideService } from '@/services/slides.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useGetSlides() {
	return useQuery({
		queryKey: ['slides get'],
		queryFn: async () => {
			const res = await slideService.getAllSlides()
			if (!res?.data) return Promise.reject()
			return res.data
		},
		refetchOnWindowFocus: false
	})
}

export function useDeleteSlide() {
	return useMutation({
		mutationKey: ['slide delete'],
		mutationFn: async (id: number) => {
			const res = await slideService.deleteSlide(id)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export function useCreateSlide() {
	interface Props {
		background: FileList
		text: string
		url: string
		device: 'MOBILE' | 'DESKTOP'
	}
	return useMutation({
		mutationKey: ['slide create'],
		mutationFn: async (data: Props) => {
			const formData = new FormData()

			Array.from(data.background).forEach(el => {
				formData.append('background', el)
			})

			const dataWithoutBackground = Object.entries(data).reduce((acc, [key, value]) => {
				if (key !== 'background') acc[key] = value
				return acc
			}, {} as Record<string, string>)

			formData.append('info', JSON.stringify(dataWithoutBackground))
			const res = await slideService.createSlide(formData)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export function useUpdateSlide() {
	interface Props {
		background?: FileList
		text?: string
		url?: string
	}
	return useMutation({
		mutationKey: ['slide update'],
		mutationFn: async ({ data, id }: { data: Props; id: number }) => {
			const formData = new FormData()

			if (data.background) {
				Array.from(data.background).forEach(el => {
					formData.append('background', el)
				})
			}
			const dataWithoutBackground = Object.entries(data).reduce((acc, [key, value]) => {
				if (key !== 'background') acc[key] = value
				return acc
			}, {} as Record<string, string>)

			formData.append('info', JSON.stringify(dataWithoutBackground))
			const res = await slideService.updateSlide(id, formData)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}
