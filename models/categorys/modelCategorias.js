import pool from 'infra/database/db'
import { ValidationError } from 'utils/errors/error'
export async function FindAllCategorys() {
  const result = await pool.query('SELECT * FROM categorias')
  return result.rows
}
export async function FindCategoryById(id) {
  const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [
    id,
  ])
  return result.rows
}
export async function FindCategoryByName(name) {
  const result = await pool.query('SELECT * FROM categorias WHERE nome = $1', [
    name,
  ])
  return result.rows
}
export async function InsertNewCategory(name) {
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [name]
    )
    return result.rows
  } catch (err) {
    if (err.code === '23505') {
      throw new ValidationError('Category already exists')
    }
    throw err
  }
}
export async function updateCategory(id, newname) {
  try {
    const result = await pool.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [newname, id]
    )
    return result.rows
  } catch (err) {
    if (err.code === '23505') {
      throw new ValidationError('Category already exists')
    }
    throw err
  }
}
export async function deleteCategory(id) {
  const result = await pool.query(
    'DELETE FROM categorias WHERE id = $1 RETURNING *',
    [id]
  )
  return result.rows
}
