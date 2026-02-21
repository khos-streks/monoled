import { TOKEN } from '@/typing/enums'
import { NextRequest } from 'next/server'
import { ApiError } from '../exceptions/apiError'
import axios from 'axios'
import { IFile } from '@/app/admin/_components/admin-storage/admin-storage.typing'

export async function getFiles(req: NextRequest): Promise<IFile[]> {
	try {
		const storageURL = process.env.NEXT_PUBLIC_STORAGE_URL

		const res = await axios.get(`${storageURL}`, {
			headers: {
				Authorization: `Bearer ${req.cookies.get(TOKEN.ADMIN_ACCESS_TOKEN)?.value}`
			}
		})

		return res.data
	} catch (error) {
		throw new ApiError(`Error: ${error}`, 500)
	}
}
