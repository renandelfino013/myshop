import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export async function generateTestKey(context) {
  const validValuesForUseExternalServices = ['fake', 'real']
  const isvalid = validValuesForUseExternalServices.includes(context)
  if (!isvalid) {
    return new Error("inválid context . valid values: 'fake' or 'real'")
  }
  const token = jwt.sign(
    {
      storageProvider: context,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  return token
}
