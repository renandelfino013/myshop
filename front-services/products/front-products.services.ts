import type { Product } from 'shared/types/api/Products/Products.type'
import type { ApiResponse } from 'shared/types/api/response/ApiResponse.type'

export async function getproducts(): Promise<ApiResponse<Product[]>> {
  const res = await fetch('/api/v1/produtos', {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Error on list products')
  return res.json()
}
