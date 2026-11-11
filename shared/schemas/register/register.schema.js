import { validateSchema } from 'shared/schemas/validator/validationschema'
import {
  emailschema,
  passwordschema,
} from 'shared/schemas/variables/auth/auth.variables'
import { nameuserschema } from 'shared/schemas/variables/names/names.variables'
import { z } from 'zod'

export const schemaregister = z.object({
  email: emailschema.transform((val) => val.toLowerCase().trim()),
  password: passwordschema,
  name: nameuserschema,
})
export const validateSchemaregister = (data) =>
  validateSchema(schemaregister, data)
