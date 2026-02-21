'use client'

import { Dialog } from '@/components/ui/dialog'
import { useEditCategory } from '@/hooks/useCategories'
import { Category } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props {
	category: Category
}

interface Form {
	name: string
}

export function AdminEditCategory({ category }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const queryClient = useQueryClient()
	const { register, handleSubmit } = useForm<Form>()
	const { mutateAsync: editFunc, isPending, isSuccess, isError } = useEditCategory()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває зміна...')
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

	const edit = async (data: Form) => {
		await editFunc({
			id: category.id,
			name: data.name ?? undefined
		})
	}

	return (
		<Dialog
			title='Змінити категорію'
			trigger={<button className='text-blue-600 hover:text-blue-900'>Редагувати</button>}
		>
			<form
				className='mx-auto bg-white rounded-md p-4 w-[400px] h-min flex flex-col gap-8 max-sm:w-[90%]'
				onSubmit={handleSubmit(data => edit(data))}
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
						placeholder={category.name}
						defaultValue={category.name}
						id='cat'
						{...register('name', { required: true })}
					/>
				</div>
				<button
					type='submit'
					className='bg-foreground text-background w-min px-12 py-2 rounded-md mx-auto hover:bg-[rgba(0,0,0,.8)]'
				>
					Змінити
				</button>
			</form>
		</Dialog>
	)
}
