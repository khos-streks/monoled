'use client'

import clsx from 'clsx'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'
import {
	cloneElement,
	createContext,
	type JSX,
	type PropsWithChildren,
	useContext,
	useState
} from 'react'
import { createPortal } from 'react-dom'

export const DialogContext = createContext<{
	isOpen: boolean
	openPopup: () => void
	closePopup: () => void
} | null>(null)

function PopupComponent({
	trigger,
	children,
	title,
	className
}: PropsWithChildren<{
	trigger: JSX.Element
	title?: string
	className?: string
}>) {
	const [isOpen, setIsOpen] = useState(false)

	const openPopup = () => {
		setIsOpen(true)
		if (typeof window !== 'undefined') document.body.style.overflow = 'hidden'
	}

	const closePopup = () => {
		setIsOpen(false)
		if (typeof window !== 'undefined') document.body.style.overflow = 'auto'
	}

	return (
		<DialogContext.Provider value={{ isOpen, closePopup, openPopup }}>
			{cloneElement(trigger, { onClick: openPopup })}
			{createPortal(
				<PopupContent
					className={className}
					title={title}
				>
					{children}
				</PopupContent>,
				document.body
			)}
		</DialogContext.Provider>
	)
}

export const Popup = dynamic(() => Promise.resolve(PopupComponent), { ssr: false })

function PopupContent({
	children,
	className,
	title
}: PropsWithChildren<{
	className?: string
	title?: string
	side?: string
}>) {
	const popupContextValues = useContext(DialogContext)

	if (!popupContextValues) throw new Error('PopupContent must be used within a <Popup />')

	const { closePopup, isOpen } = popupContextValues

	const sideVariants: Variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	}

	return (
		<AnimatePresence mode='wait'>
			{isOpen && (
				<div
					className='fixed left-0 top-0 w-screen h-screen overflow-hidden z-[9999]'
					id='dialog'
				>
					<motion.div
						key='dialog-overlay'
						className='absolute z-[999] bg-[rgba(0,0,0,.9)] w-screen h-screen left-0 top-0 inset-0'
						variants={sideVariants}
						onClick={closePopup}
						initial='hidden'
						animate='visible'
						exit='hidden'
						transition={{
							duration: 0.6,
							ease: [0.6, -0.05, 0.01, 0.99]
						}}
					/>

					<motion.div
						variants={sideVariants}
						initial='hidden'
						animate='visible'
						exit='hidden'
						transition={{
							duration: 0.2
						}}
						className='py-4 flex gap-10 max-sm:gap-2 items-center mt-24 justify-center z-[10001] max-lg:w-[95%] max-lg:mx-auto'
					>
						<div className='z-[10001] max-lg:w-4/5'>{children}</div>
						<div className='rounded-full bg-[#666] p-2 h-20 max-sm:h-16 aspect-square flex items-center justify-center z-[10001]'>
							<X
								className='cursor-pointer'
								onClick={closePopup}
								size={36}
								strokeWidth={1}
								color='#fff'
							/>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}
