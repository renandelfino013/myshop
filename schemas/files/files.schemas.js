import { validateSchema } from 'schemas/validator/validationschema'
import { z } from 'zod'
import {
  filesizeschema,
  mimetypeschema,
  namefileschema,
} from 'schemas/variables/files/file.variables'
export const fileschema = z.object({
  namefile: namefileschema,
  filesize: filesizeschema,
  mimetype: mimetypeschema,
})
export const validatefileSchema = (data) => validateSchema(fileschema, data)
