import pool from 'infra/database/db'
export async function SearchProducts(input, limit, offset) {
  const { conditions, params, offsetPosition, limitPosition } =
    dynamicSearchQuery(input, limit, offset)

  const query = `
  SELECT p.id,
  p.nome,
  p.preco,
  p.categoria_id,
  p.image,
  p.marca_id,
  p.descricao,
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
    WHERE  
    ${conditions}
  ORDER BY p.id  
     OFFSET $${offsetPosition} 
     LIMIT $${limitPosition}`

  const search = await pool.query(query, params)

  return search.rows
}
function dynamicSearchQuery(input, limit, offset) {
  const params = Array.isArray(input)
    ? [...input.map((item) => `%${item}%`), offset, limit]
    : [`%${input}%`, offset, limit]
  const offsetPosition = Array.isArray(input) ? input.length + 1 : 2
  const limitPosition = Array.isArray(input) ? input.length + 2 : 3
  const conditions = input
    .map(
      (_, index) => `
  (

   unaccent(p.nome) ILIKE unaccent($${index + 1})
    OR unaccent(p.descricao) ILIKE unaccent($${index + 1})
    OR unaccent(m.nome) ILIKE unaccent($${index + 1})
    OR unaccent(c.nome) ILIKE unaccent($${index + 1}) 
  )
`
    )
    .join(' AND ')
  return { conditions, params, offsetPosition, limitPosition }
}
export async function SearchUsers(input, limit, offset) {
  const query = `
  SELECT u.id,
  u.nome,
  u.email,
  u.role,
  u.image,
  u.created_at
   FROM usuarios 
   AS u
    WHERE 
    unaccent(u.nome) ILIKE unaccent($1) 
    OR 
    unaccent(u.email) ILIKE unaccent($1)                     
    
    OR unaccent(u.role) ILIKE unaccent($1)
  ORDER BY u.id

     OFFSET $2 
     LIMIT $3`

  const search = await pool.query(query, [`%${input}%`, offset, limit])
  return search.rows
}
