'use client'

import { Dialog } from '@/components/ui/dialog'
import { useInfoFields } from '@/hooks/useInfoFields'
import { useUpdateProduct } from '@/hooks/useProducts'
import { ProductWithItems } from '@/typing/interfaces'
import { Category, ProductInfo } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { EditIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
	AdminProductEditCategory,
	AdminProductEditDescription,
	AdminProductEditIsNew,
	AdminProductEditModel,
	AdminProductEditName
} from '.'
import { InfoFields } from '../info-fields'

interface Form {
	name?: string
	description?: string
	categorySlug?: string
	modelUrl?: string
	isNew?: boolean
	mainImage?: FileList
	hoverImage?: FileList
	info?: ProductInfo[]
}

interface Props {
	categories: Category[] | undefined
	product: ProductWithItems
}

export const AdminProductEdit = dynamic(() =>
	Promise.resolve(({ categories, product }: Props) => {
		const [loadingToastId, setLoadingToastId] = useState('')
		const queryClient = useQueryClient()
		const { register, handleSubmit, setValue, watch } = useForm<Form>()
		const { mutateAsync: editFunc, isPending, isSuccess, isError } = useUpdateProduct()

		const { info, addInfoField, deleteInfoField, moveUp, moveDown } = useInfoFields(product.info)

		const edit = async (data: Form) => {
			await editFunc({
				id: product.id,
				data: {
					...data,
					info,
					mainImage: data.mainImage?.[0],
					hoverImage: data.hoverImage?.[0]
				}
			})
		}

		useEffect(() => {
			if (isPending) {
				const loadingToastId = toast.loading('Триває зміна...')
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

		return (
			<Dialog
				title='Змінити інформацію про товар'
				trigger={
					<button className='px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md flex items-center gap-1 text-sm hover:bg-yellow-100 transition-colors'>
						<EditIcon className='h-4 w-4' />
						<span>Редагувати</span>
					</button>
				}
			>
				<div className='mx-auto bg-white rounded-md px-4 h-min flex flex-col gap-4 w-[90%]'>
					<form
						onSubmit={handleSubmit(data => edit(data))}
						className='flex flex-col gap-4'
					>
						<AdminProductEditName
							product={product}
							register={register}
						/>

						<AdminProductEditCategory
							categories={categories}
							product={product}
							handleCategoryChange={handleCategoryChange}
						/>

						<AdminProductEditModel
							product={product}
							register={register}
						/>

						<AdminProductEditIsNew
							product={product}
							setValue={setValue}
						/>

						<div className='space-y-2'>
							<label
								htmlFor='mainImage'
								className='block text-sm font-medium'
							>
								Головне зображення
							</label>
							<input
								id='mainImage'
								type='file'
								accept='image/*'
								{...register('mainImage')}
								className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
							/>
							{product.mainImage && (
								<div className='mt-2'>
									<p className='text-sm text-gray-500'>Поточне зображення:</p>
									<img
										src={product.mainImage}
										alt='Current main image'
										className='w-32 h-32 object-cover mt-1'
									/>
								</div>
							)}
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='hoverImage'
								className='block text-sm font-medium'
							>
								Зображення при наведенні
							</label>
							<input
								id='hoverImage'
								type='file'
								accept='image/*'
								{...register('hoverImage')}
								className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
							/>
							{product.hoverImage && (
								<div className='mt-2'>
									<p className='text-sm text-gray-500'>Поточне зображення:</p>
									<img
										src={product.hoverImage}
										alt='Current hover image'
										className='w-32 h-32 object-cover mt-1'
									/>
								</div>
							)}
						</div>

						<AdminProductEditDescription
							product={product}
							setValue={setValue}
							watch={watch}
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
							Для керування варіантами товару використовуйте кнопку "Варіанти товару".
						</div>

						<button
							type='submit'
							className='bg-foreground text-background w-min px-12 py-2 rounded-md mx-auto hover:bg-[rgba(0,0,0,.8)]'
						>
							Змінити
						</button>
					</form>
				</div>
			</Dialog>
		)
	})
)
