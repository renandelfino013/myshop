import type { Category } from 'shared/types/api/Category/Category.type'
import type { ApiResult } from 'shared/types/api/response/ApiResponse.type'
import { handleApiResponse } from 'utils/errors/front/handleApiResponse'

export async function getCategorys(): Promise<ApiResult<Category[]>> {
  const res = await fetch('/api/v1/categorias', {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Error on list category')
  return res.json()
}
export async function PostCategory(name: string): Promise<ApiResult<void>> {
  const res = await fetch('/api/v1/categorias', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: name }),
  })

  return handleApiResponse(res)
}
