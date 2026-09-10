import pool from 'infra/database/db'
import dotenv from 'dotenv'
import { ValidationError } from '../../utils/errors/error'
dotenv.config()

export async function FindResetToken(key) {
  const result = await pool.query(
    'SELECT usuariosid FROM password_reset_keys WHERE key = $1 AND expirado = FALSE',
    [key]
  )

  return result.rows
}

export async function updatepassindb(hashedpassword, userid) {
  try {
    const updateResult = await pool.query(
      'UPDATE usuarios SET senha = $1 WHERE id = $2 RETURNING id',
      [hashedpassword, userid]
    )

    return updateResult.rows
  } catch (error) {
    console.error('error on updatepassindb', error)
    throw error
  }
}
export async function expiringResetToken(userId) {
  try {
    let ok = await pool.query(
      'UPDATE password_reset_keys SET expirado = TRUE WHERE usuariosid = $1',
      [userId]
    )
    return ok.rows
  } catch (error) {
    throw new ValidationError('error on expiring reset token!', error)
  }
}
