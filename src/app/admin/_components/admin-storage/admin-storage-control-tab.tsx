import Image from 'next/image'
import { IFile } from './admin-storage.typing'
import { CopyFileUrl } from './admin-storage-copy'
import { DeleteFile } from './admin-storage-delete'
import { CreateFile } from './admin-storage-create'

interface Props {
	files: IFile[] | undefined
}

export function AdminStorageControlTab({ files }: Props) {
	return (
		<div className='p-4 animate-opacity-1'>
			<div className='flex justify-between items-center mb-6 max-sm:flex-col max-sm:gap-4'>
				<h2 className='text-2xl font-semibold'>Сховище</h2>
				<CreateFile />
			</div>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								Попередній перегляд
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
								Дата створення
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
						{files
							?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map(file => {
								const url = process.env.NEXT_PUBLIC_STORAGE_URL + file.url
								return (
									<tr key={file.title}>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<Image
												src={url.length ? url : '/placeholder-image.jpg'}
												alt={file.title}
												width={120}
												height={120}
												className='aspect-square object-contain'
												loading='lazy'
											/>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{file.title}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{new Date(file.createdAt).toLocaleDateString()}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<CopyFileUrl file={file} />
											<DeleteFile file={file} />
										</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			</div>
		</div>
	)
}
