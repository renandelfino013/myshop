import { z } from 'zod'

export const priceschema = z.coerce
  .string()
  .regex(
    /^\d+(\.\d{1,2})?$/,
    'The price format is invalid. A maximum of 2 decimal places is allowed.'
  )
  .transform((val) => Number(val))
  .pipe(z.number().min(1, 'Price must be at least 1'))

export const stockschema = z.coerce.number().int().min(1)
export const descschema = z.string().trim().min(1).max(1000)
