'use client'

import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster containerClassName='!z-[10000]' />
			<main>{children}</main>
		</QueryClientProvider>
	)
}
