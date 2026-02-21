'use client'

import { IFile } from './admin-storage.typing'
import toast from 'react-hot-toast'

interface Props {
	file: IFile
}

export function CopyFileUrl({ file }: Props) {
	const handleCopy = () => {
		navigator.clipboard.writeText(process.env.NEXT_PUBLIC_STORAGE_URL + file.url)
		toast.success('Посилання на файл скопійовано!')
	}
	return <button onClick={handleCopy} className='text-green-700 hover:text-green-900'>Скопіювати URL</button>
}
