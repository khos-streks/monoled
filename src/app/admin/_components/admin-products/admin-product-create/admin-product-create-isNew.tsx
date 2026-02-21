'use client'

import { UseFormSetValue } from 'react-hook-form'

interface Props {
	setValue: UseFormSetValue<any>
}

export function AdminProductCreateIsNew({ setValue }: Props) {
	return (
		<div className='flex gap-2 items-center'>
			<label
				htmlFor='modelUrl'
				className='flex gap-2'
			>
				Новинка?
			</label>
			<input
				onChange={e => setValue('isNew', e.target.checked)}
				className='ml-3 rounded-md border border-[#ccc] bg-white aspect-square h-5 text-[#333] placeholder:text-[#808080] focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
				type='checkbox'
				placeholder='https://example.com/model'
				id='modelUrl'
			/>
		</div>
	)
}
