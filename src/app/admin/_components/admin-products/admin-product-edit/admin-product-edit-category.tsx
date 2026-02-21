'use client'

import { ProductWithInfo } from '@/typing/interfaces'
import { Category } from '@prisma/client'
import dynamic from 'next/dynamic'
import Select from 'react-select'

interface Props {
	product: ProductWithInfo
	categories: Category[] | undefined
	handleCategoryChange: (selectedOption: any) => void
}

function AdminProductEditCategoryComponent({ product, categories, handleCategoryChange }: Props) {
	return (
		<div className='flex items-start flex-col gap-2'>
			<label
				htmlFor='categorySlug'
				className='flex items-center gap-2'
			>
				Категорія
			</label>
			<Select
				id='categorySlug'
				options={categories?.map(category => ({
					label: category.name,
					value: category.slug
				}))}
				styles={{
					container: base => ({ ...base, width: '100%' })
				}}
				onChange={handleCategoryChange}
				placeholder={
					categories?.find(cat => cat.slug === product.categorySlug)?.name ?? 'Оберіть категорію'
				}
			/>
		</div>
	)
}

export const AdminProductEditCategory = dynamic(
	() => Promise.resolve(AdminProductEditCategoryComponent),
	{ ssr: false }
)
