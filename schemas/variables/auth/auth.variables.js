import { z } from 'zod'
export const emailschema = z
  .email('invalid email')
  .transform((val) => val.toLowerCase())
export const passwordschema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
  .regex(/\d/, 'A senha deve conter pelo menos um número.')
  .regex(
    /[^A-Za-z0-9]/,
    'A senha deve conter pelo menos um caractere especial.'
  )
export const resetkeyschema = z.string().trim().min(1, 'Reset key is required')
