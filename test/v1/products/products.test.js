import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests.js'

const apiUrl = 'http://localhost:3000/api/v1'
let tokenUser
let tokenAdmin
let categoryId
let markId
let productId

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
})

async function createRelatedResource(path, body) {
  const response = await fetch(`${apiUrl}/${path}`, {
    method: 'POST',
    headers: headers(tokenAdmin),
    body: JSON.stringify(body),
  })
  if (response.status !== 201) {
    throw new Error(`Failed to create ${path}: ${response.status}`)
  }
}

beforeAll(async () => {
  await orchestrator.waitForAllServices()

  const user = await createuser.fakeuser.user(
    `product-user-${Date.now()}@gmail.com`,
    'product user',
    'Abcdef12!'
  )
  tokenUser = user[1].token
  tokenAdmin = await userRoleAdmin(
    'product admin',
    `product-admin-${Date.now()}@gmail.com`,
    'AdminPass!23'
  )

  const categoryName = `Category ${Date.now()}`
  const markName = `Brand ${Date.now()}`
  await createRelatedResource('categorias', { nome: categoryName })
  await createRelatedResource('marcas', { nome: markName })

  const categoryResponse = await fetch(
    `${apiUrl}/categorias?nome=${encodeURIComponent(categoryName)}`,
    { headers: headers(tokenUser) }
  )
  const brandResponse = await fetch(
    `${apiUrl}/marcas?nome=${encodeURIComponent(markName)}`,
    { headers: headers(tokenUser) }
  )
  categoryId = (await categoryResponse.json())[0].id
  markId = (await brandResponse.json())[0].id

  const productName = `Fixture product ${Date.now()}`
  const productResponse = await fetch(`${apiUrl}/produtos`, {
    method: 'POST',
    headers: headers(tokenAdmin),
    body: JSON.stringify({
      name: productName,
      price: 19.9,
      stock: 10,
      categoryId,
      markId,
      desc: 'Fixture product description',
    }),
  })
  if (productResponse.status !== 201) {
    const errorBody = await productResponse.json().catch(() => null)
    throw new Error(
      `Failed to create product: ${productResponse.status} - ${JSON.stringify(errorBody)}`
    )
  }

  const productsResponse = await fetch(`${apiUrl}/produtos`, {
    headers: headers(tokenUser),
  })
  const products = await productsResponse.json()
  productId = products.find((product) => product.nome === productName).id
})

describe('GET api/v1/produtos', () => {
  test('GET all products', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      headers: headers(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
  })

  test('GET product by id', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`, {
      headers: headers(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body[0].id).toBe(productId)
  })

  test('GET product that does not exist', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=99999999`, {
      headers: headers(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toBe('Product not found!')
  })

  test('GET without token', async () => {
    const response = await fetch(`${apiUrl}/produtos`)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Unauthorized')
    expect(body.message).toBe('Token is missing')
  })

  test('GET with invalid token', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      headers: headers('invalid-product-token'),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({ error: 'Unauthorized', message: 'Invalid token' })
  })

  test('GET by id without token', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Unauthorized')
  })
})

describe('POST api/v1/produtos', () => {
  const validProduct = () => ({
    name: `Product ${Date.now()}-${Math.random()}`,
    price: 19.9,
    stock: 10,
    categoryId,
    markId,
    desc: 'Product description',
  })

  test('POST creates a product', async () => {
    const product = validProduct()
    const name = product.name
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: headers(tokenAdmin),
      body: JSON.stringify(product),
    })
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body).toEqual({
      success: true,
      message: 'Product created successfully',
    })

    const listResponse = await fetch(`${apiUrl}/produtos`, {
      headers: headers(tokenUser),
    })
    const products = await listResponse.json()
    productId = products.find((product) => product.nome === name).id
  })

  test.each([
    ['missing name', { name: undefined }],
    ['missing price', { price: undefined }],
    ['missing stock', { stock: undefined }],
    ['missing category', { categoryId: undefined }],
    ['missing mark', { markId: undefined }],
    ['zero price', { price: 0 }],
    ['negative price', { price: -1 }],
    ['zero stock', { stock: 0 }],
    ['negative stock', { stock: -1 }],
    ['name too short', { name: 'abc' }],
    ['invalid price precision', { price: 19.999 }],
    ['decimal stock', { stock: 1.5 }],
    ['decimal category', { categoryId: 1.5 }],
    ['decimal mark', { markId: 1.5 }],
  ])('POST rejects %s', async (_scenario, invalidFields) => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: headers(tokenAdmin),
      body: JSON.stringify({ ...validProduct(), ...invalidFields }),
    })

    expect(response.status).toBe(400)
  })

  test('POST rejects an unknown category', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: headers(tokenAdmin),
      body: JSON.stringify({ ...validProduct(), categoryId: 99999999 }),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('Invalid category or mark')
  })

  test('POST rejects an unknown mark', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: headers(tokenAdmin),
      body: JSON.stringify({ ...validProduct(), markId: 99999999 }),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('Invalid category or mark')
  })

  test('POST with user token is forbidden', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: headers(tokenUser),
      body: JSON.stringify({
        name: 'Forbidden product',
        price: 19.9,
        stock: 10,
        categoryId,
        markId,
        desc: 'Product description',
      }),
    })
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.error).toBe('User does not have permission to create')
  })

  test('POST without token is unauthorized', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validProduct()),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.message).toBe('Token is missing')
  })
})

describe('PUT api/v1/produtos', () => {
  test('PUT updates a product', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: headers(tokenAdmin),
      body: JSON.stringify({
        productid: productId,
        newname: `Updated product ${Date.now()}`,
        price: 29.9,
        stock: 8,
        categoryId,
        markId,
        desc: 'Updated description',
      }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      message: 'Product updated successfully',
    })
  })

  test('PUT for a missing product returns not found', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: headers(tokenAdmin),
      body: JSON.stringify({
        productid: 99999999,
        newname: 'Missing product',
        price: 29.9,
        stock: 8,
        categoryId,
        markId,
        desc: 'Updated description',
      }),
    })

    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toBe('Product not found!')
  })

  test.each([
    ['invalid price', { price: 10.999 }],
    ['invalid stock', { stock: 0 }],
    ['invalid name', { newname: 'bad' }],
    ['missing category', { categoryId: undefined }],
  ])('PUT rejects %s', async (_scenario, invalidFields) => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: headers(tokenAdmin),
      body: JSON.stringify({
        productid: productId,
        newname: `Updated valid product ${Date.now()}`,
        price: 29.9,
        stock: 8,
        categoryId,
        markId,
        desc: 'Updated description',
        ...invalidFields,
      }),
    })

    expect(response.status).toBe(400)
  })

  test('PUT with user token is forbidden', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: headers(tokenUser),
      body: JSON.stringify({
        productid: productId,
        newname: 'Forbidden update',
        price: 29.9,
        stock: 8,
        categoryId,
        markId,
        desc: 'Updated description',
      }),
    })
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.error).toBe('User does not have permission to modify')
  })

  test('PUT without token is unauthorized', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productid: productId }),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.message).toBe('Token is missing')
  })
})

describe('DELETE api/v1/produtos', () => {
  test('DELETE removes a product', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`, {
      method: 'DELETE',
      headers: headers(tokenAdmin),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      message: 'Product deleted successfully',
    })
  })

  test('DELETE without id returns validation error', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'DELETE',
      headers: headers(tokenAdmin),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('id is required')
  })

  test('DELETE accepts the id in the request body', async () => {
    const product = `Delete body product ${Date.now()}`
    const createResponse = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: headers(tokenAdmin),
      body: JSON.stringify({
        name: product,
        price: 9.9,
        stock: 1,
        categoryId,
        markId,
        desc: 'Product to delete',
      }),
    })
    expect(createResponse.status).toBe(201)

    const productsResponse = await fetch(`${apiUrl}/produtos`, {
      headers: headers(tokenUser),
    })
    const products = await productsResponse.json()
    const bodyProductId = products.find((item) => item.nome === product).id

    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'DELETE',
      headers: headers(tokenAdmin),
      body: JSON.stringify({ id: bodyProductId }),
    })

    expect(response.status).toBe(200)
  })

  test('DELETE for a missing product returns not found', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=99999999`, {
      method: 'DELETE',
      headers: headers(tokenAdmin),
    })
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toBe('Product not found!')
  })

  test('DELETE with user token is forbidden', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=99999999`, {
      method: 'DELETE',
      headers: headers(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.error).toBe('User does not have permission to delete')
  })

  test('DELETE without token is unauthorized', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`, {
      method: 'DELETE',
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.message).toBe('Token is missing')
  })
})

describe('Unsupported methods api/v1/produtos', () => {
  test('PATCH returns method not allowed', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PATCH',
      headers: headers(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(405)
    expect(body.error).toBe('Method Not Allowed')
  })
})
