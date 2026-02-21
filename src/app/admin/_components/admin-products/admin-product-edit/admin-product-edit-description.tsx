'use client'

import { ProductWithInfo } from '@/typing/interfaces'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface Props {
	product: ProductWithInfo
	watch: UseFormWatch<any>
	setValue: UseFormSetValue<any>
}

export function AdminProductEditDescription({ product, watch, setValue }: Props) {
	return (
		<div className='flex items-start flex-col gap-2'>
			<label
				htmlFor='description'
				className='flex items-center gap-2'
			>
				Опис
			</label>
			<ReactQuill
				theme='snow'
				value={watch('description') ?? product.description}
				onChange={text => setValue('description', text)}
			/>
		</div>
	)
}
