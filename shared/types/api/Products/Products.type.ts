import type { Brand } from 'shared/types/api/brand/Brand.type'
import type { Category } from 'shared/types/api/Category/Category.type'

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
