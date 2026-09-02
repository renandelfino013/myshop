import { validateSchema } from 'schemas/validator/validationschema'
import { idschema } from 'schemas/variables/common.variables'
import { namebrandschema } from 'schemas/variables/names/names.variables'
import { z } from 'zod'

export const schemaPostBrand = z.object({
  nome: namebrandschema,
})

export const schemaGetperIdBrand = z.object({
  id: idschema(),
})

export const schemaGetperNameBrand = z.object({
  nome: namebrandschema,
})

export const schemaPutBrand = z.object({
  brandname: namebrandschema,
  newname: namebrandschema,
})

export const schemaDeleteBrand = z.object({
  name: namebrandschema,
})
export const validateSchemaPostBrand = (data) =>
  validateSchema(schemaPostBrand, data)
export const validateSchemaGetperIdBrand = (data) =>
  validateSchema(schemaGetperIdBrand, data)
export const validateSchemaGetperNameBrand = (data) =>
  validateSchema(schemaGetperNameBrand, data)
export const validateSchemaPutBrand = (data) =>
  validateSchema(schemaPutBrand, data)
export const validateSchemaDeleteBrand = (data) =>
  validateSchema(schemaDeleteBrand, data)
