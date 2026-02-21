import { productsService } from '@/services/products.service'
import { ProductWithInfo } from '@/typing/interfaces'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products: ProductWithInfo[] | undefined = (await productsService.getAllProducts())?.data

	return [
		{
			url: 'https://lumineka.com.ua/',
			lastModified: new Date(),
			priority: 1.0
		},
		{
			url: 'https://lumineka.com.ua/shop',
			lastModified: new Date(),
			priority: 0.8
		},
		{
			url: 'https://lumineka.com.ua/about',
			lastModified: new Date(),
			priority: 0.7
		},
		{
			url: 'https://lumineka.com.ua/contact-us',
			lastModified: new Date(),
			priority: 0.7
		},
		...(products?.map(product => ({
			url: `https://lumineka.com.ua/product/${product.slug}`,
			lastModified: new Date(),
			priority: 0.8
		})) || [])
	]
}
