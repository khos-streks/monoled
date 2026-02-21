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
		],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 2678400,
		deviceSizes: [640, 750, 1080, 1920],
		imageSizes: [128, 256, 384]
	}
}

export default nextConfig
