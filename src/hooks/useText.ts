import { textsService } from '@/services/texts.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useEditText() {
	return useMutation({
		mutationKey: ['edit text'],
		mutationFn: async (data: { id: number; text: string }) => {
			const res = await textsService.editText(data)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export function useGetTexts() {
	return useQuery({
		queryKey: ['texts get'],
		queryFn: async () => {
			const res = await textsService.getAllTexts()
			if (!res) return Promise.reject()
			return res
		},
		refetchOnWindowFocus: false
	})
}
