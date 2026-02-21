import { categoriesService } from '@/services/categories.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useGetCategories() {
	return useQuery({
		queryKey: ['categories get'],
		queryFn: async () => {
			const res = await categoriesService.getAllCategories()
			if (!res?.data) return Promise.reject()
			return res.data
		},
		refetchOnWindowFocus: false
	})
}

export function useCreateCategory() {
	return useMutation({
		mutationKey: ['category create'],
		mutationFn: async ({ name }: { name: string }) => {
			const res = await categoriesService.createCategory(name)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export function useEditCategory() {
	return useMutation({
		mutationKey: ['category edit'],
		mutationFn: async (data: { id: number; name: string }) => {
			const res = await categoriesService.editCategory(data)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}
export function useDeleteCategory() {
	return useMutation({
		mutationKey: ['category delete'],
		mutationFn: async (id: number) => {
			const res = await categoriesService.deleteCategory(id)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}
