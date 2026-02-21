import { Header } from '@/components/layout/header/header'
import Layout from '@/components/layout/layout'
import { TextProvider } from '@/context/textContext'
import { textsService } from '@/services/texts.service'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.scss'
import { Footer } from '@/components/layout/footer'
import HiddenOnMain from '@/components/util/hidden-on-main'

export const revalidate = 120

const fixel = localFont({
	src: [
		{ path: '../fonts/FixelText-Thin.woff2', weight: '100', style: 'normal' },
		{ path: '../fonts/FixelText-ExtraLight.woff2', weight: '200', style: 'normal' },
		{ path: '../fonts/FixelText-Light.woff2', weight: '300', style: 'normal' },
		{ path: '../fonts/FixelText-Regular.woff2', weight: '400', style: 'normal' },
		{ path: '../fonts/FixelText-Medium.woff2', weight: '500', style: 'normal' },
		{ path: '../fonts/FixelText-SemiBold.woff2', weight: '600', style: 'normal' },
		{ path: '../fonts/FixelText-Bold.woff2', weight: '700', style: 'normal' },
		{ path: '../fonts/FixelText-ExtraBold.woff2', weight: '800', style: 'normal' },
		{ path: '../fonts/FixelText-Black.woff2', weight: '900', style: 'normal' }
	],
	display: 'swap'
})

export const metadata: Metadata = {
	title: 'Lumineka',
	description:
		'У Lumineka ми створюємо світло, яке формує простір і атмосферу. Поєднуючи технології, дизайн і бездоганну якість, ми розробляємо освітлення, що доповнює архітектуру та підкреслює деталі.'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const texts = await textsService.getAllTexts()

	return (
		<html lang='en'>
			<body className={fixel.className}>
				<TextProvider texts={texts}>
					<Layout>
						<Header />
						{children}
						<HiddenOnMain>
							<Footer />
						</HiddenOnMain>
					</Layout>
				</TextProvider>
			</body>
		</html>
	)
}
