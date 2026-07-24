import bcrypt from 'bcryptjs'
import pool from '../../utils/db'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { sendLoginNotification } from '../../utils/sendEmail'
import { ValidationError } from '../../utils/error'
import { useId } from 'react'

export async function finduserbyemail(email) {
  let emailtolower = email.toLowerCase()
  let user = await pool.query(
    'SELECT id, nome, email, role, senha FROM usuarios WHERE email = $1',
    [emailtolower]
  )
  console.log(user.rows)
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
    throw new ValidationError('error on find email user')
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
    console.log(result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.log('erro no db ', error)
    throw error
  }
}
