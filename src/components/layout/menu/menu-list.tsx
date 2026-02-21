'use client'

import { SheetContext } from '@/components/ui/sheet-menu'
import { useTexts } from '@/context/textContext'
import { Category } from '@prisma/client'
import Link from 'next/link'
import { useContext } from 'react'

interface Props {
	categories: Category[] | undefined
}

export function MenuList({ categories }: Props) {
	const sheetContext = useContext(SheetContext)
	const texts = useTexts()
	const categoriesLoadingError = texts?.find(text => text.slug === 'categories-loading-error')?.text

	return (
		<ul className='flex flex-col gap-6 text-xl max-sm:pl-3'>
			{categories ? (
				<>
					<li>
						<Link
							href='/shop'
							className='text-2xl'
							onClick={() => sheetContext?.closeSheet()}
						>
							Всі категорії
						</Link>
					</li>
					{categories.map(i => (
						<li key={i.slug}>
							<Link
								href={`/shop?category=${i.slug}`}
								className='text-2xl'
								onClick={() => sheetContext?.closeSheet()}
							>
								{i.name}
							</Link>
						</li>
					))}
				</>
			) : (
				<li>{categoriesLoadingError}</li>
			)}
		</ul>
	)
}
