import orchestrator from 'test/orchestrator.js'
import createuser from 'test/hooks/userfortests'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await createuser.fakeuser.user('testedeeuse@gmail.com', 'renan', '1234Rnads')
})

describe('teste de login', () => {
  test('login caminho feliz', async () => {
    const login = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        email: 'testedeeuse@gmail.com',
        senha: '1234Rnads',
      }),
    })
    let data = await login.json()
    expect(data).toBeDefined()
    expect(data.token).toBeDefined()
    expect(data.user).toBeDefined()
    expect(data.sucess).toBe(true)
    expect(data.sucess).toBeDefined()
  })

  test('login with incorrects informations', async () => {
    const login = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        email: 'jaestalogadote@gmail.com',
        senha: '123dsD',
      }),
    })
    let data = await login.json()
    console.log(data)
    expect(data.succes).toBeDefined()
    expect(data.error).toBeDefined()
    expect(data.type).toBeDefined()
    expect(data.succes).toBe(false)
  })

  test('login with invalid email', async () => {
    const login = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        email: 'jaestalo@gadote.com',
        senha: '123dsD',
      }),
    })
    let data = await login.json()
    console.log('login with invalid email : ', data)
    expect(data.succes).toBeDefined()
    expect(data.succes).toBe(false)
    expect(data.error).toBeDefined()
    expect(data.error).toEqual('ValidationError: invalid email')
    expect(typeof data.error).toEqual('string')

    expect(data.type).toBeDefined()
  })
  test('login with invalid password', async () => {
    const login = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        email: 'jaestalo@gadote.com',
        senha: '123ds',
      }),
    })
    let data = await login.json()
    expect(data.succes).toBeDefined()
    expect(data.succes).toBe(false)
    expect(data.error).toBeDefined()
    expect(data.error).toEqual(
      'ValidationError: invalid password, min 4 carac and with 1 uppercase'
    )
    console.log(data.error)

    expect(data.type).toBeDefined()
  })
})
