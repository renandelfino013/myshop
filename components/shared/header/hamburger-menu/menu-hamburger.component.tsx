import { useMyUser } from 'hooks/users/users.hooks'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function HamburgerMenu() {
  const [open, setOpen] = useState(false)

  function openMenu() {
    setOpen(true)
  }

  function closeMenu() {
    setOpen(false)
  }
  const { data: user } = useMyUser()
  const admin = user?.role === 'ADMIN' ? true : undefined
  return (
    <>
      <button
        onClick={openMenu}
        aria-label="Abrir menu"
        aria-expanded={open}
        className="flex items-center"
      >
        <Image
          src="/assets/menu/hamburger-menu-white.png"
          alt=""
          width={20}
          height={20}
        />
      </button>

      {open && (
        <div onClick={closeMenu} className="fixed inset-0 z-40 bg-black/50" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 text-black transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>
        <button
          onClick={closeMenu}
          aria-label="Fechar menu"
          className="mb-4 flex items-center"
        >
          X
        </button>
        <nav className="mt-4 flex flex-col gap-2">
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/categorias" onClick={closeMenu}>
            Categorias
          </Link>
          {admin && (
            <Link href="/products" onClick={closeMenu}>
              Gerenciar Produtos
            </Link>
          )}
          {admin && (
            <Link href="/pedidos" onClick={closeMenu}>
              Gerenciar Pedidos
            </Link>
          )}
          {admin && (
            <Link href="/usuarios" onClick={closeMenu}>
              Gerenciar Usuários
            </Link>
          )}
        </nav>
      </aside>
    </>
  )
}
