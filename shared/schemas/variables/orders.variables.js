import { z } from 'zod'
import { idschema } from './common.variables'

export const itemsSchema = z
  .array(
    z.object({
      produto_id: idschema('Invalid produto_id'),
      quantidade: z
        .number()
        .int()
        .positive('quantidade must be a positive integer'),
    }),
    'items is required!'
  )
  .min(1, 'Order must have at least one item')
  .refine(
    (itens) =>
      new Set(itens.map((item) => item.produto_id)).size === itens.length,
    {
      message: 'Duplicate produto_id in the same order',
    }
  )
