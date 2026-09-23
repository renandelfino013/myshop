import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import fs from 'fs'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests.js'
import path from 'path'

import { createProduct } from 'test/hooks/file/helper-create-product-file'

const apiUrl = 'http://localhost:3000/api/v1'

let tokenUser
let tokenAdmin
let categoryId
let markId
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let productId = 0

const headers = (token) => ({
  cookie: `${token}`,
})

async function createRelatedResource(path, body) {
  const response = await fetch(`${apiUrl}/${path}`, {
    method: 'POST',
    headers: {
      cookie: `${tokenAdmin}`,

      'Content-Type': 'application/json',
    },
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

  const categoryName = `Category ${Date.now()}`
  const markName = `Brand ${Date.now()}`
  await createRelatedResource('categorias', { nome: categoryName })
  await createRelatedResource('marcas', { nome: markName })

  const categoryResponse = await fetch(
    `${apiUrl}/categorias?nome=${encodeURIComponent(categoryName)}`,
    { headers: headers(tokenAdmin) }
  )
  const brandResponse = await fetch(
    `${apiUrl}/marcas?nome=${encodeURIComponent(markName)}`,
    { headers: headers(tokenAdmin) }
  )
  const brandbody = await brandResponse.json()
  const categorybody = await categoryResponse.json()
  categoryId = categorybody.data[0].id
  markId = brandbody.data[0].id

  const productName = `Fixture product ${Date.now()}`
  const formData = new FormData()
  formData.append('name', productName)
  formData.append('price', '299.90')
  formData.append('stock', '15')
  formData.append('categoryId', String(categoryId))
  formData.append('markId', String(markId))
  formData.append('desc', 'Tênis de corrida')
  formData.append(
    'image',
    new Blob([fs.readFileSync(path.join(__dirname, 'files', 'foto.jpg'))], {
      type: 'image/jpeg',
    }),
    'teste.jpg'
  )
  const productResponse = await fetch(`${apiUrl}/produtos`, {
    method: 'POST',
    headers: {
      cookie: `${tokenAdmin}`,
    },
    body: formData,
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
  productId = products.data.find((product) => product.nome === productName).id
})
describe('PUT and POST Happy path', () => {
  test('POST image upload test', async () => {
    const formData = new FormData()
    formData.append('name', `Tênis Nike ${Date.now()}`)
    formData.append('price', '299.90')
    formData.append('stock', '15')
    formData.append('categoryId', String(categoryId))
    formData.append('markId', String(markId))
    formData.append('desc', 'Tênis de corrida')
    formData.append(
      'image',
      new Blob([fs.readFileSync(path.join(__dirname, 'files', 'foto.jpg'))], {
        type: 'image/jpeg',
      })
    )

    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: {
        cookie: `${tokenAdmin}`,
      },
      body: formData,
    })

    const body = await response.json()
    if (response.status !== 201) console.error(body)
    expect(response.status).toBe(201)
    expect(body.success).toBe(true)
  })

  test('PUT without new image keep the old', async () => {
    const productName = `product img ${Date.now()}`

    const created = await createProduct({
      token: tokenAdmin,
      name: productName,
      categoryId,
      markId,
      imagePath: path.join(__dirname, 'files', 'foto.jpg'),
    })
    expect(created.status).toBe(201)

    const listResponse = await fetch(`${apiUrl}/produtos`, {
      headers: { cookie: `${tokenAdmin}` },
    })
    const list = await listResponse.json()
    const product = list.data.find((p) => p.nome === productName)

    expect(product).toBeDefined()
    const originalImageUrl = product.image

    const formData = new FormData()
    formData.append('newname', `zé do butao${Date.now()}`)
    formData.append('price', '350.00')
    formData.append('stock', '20')
    formData.append('categoryId', categoryId)
    formData.append('markId', markId)
    formData.append('desc', product.descricao)
    formData.append('productId', product.id)

    const putResponse = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: { cookie: `${tokenAdmin}` },
      body: formData,
    })
    const body = await putResponse.json()
    if (putResponse.status !== 200) console.dir(body, { depth: null })
    const afterResponse = await fetch(`${apiUrl}/produtos?id=${product.id}`, {
      headers: { cookie: `${tokenAdmin}` },
    })
    expect(putResponse.status).toBe(200)
    const after = await afterResponse.json()
    expect(after.data[0].image).toBe(originalImageUrl)
  })
  test('PUT Happy path', async () => {
    const productName = `Produto imagem ${Date.now()}`

    const created = await createProduct({
      token: tokenAdmin,
      name: productName,
      categoryId,
      markId,
      imagePath: path.join(__dirname, 'files', 'foto.jpg'),
    })
    expect(created.status).toBe(201)

    const listResponse = await fetch(`${apiUrl}/produtos`, {
      headers: { cookie: `${tokenAdmin}` },
    })
    const list = await listResponse.json()
    const product = list.data.find((p) => p.nome === productName)

    expect(product).toBeDefined()
    const originalImageUrl = product.image

    const formData = new FormData()
    formData.append('newname', `zé do butao${Date.now()}`)
    formData.append('price', '350.00')
    formData.append('stock', '20')
    formData.append('categoryId', categoryId)
    formData.append('markId', markId)
    formData.append('desc', product.descricao)
    formData.append('productId', product.id)
    const imagepath = path.join(__dirname, 'files', 'foto.jpg')

    formData.append(
      'image',
      new Blob([fs.readFileSync(imagepath)], { type: 'image/jpeg' }),
      'foto.jpg'
    )

    const putResponse = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: { cookie: `${tokenAdmin}` },
      body: formData,
    })
    const body = await putResponse.json()
    if (putResponse.status !== 200) console.dir(body, { depth: null })
    const afterResponse = await fetch(`${apiUrl}/produtos?id=${product.id}`, {
      headers: { cookie: `${tokenAdmin}` },
    })
    expect(putResponse.status).toBe(200)
    const after = await afterResponse.json()
    expect(after.data[0].image).not.toBe(originalImageUrl)
  })
})
describe('PUT and POST invalid files', () => {
  test('POST with invalid file', async () => {
    const productName = `teste${Date.now()}`

    const created = await createProduct({
      token: tokenAdmin,
      name: productName,
      categoryId,
      markId,
      imagePath: path.join(__dirname, 'files', 'teste.pdf'),
    })
    expect(created.status).toBe(415)
    expect(created.body).toMatchObject({
      success: expect.any(Boolean),
      error: {
        code: expect.any(String),
        details: expect.any(Array),
      },
    })
  })
  test('PUT with invalid file and fake mimetype', async () => {
    const productName = `teste${Date.now()}`

    const created = await createProduct({
      token: tokenAdmin,
      name: productName,
      categoryId,
      markId,
      imagePath: path.join(__dirname, 'files', 'foto.jpg'),
    })
    expect(created.status).toBe(201)

    const listResponse = await fetch(`${apiUrl}/produtos`, {
      headers: { cookie: `${tokenAdmin}` },
    })
    const list = await listResponse.json()
    const product = list.data.find((p) => p.nome === productName)

    const formData = new FormData()
    formData.append('newname', `zé do butao${Date.now()}`)
    formData.append('price', '350.00')
    formData.append('stock', '20')
    formData.append('categoryId', categoryId)
    formData.append('markId', markId)
    formData.append('desc', product.descricao)
    formData.append('productId', product.id)
    const imagepath = path.join(__dirname, 'files', 'teste.pdf')

    formData.append(
      'image',
      new Blob([fs.readFileSync(imagepath)], { type: 'image/jpeg' }),
      'teste.pdf'
    )
    const putResponse = await fetch(`${apiUrl}/produtos`, {
      method: 'PUT',
      headers: { cookie: `${tokenAdmin}` },
      body: formData,
    })
    const body = await putResponse.json()
    expect(putResponse.status).toBe(415)
    if (putResponse.status !== 200) console.dir(body, { depth: null })
  })
})
describe('POST without file', () => {
  test('POST without file return 415', async () => {
    const productName = `testWithoutFile${Date.now()}`
    const created = await createProduct({
      token: tokenAdmin,
      name: productName,
      categoryId,
      markId,
    })
    expect(created.status).toBe(415)
  })
})
describe('POST with file bigger than 5mb', () => {
  test('POST with image bigger than 5mb returns 400', async () => {
    const formData = new FormData()
    formData.append('name', `Tênis Nike ${Date.now()}`)
    formData.append('price', '299.90')
    formData.append('stock', '15')
    formData.append('categoryId', String(categoryId))
    formData.append('markId', String(markId))
    formData.append('desc', 'Tênis de corrida')
    formData.append(
      'image',
      new Blob(
        [fs.readFileSync(path.join(__dirname, 'files', 'foto-grande.jpg'))],
        {
          type: 'image/jpeg',
        }
      )
    )

    const response = await fetch(`${apiUrl}/produtos`, {
      method: 'POST',
      headers: {
        cookie: `${tokenAdmin}`,
      },
      body: formData,
    })
    const body = await response.json()
    if (response.status !== 200) console.dir(body, { depth: null })
    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
  })
})
