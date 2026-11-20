import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCategorys,
  PostCategory,
} from 'front-services/categorys/front-category.services'

export function ListAllCategorys() {
  return useQuery({
    queryKey: ['categorys'],
    queryFn: getCategorys,
    refetchInterval: 0,
    retry: 0,
  })
}
export function NewCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['categorys'],
    mutationFn: (name: string) => PostCategory(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorys'] }),
  })
}
