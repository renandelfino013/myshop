import { z } from 'zod'

export const idschema = (message = 'Invalid id format') => {
  return z.coerce.number().pipe(z.number().int().positive(message))
}
