'use client'

import { useAdminAuth } from '@/hooks/useAdmin'
import { LockIcon, MailIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Form {
	email: string
	password: string
}

export function AdminLogin() {
	const [loadingToastId, setLoadingToastId] = useState('')
	const { register, handleSubmit } = useForm<Form>()
	const { mutateAsync: authFunc, isPending, isSuccess, isError } = useAdminAuth()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває авторизація...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			toast.success('Успішно авторизовано!')
			setTimeout(() => window.location.reload(), 500)
		}
		if (isError) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	return (
		<div className='min-h-[88vh] animate-opacity-1'>
			<form
				className='mx-auto bg-white rounded-md p-4 w-[400px] mt-10 h-min flex flex-col gap-8 max-sm:w-[90%]'
				onSubmit={handleSubmit(data => authFunc(data))}
			>
				<h2 className='text-center font-semibold text-3xl'>Вхід</h2>
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
					className='bg-foreground text-background w-min px-12 py-2 rounded-md mx-auto hover:bg-[rgba(0,0,0,.8)]'
				>
					Вхід
				</button>
			</form>
		</div>
	)
}
