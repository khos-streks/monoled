import cn from 'clsx'
import Logo from '@/components/layout/logo'
import { textsService } from '@/services/texts.service'

interface Props {
	className?: string
}

export async function Footer({ className }: Props) {
	const texts = await textsService.getAllTexts()
	const copyrightText = texts?.find(text => text.slug === 'copyright')?.text
	return (
		<footer
			className={cn(
				className,
				'bg-foreground text-background px-8 py-5 max-sm:px-4 w-ful h-full flex flex-col items-center text-center gap-4 animate-opacity-1'
			)}
		>
			<Logo color='#fff' />
			<span className='text-neutral-400'>{copyrightText}</span>
		</footer>
	)
}
