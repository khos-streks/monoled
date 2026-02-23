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

		// Attempt to keep the original file extension. Prefer the uploaded
		// file's name; fall back to MIME type mapping if name has no ext.
		const originalName = (file as any)?.name || ''
		let ext = ''
		const nameMatch = originalName.match(/\.([0-9A-Za-z]+)(?:\?.*)?$/)
		if (nameMatch) {
			ext = nameMatch[1]
		} else if (file.type) {
			const mime = file.type.split('/')[1]
			// common mappings for multipart types (e.g., "jpeg" -> "jpg")
			const mimeMap: Record<string, string> = {
				jpeg: 'jpg',
				'svg+xml': 'svg',
				'x-icon': 'ico'
			}
			ext = mimeMap[mime] || mime
		}

		const suffix = ext ? `.${ext}` : ''
		return `${storageURL}${fileUrl}${suffix}`
	} catch (error) {
		throw new ApiError(`Error: ${error}`, 500)
	}
}
