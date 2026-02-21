'use client'

import { useUpdateProductItem } from '@/hooks/useProducts'
import { ProductWithItems } from '@/typing/interfaces'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { FormEvent, useState } from 'react'

interface Props {
	itemId: number
	item: ProductWithItems['items'][0]
	onComplete: () => void
}

export function AdminProductItemEdit({ itemId, item, onComplete }: Props) {
	const [price, setPrice] = useState<string>(item.price.toString())
	const [quantityLeft, setQuantityLeft] = useState<string>(item.quantityLeft.toString())
	const [colorTemperature, setColorTemperature] = useState<string>(item.colorTemperature || '')
	const [color, setColor] = useState<string>(item.color || '')
	const [dimmable, setDimmable] = useState<string>(item.dimmable || '')
	const [scatteringAngle, setScatteringAngle] = useState<string>(item.scatteringAngle || '')
	const [images, setImages] = useState<FileList | null>(null)
	const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

	const { mutate: updateProductItem } = useUpdateProductItem()
	const queryClient = useQueryClient()

	const handleDeleteImage = (imageUrl: string) => {
		setImagesToDelete(prev => [...prev, imageUrl])
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (!price || !quantityLeft) {
			alert("Заповніть всі обов'язкові поля")
			return
		}

		setIsSubmitting(true)
		updateProductItem(
			{
				id: itemId,
				data: {
					price: Number(price),
					quantityLeft: Number(quantityLeft),
					colorTemperature,
					color,
					dimmable,
					scatteringAngle,
					images: images || undefined,
					deleteImages: imagesToDelete.length > 0 ? imagesToDelete : undefined
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
					alert('Помилка при оновленні варіанту товару')
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
					<label className='block text-sm font-medium'>Поточні зображення</label>
					<div className='grid grid-cols-3 gap-2'>
						{item.images
							.filter(img => !imagesToDelete.includes(img))
							.map((img, index) => (
								<div
									key={index}
									className='relative group'
								>
									<div className='aspect-square relative rounded overflow-hidden'>
										<Image
											src={img}
											alt={`Product image ${index + 1}`}
											fill
											className='object-cover'
										/>
									</div>
									<button
										type='button'
										className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
										onClick={() => handleDeleteImage(img)}
									>
										×
									</button>
								</div>
							))}
					</div>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='images'
						className='block text-sm font-medium'
					>
						Додати нові зображення
					</label>
					<input
						id='images'
						type='file'
						accept='image/*'
						multiple
						onChange={e => setImages(e.target.files)}
						className='w-full rounded-md border border-gray-500 bg-white px-5 py-3 text-sm'
					/>
				</div>

				<button
					type='submit'
					className='w-full bg-foreground text-background px-4 py-2 rounded-md'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Оновлення...' : 'Оновити варіант товару'}
				</button>
			</form>
		</div>
	)
}
