import { Category } from '@prisma/client'
import { api } from './axios'

class CategoriesService {
	async getAllCategories() {
		try {
			const res = await api.get<Category[]>('/categories/all')
			if (res.status != 200) throw new Error('Помилка при отриманні категорій')
			return res
		} catch {}
	}

	async createCategory(name: string) {
		return await api.post('/categories/create', { name })
	}

	async editCategory({ id, name }: { id: number; name: string }) {
		return await api.put(`/categories/edit/${id}`, { name })
	}

	async deleteCategory(id: number) {
		return await api.delete(`/categories/delete/${id}`)
	}
}

export const categoriesService = new CategoriesService()
