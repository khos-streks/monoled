'use client'

import { ShopProduct } from '@/app/shop/_components/shop-product'
import { ProductWithItems } from '@/typing/interfaces'
import type { Category } from '@prisma/client'
import { AdminProductCreate } from './admin-product-create/admin-product-create'
import { AdminProductDelete } from './admin-product-delete'
import { AdminProductEdit } from './admin-product-edit/admin-product-edit'
import { AdminProductInfo } from './admin-product-info'
import { AdminProductItems } from './admin-product-items/admin-product-items'
import { AdminProductMoveDown } from './admin-product-moveDown'
import { AdminProductMoveUp } from './admin-product-moveUp'

interface Props {
	products: ProductWithItems[] | undefined
	categories: Category[] | undefined
}

export function AdminProductsTab({ products, categories }: Props) {
	return (
		<div className='w-full p-4 animate-opacity-1'>
			<h2 className='mb-6 text-2xl font-semibold'>Товари</h2>

			{products ? (
				<div className='space-y-8'>
					<div className='grid grid-cols-1 w-full gap-8'>
						{products
							?.sort((a, b) => a.order - b.order)
							.map((product, index) => {
								const categoryName =
									categories?.find(category => category.slug === product.categorySlug)?.name ??
									'Без категорії'
								return (
									<div
										className='bg-white rounded-lg shadow-md overflow-hidden'
										key={product.id}
									>
										<div className='p-4 bg-gray-50 border-b flex justify-between items-center'>
											<div>
												<h3 className='text-xl font-medium'>{product.name}</h3>
												<p className='text-sm text-gray-500'>Категорія: {categoryName}</p>
											</div>
											<div className='flex gap-2'>
												<AdminProductMoveUp productId={product.id} />
												<AdminProductMoveDown productId={product.id} />
											</div>
										</div>

										<div className='p-4 grid grid-cols-2 gap-6'>
											{/* Колонка з візуалізацією товару */}
											<div className='md:col-span-1'>
												<ShopProduct
													index={index}
													showMode='list'
													product={product}
												/>
											</div>

											{/* Колонка з інформацією та діями */}
											<div className='col-span-2 ml-auto max-[480px]:col-span-1'>
												<div className='flex gap-2 flex-wrap'>
													<AdminProductEdit
														product={product}
														categories={categories}
													/>
													<AdminProductItems product={product} />
													<AdminProductInfo product={product} />
													<AdminProductDelete
														productId={product.id}
														productName={product.name}
													/>
												</div>
											</div>
										</div>
									</div>
								)
							})}
					</div>

					<div className='pt-4'>
						<AdminProductCreate categories={categories} />
					</div>
				</div>
			) : (
				<p>Отримання товарів з бази даних...</p>
			)}
		</div>
	)
}
