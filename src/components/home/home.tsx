import { Slide } from '@prisma/client'
import * as motion from 'framer-motion/client'
import { Carousel } from './carousel'

interface Props {
	slides: Slide[] | undefined
}

export function Home({ slides }: Props) {
	const mobileSlides = slides?.filter(slide => slide.device === 'MOBILE')
	const desktopSlides = slides?.filter(slide => slide.device === 'DESKTOP')
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { duration: 1 } }}
			className='h-vh absolute inset-0 top-0 left-0 w-full h-full -z-10'
		>
			<Carousel
				className='sm:!hidden'
				slides={mobileSlides}
			/>
			<Carousel
				className='max-sm:!hidden'
				slides={desktopSlides}
			/>
		</motion.div>
	)
}
