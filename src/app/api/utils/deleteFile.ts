import { TOKEN } from '@/typing/enums'
import axios from 'axios'
import { NextRequest } from 'next/server'

export async function deleteFile(url: string, req: NextRequest) {
	await axios.delete(url, {
		headers: { Authorization: `Bearer ${req.cookies.get(TOKEN.ADMIN_ACCESS_TOKEN)?.value}` }
	})
}
