import { validateSchema } from 'schemas/validator/validationschema'
import { idschema } from 'schemas/variables/common.variables'
import { nameproductschema } from 'schemas/variables/names/names.variables'
import {
  descschema,
  priceschema,
  stockschema,
} from 'schemas/variables/products.variables'
import { z } from 'zod'

export const ProductsPerIdSchema = z.object({
  id: idschema('id is required'),
})

export const productSchema = z.object({
  name: nameproductschema,
  price: priceschema,
  stock: stockschema,
  categoryId: idschema('id is required'),
  markId: idschema('id is required'),
  desc: descschema.optional(),
  productId: idschema().optional(),
})

export const validateProductsPerIdSchema = (data) => {
  if (!data) {
    throw new Error('Product id is required')
  }
  return validateSchema(ProductsPerIdSchema, data)
}
export const validateProductSchema = (data) =>
  validateSchema(productSchema, data)
