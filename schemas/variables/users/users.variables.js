import z from 'zod'
export const limitschema = z.coerce.number().int().positive().optional()
export const pageschema = z.coerce.number().optional()
