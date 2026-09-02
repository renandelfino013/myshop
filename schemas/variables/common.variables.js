import { ValidationError } from 'utils/errors/error'
import { z } from 'zod'

export const idschema = (message = 'Invalid id format') =>
  z.coerce
    .number()
    .pipe(z.number().int().positive('Invalid id format'))
    .catch((ctx) => {
      console.error(
        'idschema catch — value:',
        ctx.value,
        'issues:',
        JSON.stringify(ctx.error?.issues)
      )
      throw new ValidationError(message, 'id')
    })
