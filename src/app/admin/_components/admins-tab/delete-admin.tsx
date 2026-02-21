'use client'

import { Dialog } from '@/components/ui/dialog'
import { useAdminDelete } from '@/hooks/useAdmin'
import { Admin } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
	admins: Admin[]
	admin: Admin
}

export function DeleteAdmin({ admin, admins }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const queryClient = useQueryClient()
	const { mutateAsync: deleteFunc, isPending, isSuccess, isError } = useAdminDelete()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває видалення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			queryClient.invalidateQueries({ queryKey: ['admins get'] })
		}
		if (isError) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])
	return (
		<Dialog
			title='Видалити адміна'
			trigger={
				<button
					className='ml-4 text-red-600 hover:text-red-900 disabled:text-red-200 disabled:cursor-not-allowed'
					disabled={admins.length === 1 || admin.login === 'ostapenkokpersonal@gmail.com'}
				>
					Видалити
				</button>
			}
		>
			<div className='flex flex-col items-start gap-6'>
				<span className='text-lg'>Ви впевнені, що хочете видалити {admin.login}?</span>
				<button
					className='bg-foreground text-background rounded-md px-6 py-2 ml-auto'
					onClick={() => deleteFunc({ id: admin.id })}
				>
					Так
				</button>
			</div>
		</Dialog>
	)
}
