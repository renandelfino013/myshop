import { validateSchema } from 'schemas/validator/validationschema'
import { searchvSchema } from 'schemas/variables/search/search.variables'
import { z } from 'zod'
export const searchSchema = z.object({
  search: searchvSchema,
})
export const validateSearchSchema = (data) => validateSchema(searchSchema, data)
