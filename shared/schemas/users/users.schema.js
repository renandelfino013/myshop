import { validateSchema } from 'shared/schemas/validator/validationschema'
import { pageschema } from 'shared/schemas/variables/users/users.variables'
import { z } from 'zod'
import { limitschema } from 'shared/schemas/variables/users/users.variables'
import { idschema } from 'shared/schemas/variables/common.variables'
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
