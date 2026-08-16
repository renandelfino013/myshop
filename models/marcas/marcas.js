import pool from 'utils/db'

export async function FindAllBrands() {
  const result = await pool.query('SELECT * FROM marcas')
  return result.rows
}

export async function FindBrandById(id) {
  const result = await pool.query('SELECT * FROM marcas WHERE id = $1', [id])
  return result.rows
}

export async function InsertNewBrand(name) {
  const result = await pool.query(
    'INSERT INTO marcas (nome) VALUES ($1) RETURNING *',
    [name]
  )
  return result.rows
}
export async function FindBrandByName(name) {
  const result = await pool.query('SELECT * FROM marcas WHERE nome = $1', [
    name,
  ])
  return result.rows
}
