'use client'

import { useDeleteProductItem } from '@/hooks/useProducts'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangleIcon } from 'lucide-react'
import { useState } from 'react'

interface Props {
	itemId: number
	itemName: string
	onComplete: () => void
	onCancel: () => void
}

export function AdminProductItemDelete({ itemId, itemName, onComplete, onCancel }: Props) {
	const [isDeleting, setIsDeleting] = useState(false)
	const queryClient = useQueryClient()
	const { mutate: deleteProductItem } = useDeleteProductItem()

	const handleDelete = () => {
		setIsDeleting(true)
		deleteProductItem(
			{ id: itemId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['products get'] })
					setIsDeleting(false)
					onComplete()
				},
				onError: () => {
					setIsDeleting(false)
					alert('Помилка при видаленні варіанту товару')
				}
			}
		)
	}

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center gap-2 text-red-600'>
				<AlertTriangleIcon className='h-5 w-5' />
				<h3 className='text-lg font-medium'>Видалити варіант товару</h3>
			</div>

			<p>
				Ви впевнені, що хочете видалити варіант товару <strong>"{itemName}"</strong>? Ця дія не може
				бути скасована.
			</p>

			<div className='flex gap-2 justify-end'>
				<button
					className='border border-foreground rounded-md px-4 py-2'
					onClick={onCancel}
					disabled={isDeleting}
				>
					Скасувати
				</button>
				<button
					className='bg-red-600 text-white rounded-md px-4 py-2'
					onClick={handleDelete}
					disabled={isDeleting}
				>
					{isDeleting ? 'Видалення...' : 'Видалити варіант'}
				</button>
			</div>
		</div>
	)
}
