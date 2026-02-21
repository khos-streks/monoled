'use client'

import { Category } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
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
						<motion.li
							initial={{ opacity: 0, y: '100%' }}
							animate={{ opacity: 1, y: '0' }}
							transition={{ duration: 0.2, bounce: 0, ease: 'easeInOut' }}
						>
							<Link
								target='_top'
								href='/shop'
								className='py-2 text-xl'
							>
								{(!params.toString().includes('category') || !params.get('category')?.length) &&
									pathname.includes('shop') &&
									'-'}{' '}
								{allCategoriesText}
							</Link>
						</motion.li>
						{allCategories.map(i => {
							const isCurrentSelected =
								params.toString().includes(i.slug) && pathname.includes('shop')
							return (
								<motion.li
									key={i.slug}
									initial={{ opacity: 0, y: '100%' }}
									animate={{ opacity: 1, y: '0' }}
									transition={{ duration: 0.2, bounce: 0, ease: 'easeInOut' }}
								>
									<Link
										target='_top'
										className='py-2 text-xl'
										href={`/shop?category=${i.slug}`}
									>
										{isCurrentSelected && '-'} {i.name}
									</Link>
								</motion.li>
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
