'use client'

import { Dialog } from '@/components/ui/dialog'
import { useDeleteSlide } from '@/hooks/useSlides'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
	id: number
}

export function AdminDeleteSlide({ id }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const queryClient = useQueryClient()
	const { mutateAsync: deleteFunc, isPending, isSuccess, isError } = useDeleteSlide()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває видалення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			queryClient.invalidateQueries({ queryKey: ['slides get'] })
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
			<div className='flex items-start gap-4 flex-col'>
				<span className='text-lg'>Ви впевнені, що хочете видалити цей слайд?</span>
				<div className='flex items-center gap-4 ml-auto'>
					<button
						onClick={() => deleteFunc(id)}
						className='bg-foreground text-background rounded-md px-6 py-2'
					>
						Так
					</button>
				</div>
			</div>
		</Dialog>
	)
}
