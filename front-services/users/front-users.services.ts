import { ApiResult } from 'shared/types/api/response/ApiResponse.type'
import { UserType } from 'shared/types/api/users/users.type'
import { handleApiResponse } from 'utils/errors/front/handleApiResponse'

export async function getMe(): Promise<ApiResult<UserType> | null> {
  const res = await fetch('/api/v1/users/me', {
    credentials: 'include',
  })
  if (res.status === 401) return null
  return handleApiResponse(res)
}

export async function logoutMe(): Promise<ApiResult<null> | null> {
  const res = await fetch('/api/v1/users/me/logout', {
    method: 'POST',
  })
  if (res.status === 401) return null
  handleApiResponse(res)
}
