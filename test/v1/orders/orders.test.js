import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests'
import path from 'path'
import fs from 'fs'
import { generateTestKey } from 'test/hooks/file/testkey/generateTestKey'

const imagePath = path.join(
  __dirname,
  '..',
  'products',
  'image-upload-test',
  'files',
  'foto.jpg'
)
let tokenUser = 0
let tokenAdmin = 0
let categoryId = ''
let markId = ''
let productId = ''
let productWithLowStockId = ''

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  const email = `teste${Date.now()}@gmail.com`
  const user = await createuser.fakeuser.user(email, 'renan', 'Abcdef12!')

  const emailadmin = `testadmin${Date.now()}@gmail.com`
  await userRoleAdmin('renanadmin', emailadmin, 'AdminPass!23')
  const setcookieadmin = await fetch('http://localhost:3000/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: `${emailadmin}`,
      senha: 'AdminPass!23',
    }),
  })
  const cookieuser = user[2].headers.getSetCookie()
  tokenUser = cookieuser[0]

  const cookieadmin = setcookieadmin.headers.getSetCookie()
  tokenAdmin = cookieadmin[0]

  const categoryName = `catego${Date.now()}`
  const categoryCreate = await fetch(
    'http://localhost:3000/api/v1/categorias',
    {
      method: 'POST',
      headers: {
        cookie: `${tokenAdmin}`,
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
    { headers: { cookie: `${tokenAdmin}` } }
  )
  const categoryBody = await categoryResp.json()
  if (categoryBody.data.length === 0) {
    throw new Error(
      `Category lookup failed: ${categoryResp.status} ${JSON.stringify(categoryBody)}`
    )
  }
  categoryId = categoryBody.data[0].id

  const markName = `marca${Date.now()}`
  const markCreate = await fetch('http://localhost:3000/api/v1/marcas', {
    method: 'POST',
    headers: {
      cookie: `${tokenAdmin}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome: markName }),
  })
  if (markCreate.status !== 201) {
    throw new Error(`Brand setup failed: ${markCreate.status}`)
  }
  const markResp = await fetch(
    `http://localhost:3000/api/v1/marcas?nome=${encodeURIComponent(markName)}`,
    { headers: { cookie: `${tokenAdmin}` } }
  )
  const markBody = await markResp.json()
  if (markBody.data[0].length === 0) {
    throw new Error(
      `Brand lookup failed: ${markResp.status} ${JSON.stringify(markBody)}`
    )
  }
  markId = markBody.data[0].id
  const fakeproviderToken = await generateTestKey('fake')
  const productName = `produto${Date.now()}`
  const productCreate = await fetch('http://localhost:3000/api/v1/produtos', {
    method: 'POST',
    headers: {
      cookie: `${tokenAdmin}`,
      'x-test-provider': fakeproviderToken, // se esse arquivo também usa esse header — confirma se você já tem essa variável aqui
    },
    body: (() => {
      const formData = new FormData()
      formData.append('name', productName)
      formData.append('price', '50')
      formData.append('stock', '100')
      formData.append('categoryId', String(categoryId))
      formData.append('markId', String(markId))
      formData.append('desc', 'produto pra teste de pedido')
      formData.append(
        'image',
        new Blob([fs.readFileSync(imagePath)], { type: 'image/jpeg' }),
        'foto.jpg'
      )
      return formData
    })(),
  })
  if (productCreate.status !== 201) {
    const body = await productCreate.json()
    throw new Error(
      `Product setup failed: ${productCreate.status} ${JSON.stringify(body)}`
    )
  }
  const allProducts = await (
    await fetch('http://localhost:3000/api/v1/produtos', {
      headers: { cookie: `${tokenAdmin}` },
    })
  ).json()
  const foundProduct = allProducts.data.find((p) => p.nome === productName)
  if (!foundProduct) {
    throw new Error(`Created product not found in listing: ${productName}`)
  }
  productId = foundProduct.id

  const lowStockName = `prlowstock${Date.now()}`
  const lowStockCreate = await fetch('http://localhost:3000/api/v1/produtos', {
    method: 'POST',
    headers: {
      cookie: `${tokenAdmin}`,
      'x-test-provider': fakeproviderToken, // se esse arquivo também usa esse header — confirma se você já tem essa variável aqui
    },
    body: (() => {
      const formData = new FormData()
      formData.append('name', lowStockName)
      formData.append('price', '50')
      formData.append('stock', '1')
      formData.append('categoryId', String(categoryId))
      formData.append('markId', String(markId))
      formData.append('desc', 'produto pra teste de pedido')
      formData.append(
        'image',
        new Blob([fs.readFileSync(imagePath)], { type: 'image/jpeg' }),
        'foto.jpg'
      )
      return formData
    })(),
  })
  if (lowStockCreate.status !== 201) {
    const body = await lowStockCreate.json()
    throw new Error(
      `Low-stock product setup failed: ${lowStockCreate.status} ${JSON.stringify(body)}`
    )
  }
  const allProducts2 = await (
    await fetch('http://localhost:3000/api/v1/produtos', {
      headers: { cookie: `${tokenAdmin}` },
    })
  ).json()
  const foundLowStock = allProducts2.data.find((p) => p.nome === lowStockName)
  if (!foundLowStock) {
    throw new Error(`Low-stock product not found in listing: ${lowStockName}`)
  }
  productWithLowStockId = foundLowStock.id
})

async function createOrder(token, produtoId, quantidade = 1) {
  const response = await fetch('http://localhost:3000/api/v1/pedidos', {
    method: 'POST',
    headers: {
      cookie: `${token}`,
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

  return body.data[0].order_id
}

describe('POST /api/v1/pedidos', () => {
  test('POST create order happy path', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
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
    expect(respbody.data[0].order_id).toBeDefined()

    const orderResponse = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${respbody.data[0].order_id}`,
      { headers: { cookie: `${tokenUser}` } }
    )
    const order = await orderResponse.json()

    expect(orderResponse.status).toBe(200)
    expect(order.data[0].pedido_id).toBe(respbody.data[0].order_id)
  })

  test('POST create order actually decreases stock', async () => {
    const productBefore = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { cookie: `${tokenUser}` },
      })
    ).json()
    const stockBefore = productBefore.data[0].estoque

    const orderResponse = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 3 }],
      }),
    })

    const orderBody = await orderResponse.json()
    expect(orderResponse.status).toBe(201)
    expect(orderBody.data[0].order_id).toBeDefined()

    const productAfter = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { cookie: `${tokenUser}` },
      })
    ).json()
    const stockAfter = productAfter.data[0].estoque

    expect(Number(stockAfter)).toEqual(Number(stockBefore) - 3)
  })

  test('POST create order without items', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error.details).toEqual([
      { field: 'items', message: 'items is required!' },
    ])
  })

  test('POST create order with empty items array', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: [] }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error.details).toEqual([
      { field: 'items', message: 'Order must have at least one item' },
    ])
  })

  test('POST create order with invalid produto_id', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: 'abc', quantidade: 1 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error.details).toEqual([
      {
        field: 'items.0.produto_id',
        message: 'Invalid input: expected number, received NaN',
      },
    ])
  })

  test('POST create order with zero quantity', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 0 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error.details).toEqual([
      {
        field: 'items.0.quantidade',
        message: 'quantidade must be a positive integer',
      },
    ])
  })

  test('POST create order with negative quantity', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: -5 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error.details).toEqual([
      {
        field: 'items.0.quantidade',
        message: 'quantidade must be a positive integer',
      },
    ])
  })

  test('POST create order with duplicate product IDs', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
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
    expect(respbody.error.details).toEqual([
      { field: 'items', message: 'Duplicate produto_id in the same order' },
    ])
  })

  test('POST create order with insufficient stock', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productWithLowStockId, quantidade: 999 }],
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(409)
    expect(respbody.error).toBeDefined()
    expect(respbody.error.details).toEqual([
      {
        field: 'produto_id',
        message: expect.stringContaining('Insufficient stock for product'),
      },
    ])
  })

  test('POST create order with non-existent produto_id', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: 99999999, quantidade: 1 }],
      }),
    })

    let respbody = await response.json()
    expect(respbody.error).toBeDefined()

    expect(response.status).toBe(404)
  })

  test('POST order with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `token=teste145322`,
        'Content-Type': 'application/json',
      },
    })

    let respbody = await response.json()
    expect(response.status).toBe(401)
    expect(respbody.error.code).toEqual('UNAUTHORIZED')
    expect(respbody.error.details).toEqual([
      { field: 'token', message: 'invalid token' },
    ])
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
    expect(respbody.error.code).toEqual('UNAUTHORIZED')
    expect(respbody.error.details).toEqual([
      { field: 'token', message: 'token is missing' },
    ])
  })
})

describe('GET /api/v1/pedidos', () => {
  test('GET all orders of the logged user', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      headers: { cookie: `${tokenUser}` },
    })

    let respbody = await response.json()

    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(200)
    expect(Array.isArray(respbody.data)).toBe(true)
  })

  test('GET all orders as admin returns orders from all users', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      headers: { cookie: `${tokenAdmin}` },
    })

    let respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody.data)).toBe(true)
  })

  test('GET all orders without token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos')

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error.code).toEqual('UNAUTHORIZED')
    expect(respbody.error.details).toEqual([
      { field: 'token', message: 'token is missing' },
    ])
  })

  test('GET all orders with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      headers: { cookie: `token=teste145322` },
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error.code).toEqual('UNAUTHORIZED')
    expect(respbody.error.details).toEqual([
      { field: 'token', message: 'invalid token' },
    ])
  })

  test('GET order by id happy path', async () => {
    const orderId = await createOrder(tokenUser, productId)

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${orderId}`,
      { headers: { cookie: `${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody.data)).toBe(true)
    expect(respbody.data[0].pedido_id).toEqual(orderId)
  })

  test('GET order by id that does not exist', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=99999999',
      { headers: { cookie: `${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test("GET order by ID — admin can view any user's order", async () => {
    const orderId = await createOrder(tokenUser, productId)
    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${encodeURIComponent(orderId)}`,
      { headers: { cookie: `${tokenAdmin}` } }
    )

    const respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody.data)).toBe(true)
    expect(respbody.data[0].pedido_id).toEqual(orderId)
  })

  test("GET order by id — A regular user cannot see another regular user's order.", async () => {
    const email2 = `teste2${Date.now()}@gmail.com`
    const user2 = await createuser.fakeuser.user(
      email2,
      'outrorenan',
      'Abcdef12!'
    )
    const cookieuser = user2[2].headers.getSetCookie()
    const tokenUser2 = cookieuser[0]

    const createResp = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser2}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })
    expect(createResp.status).toBe(201)
    const created = await createResp.json()

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.data[0].order_id}`,
      { headers: { cookie: `${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test("GET order by ID — a regular user cannot view an order using another user's ID, even if the order was created by the admin.", async () => {
    const createResp = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })
    expect(createResp.status).toBe(201)
    const created = await createResp.json()

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.data[0].order_id}`,
      { headers: { cookie: `${tokenUser}` } }
    )

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test('GET order by id with invalid format', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=abc123',
      { headers: { cookie: `${tokenUser}` } }
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

    console.dir(respbody, { depth: null })
  })
})

describe('DELETE /api/v1/pedidos', () => {
  test('DELETE order successfully restores stock', async () => {
    const createorderResponse = await fetch(
      'http://localhost:3000/api/v1/pedidos',
      {
        method: 'POST',
        headers: {
          cookie: `${tokenUser}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ produto_id: productId, quantidade: 1 }],
        }),
      }
    )
    expect(createorderResponse.status).toBe(201)
    const createorder = await createorderResponse.json()
    expect(createorder.data[0].order_id).toBeDefined()

    const productBefore = await (
      await fetch(`http://localhost:3000/api/v1/produtos?id=${productId}`, {
        headers: { cookie: `${tokenUser}` },
      })
    ).json()
    const stockBefore = Number(productBefore.data[0].estoque)

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${createorder.data[0].order_id}`,
      {
        method: 'DELETE',
        headers: {
          cookie: `${tokenUser}`,
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
        headers: { cookie: `${tokenUser}` },
      })
    ).json()
    const stockAfter = Number(productAfter.data[0].estoque)

    expect(stockAfter).toEqual(stockBefore + 1)

    const deletedOrderResponse = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${createorder.data[0].order_id}`,
      { headers: { cookie: `${tokenUser}` } }
    )

    expect(deletedOrderResponse.status).toBe(404)
  })

  test('DELETE a non-existent order', async () => {
    const idnonexist = 999999
    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${encodeURIComponent(idnonexist)}`,
      {
        method: 'DELETE',
        headers: {
          cookie: `${tokenUser}`,
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
      'Abcdef12!'
    )
    const cookieuser = user2[2].headers.getSetCookie()
    const tokenUser2 = cookieuser[0]

    const createResponse = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'POST',
      headers: {
        cookie: `${tokenUser2}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ produto_id: productId, quantidade: 1 }],
      }),
    })
    expect(createResponse.status).toBe(201)
    const created = await createResponse.json()

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.data[0].order_id}`,
      {
        method: 'DELETE',
        headers: {
          cookie: `${tokenUser}`,
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
        cookie: `${tokenUser}`,
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
        headers: { cookie: `${tokenAdmin}` },
      })
    ).json()
    const stockBefore = Number(productBefore.data[0].estoque)

    const response = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.data[0].order_id}`,
      {
        method: 'DELETE',
        headers: {
          cookie: `${tokenAdmin}`,
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
        headers: { cookie: `${tokenAdmin}` },
      })
    ).json()
    const stockAfter = Number(productAfter.data[0].estoque)

    expect(stockAfter).toEqual(stockBefore + 1)

    const deletedOrderResponse = await fetch(
      `http://localhost:3000/api/v1/pedidos?order_id=${created.data[0].order_id}`,
      { headers: { cookie: `${tokenUser}` } }
    )

    expect(deletedOrderResponse.status).toBe(404)
  })

  test('DELETE a non-existent order as an admin', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=99999999',
      {
        method: 'DELETE',
        headers: {
          cookie: `${tokenAdmin}`,
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
        headers: { cookie: `token=tiktok` },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error.code).toEqual('UNAUTHORIZED')
    expect(respbody.error.details).toEqual([
      { field: 'token', message: 'invalid token' },
    ])
  })

  test('DELETE order without token', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/pedidos?order_id=1',
      { method: 'DELETE' }
    )

    let respbody = await response.json()
    expect(response.status).toBe(401)
    expect(respbody.error.code).toEqual('UNAUTHORIZED')
    expect(respbody.error.details).toEqual([
      { field: 'token', message: 'token is missing' },
    ])
  })

  test('DELETE order without an order_id query parameter', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'DELETE',
      headers: { cookie: `${tokenUser}` },
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error.details).toEqual([
      {
        field: 'orderId',
        message: 'Invalid input: expected number, received NaN',
      },
    ])
  })
})

describe('Unsupported methods', () => {
  test('returns 405 for the PATCH method', async () => {
    const response = await fetch('http://localhost:3000/api/v1/pedidos', {
      method: 'PATCH',
      headers: { cookie: `${tokenAdmin}` },
    })

    expect(response.status).toBe(405)
  })
})
