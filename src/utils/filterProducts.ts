import { ISortingMethod } from '@/app/shop/shop.types'
import { ProductWithItems } from '@/typing/interfaces'
import { Category } from '@prisma/client'

interface Filters {
	category: Category['slug']
	searchQuery: string | null
	sortingMethodId: ISortingMethod['id']
	page: number
	limit: number
}

export const filterProducts = (
	products: ProductWithItems[] | undefined,
	{ category, sortingMethodId, searchQuery, page = 1, limit = 25 }: Filters
): { filteredProducts: ProductWithItems[] | undefined; totalPages: number } => {
	const filteredProducts = products
		?.filter(product => product.items.length > 0)
		?.filter(product => (category.length ? product.categorySlug === category : product))
		.filter(product =>
			product.name.toLowerCase().includes(searchQuery ? searchQuery.toLowerCase() : '')
		)

	let sortedProducts = filteredProducts
	switch (sortingMethodId) {
		case 1:
			sortedProducts = filteredProducts?.sort((a, b) => a.order - b.order)
			break
		case 2:
			sortedProducts = filteredProducts?.sort(
				(a, b) => (a.items[0]?.price || 0) - (b.items[0]?.price || 0)
			)
			break
		case 3:
			sortedProducts = filteredProducts?.sort(
				(a, b) => (b.items[0]?.price || 0) - (a.items[0]?.price || 0)
			)
			break
	}

	const limitSafe = limit > 0 ? limit : 1
	const slicedFilteredProducts = sortedProducts?.slice((page - 1) * limitSafe, page * limitSafe)

	const totalPages = filteredProducts?.length ? Math.ceil(filteredProducts.length / limitSafe) : 1

	return { filteredProducts: slicedFilteredProducts, totalPages }
}
