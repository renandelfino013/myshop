import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests'
let tokenUser = 0
let tokenAdmin = 0
let namebrand = ''
let nameupdated = ''
beforeAll(async () => {
  await orchestrator.waitForAllServices()
  const email = `teste${Date.now()}@gmail.com`
  const user = await createuser.fakeuser.user(email, 'renan', 'Abcdef12!')
  const admin = await userRoleAdmin(
    'renanadmin',
    `teste2${Date.now()}@gmail.com`,
    'AdminPass!23'
  )
  tokenUser = user[1].token
  tokenAdmin = admin
})
describe('POST api/v1/marcas', () => {
  test('POST create brand happy path', async () => {
    let name = `Bránd ${Date.now()}`
    namebrand = name
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `${name}`,
      }),
    })

    let respbody = await response.json()
    if (respbody.error) {
      console.log(respbody)
    }
    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(201)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('Brand sucessfully created')
  })
  test('POST create with invalid name', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `${Date.now()}`,
      }),
    })

    let respbody = await response.json()
    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(400)
  })
  test('POST with user token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `bra${Date.now()}`,
      }),
    })

    let respbody = await response.json()
    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(403)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('User does not have permission to create')
  })
  test('POST brand with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
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

  test('POST brand whithout token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `Brand created at ${Date.now()}`,
      }),
    })

    let respbody = await response.json()
    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Token is missing')
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
describe('GET api/v1/marcas by id or nome', () => {
  let createdName = ''
  let createdId = ''

  beforeAll(async () => {
    createdName = `name${Date.now()}`
    await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: createdName }),
    })

    const response = await fetch(
      `http://localhost:3000/api/v1/marcas?nome=${encodeURIComponent(createdName)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const body = await response.json()
    createdId = body[0].id
  })

  test('GET brand by nome happy path', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/marcas?nome=${encodeURIComponent(createdName)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody)).toBe(true)
    expect(respbody[0].nome).toEqual(createdName)
  })

  test('GET brand by nome that does not exist', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/marcas?nome=does${Date.now()}`,
      {
        method: 'GET',
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

  test('GET brand by id happy path', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/marcas?id=${createdId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(respbody)).toBe(true)
    expect(respbody[0].id).toEqual(createdId)
  })

  test('GET brand by id that does not exist', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/marcas?id=99999999`,
      {
        method: 'GET',
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

  test('GET brand by id/nome without token', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/marcas?id=${createdId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Token is missing')
  })
  test('GET brand by id with invalid format', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/marcas?id=abc123`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()
    console.log(respbody)
    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Invalid id format')
  })
})
describe('PATCH api/v1/marcas', () => {
  nameupdated = `teste${Date.now()}`
  test('PATCH happy path', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandname: `${namebrand}`,
        newname: nameupdated,
      }),
    })

    namebrand = nameupdated
    let respbody = await response.json()

    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(200)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('Brand sucessfully updated')
  })
  test('PATCH with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer tiktok`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandname: `${namebrand}`,
        newname: `test${Date.now()}`,
      }),
    })
    console.log(await response)
    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Invalid token')
  })
  test('PATCH without token', async () => {
    nameupdated = `teste${Date.now()}`
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandname: `${namebrand}`,
        newname: `${nameupdated}`,
      }),
    })
    console.log(await response)
    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Token is missing')
  })
  test('PATCH with user token (forbidden)', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandname: `${namebrand}`,
        newname: `test${Date.now()}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(403)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('User does not have permission to rename')
  })

  test('PATCH with invalid newname (regex)', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandname: `${namebrand}`,
        newname: `${Date.now()}`, // só números, não passa no regex
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
  })

  test('PATCH to a name that already exists', async () => {
    // cria uma segunda marca só pra ter um nome já existente pra colidir
    const existingName = `Existing${Date.now()}`.slice(0, 20)
    await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: existingName }),
    })

    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandname: `${namebrand}`,
        newname: existingName,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Brand already exists')
  })

  test('PATCH brand that does not exist', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandname: `bra${Date.now()}`,
        newname: `newn${Date.now()}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test('PATCH without brandname or newname in body', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
  })
})
describe('DELETE api/v1/marcas', () => {
  test('DELETE happy path', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${namebrand}`,
      }),
    })

    let respbody = await response.json()

    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(200)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('Brand sucessfully deleted')
  })

  test('DELETE brand that does not exist', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `baa${Date.now()}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test('DELETE with user token (forbidden)', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${namebrand}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(403)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('User does not have permission to remove')
  })

  test('DELETE with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer tiktok`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${namebrand}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Invalid token')
  })

  test('DELETE without token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${namebrand}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Token is missing')
  })

  test('DELETE without name in body', async () => {
    const response = await fetch('http://localhost:3000/api/v1/marcas', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
  })
})
