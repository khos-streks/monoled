'use client'

import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'

export default function HiddenOnMain({ children }: PropsWithChildren<unknown>) {
	const pathname = usePathname()
	return pathname !== '/' && <div>{children}</div>
}
