'use client'

import { ProductWithItems } from '@/typing/interfaces'
import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
	product: ProductWithItems
	index: number
	showMode: 'grid' | 'list'
}

const CATALOG_SIZES = '(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw'
const BLUR_DATA_URL =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+'

export function ShopProduct({ product, showMode, index }: Props) {
	const defaultItem = product.items && product.items.length > 0 ? product.items[0] : null
	const mainImage = defaultItem?.images?.[0] || '/placeholder-image.jpg'
	const hoverImage = defaultItem?.images?.[1]

	const isAboveFold = index < 4
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		setIsMobile(window.matchMedia('(hover: none)').matches)
	}, [])

	return (
		<Link
			href={`/product/${product.slug}`}
			className={cn('flex w-full flex-col group cursor-pointer', {
				'min-[500px]:gap-10 min-[500px]:flex-row': showMode === 'list'
			})}
		>
			<div
				className={cn('z-0 relative w-full aspect-square', {
					'min-[500px]:h-[200px] 2xl:h-[250px] min-[500px]:w-auto': showMode === 'list'
				})}
			>
				{product.isNew && (
					<div className='absolute top-0 right-3 bg-blue-500 text-white z-[11] rounded-b-md px-4 py-2'>
						Новинка
					</div>
				)}
				<Image
					src={mainImage}
					alt={product.name}
					width={360}
					height={360}
					sizes={CATALOG_SIZES}
					quality={60}
					loading={isAboveFold ? 'eager' : 'lazy'}
					priority={isAboveFold}
					placeholder='blur'
					blurDataURL={BLUR_DATA_URL}
					className={cn('object-cover rounded-lg h-full w-full', {
						'group-hover:opacity-0 transition-opacity duration-[400ms] absolute z-10':
							hoverImage && !isMobile
					})}
				/>
				{hoverImage && !isMobile && (
					<Image
						src={hoverImage}
						alt={product.name}
						width={360}
						height={360}
						sizes={CATALOG_SIZES}
						quality={60}
						loading='lazy'
						placeholder='blur'
						blurDataURL={BLUR_DATA_URL}
						className='object-cover h-full w-full rounded-lg absolute top-0 left-0 hover-only'
					/>
				)}
			</div>

			<div className='flex flex-col'>
				<p className='mt-5 text-lg group-hover:underline underline-offset-4 transition-colors duration-200 max-[500px]:text-base'>
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
