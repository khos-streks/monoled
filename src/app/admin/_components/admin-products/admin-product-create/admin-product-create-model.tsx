'use client'

import { UseFormRegister } from 'react-hook-form'

interface Props {
	register: UseFormRegister<any>
}

export function AdminProductCreateModel({ register }: Props) {
	return (
		<div className='flex items-start flex-col gap-2'>
			<label
				htmlFor='modelUrl'
				className='flex items-center gap-2'
			>
				URL 3D Моделі <span className='text-red-400'>*</span>
			</label>
			<input
				className='w-full rounded-md border border-[#ccc] bg-white h-10 text-[#333] placeholder:text-[#808080] px-3 py-3 text-sm focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
				type='url'
				placeholder='https://example.com/model'
				id='modelUrl'
				{...register('modelUrl')}
			/>
		</div>
	)
}
