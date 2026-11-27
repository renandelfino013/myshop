export function makeCheck(schema, field = 'nome') {
  return (value: string): string | undefined => {
    const result = schema.safeParse({ [field]: value })
    if (result.success) return undefined
    return result.error.issues[0]?.message
  }
}
