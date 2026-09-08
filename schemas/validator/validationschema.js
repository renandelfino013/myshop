import { ValidationError } from 'utils/errors/error'
export function validateSchema(schema, data) {
  const result = schema.safeParse(data)

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))
    throw new ValidationError(details)
  }

  return result.data
}
