import Image from 'next/image'
import { useState } from 'react'
import { UserOpen } from './user-open.component'
import Link from 'next/link'
import { useMyUser } from 'hooks/users/users.hooks'
const defaultImage = '/assets/user/user-icon-white.png'
export function Usericon() {
  const [open, setOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { data: user, isPending } = useMyUser()
  console.log(user, isPending, user?.image)
  const foundUser = !!user
  function openMenu() {
    setOpen(true)
  }
  function Action(url) {
    if (!foundUser) {
      return (
        <Link href="/">
          <Image
            src={`${url}`}
            onClick={openMenu}
            alt="Logo"
            className="min-w-8 h-auto border-zinc-400 border-1 rounded-full shadow "
            style={{ cursor: 'pointer' }}
            width={20}
            height={20}
          />
        </Link>
      )
    }
    return (
      <>
        <Image
          src={`${url}`}
          onClick={openMenu}
          alt="user"
          className="max-w-8 h-auto border-zinc-400 border-1 rounded-full shadow "
          style={{ cursor: 'pointer' }}
          width={100}
          height={100}
          quality={90}
        />
      </>
    )
  }
  function closeMenu() {
    setOpen(false)
  }
  const url = user?.image || defaultImage
  return (
    <>
      {url && Action(url)}

      {open && (
        <div onClick={closeMenu} className="fixed inset-0 z-40 bg-black/50 " />
      )}
      {open && foundUser && <UserOpen url={url} />}
    </>
  )
}
