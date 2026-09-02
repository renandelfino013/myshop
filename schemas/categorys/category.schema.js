import { validateSchema } from 'schemas/validator/validationschema'
import { idschema } from 'schemas/variables/common.variables'
import { namecategoryschema } from 'schemas/variables/names/names.variables'
import { z } from 'zod'

export const schemaPost = z.object({
  nome: namecategoryschema,
})

export const schemaGetcategoryPerId = z.object({
  id: idschema(),
})

export const schemaPutcategory = z.object({
  id: idschema(),
  novonome: namecategoryschema,
})

export const schemaGetcategoryPerName = z.object({
  nome: namecategoryschema,
})

export const schemaDeletecategory = z.object({
  id: idschema(),
})

export const validateSchemaPost = (data) => validateSchema(schemaPost, data)
export const validateSchemaGetcategoryPerId = (data) =>
  validateSchema(schemaGetcategoryPerId, data)
export const validateSchemaGetcategoryPerName = (data) =>
  validateSchema(schemaGetcategoryPerName, data)
export const validateSchemaPutcategory = (data) =>
  validateSchema(schemaPutcategory, data)
export const validateSchemaDeletecategory = (data) =>
  validateSchema(schemaDeletecategory, data)
