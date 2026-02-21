import axios from 'axios'
import toast from 'react-hot-toast'

export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.response.use(
	response => response,
	error => {
		if (error?.response?.data) {
			const { message } = error?.response?.data
			toast.error(message)
		} else if (error?.response?.status === 500) {
			toast.error('Something went wrong. Try again later.')
		}
	}
)
