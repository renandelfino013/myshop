import orchestrator from 'test/orchestrator.js'
import createuser from 'test/hooks/userfortests'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  const email = `testedeeuse-${Date.now()}@gmail.com`
  let result = await createuser.fakeuser.user(email, 'renan', 'Abcdef12!@dfd')
  console.log('result of user creation : ', result)
  globalThis.__loginEmailTest = email
})

describe('teste de login', () => {
  test('login caminho feliz', async () => {
    const login = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        email: globalThis.__loginEmailTest,
        senha: 'Abcdef12!@dfd',
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
        senha: 'Password1!',
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
        email: 'jaestalo@ga .com',
        senha: 'Password1!',
      }),
    })
    let data = await login.json()
    console.log('login with invalid email : ', data)
    expect(data.succes).toBeDefined()
    expect(data.succes).toBe(false)
    expect(data.error).toBeDefined()
    expect(data.error).toEqual('invalid email')
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
    expect(data.error).toEqual('A senha deve ter pelo menos 8 caracteres.')
    console.log(data.error)

    expect(data.type).toBeDefined()
  })
})
