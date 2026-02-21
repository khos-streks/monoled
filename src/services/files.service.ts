import { api } from './axios'

class FileService {
	async deleteFile(title: string) {
		return await api.delete(`/storage/delete/${title}`)
	}

	async createFile(data: FormData) {
		return await api.post(`/storage/upload`, data, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	}

	async getAllFiles() {
		return await api.get('/storage/all')
	}
}

export const fileService = new FileService()
