import { z } from 'zod'
export const max_file_size = 5 * 1024 * 1024
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png']
export const namefileschema = z.string().transform((name) => {
  const nameclear = name
    //clear the path to the archive
    .replace(/^(\.\.(\/|\\|$))+/g, '')
    //separates accents
    .normalize('NFD')
    //clear accents
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase() //replace all spaces with hyphens
    .replace(/\s+/g, '-')
    //deletes everything except letters, numbers, periods, or hyphens
    // eslint-disable-next-line no-useless-escape
    .replace(/[^a-z0-9\.\-_]/g, '')
  return nameclear
})
export const filesizeschema = z
  .number()
  .max(max_file_size, 'The maximum file size is 5 MB.')
export const mimetypeschema = z
  .string()
  .refine((type) => ACCEPTED_MIME_TYPES.includes(type), {
    message: 'invalid file',
  })
