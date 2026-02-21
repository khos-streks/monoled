import Logo from '@/components/layout/logo'
import { MenuButton } from '../../buttons/MenuButton'
import { SearchButton } from '../../buttons/SearchButton'
import { HeaderWrapper } from './header-wrapper'

export async function Header() {
	return (
		<HeaderWrapper>
			<div className='px-8 max-sm:px-2 flex items-center justify-between'>
				<div className='flex items-center gap-12'>
					<MenuButton />
					<Logo />
				</div>
				<SearchButton />
			</div>
		</HeaderWrapper>
	)
}
