import { ValidationError } from 'utils/errors/error'

export function validateSchema(schema, data) {
  const result = schema.safeParse(data)

  if (!result.success) {
    const issue = result.error.issues[0]

    throw new ValidationError(issue.message, issue.path[0])
  }

  return result.data
}
