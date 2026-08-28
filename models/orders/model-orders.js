import pool from 'infra/database/db'
import { InsufficientStockError, NotFoundError } from 'utils/errors/error'
import calcTotalOrder from 'utils/helper/calcTotalOrder'
export async function FindAllOrders(user_id, client) {
  const executor = client || pool
  const orders = await executor.query(
    `SELECT
  u.nome AS usuario_nome,
  u.id AS usuario_id,
  u.email AS usuario_email,
  u.role AS usuario_role,

  pr.nome AS produto_nome,
  pr.preco AS produto_preco,

  p.id AS pedido_id,
  p.data_pedido,

  i.produto_id,
  i.quantidade,
  (i.quantidade * i.preco_unitario) AS totalprice

FROM pedidos p

JOIN itens_pedido i
  ON p.id = i.pedido_id

JOIN usuarios u
  ON p.usuario_id = u.id

JOIN produtos pr
  ON i.produto_id = pr.id

  WHERE p.usuario_id = $1;`,
    [user_id]
  )
  return orders.rows
}

export async function FindAllOrdersAdmin(client) {
  const executor = client || pool
  const orders = await executor.query(
    `SELECT
  u.nome AS usuario_nome,
  u.id AS usuario_id,
  u.email AS usuario_email,
  u.role AS usuario_role,

  pr.nome AS produto_nome,
  pr.preco AS produto_preco,

  p.id AS pedido_id,
  p.data_pedido,

  i.produto_id,
  i.quantidade,
  (i.quantidade * i.preco_unitario) AS totalprice

FROM pedidos p

JOIN itens_pedido i
  ON p.id = i.pedido_id

JOIN usuarios u
  ON p.usuario_id = u.id

JOIN produtos pr
  ON i.produto_id = pr.id`
  )
  return orders.rows
}

export async function FindOrderPerId(order_id, user_id, client) {
  const executor = client || pool
  const orders = await executor.query(
    `SELECT
      u.nome AS usuario_nome,
      u.id AS usuario_id,
      u.email AS usuario_email,
      u.role AS usuario_role,
      pr.nome AS produto_nome,
      i.preco_unitario AS produto_preco,
      p.id AS pedido_id,
      p.data_pedido,
      i.produto_id,
      i.quantidade,
      i.preco_unitario,
      (i.quantidade * i.preco_unitario) AS totalprice

    FROM pedidos p

    JOIN itens_pedido i
      ON p.id = i.pedido_id

    JOIN usuarios u
      ON p.usuario_id = u.id

    JOIN produtos pr
      ON i.produto_id = pr.id

    WHERE p.id = $1
      AND p.usuario_id = $2`,
    [order_id, user_id]
  )

  return orders.rows
}
export async function FindOrderPerIdAdmin(order_id, client) {
  const executor = client || pool
  const orders = await executor.query(
    `SELECT
      u.nome AS usuario_nome,
      u.id AS usuario_id,
      u.email AS usuario_email,
      u.role AS usuario_role,
      pr.nome AS produto_nome,
      i.preco_unitario AS produto_preco,
      p.id AS pedido_id,
      p.data_pedido,
      i.produto_id,
      i.quantidade,
      i.preco_unitario,
      (i.quantidade * i.preco_unitario) AS totalprice

    FROM pedidos p

    JOIN itens_pedido i
      ON p.id = i.pedido_id

    JOIN usuarios u
      ON p.usuario_id = u.id

    JOIN produtos pr
      ON i.produto_id = pr.id

    WHERE p.id = $1
  `,
    [order_id]
  )

  return orders.rows
}
export async function Insertorder(user_id, itens) {
  const client = await pool.connect()
  const ordenadeditens = [...itens].sort((a, b) => a.produto_id - b.produto_id)
  try {
    await client.query('BEGIN')
    const productsIds = ordenadeditens.map((item) => item.produto_id)
    const foundproducts = await FindAllProductsOrder(productsIds, client)
    const productPerId = new Map(foundproducts.map((p) => [p.id, p]))
    const itenswithprice = ordenadeditens.map((item) => {
      const produto = productPerId.get(item.produto_id)
      if (!produto) {
        throw new NotFoundError(`Product ${item.produto_id} not found`)
      }
      return { ...item, preco: produto.preco }
    })
    const id_order = await client.query(
      'INSERT INTO pedidos (usuario_id,total) VALUES ($1,$2) RETURNING id',
      [user_id, calcTotalOrder(itenswithprice)]
    )
    for (const item of itenswithprice) {
      const stockResult = await client.query(
        `UPDATE produtos
         SET estoque = estoque - $1
         WHERE id = $2 AND estoque >= $1
         RETURNING *`,
        [item.quantidade, item.produto_id]
      )
      if (stockResult.rows.length === 0) {
        throw new InsufficientStockError('Insufficient Stock of product!')
      }

      await client.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
        [id_order.rows[0].id, item.produto_id, item.quantidade, item.preco]
      )
    }

    await client.query('COMMIT')
    return id_order.rows[0].id
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
export async function DeleteOrder(user_id, order_id) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const order = await FindOrderPerId(order_id, user_id, client)
    if (order.length === 0) {
      throw new NotFoundError('Order not found!')
    }
    await Promise.all(
      order.map((item) =>
        client.query(
          'UPDATE produtos SET estoque = estoque + $1 WHERE id = $2',
          [item.quantidade, item.produto_id]
        )
      )
    )
    const stock = await client.query(
      'DELETE FROM pedidos WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [order_id, user_id]
    )
    await client.query('COMMIT')
    return stock.rows
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function FindAllProductsOrder(ids, client) {
  const executor = client || pool
  const result = await executor.query(
    'SELECT * FROM produtos WHERE id = ANY($1)',
    [ids]
  )
  return result.rows
}
export async function DeleteorderAdmin(order_id) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const order = await FindOrderPerIdAdmin(order_id, client)
    if (order.length === 0) {
      throw new NotFoundError('Order not found!')
    }
    await Promise.all(
      order.map((item) =>
        client.query(
          'UPDATE produtos SET estoque = estoque + $1 WHERE id = $2',
          [item.quantidade, item.produto_id]
        )
      )
    )
    const stock = await client.query(
      'DELETE FROM pedidos WHERE id = $1 RETURNING *',
      [order_id]
    )
    await client.query('COMMIT')
    return stock.rows
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
