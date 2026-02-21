'use client'

import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface Props {
	watch: UseFormWatch<any>
	setValue: UseFormSetValue<any>
}

export function AdminProductCreateDescription({ watch, setValue }: Props) {
	return (
		<div className='flex items-start flex-col gap-2'>
			<label
				htmlFor='description'
				className='flex items-center gap-2'
			>
				Опис <span className='text-red-400'>*</span>
			</label>
			<ReactQuill
				className='w-full'
				theme='snow'
				value={watch('description')}
				onChange={text => setValue('description', text)}
			/>
		</div>
	)
}
