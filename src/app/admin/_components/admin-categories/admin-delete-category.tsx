'use client'

import { Dialog } from '@/components/ui/dialog'
import { useDeleteCategory } from '@/hooks/useCategories'
import { Category, Product } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
	category: Category
	products: Product[] | undefined
}

export function AdminDeleteCategory({ category, products }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const queryClient = useQueryClient()
	const { mutateAsync: deleteFunc, isPending, isSuccess, isError } = useDeleteCategory()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває видалення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			queryClient.invalidateQueries({ queryKey: ['categories get'] })
		}
		if (isError) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	return (
		<Dialog
			title='Видалити категорію'
			trigger={
				<button
					disabled={!!products?.find(p => p.categorySlug === category.slug)}
					title={!!products?.find(p => p.categorySlug === category.slug) ? "Дана категорія використовується" : "Видалити"}
					className='ml-4 text-red-600 hover:text-red-900 disabled:text-red-200 disabled:cursor-not-allowed'
				>
					Видалити
				</button>
			}
		>
			<div className='flex flex-col items-start gap-6'>
				<p>Ви дійсно хочете видалити категорію {category.name}?</p>
				<button
					className='ml-auto rounded-md text-background bg-foreground px-6 py-2'
					onClick={() => deleteFunc(category.id)}
				>
					Так
				</button>
			</div>
		</Dialog>
	)
}
