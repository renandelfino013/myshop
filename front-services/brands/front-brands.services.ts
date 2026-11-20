import type { Brand } from 'shared/types/api/brand/Brand.type'
import type { ApiResult } from 'shared/types/api/response/ApiResponse.type'
import { handleApiResponse } from 'utils/errors/front/handleApiResponse'

export async function getBrands(): Promise<ApiResult<Brand[]>> {
  const res = await fetch('/api/v1/marcas', {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Error on list brands')
  return res.json()
}
export async function PostBrand(name: string): Promise<ApiResult<void>> {
  const res = await fetch('/api/v1/marcas', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: name }),
  })

  return handleApiResponse(res)
}
