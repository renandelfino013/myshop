import { z } from 'zod'
import {
  emailschema,
  passwordschema,
} from 'schemas/variables/auth/auth.variables'
import { validateSchema } from 'schemas/validator/validationschema'

export const passwordResetSchema = z.object({
  email: emailschema,
})

export const Schemapassword = z.object({
  newpassword: passwordschema,
})

export const validatePasswordResetSchema = (data) =>
  validateSchema(passwordResetSchema, data)
export const validateSchemapassword = (data) =>
  validateSchema(Schemapassword, data)
