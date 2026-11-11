import { validateSchema } from 'schemas/validator/validationschema'
import {
  emailschema,
  passwordschema,
} from 'schemas/variables/auth/auth.variables'
import { z } from 'zod'

export const schemalogin = z.object({
  email: emailschema,
  senha: passwordschema,
})

export const validateSchemaLogin = (data) => validateSchema(schemalogin, data)
