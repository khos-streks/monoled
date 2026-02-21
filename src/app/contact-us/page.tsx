import { ContactUsForm } from '@/components/layout/contact-us-form/contact-us-form'
import { textsService } from '@/services/texts.service'
import Image from 'next/image'
import { ContactText } from './contact-text'

export const metadata = {
	title: 'Lumineka - Контакти'
}

export default async function ContactUsPage() {
	const texts = await textsService.getAllTexts()
	const contactUsText = texts?.find(text => text.slug === 'contacts-title')?.text
	const title = texts?.find(text => text.slug === 'title')?.text
	const description = texts?.find(text => text.slug === 'contacts-description')?.text

	const imageUrl = texts?.find(text => text.slug === 'contacts-page-image-url')?.text

	return (
		<div className='mx-auto container my-5'>
			<h2 className='text-5xl font-medium mb-6 text-left'>{contactUsText}</h2>
			<div className='grid-cols-2 grid gap-10 py-6 max-sm:grid-cols-1 max-sm:h-80 animate-opacity-1'>
				<div className='w-full h-min aspect-square sticky top-5 max-sm:hidden'>
					<div className='relative w-full h-full'>
						<Image
							src={imageUrl && imageUrl.trim().length ? imageUrl : '/placeholder-image.jpg'}
							alt='about'
							className='object-cover'
							loading='lazy'
							fill
							sizes='100%, 100%'
						/>
					</div>
				</div>
				<div className='my-20 container mx-auto max-sm:px-2'>
					<h1 className='text-5xl mb-10 text-center uppercase font-semibold'>{title}</h1>
					<ContactText text={description} />
				</div>
			</div>
			<div className='py-20 bg-neutral-100'>
				<ContactUsForm />
			</div>
		</div>
	)
}
