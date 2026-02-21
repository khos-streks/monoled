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
import { useMenuState } from '../layout/menu/menu.state'

export const SheetContext = createContext<{
	isOpen: boolean
	openSheet: () => void
	closeSheet: () => void
} | null>(null)

function SheetComponent({
	trigger,
	children,
	title,
	className
}: PropsWithChildren<{
	trigger: JSX.Element
	title?: string
	side?: string
	className?: string
}>) {
	const [isOpen, setIsOpen] = useState(false)
	const { setIsOpen: setIsOpenMenu } = useMenuState()

	const openSheet = () => {
		setIsOpen(true)
		setIsOpenMenu(true)
		if (typeof window !== 'undefined') document.body.style.overflow = 'hidden'
	}

	const closeSheet = () => {
		setIsOpen(false)
		setIsOpenMenu(false)
		if (typeof window !== 'undefined') document.body.style.overflow = 'auto'
	}

	return (
		<SheetContext.Provider value={{ isOpen, closeSheet, openSheet }}>
			{cloneElement(trigger, { onClick: openSheet })}
			{createPortal(
				<SheetContent
					className={className}
					title={title}
				>
					{children}
				</SheetContent>,
				document.body
			)}
		</SheetContext.Provider>
	)
}

export const Sheet = dynamic(() => Promise.resolve(SheetComponent), { ssr: false })

function SheetContent({
	children,
	className,
	title
}: PropsWithChildren<{
	className?: string
	title?: string
	side?: string
}>) {
	const sheetContextValues = useContext(SheetContext)

	if (!sheetContextValues) throw new Error('SheetContent must be used within a <Sheet />')

	const { closeSheet, isOpen } = sheetContextValues

	const sideVariants: Variants = {
		hidden: { clipPath: 'inset(0 0 100% 0)' },
		visible: { clipPath: 'inset(0 0 0 0)' }
	}

	return (
		<AnimatePresence mode='wait'>
			{isOpen && (
				<div
					className='fixed left-0 top-20 w-screen h-screen overflow-x-hidden z-[9999]'
					id='sheet'
				>
					<motion.div
						key='sheet-content'
						id='sheet-content'
						className={clsx('fixed top-20 left-0 p-4 bg-white z-[1000] w-full h-full overflow-y-scroll')}
						variants={sideVariants}
						initial='hidden'
						animate='visible'
						exit='hidden'
						transition={{
							duration: 0.6,
							ease: [0.6, -0.05, 0.01, 0.99]
						}}
					>
						<div className='w-full py-4 flex justify-between items-center mb-2'>
							<h2 className='text-3xl font-bold text-black'>{title}</h2>
							<X
								className='cursor-pointer'
								onClick={closeSheet}
								size={40}
								color='#000'
							/>
						</div>
						<div className={clsx('w-full h-full', className)}>{children}</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}
