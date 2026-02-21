'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useState, useEffect, useRef } from 'react'
import useDebounce from '@/hooks/useDebounce'

export default function LimitSelector() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const initialLimit = Number(searchParams.get('limit')) || 10
	const [inputValue, setInputValue] = useState(initialLimit)
	const debouncedLimit = useDebounce(inputValue, 500)

	// Пропускаємо перший рендер, щоб не робити зайвий router.replace при монтуванні.
	// Залежність — тільки debouncedLimit (а не searchParams), щоб уникнути
	// нескінченного циклу: searchParams змінюється → effect → replace → searchParams змінюється → ...
	const isFirstRender = useRef(true)

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
			return
		}

		const params = new URLSearchParams(window.location.search)
		params.set('limit', String(debouncedLimit))
		router.replace(`?${params.toString()}`, { scroll: false })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedLimit])

	const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value)

		if (value <= 0) {
			setInputValue(1)
		} else if (value > 100) {
			setInputValue(100)
		} else {
			setInputValue(value)
		}
	}

	return (
		<div className='flex gap-2 h-full items-center'>
			Показати
			<input
				type='number'
				value={inputValue}
				onChange={handleLimitChange}
				min='1'
				max='100'
				placeholder='шт.'
				className='rounded-[4px] border-[1px] border-[rgb(204,204,204)] h-full px-2 max-lg:h-[40px]'
			/>
			шт.
		</div>
	)
}
