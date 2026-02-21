'use client'

import { ProductWithItems } from '@/typing/interfaces'
import { filterProducts } from '@/utils/filterProducts'
import { Category, TextField } from '@prisma/client'
import cn from 'clsx'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { ShopHeader } from './shop-header'
import { ShopPagination } from './shop-pagination'
import { ShopProduct } from './shop-product'
import { ShopSearchView } from './shop-search-view'
import { ShopSidebar } from './shop-sidebar'

interface Props {
	allCategories: Category[] | undefined
	allProducts: ProductWithItems[] | undefined
	texts: TextField[] | undefined
}

export default function Shop({ allCategories, allProducts, texts }: Props) {
	const searchParams = useSearchParams()

	const category = searchParams.get('category') ?? ''
	const searchQuery = searchParams.get('search') ?? ''
	const currentShowMode = searchParams.get('showMode') === 'list' ? ('list' as const) : ('grid' as const)
	const sortingMethodId = Number(searchParams.get('sorting') ?? 1)
	const page = Number(searchParams.get('page')) || 1
	const limit = Number(searchParams.get('limit')) || 10

	const { filteredProducts, totalPages } = useMemo(
		() => filterProducts(allProducts, { category, searchQuery, sortingMethodId, page, limit }),
		[allProducts, category, searchQuery, sortingMethodId, page, limit]
	)

	const shopSectionTitle = texts?.find(text => text.slug === 'shop-section-title')?.text
	const nothingFound = texts?.find(text => text.slug === 'nothing-found')?.text

	return (
		<div className='container mx-auto max-sm:px-2 mt-10 pb-20 animate-opacity-1'>
			<h2 className='text-4xl font-medium mb-6'>{shopSectionTitle}</h2>
			<div className='grid grid-cols-[1fr_3fr] max-lg:grid-cols-[1fr_2fr] max-md:grid-cols-1 max-md:gap-5 w-full mt-8'>
				<ShopSidebar allCategories={allCategories} />
				<section className='w-full bg-white'>
					<div className='h-[60px] max-lg:h-[200px] max-md:h-[140px]'>
						<ShopHeader currentShowMode={currentShowMode} />
					</div>
					<main>
						<ShopSearchView searchQuery={searchQuery} />
						{filteredProducts && filteredProducts.length ? (
							<div
								className={cn('bg-white w-full p-5 gap-5 grid grid-cols-3 max-lg:grid-cols-2', {
									'min-[500px]:grid-cols-1': currentShowMode === 'list'
								})}
							>
								{filteredProducts.map((product, index) => (
									<article
										key={product.id}
										style={{
											opacity: 0,
											animation: 'opacity 0.6s ease-in-out forwards',
											animationDelay: `${Math.min(index * 0.1, 1)}s`
										}}
									>
										<ShopProduct
											index={index}
											showMode={currentShowMode}
											product={product}
										/>
									</article>
								))}
							</div>
						) : (
							<h2 className='ml-8 mt-5 text-xl'>{nothingFound}</h2>
						)}
						<ShopPagination totalPages={totalPages} />
					</main>
				</section>
			</div>
		</div>
	)
}
