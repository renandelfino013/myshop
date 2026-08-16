import { registerAdminInDB } from 'models/users/users'
import { ValidationError } from 'utils/error'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
export default async function userRoleAdmin(nome, email, senha) {
  try {
    const hashedpassword = await bcrypt.hash(senha, 10)
    const userAdmin = await registerAdminInDB(nome, email, hashedpassword)
    const token = await jwt.sign(
      { email, nome, role: 'ADMIN', id: userAdmin.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )
    return token
  } catch (error) {
    throw new ValidationError('failed register admin in db', error)
  }
}
