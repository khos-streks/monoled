import { Dialog } from '@/components/ui/dialog'
import { ProductWithItems } from '@/typing/interfaces'
import { stringifyWithoutQuotes } from '@/utils/stringifyWithoutQuotes'
import { InfoIcon } from 'lucide-react'

interface Props {
	product: ProductWithItems
}

export function AdminProductInfo({ product }: Props) {
	const keysToDisplay: Record<string, string> = {
		id: 'ID',
		name: 'Назва',
		categorySlug: 'Slug категорї',
		slug: 'Slug',
		modelUrl: 'URL моделі',
		isNew: 'Новинка',
		description: 'Опис',
		createdAt: 'Дата створення',
		updatedAt: 'Дата оновлення'
	}

	return (
		<Dialog
			title='Детальна інформація'
			trigger={
				<button className='px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-md flex items-center gap-1 text-sm hover:bg-blue-100 transition-colors'>
					<InfoIcon className='h-4 w-4' />
					<span>Інфо</span>
				</button>
			}
		>
			<div className='p-4'>
				<h3 className='text-xl font-medium mb-4'>{product.name}</h3>

				<div className='space-y-2'>
					{Object.entries(product)
						.filter(i => i[0] !== 'items' && i[0] !== 'images' && i[0] !== 'info')
						.map(([key, value]) => (
							<div
								className='grid grid-cols-2 gap-4'
								key={key}
							>
								<span className='font-medium'>{keysToDisplay[key] || key}:</span>
								<span>{stringifyWithoutQuotes(value)}</span>
							</div>
						))}
					<div className='grid grid-cols-2 gap-4'>
						<span className='font-medium'>Кількість варіантів:</span>
						<span>{product.items.length}</span>
					</div>
				</div>

				{product.info && product.info.length > 0 && (
					<div className='mt-6'>
						<h4 className='text-lg font-medium mb-2'>Додаткова інформація</h4>
						<div className='space-y-2'>
							{product.info
								.sort((a, b) => a.order - b.order)
								.map((info, idx) => (
									<div
										className='grid grid-cols-2 gap-4'
										key={idx}
									>
										<span className='font-medium'>{info.title}:</span>
										<span>{info.value}</span>
									</div>
								))}
						</div>
					</div>
				)}
			</div>
		</Dialog>
	)
}
