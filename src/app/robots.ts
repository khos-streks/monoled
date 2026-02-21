import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/', '/product/*', '/shop', '/about', '/contact-us'],
				disallow: ['/api/*', '/admin', '/admin-login']
			}
		],
		sitemap: 'https://lumineka.com.ua/sitemap.xml'
	}
}
