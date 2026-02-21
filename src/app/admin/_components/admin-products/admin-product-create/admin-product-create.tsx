'use client'

import { Dialog } from '@/components/ui/dialog'
import { useInfoFields } from '@/hooks/useInfoFields'
import { useCreateProduct } from '@/hooks/useProducts'
import { Category } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { PlusCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
	AdminProductCreateCategory,
	AdminProductCreateDescription,
	AdminProductCreateIsNew,
	AdminProductCreateModel,
	AdminProductCreateName
} from '.'
import { InfoFields } from '../info-fields'

interface Form {
	name: string
	description: string
	categorySlug: string
	modelUrl: string
	isNew?: boolean
	info?: { title: string; value: string; order: number }[]
}

interface Props {
	categories: Category[] | undefined
}

export function AdminProductCreate({ categories }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const { register, handleSubmit, setValue, watch } = useForm<Form>()
	const queryClient = useQueryClient()
	const { mutateAsync: createFunc, isPending, isSuccess, isError } = useCreateProduct()
	const { info, addInfoField, deleteInfoField, moveUp, moveDown } = useInfoFields()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває створення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && toast.dismiss(loadingToastId)
			queryClient.invalidateQueries({ queryKey: ['products get'] })
		}
		if (isError) {
			loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	const handleCategoryChange = (selectedOption: any) => {
		setValue('categorySlug', selectedOption.value)
	}

	const handleCreate = (data: Form) => {
		return createFunc({
			...data,
			info
		})
	}

	return (
		<Dialog
			title='Створити товар'
			trigger={
				<button className='w-full bg-foreground text-background transition-colors px-4 py-3 rounded-md flex items-center justify-center gap-2'>
					<PlusCircleIcon className='h-5 w-5' />
					<span className='text-lg font-medium'>Створити новий товар</span>
				</button>
			}
		>
			<div className='mx-auto bg-white rounded-md px-4 h-min flex flex-col gap-4 w-[90%]'>
				<form
					className='flex flex-col gap-4'
					onSubmit={handleSubmit(handleCreate)}
				>
					<AdminProductCreateName register={register} />

					<AdminProductCreateCategory
						handleCategoryChange={handleCategoryChange}
						categories={categories}
					/>

					<AdminProductCreateModel register={register} />
					<AdminProductCreateIsNew setValue={setValue} />

					<AdminProductCreateDescription
						watch={watch}
						setValue={setValue}
					/>

					<div className='border-t pt-4 mt-2'>
						<InfoFields
							info={info}
							addInfoField={addInfoField}
							deleteInfoField={deleteInfoField}
							moveUp={moveUp}
							moveDown={moveDown}
						/>
					</div>

					<div className='text-sm text-neutral-500 italic mb-4'>
						Після створення товару, ви зможете додати варіанти товару з цінами та зображеннями.
					</div>

					<button
						type='submit'
						className='bg-foreground text-background transition-colors w-full px-6 py-2 rounded-md mx-auto'
					>
						Створити товар
					</button>
				</form>
			</div>
		</Dialog>
	)
}
