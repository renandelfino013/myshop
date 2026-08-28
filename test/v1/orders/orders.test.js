import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests'

let tokenUser = 0
let tokenAdmin = 0
let categoryId = ''
let markId = ''
let productId = ''
let productWithLowStockId = ''

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  const email = `teste${Date.now()}@gmail.com`
  const user = await createuser.fakeuser.user(email, 'renan', '1234Rnads')
  const admin = await userRoleAdmin(
    'renanadmin',
    `teste2${Date.now()}@gmail.com`,
    'Testeadmin1345'
  )
  tokenUser = user[1].token
  tokenAdmin = admin

  const categoryName = `catego${Date.now()}`
  const categoryCreate = await fetch(
    'http://localhost:3000/api/v1/categorias',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: categoryName }),
    }
  )
  if (categoryCreate.status !== 201) {
    throw new Error(`Category setup failed: ${categoryCreate.status}`)
  }
  const categoryResp = await fetch(
    `http://localhost:3000/api/v1/categorias?nome=${encodeURIComponent(categoryName)}`,
    { headers: { Authorization: `Bearer ${tokenAdmin}` } }
  )
  const categoryBody = await categoryResp.json()
  if (!Array.isArray(categoryBody)) {
    throw new Error(
      `Category lookup failed: ${categoryResp.status} ${JSON.stringify(categoryBody)}`
    )
  }
  categoryId = categoryBody[0].id

  const markName = `marca${Date.now()}`
  const markCreate = await fetch('http://localhost:3000/api/v1/marcas', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenAdmin}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: markName }),
  })
  if (markCreate.status !== 201) {
    throw new Error(`Brand setup failed: ${markCreate.status}`)
  }
  const markResp = await fetch(
    `http://localhost:3000/api/v1/marcas?nome=${encodeURIComponent(markName)}`,
    { headers: { Authorization: `Bearer ${tokenAdmin}` } }
  )
  const markBody = await markResp.json()
  if (!Array.isArray(markBody)) {
    throw new Error(
      `Brand lookup failed: ${markResp.status} ${JSON.stringify(markBody)}`
    )
  }
  markId = markBody[0].id

  const productName = `produto${Date.now()}`
  const productCreate = await fetch('http://localhost:3000/api/v1/produtos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenAdmin}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: productName,
      price: 50,
      stock: 100,
      categoryId,
      markId,
      desc: 'produto pra teste de pedido',
    }),
  })
  if (productCreate.status !== 201) {
    const body = await productCreate.json()
    throw new Error(
      `Product setup failed: ${productCreate.status} ${JSON.stringify(body)}`
    )
  }
  const allProducts = await (
    await fetch('http://localhost:3000/api/v1/produtos', {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    })
  ).json()
  const foundProduct = allProducts.find((p) => p.nome === productName)
  if (!foundProduct) {
    throw new Error(`Created product not found in listing: ${productName}`)
  }
  productId = foundProduct.id

  const lowStockName = `prlowstock${Date.now()}`
  const lowStockCreate = await fetch('http://localhost:3000/api/v1/produtos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenAdmin}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: lowStockName,
      price: 20,
      stock: 1,
      categoryId,
      markId,
      desc: 'produto com pouco estoque',
    }),
  })
  if (lowStockCreate.status !== 201) {
    const body = await lowStockCreate.json()
    throw new Error(
      `Low-stock product setup failed: ${lowStockCreate.status} ${JSON.stringify(body)}`
    )
  }
  const allProducts2 = await (
    await fetch('http://localhost:3000/api/v1/produtos', {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    })
  ).json()
  const foundLowStock = allProducts2.find((p) => p.nome === lowStockName)
  if (!foundLowStock) {
    throw new Error(`Low-stock product not found in listing: ${lowStockName}`)
  }
  productWithLowStockId = foundLowStock.id
})

async function createOrder(token, produtoId, quantidade = 1) {
  const response = await fetch('http://localhost:3000/api/v1/pedidos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ produto_id: produtoId, quantidade }],
    }),
  })

  const body = await response.json()
  if (response.status !== 201) {
    throw new Error(`Order creation failed: ${JSON.stringify(body)}`)
  }

  return body.order_id
}

describe('POST /api/v1/pedidos', () => {
  test('POST create order happy path', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 2 }],
      }),
    })

    const respbody = await response.json()

    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(201)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('Order created successfully!')

    expect(respbody.order_id).toBeDefined()

    const orderResponse = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${respbody.order_id}`,
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )
    const order = await orderResponse.json()

    expect(orderResponse.status).toBe(200)
    expect(order[0].pedido_id).toBe(respbody.order_id)
  })

  test('POST create order actually decreases stock', async () => {
    const productBefore = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      })
    ).json()
    const stockBefore = productBefore[0].estoque

    const orderResponse = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 3 }],
      }),
    })

    const orderBody = await orderResponse.json()
    expect(orderResponse.status).toBe(201)
    expect(orderBody.order_id).toBeDefined()

    const productAfter = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      })
    ).json()
    const stockAfter = productAfter[0].estoque

    expect(Number(stockAfter)).toEqual(Number(stockBefore) - 3)
  })

  test('POST create order without items', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('items is required!')
  })

  test('POST create order with empty items array', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: [] }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Order must have at least one item')
  })

  test('POST create order with invalid produto_id', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: 'abc', quantidade: 1 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Invalid produto_id')
  })

  test('POST create order with zero quantity', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 0 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('quantidade must be a positive integer')
  })

  test('POST create order with negative quantity', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: -5 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('quantidade must be a positive integer')
  })

  test('POST create order with duplicate product IDs', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          { produto_id: productId, quantidade: 1 },
          { produto_id: productId, quantidade: 2 },
        ],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Duplicate produto_id in the same order')
  })

  test('POST create order with insufficient stock', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productWithLowStockId, quantidade: 999 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(409)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Insufficient Stock of product!')
  })

  test('POST create order with non-existent produto_id', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: 99999999, quantidade: 1 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toEqual('Product 99999999 not found')
  })

  test('POST order with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer teste145322`,
        'Content-Type': 'application/json',
      },
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toEqual('Invalid token')
  })

  test('POST order without token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toEqual('Token is missing')
  })
})

describe('GET /api/v1/pedidos', () => {
  test('GET all orders of the logged user', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      headers: { Authorization: `Bearer ${tokenUser}` },
    })

    let respbody = await response.json()

    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(200)
    expect(Array.isArray(respbody)).toBe(true)
  })

  test('GET all orders as admin returns orders from all users', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    })

    let respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody)).toBe(true)
  })

  test('GET all orders without token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos')

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toEqual('Token is missing')
  })

  test('GET all orders with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      headers: { Authorization: `Bearer teste145322` },
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toEqual('Invalid token')
  })

  test('GET order by id happy path', async () => {
    const orderId = await createOrder(tokenUser, productId)

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${orderId}`,
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody)).toBe(true)
    expect(respbody[0].pedido_id).toEqual(orderId)
  })

  test('GET order by id that does not exist', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=99999999',
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test("GET order by ID — admin can view any user's order", async () => {
    const orderId = await createOrder(tokenUser, productId)

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${orderId}`,
      { headers: { Authorization: `Bearer ${tokenAdmin}` } }
    )

    const respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody)).toBe(true)
    expect(respbody[0].pedido_id).toEqual(orderId)
  })

  test("GET order by id — A regular user cannot see another regular user's order.", async () => {
    const email2 = `teste2${Date.now()}@gmail.com`
    const user2 = await createuser.fakeuser.user(
      email2,
      'outrorenan',
      '1234Rnads'
    )
    const tokenUser2 = user2[1].token

    const createResp = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser2}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })
    expect(createResp.status).toBe(201)
    const created = await createResp.json()

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.order_id}`,
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test("GET order by ID — a regular user cannot view an order using another user's ID, even if the order was created by the admin.", async () => {
    const createResp = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })
    expect(createResp.status).toBe(201)
    const created = await createResp.json()

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.order_id}`,
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test('GET order by id with invalid format', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=abc123',
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
  })

  test('GET order by id without token', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=1'
    )

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toEqual('Token is missing')
  })
})

describe('DELETE /api/v1/pedidos', () => {
  test('DELETE order successfully restores stock', async () => {
    const createorderResponse = await fetch(
      'http://localhost:3000/api/v1/pedidos',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ produto_id: productId, quantidade: 1 }],
        }),
      }
    )
    expect(createorderResponse.status).toBe(201)
    const createorder = await createorderResponse.json()
    expect(createorder.order_id).toBeDefined()

    const productBefore = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      })
    ).json()
    const stockBefore = Number(productBefore[0].estoque)

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${createorder.order_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const respbody = await response.json()

    expect(response.status).toBe(200)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('order deleted successfully!')

    const productAfter = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      })
    ).json()
    const stockAfter = Number(productAfter[0].estoque)

    expect(stockAfter).toEqual(stockBefore + 1)

    const deletedOrderResponse = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${createorder.order_id}`,
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )

    expect(deletedOrderResponse.status).toBe(404)
  })

  test('DELETE a non-existent order', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=99999999',
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test("DELETE order — a regular user cannot delete another user's order", async () => {
    const email2 = `deleteother${Date.now()}@gmail.com`
    const user2 = await createuser.fakeuser.user(
      email2,
      'usuario para exclusao',
      '1234Rnads'
    )
    const tokenUser2 = user2[1].token

    const createResponse = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser2}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })
    expect(createResponse.status).toBe(201)
    const created = await createResponse.json()

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.order_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test("DELETE order — an admin can delete any user's order and restore stock", async () => {
    const createResponse = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })
    expect(createResponse.status).toBe(201)
    const created = await createResponse.json()

    const productBefore = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` },
      })
    ).json()
    const stockBefore = Number(productBefore[0].estoque)

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.order_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const respbody = await response.json()

    expect(response.status).toBe(200)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('order deleted successfully!')

    const productAfter = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` },
      })
    ).json()
    const stockAfter = Number(productAfter[0].estoque)

    expect(stockAfter).toEqual(stockBefore + 1)

    const deletedOrderResponse = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.order_id}`,
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )

    expect(deletedOrderResponse.status).toBe(404)
  })

  test('DELETE a non-existent order as an admin', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=99999999',
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test('DELETE order with invalid token', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=1',
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer tiktok` },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toEqual('Invalid token')
  })

  test('DELETE order without token', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=1',
      { method: 'DELETE' }
    )

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toEqual('Token is missing')
  })

  test('DELETE order without an order_id query parameter', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenUser}` },
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('id is required!')
  })
})

describe('Unsupported methods', () => {
  test('returns 405 for the PATCH method', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    })

    expect(response.status).toBe(405)
  })
})
