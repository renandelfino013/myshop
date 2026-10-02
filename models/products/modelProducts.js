import pool from 'infra/database/db'
import { alreadyExistsError, ValidationError } from 'utils/errors/error'
import { requestContext } from 'infra/request-context/request-context'

export async function FindAllProducts(limit, offset) {
  const { Nopagination } = requestContext.getStore()

  const query = !Nopagination
    ? `
  SELECT p.id,
  p.nome,
  p.preco,
  p.categoria_id,
  p.marca_id,
  p.descricao,
  p.image,
  m.nome 
  AS marca_nome ,
  c.nome 
  AS categoria_nome
   FROM produtos 
   AS p  
   INNER JOIN marcas 
   AS m
    ON p.marca_id = m.id 
   INNER JOIN categorias
    AS c 
    ON c.id= p.categoria_id
    ORDER BY p.id 
     OFFSET $1 
     LIMIT $2
  
     
     `
    : `
  SELECT p.id,
  p.nome,
  p.preco,
  p.categoria_id,
  p.marca_id,
  p.descricao,
  p.image,
  m.nome 
  AS marca_nome ,
  c.nome 
  AS categoria_nome
   FROM produtos 
   AS p  
   INNER JOIN marcas 
   AS m
    ON p.marca_id = m.id 
   INNER JOIN categorias
    AS c 
    ON c.id= p.categoria_id
    ORDER BY p.id 
    
     
     `
  const params = !Nopagination ? [offset, limit] : []
  const result = await pool.query(query, params)

  return result.rows
}

export async function FindproductPerId(id, client) {
  const executor = client || pool
  const result = await executor.query('SELECT * FROM produtos WHERE id = $1', [
    id,
  ])

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
  desc,
  image_url
) {
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, preco, estoque, categoria_id, marca_id, descricao,image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, price, stock, categoryId, markId, desc, image_url]
    )
    return result.rows
  } catch (err) {
    if (err.code === '23505')
      throw new alreadyExistsError([
        {
          field: 'name',
          message: 'Product already exists',
        },
      ])
    if (err.code === '23503')
      throw new ValidationError([
        {
          field: 'category_id',
          message: 'Invalid category',
        },
        {
          field: 'marca_id',
          message: 'Invalid mark',
        },
      ])
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
  productId,
  image_url
) {
  try {
    const query =
      image_url !== undefined
        ? 'UPDATE produtos SET nome = $1, preco = $2, estoque = $3, categoria_id = $4, marca_id = $5, descricao = $6 , image = $7 WHERE id = $8 RETURNING *'
        : 'UPDATE produtos SET nome = $1, preco = $2, estoque = $3, categoria_id = $4, marca_id = $5, descricao = $6 WHERE id = $7 RETURNING *'
    const params =
      image_url !== undefined
        ? [name, price, stock, categoryId, markId, desc, image_url, productId]
        : [name, price, stock, categoryId, markId, desc, productId]

    const result = await pool.query(query, params)
    return result.rows
  } catch (err) {
    if (err.code === '23505')
      throw new alreadyExistsError([
        {
          field: 'name',
          message: 'Product already exists',
        },
      ])
    if (err.code === '23503')
      throw new ValidationError([
        {
          field: 'category_id',
          message: 'Invalid category',
        },
        {
          field: 'marca_id',
          message: 'Invalid mark',
        },
      ])
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
export async function DeleteAllProducts() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('This function can only be called in test environment')
  }
  const result = await pool.query('DELETE FROM produtos RETURNING *')
  return result.rows
}
