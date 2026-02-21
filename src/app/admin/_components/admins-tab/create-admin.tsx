'use client'

import { Dialog } from '@/components/ui/dialog'
import { useAdminCreate } from '@/hooks/useAdmin'
import { useQueryClient } from '@tanstack/react-query'
import { LockIcon, MailIcon, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Form {
	email: string
	password: string
}

export function CreateAdmin() {
	const [loadingToastId, setLoadingToastId] = useState('')
	const { register, handleSubmit } = useForm<Form>()
	const queryClient = useQueryClient()
	const { mutateAsync: createFunc, isPending, isSuccess, isError } = useAdminCreate()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває створення...')
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
			title='Додати адміна'
			trigger={
				<button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2'>
					<PlusIcon
						color='#fff'
						size={20}
					/>{' '}
					Додати адміна
				</button>
			}
		>
			<div className='mx-auto bg-white rounded-md p-4 w-[400px] h-min flex flex-col gap-8 max-sm:w-[90%]'>
				<form
					className='flex flex-col gap-8'
					onSubmit={handleSubmit(data => createFunc(data))}
				>
					<div className='flex items-start flex-col gap-3'>
						<label
							htmlFor='email'
							className='flex items-center gap-2'
						>
							<MailIcon /> Пошта
						</label>
						<input
							className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm placeholder:text-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
							type='email'
							required
							placeholder='123@gmail.com'
							id='email'
							{...register('email', { required: true })}
						/>
					</div>
					<div className='flex items-start flex-col gap-3'>
						<label
							htmlFor='password'
							className='flex items-center gap-2'
						>
							<LockIcon /> Пароль
						</label>
						<input
							className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm placeholder:text-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
							type='password'
							required
							placeholder='12345678'
							id='password'
							{...register('password', { required: true })}
						/>
					</div>
					<button
						type='submit'
						className='bg-foreground text-background w-min px-12 py-2 rounded-md mx-auto'
					>
						Створити
					</button>
				</form>
			</div>
		</Dialog>
	)
}
