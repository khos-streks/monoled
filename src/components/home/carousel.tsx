'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'
import { SwiperOptions } from 'swiper/types'
import { Mousewheel, Keyboard } from 'swiper/modules'
import { Slide } from '@prisma/client'
import clsx from 'clsx'

interface Props {
	slides: Slide[] | undefined
	className?: string
}

export function Carousel({ slides, className }: Props) {
	const swiperSettings: SwiperOptions = {
		spaceBetween: 0,
		slidesPerView: 1,
		resistanceRatio: 0,
		modules: [Mousewheel, Keyboard],
		direction: 'vertical',
		speed: 500,
		followFinger: false,
		mousewheel: true,
		keyboard: true
	}

	return (
		<Swiper
			className={clsx('overflow-hidden h-full', className)}
			{...swiperSettings}
		>
			{slides &&
				slides.map((slide, index) => (
					<SwiperSlide
						key={index}
						className='w-full h-full pt-20 pb-10 text-center relative'
					>
						<div className='absolute w-full h-full inset-0 top-0 left-0 -z-10'>
							<div className='relative w-full h-full inset-0 top-0 left-0'>
								<Image
									src={slide.background}
									alt={slide.text}
									fill
									sizes='100%, 100%'
									priority={index === 0}
									loading={index === 0 ? 'eager' : 'lazy'}
									className='object-cover object-[35%_40%]'
								/>
							</div>
						</div>

						<div className='w-full h-full px-8 max-sm:px-2 flex flex-col items-start text-start justify-end max-sm:text-center max-sm:items-center gap-7'>
							<h2 className='font-medium text-5xl max-xl:text-4xl max-sm:text-2xl max-md:w-full'>
								{slide.text}
							</h2>
							<button className='bg-white rounded-md text-black font-medium border-2 border-transparent hover:border-black transition-colors duration-300 border-black max-sm:mx-auto'>
								<Link
									href={slide.url}
									className='w-full h-full block px-20 py-3 max-sm:px-14'
								>
									Детальніше
								</Link>
							</button>
						</div>
					</SwiperSlide>
				))}
		</Swiper>
	)
}
