import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	sassOptions: {
		silenceDeprecations: ['legacy-js-api']
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'storage.lumineka.com.ua',
				pathname: '/**'
			}
		]
	}
}

export default nextConfig
