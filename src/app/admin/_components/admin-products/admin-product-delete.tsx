'use client'

import { Dialog } from '@/components/ui/dialog'
import { useDeleteProduct } from '@/hooks/useProducts'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
	productName: string
	productId: number
}

export function AdminProductDelete({ productName, productId }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const queryClient = useQueryClient()
	const { mutateAsync: deleteFunc, isPending, isSuccess, isError } = useDeleteProduct()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває видалення...')
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
		<Dialog
			title='Видалити'
			trigger={
				<button>
					<Trash2Icon />
				</button>
			}
		>
			<div className='mx-auto bg-white rounded-md p-4 w-[400px] h-min flex flex-col gap-4 max-sm:w-[90%]'>
				<div className='flex items-start gap-4 flex-col'>
					<span className='text-lg'>Ви впевнені, що хочете видалити {productName}?</span>
					<div className='flex items-center gap-4 ml-auto'>
						<button
							onClick={() => deleteFunc({ id: productId })}
							className='bg-foreground text-background rounded-md px-6 py-2'
						>
							Так
						</button>
					</div>
				</div>
			</div>
		</Dialog>
	)
}
