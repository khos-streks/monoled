'use client'

import { useContactUs } from '@/hooks/useEmail'
import styles from './styles.module.scss'
import cn from 'clsx'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTexts } from '@/context/textContext'

interface Form {
	firstName: string
	lastName: string
	tel: string
	companyName: string
	country: string
	city: string
	email: string
	message: string
}

export function ContactUsForm() {
	const [loadingToastId, setLoadingToastId] = useState('')
	const { register, handleSubmit } = useForm<Form>()
	const { mutateAsync: contactUs, isPending, isSuccess, isError } = useContactUs()

	const texts = useTexts()

	const contactUsText = texts?.find(text => text.slug === 'contact-us')?.text
	const firstNameText = texts?.find(text => text.slug === 'first-name')?.text
	const lastNameText = texts?.find(text => text.slug === 'last-name')?.text
	const telText = texts?.find(text => text.slug === 'tel')?.text
	const companyNameText = texts?.find(text => text.slug === 'company-name')?.text
	const countryText = texts?.find(text => text.slug === 'country')?.text
	const cityText = texts?.find(text => text.slug === 'city')?.text
	const emailText = texts?.find(text => text.slug === 'email')?.text
	const messageText = texts?.find(text => text.slug === 'message')?.text

	const firstNamePlaceholder = texts?.find(text => text.slug === 'first-name-placeholder')?.text
	const lastNamPlaceholder = texts?.find(text => text.slug === 'last-name-placeholder')?.text
	const telPlaceholder = texts?.find(text => text.slug === 'tel-placeholder')?.text
	const companyNamePlaceholder = texts?.find(text => text.slug === 'company-name-placeholder')?.text
	const countryPlaceholder = texts?.find(text => text.slug === 'country-placeholder')?.text
	const cityPlaceholder = texts?.find(text => text.slug === 'city-placeholder')?.text
	const emailPlaceholder = texts?.find(text => text.slug === 'email-placeholder')?.text
	const messagePlaceholder = texts?.find(text => text.slug === 'message-placeholder')?.text

	const sendTitle = texts?.find(text => text.slug === 'send')?.text

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває відправлення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			toast.success('Успішно відправлено!')
			setTimeout(() => window.location.reload(), 500)
		}
		if (isError) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	return (
		<div className='animate-opacity-1'>
			<h2 className='text-3xl text-center'>{contactUsText}</h2>
			<form
				className='w-[600px] max-sm:w-[95%] mx-auto mt-10 flex flex-col gap-4 items-center'
				onSubmit={handleSubmit(data => contactUs(data))}
			>
				<div className='grid grid-cols-2 gap-x-6 gap-y-4 w-full mx-auto place-items-center max-sm:grid-cols-1'>
					<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
						<label htmlFor='first-name'>{firstNameText}</label>
						<input
							{...register('firstName', { required: true })}
							required
							type='text'
							placeholder={firstNamePlaceholder}
							id='first-name'
						/>
					</div>
					<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
						<label htmlFor='last-name'>{lastNameText}</label>
						<input
							{...register('lastName', { required: true })}
							required
							type='text'
							placeholder={lastNamPlaceholder}
							id='last-name'
						/>
					</div>
					<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
						<label htmlFor='tel'>{telText}</label>
						<input
							{...register('tel', { required: true })}
							required
							type='tel'
							placeholder={telPlaceholder}
							id='tel'
						/>
					</div>
					<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
						<label htmlFor='company-name'>{companyNameText}</label>
						<input
							{...register('companyName', { required: true })}
							required
							type='text'
							placeholder={companyNamePlaceholder}
							id='company-name'
						/>
					</div>
					<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
						<label htmlFor='country'>{countryText}</label>

						<input
							type='text'
							{...register('country', { required: true })}
							required
							placeholder={countryPlaceholder}
							id='country'
						/>
					</div>
					<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
						<label htmlFor='first-name'>{cityText}</label>
						<input
							type='text'
							{...register('city', { required: true })}
							required
							placeholder={cityPlaceholder}
							id='city'
						/>
					</div>
				</div>
				<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
					<label htmlFor='email'>{emailText}</label>
					<input
						type='email'
						{...register('email', { required: true })}
						required
						placeholder={emailPlaceholder}
						id='email'
					/>
				</div>
				<div className={cn('flex flex-col items-start gap-2 w-full', styles.inputParent)}>
					<label htmlFor='message'>{messageText}</label>
					<textarea
						placeholder={messagePlaceholder}
						id='message'
						{...register('message', { required: true })}
						required
						className='resize-y w-full min-h-[150px] max-h-[300px]'
					/>
				</div>
				<button
					type='submit'
					className='w-[200px] max-sm:w-full h-12 bg-foreground text-background rounded-lg'
				>
					{sendTitle}
				</button>
			</form>
		</div>
	)
}
