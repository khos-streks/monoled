'use client'

import { Dialog } from '@/components/ui/dialog'
import { useCreateCategory } from '@/hooks/useCategories'
import { useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Form {
	name: string
}

export function AdminCreateCategory() {
	const [loadingToastId, setLoadingToastId] = useState('')
	const { register, handleSubmit } = useForm<Form>()
	const queryClient = useQueryClient()
	const { mutateAsync: createFunc, isPending, isSuccess, isError } = useCreateCategory()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває створення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			queryClient.invalidateQueries({ queryKey: ['categories get'] })
		}
		if (isError) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	return (
		<Dialog
			title='Створити категорію'
			trigger={
				<button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2'>
					<PlusIcon
						color='#fff'
						size={20}
					/>{' '}
					Додати категорію
				</button>
			}
		>
			<form
				className='mx-auto bg-white rounded-md p-4 w-[400px] h-min flex flex-col gap-8 max-sm:w-[90%]'
				onSubmit={handleSubmit(data => createFunc(data))}
			>
				<div className='flex items-start flex-col gap-3'>
					<label
						htmlFor='cat'
						className='flex items-center gap-2'
					>
						Назва
					</label>
					<input
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm placeholder:text-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
						type='text'
						required
						placeholder='Категорія'
						id='cat'
						{...register('name', { required: true })}
					/>
				</div>
				<button
					type='submit'
					className='bg-foreground text-background w-min px-12 py-2 rounded-md mx-auto hover:bg-[rgba(0,0,0,.8)]'
				>
					Створити
				</button>
			</form>
		</Dialog>
	)
}
