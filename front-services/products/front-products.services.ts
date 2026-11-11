export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
export interface Brand {
  id: number
  nome: string
}
export interface Category {
  id: number
  nome: string
}
export interface Product {
  id: number
  nome: string
  preco: number
  estoque: number
  image: string
  marca: Brand
  descricao: string
  categoria: Category
}
export async function getproducts(): Promise<ApiResponse<Product[]>> {
  const res = await fetch('/api/v1/produtos', {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Error on list products')
  return res.json()
}
