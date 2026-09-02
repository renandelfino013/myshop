import { z } from 'zod'

export const nameproductschema = z
  .string()
  .regex(
    /^[a-zA-Z0-9áéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ\s\-/.%"'&]{5,100}$/u,
    'Product name must be between 5 and 100 characters and contain only letters, numbers, and standard symbols (like -, /, %, &, and '
  )

export const nameuserschema = z
  .string()
  .min(4, 'username they have must 4 lengths a more')
  .max(40, 'username they have max 40 lengths')

export const namecategoryschema = z
  .string()
  .min(2, 'Name must be at least 2 characters long.')
  .max(40, 'Name must be at most 40 characters long.')
  .regex(
    /^[a-zA-ZÀ-ÿ]{2}[a-zA-ZÀ-ÿ0-9\s]{0,38}$/,
    'Name contains invalid characters.'
  )
export const namebrandschema = z
  .string()
  .min(3, 'Name must be at least 3 characters long.')
  .max(20, 'Name must be at most 20 characters long.')
  .regex(/^\p{L}{3}[\p{L}0-9 ]{0,17}$/u, 'Name contains invalid characters.')
