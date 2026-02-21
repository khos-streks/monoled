'use client'

import { useMoveUpProduct } from '@/hooks/useProducts'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
	productId: number
}

export function AdminProductMoveUp({ productId }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const queryClient = useQueryClient()
	const { mutateAsync: moveUp, isPending, isSuccess, isError } = useMoveUpProduct()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Зачекайте...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			queryClient.invalidateQueries({ queryKey: ['products get'] })
		}

		if (isError) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	return (
		<button onClick={() => moveUp(productId)}>
			<ChevronUpIcon />
		</button>
	)
}
