import { SearchIcon } from 'lucide-react'
import { Popup } from '../ui/popup'
import { textsService } from '@/services/texts.service'

export async function SearchButton() {
	const texts = await textsService.getAllTexts()
	const searchPlaceholder = texts?.find(text => text.slug === 'search-placeholder')?.text

	return (
		<Popup
			title='Пошук'
			trigger={
				<button>
					<SearchIcon
						size={30}
						strokeWidth={1.5}
					/>
				</button>
			}
		>
			<search className='mx-auto w-[750px] h-[80px] max-sm:h-16 max-lg:w-full'>
				<form action='/shop' className='relative w-full h-full'>
					<input
						className='w-full pl-16 border border-gray-300 h-full rounded-full'
						type='search'
						placeholder={searchPlaceholder}
						name='search'
					/>
					<button type='submit' className='absolute top-1/2 -translate-y-1/2 left-6'>
						<SearchIcon />
					</button>
				</form>
			</search>
		</Popup>
	)
}
