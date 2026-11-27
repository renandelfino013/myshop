import { fileschema } from 'shared/schemas/files/files.schemas.js'
import { productSchema } from 'schemas/products/products.schema'
export const formProductsSchema = productSchema.extend(fileschema.shape)
