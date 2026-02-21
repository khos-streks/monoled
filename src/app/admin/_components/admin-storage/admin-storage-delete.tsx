'use client'

import { Dialog } from '@/components/ui/dialog'
import { IFile } from './admin-storage.typing'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useDeleteFile } from '@/hooks/useStorage'

interface Props {
	file: IFile
}

export function DeleteFile({ file }: Props) {
	const [loadingToastId, setLoadingToastId] = useState('')
	const { mutateAsync: deleteFunc, isPending, isSuccess, isError } = useDeleteFile()

	useEffect(() => {
		if (isPending) {
			const loadingToastId = toast.loading('Триває видалення...')
			setLoadingToastId(loadingToastId)
		}
		if (isSuccess) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
			toast.success('Успішно! Файл буде видалений з сховища протягом 5 хвилин', {duration: 3000})
		}
		if (isError) {
			loadingToastId && loadingToastId && toast.dismiss(loadingToastId)
		}
	}, [isPending, isSuccess, isError])

	return (
		<Dialog
			title='Видалити файл'
			trigger={
				<button className='ml-4 text-red-600 hover:text-red-900 disabled:text-red-200 disabled:cursor-not-allowed'>
					Видалити
				</button>
			}
		>
			<div className='flex flex-col items-start gap-6'>
				<p>Ви дійсно хочете видалити файл {file.title}?</p>
				<button
					className='ml-auto rounded-md text-background bg-foreground px-6 py-2'
					onClick={() => deleteFunc(file.title)}
				>
					Так
				</button>
			</div>
		</Dialog>
	)
}
