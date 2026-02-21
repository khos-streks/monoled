import { Slide } from '@prisma/client'
import { api } from './axios'

class SlideService {
	async getAllSlides() {
		try {
			const res = await api.get<Slide[]>('/slides/all')
			if (res.status != 200) throw new Error('Помилка при отриманні слайдів')
			return res
		} catch {}
	}

	async deleteSlide(id: number) {
		return await api.delete(`/slides/delete/${id}`)
	}

	async createSlide(data: FormData) {
		return await api.post('/slides/create', data, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}

	async updateSlide(id: number, data: FormData) {
		return await api.put(`/slides/edit/${id}`, data, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}
}

export const slideService = new SlideService()
