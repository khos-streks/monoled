import { Admin } from '@prisma/client'
import { CreateAdmin } from './create-admin'
import { EditAdmin } from './edit-admin'
import { DeleteAdmin } from './delete-admin'

interface Props {
	admins: Admin[] | undefined
}

export function AdminsTab({ admins }: Props) {
	return (
		<div className='p-4 animate-opacity-1'>
			<div className='flex justify-between items-center mb-6 max-sm:flex-col max-sm:gap-4'>
				<h2 className='text-2xl font-semibold'>Адміністратори</h2>
				<CreateAdmin />
			</div>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
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
								Логін
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
						{admins?.map(admin => (
							<tr key={admin.id}>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{admin.id}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{admin.login}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{new Date(admin.createdAt).toLocaleDateString()}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{new Date(admin.updatedAt).toLocaleDateString()}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									<EditAdmin admin={admin} />
									<DeleteAdmin admin={admin} admins={admins} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
