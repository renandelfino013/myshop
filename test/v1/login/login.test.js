import orchestrator from 'test/orchestrator.js'
import createuser from 'test/hooks/userfortests'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  const email = `testedeeuse-${Date.now()}@gmail.com`
  await createuser.fakeuser.user(email, 'renan', 'Abcdef12!@dfd')
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
    expect(data.success).toBeDefined()
    expect(data.success).toBe(true)
    expect(data.data.token).toBeDefined()
    expect(data.message).toBe('successfully logged in')
  })

  test('login with incorrects informations', async () => {
    const login = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({
        email: 'jaestalogadote@gmail.com',
        senha: 'Password142141!',
      }),
    })
    let data = await login.json()
    expect(data.success).toBeDefined()
    expect(data.error).toBeDefined()
    expect(data.success).toBe(false)
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
    expect(data.success).toBe(false)
    expect(data.error).toBeDefined()
    expect(data.error.details).toEqual([
      { field: 'email', message: 'invalid email' },
    ])
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
    expect(data.success).toBe(false)
    expect(data.error).toBeDefined()
    expect(data.error.details).toEqual(
      expect.arrayContaining([
        {
          field: 'senha',
          message: 'A senha deve ter pelo menos 8 caracteres.',
        },
      ])
    )
  })
})
