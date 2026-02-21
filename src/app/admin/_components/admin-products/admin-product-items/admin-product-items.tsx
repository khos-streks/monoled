'use client'

import { Dialog } from '@/components/ui/dialog'
import { ProductWithItems } from '@/typing/interfaces'
import { Layers } from 'lucide-react'
import { useState } from 'react'
import { AdminProductItemCreate } from './admin-product-item-create'
import { AdminProductItemList } from './admin-product-item-list'

interface Props {
	product: ProductWithItems
}

export function AdminProductItems({ product }: Props) {
	const [showAddForm, setShowAddForm] = useState(false)

	return (
		<Dialog
			title={`Варіанти товару ${product.name}`}
			trigger={
				<button className='px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md flex items-center gap-1 text-sm hover:bg-indigo-100 transition-colors'>
					<Layers className='h-4 w-4' />
					<span>Варіанти ({product.items.length})</span>
				</button>
			}
		>
			<div className='mx-auto bg-white rounded-md p-4 w-full h-min flex flex-col gap-4'>
				{showAddForm ? (
					<div className='space-y-4'>
						<button
							className='px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1'
							onClick={() => setShowAddForm(false)}
						>
							<span>←</span> Назад до списку
						</button>
						<h3 className='text-lg font-medium'>Створення нового варіанту товару</h3>
						<AdminProductItemCreate
							productId={product.id}
							onComplete={() => {
								setShowAddForm(false)
							}}
						/>
					</div>
				) : (
					<div className='space-y-4'>
						<div className='flex justify-between items-center'>
							<h3 className='text-lg font-medium'>Варіанти товару ({product.items.length})</h3>
							<button
								className='px-3 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-1 hover:bg-indigo-700 transition-colors'
								onClick={() => setShowAddForm(true)}
							>
								<span>+</span> Додати варіант товару
							</button>
						</div>
						<AdminProductItemList
							productId={product.id}
							items={product.items}
						/>
					</div>
				)}
			</div>
		</Dialog>
	)
}
