import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe, logoutMe } from 'front-services/users/front-users.services'
import { useRouter } from 'next/router'

export function useMyUser() {
  return useQuery({ queryKey: ['myuser'], queryFn: getMe, retry: false })
}
export function useLogoutMyUser() {
  const queryClient = useQueryClient()
  const router = useRouter()

  async function logout() {
    try {
      await logoutMe()
    } catch {
      return
    }

    queryClient.clear()
    queryClient.setQueryData(['myuser'], null)
    router.reload()
  }

  return logout
}
