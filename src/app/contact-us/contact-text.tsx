'use client'

import dynamic from 'next/dynamic'

function ContactTextComponent({ text }: { text: string | undefined }) {
	return (
		<div
			className='mb-10 text-center mx-auto w-[90%] text-xl'
			dangerouslySetInnerHTML={{ __html: text || '' }}
		/>
	)
}

export const ContactText = dynamic(() => Promise.resolve(ContactTextComponent), { ssr: false })
