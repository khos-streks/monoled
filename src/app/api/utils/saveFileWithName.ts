import { TOKEN } from '@/typing/enums'
import { NextRequest } from 'next/server'
import { ApiError } from '../exceptions/apiError'
import axios from 'axios'

export async function saveFileWithName(
	{ file, name }: { file: File; name: string },
	req: NextRequest
): Promise<string> {
	try {
		const storageURL = process.env.NEXT_PUBLIC_STORAGE_URL
		const formData = new FormData()
		formData.append('file', file)
		formData.append('name', name)
		const res = await axios.post(`${storageURL}/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${req.cookies.get(TOKEN.ADMIN_ACCESS_TOKEN)?.value}`
			}
		})
		const fileUrl = res?.data?.fileUrl
		return storageURL + (fileUrl ?? '/')
	} catch (error: any) {
		throw new ApiError(`Error: ${error.message}`, 500)
	}
}
