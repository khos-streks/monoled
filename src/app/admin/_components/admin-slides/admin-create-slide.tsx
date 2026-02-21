'use client'

import { Dialog } from '@/components/ui/dialog'
import { useCreateSlide } from '@/hooks/useSlides'
import { useQueryClient } from '@tanstack/react-query'
import { PlusCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Form {
	background: FileList
	text: string
	url: string
}

interface Props {
	view: 'desktop' | 'mobile'
}

export function AdminSlideCreate({ view }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const queryClient = useQueryClient()
	const { register, handleSubmit } = useForm<Form>()
	const { mutateAsync: createFunc, isPending, isSuccess, isError } = useCreateSlide()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває створення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && toast.dismiss(loadingToastId)
			queryClient.invalidateQueries({ queryKey: ['slides get'] })
		}
		if (isError) {
			loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	return (
		<Dialog
			title='Створити слайд'
			trigger={
				<button className='w-full h-full min-h-56 bg-[rgba(0,0,0,.35)] hover:bg-[rgba(0,0,0,.6)] transition-colors duration-700 rounded-md flex flex-col gap-4 items-center justify-center'>
					<PlusCircleIcon
						size={90}
						stroke='#fff'
					/>
					<h3 className='text-white text-2xl font-medium'>Створити</h3>
				</button>
			}
		>
			<form
				className='mx-auto bg-white rounded-md p-4 w-[400px] h-min flex flex-col gap-4 max-sm:w-[90%]'
				onSubmit={handleSubmit(data =>
					createFunc({ ...data, device: view.toUpperCase() as 'MOBILE' | 'DESKTOP' })
				)}
			>
				<div>
					<label
						htmlFor='images'
						className='flex items-center gap-2'
					>
						Зображення <span className='text-red-400'>*</span>
					</label>
					<input
						className='w-full appearance-none rounded-md border border-[#ccc] bg-white text-[#333] placeholder:text-[#808080] px-3 py-3 text-sm focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
						type='file'
						required
						id='images'
						{...register('background', { required: true })}
					/>
				</div>
				<div className='flex items-start flex-col gap-2'>
					<label
						htmlFor='text'
						className='flex items-center gap-2'
					>
						Текст <span className='text-red-400'>*</span>
					</label>
					<input
						className='w-full rounded-md border border-[#ccc] bg-white h-10 text-[#333] placeholder:text-[#808080] px-3 py-3 text-sm focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
						type='text'
						required
						placeholder='Слайд'
						id='text'
						{...register('text', { required: true })}
					/>
				</div>

				<div className='flex items-start flex-col gap-2'>
					<label
						htmlFor='url'
						className='flex items-center gap-2'
					>
						Посилання <span className='text-red-400'>*</span>
					</label>
					<input
						className='w-full rounded-md border border-[#ccc] bg-white h-10 text-[#333] placeholder:text-[#808080] px-3 py-3 text-sm focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500;'
						type='url'
						required
						placeholder='https://example.com'
						id='url'
						{...register('url', { required: true })}
					/>
				</div>

				<button
					type='submit'
					className='bg-foreground text-background w-min px-12 py-2 rounded-md mx-auto hover:bg-[rgba(0,0,0,.8)]'
				>
					Створити
				</button>
			</form>
		</Dialog>
	)
}
