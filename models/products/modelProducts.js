import pool from 'infra/database/db'
import { ValidationError } from 'utils/errors/error'

export async function FindAllProducts() {
  const result = await pool.query('SELECT * FROM produtos')
  return result.rows
}

export async function FindproductPerId(id) {
  const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id])
  return result.rows
}

export async function FindproductPerName(name) {
  const result = await pool.query('SELECT * FROM produtos WHERE nome = $1', [
    name,
  ])
  return result.rows
}

export async function Insertproduct(
  name,
  price,
  stock,
  categoryId,
  markId,
  desc
) {
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, preco, estoque, categoria_id, marca_id, descricao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, stock, categoryId, markId, desc]
    )
    return result.rows
  } catch (err) {
    if (err.code === '23505')
      throw new ValidationError('Product already exists')
    if (err.code === '23503')
      throw new ValidationError('Invalid category or mark')
    throw err
  }
}

export async function Updateproduct(
  name,
  price,
  stock,
  categoryId,
  markId,
  desc,
  productId
) {
  try {
    const result = await pool.query(
      'UPDATE produtos SET nome = $1, preco = $2, estoque = $3, categoria_id = $4, marca_id = $5, descricao = $6 WHERE id = $7 RETURNING *',
      [name, price, stock, categoryId, markId, desc, productId]
    )
    return result.rows
  } catch (err) {
    if (err.code === '23505')
      throw new ValidationError('Product already exists')
    if (err.code === '23503')
      throw new ValidationError('Invalid category or mark')
    throw err
  }
}

export async function Deleteproduct(id) {
  const result = await pool.query(
    'DELETE FROM produtos WHERE id = $1 RETURNING *',
    [id]
  )
  return result.rows
}
