import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests'
let tokenUser = 0
let tokenAdmin = 0

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
})
describe('POST api/v1/marcas', () => {
  test('POST create brand happy path', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `Brand created at ${Date.now()}`,
      }),
    })

    let respbody = await response.json()
    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(201)
  })
})

describe('GET api/v1/marcas', () => {
  test('GET all brands', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
    })

    let respbody = await response.json()
    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(200)
    expect(respbody.length).toBeGreaterThanOrEqual(0)
  })
  test('GET all brand whithout token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let respbody = await response.json()
    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Token is missing')
  })

  test('GET all brand with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'GET',
      headers: {
        Authorization: `Bearer teste145322`,

        'Content-Type': 'application/json',
      },
    })

    let respbody = await response.json()
    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Invalid token')
  })
})
