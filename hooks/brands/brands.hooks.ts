import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getBrands,
  PostBrand,
} from 'front-services/brands/front-brands.services'

export function ListAllBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    refetchInterval: 0,
    retry: 0,
  })
}
export function NewBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['brands'],
    mutationFn: (name: string) => PostBrand(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] }),
  })
}
