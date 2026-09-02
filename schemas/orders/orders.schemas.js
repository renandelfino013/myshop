import { itemsSchema } from 'schemas/variables/orders.variables'
import { idschema } from 'schemas/variables/common.variables'
import { validateSchema } from 'schemas/validator/validationschema'
import { z } from 'zod'
export const idForOrdersSchemaUser = z.object({
  id: idschema('id is required!'),
  user_id: idschema('user_id is required!'),
})

export const orderPostSchema = z.object({
  userId: idschema('userId is required!'),
  items: itemsSchema,
})
export const orderDeleteSchema = z.object({
  orderId: idschema('orderId is required!'),
})
export const idForOrdersSchema = z.object({
  id: idschema('id is required!'),
})
export const validateorderPost = (data) => validateSchema(orderPostSchema, data)
export const validateorderDelete = (data) =>
  validateSchema(orderDeleteSchema, data)
export const validateidForOrders = (data) =>
  validateSchema(idForOrdersSchema, data)

export const validateidForOrdersUser = (data) =>
  validateSchema(idForOrdersSchemaUser, data)
