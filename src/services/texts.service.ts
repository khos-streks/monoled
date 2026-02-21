import { TextField } from '@prisma/client'
import { api } from './axios'

class TextsService {
	async getAllTexts() {
		try {
			const res: TextField[] | undefined = await (
				await fetch(`${process.env.NEXT_PUBLIC_API_URL}/texts/all`, {
					method: 'GET',
					next: {
						revalidate: 180,
					}
				})
			).json()

			if (!res?.length) throw new Error('Помилка при отриманні данних')
			return res
		} catch {}
	}

	async editText({ id, text }: { id: number; text: string }) {
		return await api.put(`/texts/edit/${id}`, { text })
	}
}

export const textsService = new TextsService()
