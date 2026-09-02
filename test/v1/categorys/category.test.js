import createuser from 'test/hooks/userfortests.js'
import orchestrator from 'test/orchestrator.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests'

let tokenUser = 0
let tokenAdmin = 0
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
let namecategory = ''
let nameupdated = ''

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
  console.log('teste do tkadmin ', tokenAdmin)
})

describe('POST api/v1/categorias', () => {
  test('POST create category happy path', async () => {
    let name = `Categoria ${Date.now()}`
    namecategory = name
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
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
    expect(respbody.message).toEqual('Category sucessfully created')
  })

  test('POST create with invalid name', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
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
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `category${Date.now()}`,
      }),
    })

    let respbody = await response.json()
    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(403)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('User does not have permission to create')
  })

  test('POST category with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
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

  test('POST category whithout token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `Category created at ${Date.now()}`,
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

describe('GET api/v1/categorias', () => {
  test('GET all categories', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
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

  test('GET all categories whithout token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
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

  test('GET all categories with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
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
let createdName = ''
let createdId = ''
describe('GET api/v1/categorias by id or nome', () => {
  beforeAll(async () => {
    createdName = `name${Date.now()}`
    await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: createdName }),
    })

    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?nome=${encodeURIComponent(createdName)}`,
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

  test('GET category by nome happy path', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?nome=${encodeURIComponent(createdName)}`,
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

  test('GET category by nome that does not exist', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?nome=does${Date.now()}`,
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

  test('GET category by id happy path', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?id=${createdId}`,
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

  test('GET category by id that does not exist', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?id=99999999`,
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

  test('GET category by id/nome without token', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?id=${createdId}`,
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

  test('GET category by id with invalid format', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?id=abc123`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()
    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Invalid id format')
  })
})

describe('PUT api/v1/categorias', () => {
  nameupdated = `teste${Date.now()}`

  test('PUT happy path', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${createdId}`,
        novonome: nameupdated,
      }),
    })

    namecategory = nameupdated
    let respbody = await response.json()

    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(200)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('Category sucessfully updated')
  })

  test('PUT with invalid token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer tiktok`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${createdId}`,
        novonome: `test${Date.now()}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Invalid token')
  })

  test('PUT without token', async () => {
    nameupdated = `teste${Date.now()}`
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${createdId}`,
        novonome: `${nameupdated}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Token is missing')
  })

  test('PUT with user token (forbidden)', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenUser}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${createdId}`,
        novonome: `test${Date.now()}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(403)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('User does not have permission to update')
  })

  test('PUT with invalid novonome (regex)', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${createdId}`,
        novonome: `${Date.now()}`, // só números, não passa no regex
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
  })

  test('PUT to a name that already exists', async () => {
    const name = `categ${Date.now()}`
    await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: `${name}`,
      }),
    })
    const get = await fetch(
      `http://localhost:3000/api/v1/categorias?id=${createdId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const getb = await get.json()
    console.log('teste do teste', getb[0].id)
    const id = getb[0].id

    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${id}`,
        novonome: name,
      }),
    })

    let respbody = await response.json()
    if (respbody.error) {
      console.error(respbody)
    }

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Category already exists')
  })

  test('PUT category that does not exist', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '99999999',
        novonome: `newname${Date.now()}`,
      }),
    })

    let respbody = await response.json()

    expect(response.status).toBe(404)
    expect(respbody.error).toBeDefined()
  })

  test('PUT without id or novonome in body', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'PUT',
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

describe('DELETE api/v1/categorias', () => {
  test('DELETE happy path', async () => {
    const nome = `cat${Date.now()}`
    await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    })
    const searchResponse = await fetch(
      `http://localhost:3000/api/v1/categorias?nome=${encodeURIComponent(nome)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const s = await searchResponse.json()
    console.log(s)

    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?id=${s[0].id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()
    if (respbody.error) {
      console.error(respbody)
    }

    expect(typeof respbody).toBe('object')
    expect(response.status).toBe(200)
    expect(respbody.success).toBe(true)
    expect(respbody.message).toEqual('Category deleted')
  })

  test('DELETE category that does not exist', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/categorias?id=99999999',
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

  test('DELETE with user token (forbidden)', async () => {
    const nome = `categoriaforbidden${Date.now()}`
    await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    })
    const searchResponse = await fetch(
      `http://localhost:3000/api/v1/categorias?nome=${encodeURIComponent(nome)}`,
      { headers: { Authorization: `Bearer ${tokenUser}` } }
    )
    const s = await searchResponse.json()

    const response = await fetch(
      `http://localhost:3000/api/v1/categorias?id=${s[0].id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(403)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('User does not have permission to remove')
  })

  test('DELETE with invalid token', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/categorias?id=1',
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer tiktok`,
          'Content-Type': 'application/json',
        },
      }
    )

    let respbody = await response.json()

    expect(response.status).toBe(401)
    expect(respbody.error).toBeDefined()
    expect(respbody.error).toEqual('Unauthorized')
    expect(respbody.message).toBeDefined()
    expect(respbody.message).toEqual('Invalid token')
  })

  test('DELETE without token', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/categorias?id=1',
      {
        method: 'DELETE',
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

  test('DELETE without id in query', async () => {
    const response = await fetch('http://localhost:3000/api/v1/categorias', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json',
      },
    })

    let respbody = await response.json()

    expect(response.status).toBe(400)
    expect(respbody.error).toBeDefined()
  })
})
