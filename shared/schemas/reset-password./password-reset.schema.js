import { z } from 'zod'
import {
  emailschema,
  passwordschema,
  resetkeyschema,
} from 'shared/schemas/variables/auth/auth.variables'
import { validateSchema } from 'shared/schemas/validator/validationschema'

export const passwordResetSchema = z.object({
  email: emailschema,
})

export const Schemapassword = z.object({
  newpassword: passwordschema,
  key: resetkeyschema,
})

export const validatePasswordResetSchema = (data) =>
  validateSchema(passwordResetSchema, data)
export const validateSchemapassword = (data) =>
  validateSchema(Schemapassword, data)
