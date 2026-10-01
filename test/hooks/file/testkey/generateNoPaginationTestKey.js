import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export async function generateNoPaginationTestKey() {
  const token = jwt.sign(
    {
      noPagination: true,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  return token
}
