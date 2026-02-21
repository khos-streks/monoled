'use client'

import { ProductWithItems } from '@/typing/interfaces'
import cn from 'clsx'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
	product: ProductWithItems
	index: number
	showMode: 'grid' | 'list'
}

const SIZES = '(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw'

export function ShopProduct({ product, index, showMode }: Props) {
	const defaultItem = product.items && product.items.length > 0 ? product.items[0] : null

	const mainImage = defaultItem?.images?.[0] || '/placeholder-image.jpg'
	const hoverImage = defaultItem?.images?.[1]
	const isPriority = index < 4

	const [src, setSrc] = useState(mainImage)
	const [hoverSrc, setHoverSrc] = useState(hoverImage)

	return (
		<Link
			href={`/product/${product.slug}`}
			className={cn('flex w-full flex-col group', {
				'min-[500px]:gap-10 min-[500px]:flex-row': showMode === 'list'
			})}
			prefetch={false}
		>
			<div
				className={cn('relative w-full aspect-square', {
					'min-[500px]:h-[200px] 2xl:h-[250px] min-[500px]:w-auto': showMode === 'list'
				})}
			>
				{product.isNew && (
					<div className='absolute top-0 right-3 bg-blue-500 text-white z-10 rounded-b-md px-4 py-2'>
						Новинка
					</div>
				)}

				{/* Main image */}
				<img
					src={src}
					alt={product.name}
					width={300}
					height={300}
					loading={isPriority ? 'eager' : 'lazy'}
					sizes={SIZES}
					className={cn(
						'object-cover rounded-lg w-full h-full transition-opacity duration-300',
						hoverSrc && 'group-hover:opacity-0'
					)}
					onError={() => setSrc('/placeholder-image.jpg')}
				/>

				{/* Hover image */}
				{hoverSrc && (
					<img
						src={hoverSrc}
						alt={product.name}
						width={300}
						height={300}
						loading='lazy'
						sizes={SIZES}
						className='object-cover rounded-lg w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
						onError={() => setHoverSrc('/placeholder-image.jpg')}
					/>
				)}
			</div>

			<div className='flex flex-col'>
				<p className='mt-5 text-lg group-hover:underline underline-offset-4 max-[500px]:text-base'>
					{product.name}
				</p>

				<div
					className='line-clamp-6 text-sm text-neutral-500 my-3 max-[500px]:text-xs'
					dangerouslySetInnerHTML={{ __html: product.description }}
				/>

				{defaultItem && <p className='font-semibold text-lg'>{defaultItem.price} грн.</p>}
			</div>
		</Link>
	)
}