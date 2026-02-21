import { MenuIcon } from 'lucide-react'
import { Menu } from '../layout/menu/menu'
import { Sheet } from '../ui/sheet-menu'

export function MenuButton() {
	return (
		<Sheet
			side='left'
			trigger={
				<button title='Відкрити меню'>
					<MenuIcon
						size={40}
						strokeWidth={1.5}
					/>
				</button>
			}
		>
			<Menu />
		</Sheet>
	)
}
