import { useMyUser, useLogoutMyUser } from 'hooks/users/users.hooks'
import Image from 'next/image'

export function UserOpen({
  url = '/assets/user/user-icon-white.png',
}: {
  url?: string
}) {
  const logout = useLogoutMyUser()
  const { data: user } = useMyUser()

  if (!user?.success) return null

  const data = user.data[0]

  if (!data) return null

  return (
    <aside className="w-60 h-fit fixed -inset-y-1 right-0 border-black border-1 rounded-bl-lg top-16 bg-white z-60 text-black p-0 flex flex-col gap-1">
      <div className="bg-blue-500 text-white p-1 font-light">Minha Conta</div>

      <div className="bg-transparent w-full flex flex-row gap-1 p-1">
        <div className="min-w-17 rounded-full bg-blue-400">
          <Image
            src={data.image || url}
            alt="user"
            className="w-full h-full object-cover border-zinc-400 border rounded-full shadow-2xl"
            width={40}
            height={40}
            quality={90}
          />
        </div>

        <div className="min-w-0 text-[14px] text-shadow-black align-middle">
          <p className="truncate">{data.nome}</p>

          <p className="break-all text-xs text-zinc-700" title={data.email}>
            {data.email}
          </p>
        </div>
      </div>

      <section className="h-auto w-auto flex flex-col gap-1 p-0">
        <button className="w-full px-4 py-2 text-left hover:bg-zinc-100 active:bg-zinc-100 rounded-bl-lg cursor-pointer">
          Gerenciar minha conta
        </button>

        <button className="w-full px-4 py-2 text-left hover:bg-zinc-100 active:bg-zinc-100 rounded-bl-lg cursor-pointer">
          Meus pedidos
        </button>

        <button
          className="w-full px-4 py-2 text-left hover:bg-zinc-100 active:bg-zinc-100 rounded-bl-lg cursor-pointer"
          onClick={() => logout()}
        >
          Sair
        </button>
      </section>
    </aside>
  )
}
