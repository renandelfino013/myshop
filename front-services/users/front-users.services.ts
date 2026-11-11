export type UserType = {
  id: number
  nome: string
  email: string
  role: string
  image: string
  created_at: string
}
export type LogoutType = {
  success: boolean
  message: string
  data: Array<null>
}
export async function getMe(): Promise<UserType | null> {
  const res = await fetch('http://localhost:3000/api/v1/users/me', {
    credentials: 'include',
  })
  if (res.status === 401) return null
  if (!res.ok) throw new Error('Erro ao buscar usuário')
  const { data } = await res.json()
  return data[0] ?? null
}

export async function logoutMe(): Promise<LogoutType | null> {
  const res = await fetch('/api/v1/users/me/logout', {
    method: 'POST',
  })
  if (res.status === 401) return null
  if (!res.ok) throw new Error('Erro ao sair')
  const body = await res.json()
  return body ?? null
}
