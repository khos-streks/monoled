import type { Product, ProductInfo, ProductItem } from '@prisma/client'

export interface ProductWithItems extends Product {
	items: ProductItem[]
	info: ProductInfo[]
}

export interface ProductWithInfo extends Product {
	info: ProductInfo[]
}
