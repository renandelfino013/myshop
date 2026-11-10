import jwt from 'jsonwebtoken'
export function decodeJWT(
  token: string
): { email: string; role: string; session_version: number; id: number } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded as {
      email: string
      role: string
      session_version: number
      id: number
    }
  } catch (error) {
    console.error('Error decoding JWT:', error)
    throw error
  }
}
