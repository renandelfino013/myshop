import pool from 'infra/database/db'
import orchestrator from 'test/orchestrator.js'
import createuser from 'test/hooks/userfortests'

const REGISTER_URL = 'http://localhost:3000/api/v1/register'
const existingUserEmail = 'jaestalogadoteste@gmail.com'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await createuser.fakeuser.user(existingUserEmail, 'aDSADAASa', 'ValidPass1!')
})

afterAll(async () => {
  await pool.query('DELETE FROM usuarios WHERE email = $1', [existingUserEmail])
})

async function cleanUser(email) {
  await pool.query('DELETE FROM usuarios WHERE email = $1', [email])
}

async function register(body) {
  const response = await fetch(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { response, body: await response.json() }
}

describe('POST /api/v1/register', () => {
  test('registers a user with valid data', async () => {
    const email = `test${Date.now()}@gmail.com`

    const { response, body } = await register({
      nome: `test${Date.now()}`,
      email,
      senha: `Renan${Date.now()}!A1`,
    })

    expect(response.status).toBe(201)
    expect(body).not.toHaveProperty('error')
    expect(body.data[0]).toHaveProperty('token')

    expect(body).toMatchObject({
      success: true,
      message: expect.any(String),
      data: [expect.any(Object)],
    })
    await cleanUser(email)
  })

  test('returns 409 when trying to register with an already existing email', async () => {
    const { response, body } = await register({
      nome: 'anotherName',
      email: existingUserEmail,
      senha: 'ValidPass1!',
    })

    expect(response.status).toBe(409)
    expect(body).toHaveProperty('error')
  })

  describe('invalid cases (400)', () => {
    test.each([
      [
        'invalid email',
        { nome: 'testuser', email: '@.ddsadm', senha: 'ValidPass1!' },
      ],
      [
        'password missing uppercase letter',
        {
          nome: 'testuser',
          email: `t${Date.now()}a@a.com`,
          senha: 'senha123!',
        },
      ],
      [
        'password missing lowercase letter',
        {
          nome: 'testuser',
          email: `t${Date.now()}b@a.com`,
          senha: 'SENHA123!',
        },
      ],
      [
        'password missing number',
        {
          nome: 'testuser',
          email: `t${Date.now()}c@a.com`,
          senha: 'Senhaaaa!',
        },
      ],
      [
        'password missing special character',
        {
          nome: 'testuser',
          email: `t${Date.now()}d@a.com`,
          senha: 'Senha1234',
        },
      ],
      [
        'password too short',
        { nome: 'testuser', email: `t${Date.now()}e@a.com`, senha: 'Sh1!' },
      ],
      [
        'name too short',
        { nome: 'aa', email: `t${Date.now()}f@a.com`, senha: 'ValidPass1!' },
      ],
      [
        'name too long',
        {
          nome: 'a'.repeat(41),
          email: `t${Date.now()}g@a.com`,
          senha: 'ValidPass1!',
        },
      ],
    ])('%s', async (_desc, payload) => {
      const { response, body } = await register(payload)

      expect(response.status).toBe(400)
      expect(body).toHaveProperty('error')
    })
  })
})
