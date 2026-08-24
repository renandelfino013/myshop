import pool from 'infra/database/db'
import { ValidationError } from 'utils/errors/error'

export async function finduserbyemail(email) {
  let emailtolower = email.toLowerCase()
  let user = await pool.query(
    'SELECT id, nome, email, role, senha FROM usuarios WHERE email = $1',
    [emailtolower]
  )
  return user.rows
}
export async function findEmailUserbyId(userid) {
  try {
    let emailuser = await pool.query(
      'select email from usuarios WHERE id = $1',

      [userid]
    )
    return emailuser.rows
  } catch (error) {
    throw new ValidationError('error on find email user', error)
  }
}
export async function insertkey(userid, resetkey) {
  let key = await pool.query(
    'INSERT INTO password_reset_keys (usuariosid, key) VALUES ($1, $2)  ON CONFLICT (usuariosid) DO UPDATE SET key = EXCLUDED.key, expirado = FALSE',
    [userid, resetkey]
  )
  if (key) {
    return true
  } else {
    throw new ValidationError('key n setada no banco')
  }
}
export async function registerUserInDB(nome, email, hashedpassword) {
  try {
    let result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id',
      [nome, email, hashedpassword]
    )
    return result.rows[0]
  } catch (error) {
    console.error('erro no db ', error)
    throw error
  }
}
export async function findresetkey(email) {
  let resetkey = await pool.query(
    'SELECT key FROM password_reset_keys WHERE usuariosid = (SELECT id FROM usuarios WHERE email = $1) AND expirado = FALSE',
    [email]
  )
  return resetkey.rows
}
export async function registerAdminInDB(nome, email, hashedpassword) {
  try {
    let result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3,$4) RETURNING id',
      [nome, email, hashedpassword, 'ADMIN']
    )
    return result.rows[0]
  } catch (error) {
    console.error('erro no db ', error)
    throw error
  }
}
