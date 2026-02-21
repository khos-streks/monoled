'use client'

import { UseFormRegister, UseFormWatch } from 'react-hook-form'

interface Props {
	register: UseFormRegister<any>
	watch: UseFormWatch<any>
}

export function AdminProductCreateImage({ register, watch }: Props) {
	return (
		<div className='flex gap-2 flex-col text-left items-start'>
			<label htmlFor='images'>Зображення</label>
			<label className='w-min text-nowrap appearance-none rounded-md border border-[#ccc] bg-white text-[#333] placeholder:text-[#808080] px-7 cursor-pointer py-3 text-sm focus:z-10 focus:bg-indigo-500 focus:outline-none focus:ring-indigo-500;'>
				Вибрати файл
				<input
					className='hidden'
					type='file'
					id='images'
					multiple
					{...register('images')}
				/>
			</label>{' '}
			{watch('images') && (
				<div className='flex flex-col gap-2'>
					{Array.from(watch('images')).map((file: any, i) => (
						<span key={i}>- {file.name}</span>
					))}
				</div>
			)}
		</div>
	)
}
