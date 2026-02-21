import { textsService } from '@/services/texts.service'
import { Metadata } from 'next'
import Image from 'next/image'
import { AboutText } from './about-text'

export const metadata: Metadata = {
	title: 'Lumineka - Про бренд'
}

export default async function AboutPage() {
	const texts = await textsService.getAllTexts()

	const title = texts?.find(text => text.slug === 'title')?.text
	const aboutTitle = texts?.find(text => text.slug === 'about-title')?.text
	const about = texts?.find(text => text.slug === 'about')?.text

	const imageUrl = texts?.find(text => text.slug === 'about-page-image-url')?.text

	return (
		<>
			<div className='mx-auto container my-5'>
				<h2 className='text-5xl font-medium mb-6 text-left'>{aboutTitle}</h2>
				<div className='text-center py-10 container mx-auto animate-opacity-1'>
					<div className='grid grid-cols-[1.5fr_2fr] gap-12 max-sm:grid-cols-1'>
						<div className='w-full h-min aspect-square sticky top-5 max-sm:hidden'>
							<div className='relative w-full h-full'>
								<Image
									src={imageUrl && imageUrl.trim().length ? imageUrl : '/placeholder-image.jpg'}
									alt='about'
									className='object-cover'
									fill
									loading='lazy'
									sizes='100%, 100%'
								/>
							</div>
						</div>
						<div className='w-full'>
							<div>
								<h1 className='font-semibold text-5xl uppercase'>{title}</h1>
								<AboutText text={about} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
