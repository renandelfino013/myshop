import { z } from 'zod'
export const searchvSchema = z
  .string()
  .transform((s) =>
    s
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim()
  )
  .pipe(z.string())
