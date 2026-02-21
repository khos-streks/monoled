import { productsService } from '@/services/products.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetProducts = () => {
	return useQuery({
		queryKey: ['products get'],
		queryFn: async () => {
			const res = await productsService.getAllProducts()
			if (!res?.data) return Promise.reject()
			return res.data
		},
		refetchOnWindowFocus: false
	})
}

export const useDeleteProduct = () => {
	return useMutation({
		mutationKey: ['product delete'],
		mutationFn: async ({ id }: { id: number }) => {
			const res = await productsService.deleteProduct(id)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export const useCreateProduct = () => {
	interface Props {
		name: string
		description: string
		categorySlug: string
		modelUrl: string | null
		isNew?: boolean | null
		info?: { title: string; value: string; order: number }[]
	}
	return useMutation({
		mutationKey: ['product create'],
		mutationFn: async (data: Props) => {
			const formData = new FormData()
			formData.append('productData', JSON.stringify(data))

			const res = await productsService.createProduct(formData)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export const useUpdateProduct = () => {
	interface Props {
		name?: string
		description?: string
		categorySlug?: string
		modelUrl?: string | null
		isNew?: boolean | null
		info?: { title: string; value: string; order: number }[]
	}

	return useMutation({
		mutationKey: ['product edit'],
		mutationFn: async ({ id, data }: { id: number; data: Props }) => {
			const formData = new FormData()

			const dataForForm = Object.entries(data).reduce((acc, [key, value]) => {
				acc[key] = value
				if (!value && key !== 'isNew') delete acc[key]
				return acc
			}, {} as Record<string, any>)

			formData.append('productData', JSON.stringify(dataForForm))

			const res = await productsService.updateProduct(id, formData)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export const useCreateProductItem = () => {
	interface Props {
		price: number
		images: FileList
		colorTemperature?: string
		color?: string
		dimmable?: string
		scatteringAngle?: string
		quantityLeft: number
	}
	return useMutation({
		mutationKey: ['product item create'],
		mutationFn: async ({ productId, data }: { productId: number; data: Props }) => {
			const formData = new FormData()

			Array.from(data.images).forEach(el => {
				formData.append('images', el)
			})

			const dataWithoutImages = Object.entries(data).reduce((acc, [key, value]) => {
				if (key !== 'images') acc[key] = value
				return acc
			}, {} as Record<string, any>)

			formData.append('productItemData', JSON.stringify(dataWithoutImages))

			const res = await productsService.createProductItem(productId, formData)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export const useUpdateProductItem = () => {
	interface Props {
		price?: number
		images?: FileList
		colorTemperature?: string
		color?: string
		dimmable?: string
		scatteringAngle?: string
		quantityLeft?: number
		deleteImages?: string[]
	}

	return useMutation({
		mutationKey: ['product item edit'],
		mutationFn: async ({ id, data }: { id: number; data: Props }) => {
			const formData = new FormData()

			if (data.images) {
				Array.from(data.images).forEach(el => {
					formData.append('images', el)
				})
			}

			const dataForForm = Object.entries(data).reduce((acc, [key, value]) => {
				if (key !== 'images') acc[key] = value
				if (!value && key !== 'deleteImages') delete acc[key]
				return acc
			}, {} as Record<string, any>)

			formData.append('productItemData', JSON.stringify(dataForForm))

			const res = await productsService.updateProductItem(id, formData)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export const useDeleteProductItem = () => {
	return useMutation({
		mutationKey: ['product item delete'],
		mutationFn: async ({ id }: { id: number }) => {
			const res = await productsService.deleteProductItem(id)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export const useMoveUpProduct = () => {
	return useMutation({
		mutationKey: ['product move up'],
		mutationFn: async (productId: number) => {
			const res = await productsService.moveUp(productId)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export const useMoveDownProduct = () => {
	return useMutation({
		mutationKey: ['product move down'],
		mutationFn: async (productId: number) => {
			const res = await productsService.moveDown(productId)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}
