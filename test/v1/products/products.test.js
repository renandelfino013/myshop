import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests.js'
import { generateTestKey } from 'test/hooks/file/testkey/generateTestKey'
import fs from 'fs'
import path from 'path'

const apiUrl = 'http://localhost:3000/api/v1'
let tokenUser
let tokenAdmin
let categoryId
let markId
let productId
let fakeproviderToken
const defaultImagePath = path.join(
  __dirname,
  'image-upload-test',
  'files',
  'foto.jpg'
)

const jsonHeaders = (token) => ({
  cookie: `${token}`,
  'Content-Type': 'application/json',
  'x-test-provider': fakeproviderToken,
})

const formHeaders = (token) => ({
  cookie: `${token}`,
  'x-test-provider': fakeproviderToken,
})

function buildProductFormData(
  fields,
  {
    imagePath = defaultImagePath,
    imageFilename = 'foto.jpg',
    imageMimeType = 'image/jpeg',
  } = {}
) {
  const formData = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  if (imagePath) {
    formData.append(
      'image',
      new Blob([fs.readFileSync(imagePath)], { type: imageMimeType }),
      imageFilename
    )
  }
  return formData
}

async function createRelatedResource(path, body) {
  const response = await fetch(`${apiUrl}/${path}`, {
    method: 'POST',
    headers: jsonHeaders(tokenAdmin),
    body: JSON.stringify(body),
  })
  if (response.status !== 201) {
    throw new Error(`Failed to create ${path}: ${response.status}`)
  }
}

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
  fakeproviderToken = await generateTestKey('fake')

  const categoryName = `Category ${Date.now()}`
  const markName = `Brand ${Date.now()}`
  await createRelatedResource('categorias', { nome: categoryName })
  await createRelatedResource('marcas', { nome: markName })

  const categoryResponse = await fetch(
    `${apiUrl}/categorias?nome=${encodeURIComponent(categoryName)}`,
    { headers: jsonHeaders(tokenUser) }
  )
  const brandResponse = await fetch(
    `${apiUrl}/marcas?nome=${encodeURIComponent(markName)}`,
    { headers: jsonHeaders(tokenUser) }
  )
  const brandbody = await brandResponse.json()
  const categorybody = await categoryResponse.json()
  categoryId = categorybody.data[0].id
  markId = brandbody.data[0].id

  const productName = `Fixture product ${Date.now()}`
  const productResponse = await fetch(`${apiUrl}/produtos`, {
    method: 'POST',
    headers: formHeaders(tokenAdmin),
    body: buildProductFormData({
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
    headers: jsonHeaders(tokenUser),
  })
  const products = await productsResponse.json()
  productId = products.data.find((product) => product.nome === productName).id
})

describe('GET api/v1/produtos', () => {
  test('GET all products', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      headers: { 'x-test-provider': fakeproviderToken },
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
  })

  test('GET product by id', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`, {
      headers: jsonHeaders(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data[0].id).toBe(productId)
  })

  test('GET product that does not exist', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=99999999`, {
      headers: jsonHeaders(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error.details[0].message).toBe('Product not found!')
    expect(body.error.details[0].field).toBe('product')
  })

  test('GET without token', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      headers: { 'x-test-provider': fakeproviderToken },
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
  })

  test('GET with invalid token', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      headers: jsonHeaders('token=invalid-product-token'),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBeDefined()
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(body.error.details[0].field).toBe('token')
    expect(body.error.details[0].message).toBe('invalid token')
  })

  test('GET by id without token', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`, {
      headers: { 'x-test-provider': fakeproviderToken },
    })
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
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
      headers: formHeaders(tokenAdmin),
      body: buildProductFormData(product),
    })
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body).toEqual({
      success: true,
      message: 'Product created successfully',
    })

    const listResponse = await fetch(`${apiUrl}/produtos`, {
      headers: jsonHeaders(tokenUser),
    })
    const products = await listResponse.json()
    productId = products.data.find((product) => product.nome === name).id
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
      headers: formHeaders(tokenAdmin),
      body: buildProductFormData({ ...validProduct(), ...invalidFields }),
    })

    expect(response.status).toBe(400)
  })

  test('POST rejects an unknown category', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: formHeaders(tokenAdmin),
      body: buildProductFormData({ ...validProduct(), categoryId: 99999999 }),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.details[0].field).toBe('category_id')
    expect(body.error.details[0].message).toBe('Invalid category')
    expect(body.error.details[1].field).toBe('marca_id')
    expect(body.error.details[1].message).toBe('Invalid mark')
  })

  test('POST rejects an unknown mark', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: formHeaders(tokenAdmin),
      body: buildProductFormData({ ...validProduct(), markId: 99999999 }),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.details[0].field).toBe('category_id')
    expect(body.error.details[0].message).toBe('Invalid category')
    expect(body.error.details[1].field).toBe('marca_id')
    expect(body.error.details[1].message).toBe('Invalid mark')
  })

  test('POST with user token is forbidden', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: formHeaders(tokenUser),
      body: buildProductFormData({
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
    expect(body.error.details).toEqual([
      { field: 'role', message: 'User does not have permission to create' },
    ])
  })

  test('POST without token is unauthorized', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: { 'x-test-provider': fakeproviderToken },
      body: buildProductFormData(validProduct()),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBeDefined()
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(body.error.details[0].field).toBe('token')
    expect(body.error.details[0].message).toBe('token is missing')
  })
})

describe('PUT api/v1/produtos', () => {
  test('PUT updates a product', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: formHeaders(tokenAdmin),
      body: buildProductFormData(
        {
          productId,
          newname: `Updated product ${Date.now()}`,
          price: 29.9,
          stock: 8,
          categoryId,
          markId,
          desc: 'Updated description',
        },
        { imagePath: null }
      ),
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
      headers: formHeaders(tokenAdmin),
      body: buildProductFormData(
        {
          productId: 99999999,
          newname: 'Missing product',
          price: 29.9,
          stock: 8,
          categoryId,
          markId,
          desc: 'Updated description',
        },
        { imagePath: null }
      ),
    })

    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error.details).toEqual([
      { field: 'product', message: 'Product not found!' },
    ])
  })

  test.each([
    ['invalid price', { price: 10.999 }],
    ['invalid stock', { stock: 0 }],
    ['invalid name', { newname: 'bad' }],
    ['missing category', { categoryId: undefined }],
  ])('PUT rejects %s', async (_scenario, invalidFields) => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: formHeaders(tokenAdmin),
      body: buildProductFormData(
        {
          productId,
          newname: `Updated valid product ${Date.now()}`,
          price: 29.9,
          stock: 8,
          categoryId,
          markId,
          desc: 'Updated description',
          ...invalidFields,
        },
        { imagePath: null }
      ),
    })

    expect(response.status).toBe(400)
  })

  test('PUT with user token is forbidden', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: formHeaders(tokenUser),
      body: buildProductFormData(
        {
          productId,
          newname: 'Forbidden update',
          price: 29.9,
          stock: 8,
          categoryId,
          markId,
          desc: 'Updated description',
        },
        { imagePath: null }
      ),
    })
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.error.details).toEqual([
      { field: 'role', message: 'User does not have permission to modify' },
    ])
  })

  test('PUT without token is unauthorized', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: { 'x-test-provider': fakeproviderToken },
      body: buildProductFormData({ productId }, { imagePath: null }),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBeDefined()
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(body.error.details[0].field).toBe('token')
    expect(body.error.details[0].message).toBe('token is missing')
  })
})

describe('DELETE api/v1/produtos', () => {
  test('DELETE removes a product', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`, {
      method: 'DELETE',
      headers: jsonHeaders(tokenAdmin),
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
      headers: jsonHeaders(tokenAdmin),
    })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.details).toEqual([
      {
        field: 'id',
        message: 'Invalid input: expected number, received NaN',
      },
    ])
  })

  test('DELETE for a missing product returns not found', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=99999999`, {
      method: 'DELETE',
      headers: jsonHeaders(tokenAdmin),
    })
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error.details).toEqual([
      { field: 'product', message: 'Product not found!' },
    ])
  })

  test('DELETE with user token is forbidden', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=99999999`, {
      method: 'DELETE',
      headers: jsonHeaders(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.error.details).toEqual([
      { field: 'role', message: 'User does not have permission to delete' },
    ])
  })

  test('DELETE without token is unauthorized', async () => {
    const response = await fetch(`${apiUrl}/produtos?id=${productId}`, {
      method: 'DELETE',
      headers: { 'x-test-provider': fakeproviderToken },
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBeDefined()
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(body.error.details[0].field).toBe('token')
    expect(body.error.details[0].message).toBe('token is missing')
  })
})

describe('Unsupported methods api/v1/produtos', () => {
  test('PATCH returns method not allowed', async () => {
    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'PATCH',
      headers: jsonHeaders(tokenUser),
    })
    const body = await response.json()

    expect(response.status).toBe(405)
    expect(body.error.code).toBe('METHOD_NOT_ALLOWED')
    expect(body.error.details).toEqual([
      { field: 'method', message: 'Method not allowed' },
    ])
  })
})
