import { TOKEN } from '@/typing/enums'
import axios from 'axios'
import { NextRequest } from 'next/server'
import { ApiError } from '../exceptions/apiError'

export async function saveFile(file: File, req: NextRequest): Promise<string> {
	try {
		if (!(file instanceof File)) {
			throw new ApiError('Invalid file object provided', 400)
		}

		const storageURL = process.env.NEXT_PUBLIC_STORAGE_URL
		const formData = new FormData()
		formData.append('file', file)

		const res = await axios.post(`${storageURL}/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${req.cookies.get(TOKEN.ADMIN_ACCESS_TOKEN)?.value}`
			}
		})
		const fileUrl = res?.data?.fileUrl
		if (!fileUrl) {
			throw new ApiError('Failed to get file URL from storage', 500)
		}

		return `${storageURL}${fileUrl}`
	} catch (error) {
		throw new ApiError(`Error: ${error}`, 500)
	}
}
