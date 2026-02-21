'use client'

import { PropsWithChildren } from 'react'
import { useMenuState } from '../menu/menu.state'
import clsx from 'clsx'

export function HeaderWrapper({ children }: PropsWithChildren) {
	const { isOpen } = useMenuState()
	return (
		<header
			className={clsx('py-3 transition-colors duration-500 animate-opacity-1', {
				'bg-[rgba(255,255,255,.5)]': !isOpen,
				'bg-white': isOpen
			})}
		>
			{children}
		</header>
	)
}
