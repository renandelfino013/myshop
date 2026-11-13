import { useQuery, useMutation } from '@tanstack/react-query'
import { getproducts } from 'front-services/products/front-products.services'
import {
  Product,
  ApiResponse,
} from 'front-services/products/front-products.services'
export function ListAllproducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getproducts,
    refetchInterval: 0,
    retry: 0,
  })
}
export function AddhookProduct() {
  return useMutation<ApiResponse<Product>, Error, Product>({
    mutationKey: ['products'],
    //function that's call APi
  })
}
