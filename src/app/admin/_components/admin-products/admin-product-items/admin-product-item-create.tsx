'use client'

import { useCreateProductItem } from '@/hooks/useProducts'
import { useQueryClient } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
	productId: number
	onComplete: () => void
}

export function AdminProductItemCreate({ productId, onComplete }: Props) {
	const [price, setPrice] = useState<string>('')
	const [quantityLeft, setQuantityLeft] = useState<string>('')
	const [colorTemperature, setColorTemperature] = useState<string>('')
	const [color, setColor] = useState<string>('')
	const [dimmable, setDimmable] = useState<string>('')
	const [scatteringAngle, setScatteringAngle] = useState<string>('')
	const [images, setImages] = useState<FileList | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const { mutate: createProductItem } = useCreateProductItem()
	const queryClient = useQueryClient()

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (!price.length || !quantityLeft.length || !images || images.length === 0) {
			toast.error("Заповніть всі обов'язкові поля")
			return
		}

		setIsSubmitting(true)
		createProductItem(
			{
				productId,
				data: {
					price: Number(price),
					quantityLeft: Number(quantityLeft),
					colorTemperature,
					color,
					dimmable,
					scatteringAngle,
					images: images
				}
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['products get'] })
					setIsSubmitting(false)
					onComplete()
				},
				onError: () => {
					setIsSubmitting(false)
					toast.error('Помилка при створенні варіанту товару')
				}
			}
		)
	}

	return (
		<div className='p-4 border rounded-md'>
			<form
				onSubmit={handleSubmit}
				className='space-y-4 pt-4'
			>
				<div className='space-y-2'>
					<label
						htmlFor='price'
						className='block text-sm font-medium'
					>
						Ціна *
					</label>
					<input
						id='price'
						type='number'
						min='0'
						value={price}
						onChange={e => setPrice(e.target.value)}
						required
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='quantityLeft'
						className='block text-sm font-medium'
					>
						Кількість на складі *
					</label>
					<input
						id='quantityLeft'
						type='number'
						min='0'
						value={quantityLeft}
						onChange={e => setQuantityLeft(e.target.value)}
						required
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='colorTemperature'
						className='block text-sm font-medium'
					>
						Кольорова температура
					</label>
					<input
						id='colorTemperature'
						value={colorTemperature}
						onChange={e => setColorTemperature(e.target.value)}
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='color'
						className='block text-sm font-medium'
					>
						Колір
					</label>
					<div className='flex items-center gap-2'>
						<input
							id='color'
							type='color'
							value={color || '#000000'}
							onChange={e => setColor(e.target.value)}
							className='w-12 h-10 rounded-md border border-gray-500 bg-white cursor-pointer'
						/>
						<input
							value={color}
							onChange={e => setColor(e.target.value)}
							placeholder='HEX значення (напр. #000000)'
							className='flex-1 rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
						/>
					</div>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='dimmable'
						className='block text-sm font-medium'
					>
						Дімування
					</label>
					<input
						id='dimmable'
						value={dimmable}
						onChange={e => setDimmable(e.target.value)}
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='scatteringAngle'
						className='block text-sm font-medium'
					>
						Кут розсіювання
					</label>
					<input
						id='scatteringAngle'
						value={scatteringAngle}
						onChange={e => setScatteringAngle(e.target.value)}
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='images'
						className='block text-sm font-medium'
					>
						Зображення *
					</label>
					<input
						id='images'
						type='file'
						accept='image/*'
						multiple
						onChange={e => setImages(e.target.files)}
						required
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
					/>
				</div>

				<button
					type='submit'
					className='w-full bg-foreground text-background px-4 py-2 rounded-md'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Створення...' : 'Створити варіант товару'}
				</button>
			</form>
		</div>
	)
}
