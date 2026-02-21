'use client'

import { ProductWithInfo } from '@/typing/interfaces'
import { Category } from '@prisma/client'
import dynamic from 'next/dynamic'
import Select from 'react-select'

interface Props {
	categories: Category[] | undefined
	handleCategoryChange: (selectedOption: any) => void
}

function AdminProductCreateCategoryComponent({ categories, handleCategoryChange }: Props) {
	return (
		<div className='flex items-start flex-col gap-2'>
			<label
				htmlFor='categorySlug'
				className='flex items-center gap-2'
			>
				Категорія <span className='text-red-400'>*</span>
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
				placeholder='Оберіть категорію'
				required
			/>
		</div>
	)
}

export const AdminProductCreateCategory = dynamic(
	() => Promise.resolve(AdminProductCreateCategoryComponent),
	{ ssr: false }
)
