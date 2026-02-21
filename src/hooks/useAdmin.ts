import { adminService } from '@/services/admin.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useGetAdmins() {
	return useQuery({
		queryKey: ['admins get'],
		queryFn: async () => {
			const res = await adminService.getAllAdmins()
			if (!res?.data) return Promise.reject()
			return res.data
		},
		refetchOnWindowFocus: false
	})
}

export function useAdminAuth() {
	return useMutation({
		mutationKey: ['admin auth'],
		mutationFn: async ({ email, password }: { email: string; password: string }) => {
			const res = await adminService.auth(email, password)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export function useAdminCreate() {
	return useMutation({
		mutationKey: ['admin create'],
		mutationFn: async ({ email, password }: { email: string; password: string }) => {
			const res = await adminService.createAdmin(email, password)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export function useAdminEdit() {
	return useMutation({
		mutationKey: ['admin edit'],
		mutationFn: async ({
			id,
			email,
			password
		}: {
			id: number
			email: string
			password: string
		}) => {
			const res = await adminService.editAdmin(id, { email, password })
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}

export function useAdminDelete() {
	return useMutation({
		mutationKey: ['admin delete'],
		mutationFn: async ({ id }: { id: number }) => {
			const res = await adminService.deleteAdmin(id)
			if (!res?.data) return Promise.reject()
			return res
		}
	})
}
