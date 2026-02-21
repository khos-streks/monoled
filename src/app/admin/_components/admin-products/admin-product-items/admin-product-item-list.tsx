'use client'

import { ProductWithItems } from '@/typing/interfaces'
import { EditIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { AdminProductItemDelete } from './admin-product-item-delete'
import { AdminProductItemEdit } from './admin-product-item-edit'

interface Props {
	productId: number
	items: ProductWithItems['items']
}

export function AdminProductItemList({ productId, items }: Props) {
	const [editingItemId, setEditingItemId] = useState<number | null>(null)
	const [deletingItemId, setDeletingItemId] = useState<number | null>(null)

	if (items.length === 0) {
		return (
			<div className='text-center p-8 border rounded-md bg-gray-50'>
				<p className='text-gray-500'>Немає варіантів товару. Додайте перший варіант!</p>
			</div>
		)
	}

	const handleEditComplete = () => {
		setEditingItemId(null)
	}

	const handleDeleteComplete = () => {
		setDeletingItemId(null)
	}

	return (
		<div className='space-y-4'>
			{editingItemId && (
				<div className='mb-4 border p-4 rounded-md bg-yellow-50'>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-lg font-medium'>Редагувати варіант</h3>
						<button
							className='px-3 py-1 border rounded hover:bg-gray-100 transition-colors'
							onClick={() => setEditingItemId(null)}
						>
							Скасувати
						</button>
					</div>
					<AdminProductItemEdit
						itemId={editingItemId}
						item={items.find(item => item.id === editingItemId)!}
						onComplete={handleEditComplete}
					/>
				</div>
			)}

			{deletingItemId && (
				<div className='mb-4 border p-4 rounded-md bg-red-50'>
					<AdminProductItemDelete
						itemId={deletingItemId}
						itemName={items.find(item => item.id === deletingItemId)?.color || 'Варіант товару'}
						onComplete={handleDeleteComplete}
						onCancel={() => setDeletingItemId(null)}
					/>
				</div>
			)}

			<div className='overflow-x-auto rounded-md border'>
				<table className='w-full border-collapse'>
					<thead>
						<tr className='bg-gray-50'>
							<th className='p-3 text-left border-b font-medium text-sm text-gray-600'>
								Зображення
							</th>
							<th className='p-3 text-left border-b font-medium text-sm text-gray-600'>Колір</th>
							<th className='p-3 text-left border-b font-medium text-sm text-gray-600'>Ціна</th>
							<th className='p-3 text-left border-b font-medium text-sm text-gray-600'>
								Кількість
							</th>
							<th className='p-3 text-left border-b font-medium text-sm text-gray-600'>Дії</th>
						</tr>
					</thead>
					<tbody>
						{items.map(item => (
							<tr
								key={item.id}
								className='border-b hover:bg-gray-50 transition-colors'
							>
								<td className='p-3'>
									<div className='w-16 h-16 relative'>
										<Image
											src={item.images[0] || '/placeholder-image.jpg'}
											alt='Product variant'
											fill
											className='object-cover rounded'
										/>
									</div>
								</td>
								<td className='p-3'>{item.color || 'Без кольору'}</td>
								<td className='p-3 font-medium'>{item.price} грн.</td>
								<td className='p-3'>{item.quantityLeft}</td>
								<td className='p-3'>
									<div className='flex gap-2'>
										<button
											className='p-2 border rounded hover:bg-gray-100 transition-colors'
											onClick={() => setEditingItemId(item.id)}
											title='Редагувати'
										>
											<EditIcon className='h-4 w-4' />
										</button>
										<button
											className='p-2 border rounded text-white bg-red-500 hover:bg-red-600 transition-colors'
											onClick={() => setDeletingItemId(item.id)}
											title='Видалити'
										>
											<Trash2Icon className='h-4 w-4' />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
