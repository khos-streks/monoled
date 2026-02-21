'use client'

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import cn from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
	totalPages: number
	
}

export function ShopPagination({ totalPages }: Props) {
	const searchParams = useSearchParams()
	const router = useRouter()

	const page = Number(searchParams.get('page') ?? '1')

	const setPage = (page: number) => {
		const params = new URLSearchParams(window.location.search)
		params.set('page', String(page))
		router.replace(`?${params.toString()}`)
	}

	return (
		<ul className='flex items-center gap-2 justify-center my-12'>
			<li>
				<button
					className='bg-neutral-200 p-2 aspect-square rounded-md'
					disabled={page === 1}
					onClick={() => setPage(page - 1)}
				>
					<ArrowLeftIcon />
				</button>
			</li>
			<li className='overflow-x-scroll no-scrollbar flex items-center gap-2'>
				{Array.from({ length: totalPages })
					.slice(Math.max(0, page - 6), Math.min(totalPages, page + 4))
					.map((_, index) => {
						const pageNumber = Math.max(1, page - 5) + index
						return (
							<div
								key={pageNumber}
								className='w-10 h-10 aspect-square'
							>
								<button
									className={cn('bg-neutral-200 p-2 aspect-square w-full h-full rounded-md', {
										'!bg-neutral-400': page === pageNumber
									})}
									onClick={() => setPage(pageNumber)}
								>
									{pageNumber}
								</button>
							</div>
						)
					})}
			</li>
			<li>
				<button
					className='bg-neutral-200 p-2 aspect-square rounded-md'
					disabled={page === totalPages}
					onClick={() => setPage(page + 1)}
				>
					<ArrowRightIcon />
				</button>
			</li>
		</ul>
	)
}
