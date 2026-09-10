import pool from 'infra/database/db'
import orchestrator from 'test/orchestrator.js'
import createuser from 'test/hooks/userfortests'

const LOGIN_URL = 'http://localhost:3000/api/v1/login'
const existingUserEmail = 'loginTestUser@gmail.com'
const existingUserPassword = 'ValidPass1!'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await createuser.fakeuser.user(
    existingUserEmail,
    'loginTestUser',
    existingUserPassword
  )
})

afterAll(async () => {
  await pool.query('DELETE FROM usuarios WHERE email = $1', [existingUserEmail])
})

async function login(body) {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { response, body: await response.json() }
}

describe('POST /api/v1/login', () => {
  test('logs in successfully with valid credentials', async () => {
    const { response, body } = await login({
      email: existingUserEmail,
      senha: existingUserPassword,
    })

    expect(response.status).toBe(200)
    expect(body).not.toHaveProperty('error')
    expect(body.data[0]).toHaveProperty('token')
    expect(body).toMatchObject({
      success: true,
      message: expect.any(String),
      data: [expect.objectContaining({ token: expect.any(String) })],
    })
  })

  test('is case-insensitive on email', async () => {
    const { response, body } = await login({
      email: existingUserEmail.toUpperCase(),
      senha: existingUserPassword,
    })

    expect(response.status).toBe(200)
    expect(body.data[0]).toHaveProperty('token')
  })

  describe('invalid credentials (should behave the same either way)', () => {
    test.each([
      [
        'wrong password for an existing user',
        { email: existingUserEmail, senha: 'validDDdds1!' },
      ],
      [
        'email that does not exist',
        { email: 'doesnotexist@gmail.com', senha: 'ValidPass1!' },
      ],
    ])('%s', async (_desc, payload) => {
      const { response, body } = await login(payload)

      expect(response.status).toBe(404)
      expect(body).toHaveProperty('error')
    })
  })

  describe('invalid input (400)', () => {
    test.each([
      ['invalid email format', { email: '@.ddsadm', senha: 'ValidPass1!' }],
      [
        'password missing uppercase letter',
        { email: existingUserEmail, senha: 'senha123!' },
      ],
      [
        'password missing lowercase letter',
        { email: existingUserEmail, senha: 'SENHA123!' },
      ],
      [
        'password missing number',
        { email: existingUserEmail, senha: 'Senhaaaa!' },
      ],
      [
        'password missing special character',
        { email: existingUserEmail, senha: 'Senha1234' },
      ],
      ['password too short', { email: existingUserEmail, senha: 'Sh1!' }],
      ['void fields', { email: '', senha: '' }],
      ['void password', { email: existingUserEmail, senha: '' }],
      ['void email', { email: '', senha: existingUserPassword }],
    ])('%s', async (_desc, payload) => {
      const { response, body } = await login(payload)

      expect(response.status).toBe(400)
      expect(body).toHaveProperty('error')
    })
  })

  test('returns method not allowed for non-POST requests', async () => {
    const response = await fetch(LOGIN_URL, { method: 'GET' })
    const body = await response.json()

    expect(response.status).toBe(405)
    expect(body).toHaveProperty('error')
  })
})
