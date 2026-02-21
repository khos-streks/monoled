import type { ProductInfo } from '@prisma/client'
import { useState } from 'react'

interface InfoField {
	title: string
	value: string
	order: number
}

export const useInfoFields = (initialInfo: ProductInfo[] = []) => {
	const [info, setInfo] = useState<InfoField[]>(
		initialInfo.map(item => ({
			title: item.title,
			value: item.value,
			order: item.order
		}))
	)

	const addInfoField = (key: string, value: string) => {
		if (key.trim() && value.trim()) {
			setInfo(prev => [...prev, { title: key, value: value, order: prev.length + 1 }])
		}
	}

	const moveUp = (index: number) => {
		setInfo(prev => {
			const newInfo = [...prev]
			if (index > 0) {
				const temp = newInfo[index]
				newInfo[index] = newInfo[index - 1]
				newInfo[index - 1] = temp

				newInfo.forEach((item, idx) => {
					item.order = idx + 1
				})
			}
			return newInfo
		})
	}

	const moveDown = (index: number) => {
		setInfo(prev => {
			const newInfo = [...prev]
			if (index < prev.length - 1) {
				const temp = newInfo[index]
				newInfo[index] = newInfo[index + 1]
				newInfo[index + 1] = temp

				newInfo.forEach((item, idx) => {
					item.order = idx + 1
				})
			}
			return newInfo
		})
	}

	const deleteInfoField = (index: number) => {
		setInfo(prev => {
			const newInfo = prev.filter((_, i) => i !== index)

			newInfo.forEach((item, idx) => {
				item.order = idx + 1
			})

			return newInfo
		})
	}

	return {
		info,
		addInfoField,
		moveUp,
		moveDown,
		deleteInfoField
	}
}
