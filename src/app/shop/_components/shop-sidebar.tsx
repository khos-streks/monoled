'use client'

import { Category } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTexts } from '@/context/textContext'

interface Props {
	allCategories: Category[] | undefined
}

export function ShopSidebar({ allCategories }: Props) {
	const params = useSearchParams()
	const pathname = usePathname()
	const texts = useTexts()

	const allCategoriesText = texts?.find(text => text.slug === 'all-categories-text')?.text
	const categoriesLoadingError = texts?.find(text => text.slug === 'categories-loading-error')?.text

	return (
		<aside className='bg-white overflow-y-hidden'>
			<ul className='flex flex-col gap-6 py-5 px-6 h-full'>
				{allCategories ? (
					<>
						<li
							style={{
								opacity: 0,
								animation: 'fadeSlideIn 0.2s ease-in-out forwards'
							}}
						>
							<Link
								href='/shop'
								className='py-2 text-xl'
							>
								{(!params.toString().includes('category') || !params.get('category')?.length) &&
									pathname.includes('shop') &&
									'-'}{' '}
								{allCategoriesText}
							</Link>
						</li>
						{allCategories.map((i, index) => {
							const isCurrentSelected =
								params.toString().includes(i.slug) && pathname.includes('shop')
							return (
								<li
									key={i.slug}
									style={{
										opacity: 0,
										animation: 'fadeSlideIn 0.2s ease-in-out forwards',
										animationDelay: `${(index + 1) * 0.03}s`
									}}
								>
									<Link
										className='py-2 text-xl'
										href={`/shop?category=${i.slug}`}
									>
										{isCurrentSelected && '-'} {i.name}
									</Link>
								</li>
							)
						})}
					</>
				) : (
					<li>{categoriesLoadingError}</li>
				)}
			</ul>
		</aside>
	)
}
