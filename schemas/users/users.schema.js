import { validateSchema } from 'schemas/validator/validationschema'
import { pageschema } from 'schemas/variables/users/users.variables'
import { z } from 'zod'
import { limitschema } from 'schemas/variables/users/users.variables'
import { idschema } from 'schemas/variables/common.variables'
export const getAdminSchema = z.object({
  limit: limitschema,
  page: pageschema,
})
export const userPerIdSchema = z.object({
  id: idschema(),
})
export const validateGetAdminSchema = (data) =>
  validateSchema(getAdminSchema, data)
export const validateIdforusersSchema = (data) =>
  validateSchema(userPerIdSchema, data)
