import { Logo } from 'components/shared/header/logo/logo.component'
import { HamburgerMenu } from 'components/shared/header/hamburger-menu/menu-hamburger.component'
import { Usericon } from 'components/shared/header/user-icon/user-icon.component'
import { Cart } from './cart/cart.component'
import { Searchbar } from './search/search.component'
export function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 display flex items-center z-70 gap-3 w-full">
      <HamburgerMenu />

      <Logo />
      <Searchbar />
      <Usericon />
      <Cart />
    </header>
  )
}
