'use client'

import dynamic from 'next/dynamic'

function AboutTextComponent({ text }: { text: string | undefined }) {
	return (
		<div
			className='mt-10 w-full text-center mx-auto font-light text-xl'
			dangerouslySetInnerHTML={{ __html: text || '' }}
		/>
	)
}

export const AboutText = dynamic(() => Promise.resolve(AboutTextComponent), { ssr: false })
