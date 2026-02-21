'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
	searchQuery: string | null
}

export function ShopSearchView({ searchQuery }: Props) {
	const router = useRouter()
	const removeSearchQuery = () => {
		const params = new URLSearchParams(window.location.search)
		params.delete('search')
		router.replace(`?${params.toString()}`)
	}
	return (
		searchQuery && (
			<div className='mt-5 flex items-center gap-3 ml-5'>
				<p className='text-xl'>Показані результати для "{searchQuery}"</p>
				<button
					className='border border-[#00000040] rounded-md active:scale-110 transition-transform duration-200'
					onClick={removeSearchQuery}
				>
					<X
						size={32}
						strokeWidth={1}
					/>
				</button>
			</div>
		)
	)
}
