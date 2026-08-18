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
export async function updatebrand(id, newname) {
  const result = await pool.query(
    'UPDATE marcas SET nome = $1 WHERE id = $2 RETURNING *',
    [newname, id]
  )

  return result.rows
}
export async function deletebrand(id) {
  const result = await pool.query(
    'DELETE FROM marcas WHERE id = $1 RETURNING *',
    [id]
  )

  return result.rows
}
