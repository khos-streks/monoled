import { Category, Product } from '@prisma/client'
import { AdminCreateCategory } from './admin-create-category'
import { AdminDeleteCategory } from './admin-delete-category'
import { AdminEditCategory } from './admin-edit-categories'

interface Props {
	categories: Category[] | undefined
	products: Product[] | undefined
}

export function AdminCategoriesTab({ categories, products }: Props) {
	return (
		<div className='p-4 w-full animate-opacity-1'>
			<div className='flex justify-between items-center mb-6 max-sm:flex-col max-sm:gap-4'>
				<h2 className='text-2xl font-semibold'>Категорії</h2>
				<AdminCreateCategory />
			</div>
			<div className='overflow-x-auto w-full'>
				<table className='min-w-full divide-y divide-gray-200 overflow-x-scroll'>
					<thead className='bg-gray-50'>
						<tr>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								ID
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								Назва
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								Slug
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								Дата створення
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								Останнє оновлення
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								Дії
							</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{categories?.map(category => (
							<tr key={category.id}>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{category.id}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
									{category.name}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{category.slug}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{new Date(category.createdAt).toLocaleDateString()}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{new Date(category.updatedAt).toLocaleDateString()}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									<AdminEditCategory category={category} />
									<AdminDeleteCategory category={category} products={products} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
