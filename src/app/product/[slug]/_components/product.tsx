'use client'

import { ProductWithItems } from '@/typing/interfaces'
import { ProductItem, TextField } from '@prisma/client'
import { useState } from 'react'
import { ProductInfo } from './product-info'
import { ProductMainInfo } from './product-main-info'
import { ProductSlider } from './product-slider'

interface Props {
	product: ProductWithItems
	texts: TextField[] | undefined
}

export function Product({ product, texts }: Props) {
	const [selectedItem, setSelectedItem] = useState<ProductItem>(product.items[0])
	console.log(selectedItem)

	return (
		<>
			<div className='container mx-auto max-sm:px-2 my-10 animate-opacity-1'>
				<h2 className='text-3xl text-center mb-5 max-sm:text-2xl'>{product.name}</h2>
				<div className='grid grid-cols-2 w-full pt-5 gap-10 justify-between max-lg:grid-cols-1'>
					<ProductSlider images={selectedItem.images} />
					<ProductMainInfo
						texts={texts}
						product={product}
						setSelectedItem={setSelectedItem}
						selectedItem={selectedItem}
					/>
				</div>
				<ProductInfo product={product} />
			</div>
		</>
	)
}
