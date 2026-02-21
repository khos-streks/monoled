import type { ProductWithItems } from '@/typing/interfaces'
import { api } from './axios'

class ProductsService {
	async getAllProducts() {
		try {
			const res = await api.get<ProductWithItems[]>('/products/all')
			if (res.status != 200) throw new Error('Помилка при отриманні товарів')
			return res
		} catch {}
	}

	async deleteProduct(id: number) {
		return await api.delete(`/products/delete/${id}`)
	}

	async createProduct(formData: FormData) {
		return await api.post('/products/create', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}

	async updateProduct(id: number, formData: FormData) {
		return await api.put(`/products/edit/${id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}

	async createProductItem(productId: number, formData: FormData) {
		return await api.post(`/products/items/create/${productId}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}

	async updateProductItem(id: number, formData: FormData) {
		return await api.put(`/products/items/edit/${id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}

	async deleteProductItem(id: number) {
		return await api.delete(`/products/items/delete/${id}`)
	}

	async moveUp(productId: number) {
		return await api.put(`/products/move-up/${productId}`)
	}

	async moveDown(productId: number) {
		return await api.put(`/products/move-down/${productId}`)
	}
}

export const productsService = new ProductsService()
