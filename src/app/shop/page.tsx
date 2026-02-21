import { categoriesService } from '@/services/categories.service'
import { productsService } from '@/services/products.service'
import { textsService } from '@/services/texts.service'
import { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Shop = dynamic(() => import('./_components/shop'))

export const metadata: Metadata = {
	title: 'Lumineka - Каталог товарів'
}

export const revalidate = 180

async function ShopPage() {
	const [categoriesRes, productsRes, texts] = await Promise.all([
		categoriesService.getAllCategories(),
		productsService.getAllProducts(),
		textsService.getAllTexts()
	])

	return (
		<section className='min-h-[75vh]'>
			<Suspense fallback={<ShopSkeleton />}>
				<Shop
					texts={texts}
					allCategories={categoriesRes?.data}
					allProducts={productsRes?.data}
				/>
			</Suspense>
		</section>
	)
}

function ShopSkeleton() {
	return (
		<div className='container mx-auto max-sm:px-2 mt-10 pb-20 animate-pulse'>
			<div className='h-10 w-64 bg-neutral-200 rounded mb-6' />
			<div className='grid grid-cols-[1fr_3fr] max-md:grid-cols-1 gap-5 mt-8'>
				<div className='bg-neutral-100 h-64 rounded' />
				<div className='bg-neutral-100 h-96 rounded' />
			</div>
		</div>
	)
}

export default ShopPage
