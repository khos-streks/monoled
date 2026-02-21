'use client'

import { SORTING_METHODS } from '../shop.data'
import Select from 'react-select'
import { LayoutGridIcon, ListIcon } from 'lucide-react'
import cn from 'clsx'
import dynamic from 'next/dynamic'
import { useTexts } from '@/context/textContext'
import { useRouter, useSearchParams } from 'next/navigation'
import LimitSelector from './shop-limit-selector'

interface Props {
	currentShowMode: 'grid' | 'list'
}

function ShopHeaderComponent({ currentShowMode }: Props) {
	const texts = useTexts()
	const searchParams = useSearchParams()
	const router = useRouter()

	const sortingMethodId = Number(searchParams.get('sorting') ?? '')
	const setSortingMethod = (methodId: number) => {
		const params = new URLSearchParams(window.location.search)
		params.set('sorting', String(methodId))
		router.replace(`?${params.toString()}`)
	}

	const setCurrentShowMode = (showMode: 'grid' | 'list') => {
		const params = new URLSearchParams(window.location.search)
		params.set('showMode', showMode)
		router.replace(`?${params.toString()}`)
	}

	const nothingFound = texts?.find(text => text.slug === 'nothing-found')?.text

	return (
		<header
			className='bg-white px-4 py-2 flex items-center gap-5 h-full max-lg:flex-col max-lg:py-5'
			style={{ opacity: 0, animation: 'opacity 0.3s ease-in-out forwards' }}
		>
			<Select
				options={SORTING_METHODS.map(i => ({ value: i.id, label: i.name }))}
				noOptionsMessage={() => nothingFound}
				value={
					SORTING_METHODS.some(i => i.id === sortingMethodId)
						? {
								value: sortingMethodId,
								label: SORTING_METHODS.find(i => i.id === sortingMethodId)?.name
						  }
						: { value: 1, label: 'Найрелевантніші' }
				}
				onChange={i => setSortingMethod(i?.value || 1)}
				className='w-[300px] max-[400px]:w-full'
				theme={theme => ({
					...theme,
					colors: {
						...theme.colors,
						primary25: '#e0e0e0',
						primary: '#cccccc',
						primary50: '#d3d3d3'
					}
				})}
			/>
			<LimitSelector />
			<div className='ml-auto flex items-center gap-2 max-lg:mx-auto max-md:hidden'>
				<button
					className={cn(
						'w-10 h-10 rounded-sm bg-[rgb(200,200,200)] flex items-center justify-center hover:bg-[rgb(100,100,100)] transition-colors duration-200',
						{ '!bg-[rgb(120,120,120)]': currentShowMode === 'list' }
					)}
					title='Список'
					onClick={() => setCurrentShowMode('list')}
				>
					<ListIcon
						color='rgb(255, 255, 255)'
						fill='rgb(255, 255, 255)'
					/>
				</button>
				<button
					className={cn(
						'w-10 h-10 rounded-sm bg-[rgb(200,200,200)] flex items-center justify-center hover:bg-[rgb(100,100,100)] transition-colors duration-200',
						{ '!bg-[rgb(120,120,120)]': currentShowMode === 'grid' }
					)}
					title='Сітка'
					onClick={() => setCurrentShowMode('grid')}
				>
					<LayoutGridIcon
						color='rgb(255, 255, 255)'
						fill='rgb(255, 255, 255)'
					/>
				</button>
			</div>
		</header>
	)
}

// ssr: false потрібен для react-select (уникає hydration mismatch)
export const ShopHeader = dynamic(() => Promise.resolve(ShopHeaderComponent), { ssr: false })
