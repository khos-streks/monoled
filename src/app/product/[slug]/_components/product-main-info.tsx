import { ProductWithItems } from '@/typing/interfaces'
import { stringifyWithoutQuotes } from '@/utils/stringifyWithoutQuotes'
import { ProductInfo, ProductItem, TextField } from '@prisma/client'
import clsx from 'clsx'
import { DownloadIcon } from 'lucide-react'
import Link from 'next/link'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
	product: ProductWithItems
	texts: TextField[] | undefined
	selectedItem: ProductItem
	setSelectedItem: Dispatch<SetStateAction<ProductItem>>
}

export function ProductMainInfo({ product, texts, setSelectedItem, selectedItem }: Props) {
	const [productInfo] = useState<ProductInfo[]>(product.info || [])
	const [itemProperties, setItemProperties] = useState<{
		[key: string]: string[]
	}>({})
	const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({})

	// Property mapping constants
	const propertyMappings = {
		Колір: 'color',
		'Кольорова температура': 'colorTemperature',
		Дімування: 'dimmable',
		'Кут розсіювання': 'scatteringAngle'
	}

	// Get available values for a specific property based on currently selected values
	const getAvailableValuesForProperty = (propertyTitle: string) => {
		const propertyKey = propertyMappings[propertyTitle as keyof typeof propertyMappings]

		// Filter items that match current selection for other properties
		const matchingItems = product.items.filter(item => {
			return Object.entries(selectedVariants).every(([title, value]) => {
				// Skip the property we're finding values for
				if (title === propertyTitle) return true

				// Check if this item matches the selected value for other properties
				if (title === 'Колір') return !value || String(item.color) === value
				if (title === 'Температура кольору')
					return !value || String(item.colorTemperature) === value
				if (title === 'Дімування') return !value || String(item.dimmable) === value
				if (title === 'Кут розсіювання') return !value || String(item.scatteringAngle) === value
				return true
			})
		})

		// Extract unique values for this property from matching items
		const values = new Set<string>()
		matchingItems.forEach(item => {
			const value = item[propertyKey as keyof ProductItem]
			if (value) {
				values.add(String(value))
			}
		})

		return Array.from(values)
	}

	// Check if a specific value is available for selection based on current selections
	const isValueAvailable = (propertyTitle: string, value: string) => {
		const availableValues = getAvailableValuesForProperty(propertyTitle)
		return availableValues.includes(value)
	}

	// Get all possible values for a property regardless of current selections
	const getAllValuesForProperty = (propertyTitle: string) => {
		const propertyKey = propertyMappings[propertyTitle as keyof typeof propertyMappings]
		const values = new Set<string>()

		product.items.forEach(item => {
			const value = item[propertyKey as keyof ProductItem]
			if (value) {
				values.add(String(value))
			}
		})

		return Array.from(values)
	}

	useEffect(() => {
		// Extract all unique properties from product items
		const properties: { [key: string]: Set<string> } = {}

		// Extract unique values for each property
		Object.entries(propertyMappings).forEach(([title, key]) => {
			// Check if this property exists on at least one item
			if (product.items.some(item => item[key as keyof ProductItem])) {
				const values = new Set<string>()

				product.items.forEach(item => {
					const value = item[key as keyof ProductItem]
					if (value) {
						values.add(String(value))
					}
				})

				// Only add properties that have at least 1 value
				if (values.size > 0) {
					properties[title] = values
				}
			}
		})

		// Convert Sets to arrays
		const propertiesAsArrays: { [key: string]: string[] } = {}
		Object.entries(properties).forEach(([key, valueSet]) => {
			propertiesAsArrays[key] = Array.from(valueSet)
		})

		setItemProperties(propertiesAsArrays)

		// Initialize selected variants with values from the first item
		const initialVariants: { [key: string]: string } = {}

		if (product.items.length > 0) {
			Object.entries(propertyMappings).forEach(([title, key]) => {
				const value = product.items[0][key as keyof ProductItem]
				if (value) {
					initialVariants[title] = String(value)
				}
			})
		}

		setSelectedVariants(initialVariants)
	}, [product])

	const handleVariantChange = (title: string, value: string) => {
		// When one value changes, we need to update the selection
		// and potentially reset incompatible selections
		const newVariants = { ...selectedVariants, [title]: value }

		// Check if the combination is valid by finding at least one matching item
		let isValidCombination = false
		let matchingItems: ProductItem[] = []

		for (const item of product.items) {
			let itemMatches = true

			for (const [propTitle, propValue] of Object.entries(newVariants)) {
				if (!propValue) continue

				const propKey = propertyMappings[propTitle as keyof typeof propertyMappings]
				const itemValue = item[propKey as keyof ProductItem]

				if (!itemValue || String(itemValue) !== propValue) {
					itemMatches = false
					break
				}
			}

			if (itemMatches) {
				isValidCombination = true
				matchingItems.push(item)
			}
		}

		if (isValidCombination) {
			// The combination is valid, update variants and selected item
			setSelectedVariants(newVariants)
			if (matchingItems.length > 0) {
				setSelectedItem(matchingItems[0])
			}
		} else {
			// The combination is not valid, find a valid combination
			// that respects the selected value for the changed property

			// First, get all items that match the changed property
			const validItems = product.items.filter(item => {
				const propKey = propertyMappings[title as keyof typeof propertyMappings]
				const itemValue = item[propKey as keyof ProductItem]
				return itemValue && String(itemValue) === value
			})

			if (validItems.length > 0) {
				// Use the first valid item to set all properties
				const validItem = validItems[0]
				const completeVariants: { [key: string]: string } = {}

				Object.entries(propertyMappings).forEach(([propTitle, propKey]) => {
					const propValue = validItem[propKey as keyof ProductItem]
					if (propValue) {
						completeVariants[propTitle] = String(propValue)
					}
				})

				setSelectedVariants(completeVariants)
				setSelectedItem(validItem)
			}
		}
	}

	const productCharacteristicsTitle = texts?.find(
		text => text.slug === 'product-characteristics-title'
	)?.text
	const productCharacteristicsEmpty = texts?.find(
		text => text.slug === 'product-characteristics-empty'
	)?.text
	const basePriceText = texts?.find(text => text.slug === 'base-price')?.text
	const howToOrder = texts?.find(text => text.slug === 'how-to-order')?.text
	const downloadModel = texts?.find(text => text.slug === 'download-product-model')?.text
	const productInStock = texts?.find(text => text.slug === 'product-in-stock')?.text
	const productOutOfStock = texts?.find(text => text.slug === 'product-out-of-stock')?.text
	const productOptionsText =
		texts?.find(text => text.slug === 'product-options')?.text || 'Варіанти'
	const selectVariantText =
		texts?.find(text => text.slug === 'select-variant')?.text || 'Виберіть варіант'

	return (
		<div className='mx-auto w-full animate-opacity-1'>
			{Object.keys(itemProperties).map(key => {
				if (key === 'Колір') {
					return (
						<div
							className='flex flex-wrap gap-3 mb-5'
							key={key}
						>
							{getAllValuesForProperty(key).map((value, i) => (
								<button
									key={i}
									type='button'
									onClick={() => handleVariantChange(key, value)}
									className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
										selectedVariants[key] === value
											? 'ring-2 ring-offset-2 ring-foreground'
											: 'ring-1 ring-gray-300'
									}`}
									style={{ backgroundColor: value }}
								/>
							))}
						</div>
					)
				}
				return null
			})}

			{/* Static product information */}
			<div className='mb-8'>
				<div className='text-3xl mb-6 w-full flex items-center'>
					<h3>{productCharacteristicsTitle}</h3>
				</div>
				<div className='grid-cols-2 grid gap-x-8 gap-y-3 max-sm:grid-cols-1'>
					{productInfo.length > 0 &&
						productInfo
							.sort((a, b) => a.order - b.order)
							.map((field, index) => (
								<div
									className='w-full py-2 flex flex-col items-start gap-2 border-b-[1px] border-black'
									key={`static-${index}`}
								>
									<span className='text-neutral-500'>{field.title}:</span>{' '}
									<span className='text-lg'>{stringifyWithoutQuotes(field.value)}</span>
								</div>
							))}

					{/* Show message if no characteristics */}
					{productInfo.length === 0 && Object.keys(itemProperties).length === 0 && (
						<>{productCharacteristicsEmpty}</>
					)}
				</div>
			</div>

			{/* Configurable options as buttons */}
			{Object.keys(itemProperties).length > 0 && (
				<div className='mb-10'>
					<div className='text-2xl mb-4 w-full'>
						<h4>{productOptionsText}</h4>
					</div>
					<div className='w-full grid grid-cols-2 max-sm:grid-cols-1 gap-5'>
						{Object.entries(itemProperties).map(([title, _]) => {
							if (title === 'Колір') return null // Skip color as it's shown above

							return (
								<div
									key={`variant-options-${title}`}
									className='w-full'
								>
									<h5 className='text-lg mb-2'>{title}:</h5>
									<div className='flex flex-wrap gap-3'>
										{getAllValuesForProperty(title).map((value, i) => {
											const isAvailable = isValueAvailable(title, value)
											return (
												<button
													key={i}
													type='button'
													onClick={() => {
														isAvailable && handleVariantChange(title, value)
													}}
													className={`py-2 px-4 border rounded ${
														selectedVariants[title] === value
															? 'bg-[#000000ca] text-background'
															: isAvailable
															? 'bg-background text-foreground hover:bg-gray-50'
															: 'bg-gray-100 text-gray-400 cursor-not-allowed'
													}`}
													disabled={!isAvailable}
													title={!isAvailable ? 'Недоступно з поточними параметрами' : ''}
												>
													{stringifyWithoutQuotes(value)}
												</button>
											)
										})}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)}

			{/* Price and actions */}
			<div className='w-full flex flex-col gap-1'>
				<div
					className={clsx('max-lg:text-center max-lg:w-full text-lg', {
						'text-green-700': selectedItem.quantityLeft > 0,
						'text-red-700': selectedItem.quantityLeft <= 0
					})}
				>
					{selectedItem.quantityLeft > 0
						? `${productInStock} ${selectedItem.quantityLeft} шт.`
						: `${productOutOfStock}`}
				</div>
				<div className='flex items-end gap-3 max-lg:justify-center max-[500px]:flex-col max-[500px]:items-center'>
					<h3 className='text-2xl'>{basePriceText}:</h3>
					<span className='inline-flex items-end gap-2'>
						<span className='text-2xl font-semibold tracking-wide'>{selectedItem.price} грн </span>
					</span>
				</div>
				<div className='flex items-center gap-8 h-14 mt-8 max-xl:flex-col max-xl:h-auto max-lg:flex-row max-lg:justify-center max-[500px]:flex-col'>
					<button className='h-full max-sm:w-full max-sm:items-center max-sm:flex max-sm:justify-center max-xl:h-16 border-[1px] border-foreground bg-background text-foreground rounded-md hover:text-background hover:bg-foreground transition-colors duration-300'>
						<Link
							className='flex items-center px-6 h-full'
							href='/contact-us'
						>
							{howToOrder}
						</Link>
					</button>
					<button className='h-full max-sm:w-full max-sm:items-center max-sm:flex max-sm:justify-center max-xl:h-16 border-[1px] border-foreground bg-background text-foreground rounded-md hover:text-background hover:bg-foreground transition-colors duration-300'>
						<a
							className='flex items-center px-6 h-full gap-3'
							href={product.modelUrl ?? '#'}
							download
						>
							<DownloadIcon />
							{downloadModel}
						</a>
					</button>
				</div>
			</div>
		</div>
	)
}
