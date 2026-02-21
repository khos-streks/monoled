'use client'

import { useTexts } from '@/context/textContext'
import { ProductWithItems } from '@/typing/interfaces'
import cn from 'clsx'
import { useState } from 'react'

interface Props {
	product: ProductWithItems
}

export function ProductInfo({ product }: Props) {
	const [currentInfoBlock, setCurrentInfoBlock] = useState<'description' | 'info'>('description')
	const texts = useTexts()

	const descriptionTitle = texts?.find(text => text.slug === 'description-title')?.text
	const infoTitle = texts?.find(text => text.slug === 'info-title')?.text
	const mainInfoText = texts?.find(text => text.slug === 'main-info')?.text
	const characteristicsTitle =
		texts?.find(text => text.slug === 'characteristics-title')?.text || 'Характеристики'

	return (
		<div
			id='info'
			className='pt-10'
		>
			<header className='flex items-center bg-white max-lg:justify-center max-[430px]:flex-col max-[430px]:w-full'>
				<button
					onClick={() => setCurrentInfoBlock('description')}
					className={cn('bg-neutral-100 h-full px-6 py-5 max-[430px]:w-full', {
						'underline underline-offset-[6px] !bg-neutral-200': currentInfoBlock === 'description'
					})}
				>
					{descriptionTitle}
				</button>
				<button
					onClick={() => setCurrentInfoBlock('info')}
					className={cn('bg-neutral-100 h-full px-6 py-5 max-[430px]:w-full', {
						'underline underline-offset-[6px] !bg-neutral-200': currentInfoBlock === 'info'
					})}
				>
					{infoTitle}
				</button>
			</header>
			<main>
				{currentInfoBlock === 'description' && (
					<div className='p-5 bg-white'>
						<h3 className='mb-5 text-xl'>{descriptionTitle}:</h3>
						<div
							className='w-2/3 max-xl:w-3/4 max-lg:w-full text-lg text-neutral-500 pl-5 font-light'
							dangerouslySetInnerHTML={{ __html: product.description || '' }}
						/>
					</div>
				)}
				{currentInfoBlock === 'info' && (
					<div className='p-5 bg-white'>
						<div className='font-light text-xl mb-6'>
							<div dangerouslySetInnerHTML={{ __html: mainInfoText || '' }} />
						</div>

						{product.info && product.info.length > 0 && (
							<div className='mt-6'>
								<h3 className='mb-5 text-xl'>{characteristicsTitle}:</h3>
								<div className='grid grid-cols-2 gap-4'>
									{product.info
										.sort((a, b) => a.order - b.order)
										.map((info, index) => (
											<div
												key={index}
												className='flex'
											>
												<div className='font-medium mr-2'>{info.title}:</div>
												<div>{info.value}</div>
											</div>
										))}
								</div>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	)
}
