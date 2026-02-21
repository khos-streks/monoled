'use client'

import { ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

type InfoItem = {
	title: string
	value: string
	order: number
}

interface Props {
	info: InfoItem[]
	moveUp: (index: number) => void
	moveDown: (index: number) => void
	deleteInfoField: (index: number) => void
	addInfoField: (key: string, value: string) => void
}

export function InfoFields({ info, addInfoField, deleteInfoField, moveDown, moveUp }: Props) {
	const [key, setKey] = useState('')
	const [value, setValueInput] = useState('')
	return (
		<div className='space-y-4'>
			<div className='flex flex-col gap-2'>
				<h4 className='text-lg font-medium'>Додаткова інформація:</h4>
				{info && info.length > 0 ? (
					<ul className='flex flex-col gap-2'>
						{info
							.sort((a, b) => a.order - b.order)
							?.map((info, index) => (
								<li
									className='border rounded-md py-2 px-4 flex justify-between items-center gap-2 bg-white'
									key={index}
								>
									<div className='flex-1 truncate'>
										<span className='font-medium'>{info.title}:</span> {info.value}
									</div>
									<div className='flex items-center gap-2'>
										<button
											type='button'
											onClick={() => moveUp(index)}
											className='p-1 hover:bg-gray-100 rounded'
										>
											<ChevronUpIcon className='h-4 w-4' />
										</button>
										<button
											type='button'
											onClick={() => moveDown(index)}
											className='p-1 hover:bg-gray-100 rounded'
										>
											<ChevronDownIcon className='h-4 w-4' />
										</button>
										<button
											type='button'
											onClick={() => deleteInfoField(index)}
											className='p-1 hover:bg-red-100 text-red-500 rounded'
										>
											<XIcon className='h-4 w-4' />
										</button>
									</div>
								</li>
							))}
					</ul>
				) : (
					<p className='text-sm text-gray-500'>
						Немає додаткової інформації. Тут повинна бути лише незмінна інформація
					</p>
				)}
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-2 items-end'>
				<div>
					<label
						htmlFor='info-key'
						className='block text-sm font-medium mb-1'
					>
						Ключ
					</label>
					<input
						id='info-key'
						type='text'
						placeholder='Наприклад: Потужність'
						value={key}
						onChange={e => setKey(e.target.value)}
						className='w-full rounded-md border border-gray-300 bg-white h-10 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
					/>
				</div>
				<div>
					<label
						htmlFor='info-value'
						className='block text-sm font-medium mb-1'
					>
						Значення
					</label>
					<input
						id='info-value'
						type='text'
						placeholder='Наприклад: 5 Вт'
						value={value}
						onChange={e => setValueInput(e.target.value)}
						className='w-full rounded-md border border-gray-300 bg-white h-10 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
					/>
				</div>
				<button
					type='button'
					onClick={() => {
						if (key.trim() && value.trim()) {
							addInfoField(key, value)
							setKey('')
							setValueInput('')
						}
					}}
					className=' rounded-md px-4 py-2 h-10 bg-foreground text-background transition-colors'
					disabled={!key.trim() || !value.trim()}
				>
					Додати
				</button>
			</div>
		</div>
	)
}
