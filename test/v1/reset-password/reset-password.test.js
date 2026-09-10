import orchestrator from 'test/orchestrator.js'
import createuser from 'test/hooks/userfortests.js'
import {
  requestResetPassword,
  getResetKey,
  resetPassword,
} from 'test/hooks/reset-password-helper.js'

const RESET_PASSWORD_URL = 'http://localhost:3000/api/v1/rede-password'
const VALID_PASSWORD = 'NewPassword123!'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
})

describe('POST /reset-password (request reset key)', () => {
  test('creates a reset key for an existing user', async () => {
    const email = `teste${Date.now()}@gmail.com`
    await createuser.fakeuser.user(email, 'renan', 'Abcdef12!@dfd')

    const response = await requestResetPassword(email)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toMatchObject({ success: true, message: expect.any(String) })
  })

  describe('response is identical regardless of whether the email exists (no user enumeration)', () => {
    test.each([
      [
        'existing email',
        async () => {
          const email = `teste${Date.now()}@gmail.com`
          await createuser.fakeuser.user(email, 'renan', 'Abcdef12!@dfd')
          return email
        },
      ],
      ['non-existent email', async () => 'doesnotexist@gmail.com'],
    ])('%s returns 200 with a generic message', async (_desc, getEmail) => {
      const email = await getEmail()
      const response = await requestResetPassword(email)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toMatchObject({
        success: true,
        message: expect.any(String),
      })
    })
  })

  test('returns 400 for a malformed email', async () => {
    const response = await requestResetPassword('not-an-email')
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toHaveProperty('error')
  })

  test('returns 405 for methods other than POST/PATCH', async () => {
    const response = await fetch(RESET_PASSWORD_URL, { method: 'DELETE' })
    expect(response.status).toBe(405)
  })
})

describe('PATCH /reset-password (update password)', () => {
  test('updates the password with a valid key', async () => {
    const email = `teste${Date.now()}@gmail.com`
    await createuser.fakeuser.user(email, 'renan', 'Abcdef12!@dfd')
    await requestResetPassword(email)
    const key = await getResetKey(email)

    const response = await resetPassword(key, VALID_PASSWORD)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      message: 'password updated successfully',
    })
  })

  test('the new password actually works for a subsequent login', async () => {
    const email = `teste${Date.now()}@gmail.com`
    await createuser.fakeuser.user(email, 'renan', 'Abcdef12!@dfd')
    await requestResetPassword(email)
    const key = await getResetKey(email)
    await resetPassword(key, VALID_PASSWORD)

    const loginResponse = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: VALID_PASSWORD }),
    })

    expect(loginResponse.status).toBe(200)
  })

  describe('unauthorized key — same status/code for every invalid case (401)', () => {
    test.each([
      ['malformed / non-existent key', async () => 'invalidkey'],
      [
        'already used key',
        async () => {
          const email = `teste${Date.now()}@gmail.com`
          await createuser.fakeuser.user(email, 'renan', 'Abcdef12!@dfd')
          await requestResetPassword(email)
          const key = await getResetKey(email)
          await resetPassword(key, VALID_PASSWORD) // consumes the key
          return key
        },
      ],
    ])('%s', async (_desc, getKey) => {
      const key = await getKey()
      const response = await resetPassword(key, 'AnotherPass123!')
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('invalid input (400)', () => {
    test.each([
      ['empty key', { key: '', newpassword: VALID_PASSWORD }],
      [
        'password missing uppercase letter',
        { key: 'anykey', newpassword: 'password123!' },
      ],
      [
        'password missing lowercase letter',
        { key: 'anykey', newpassword: 'PASSWORD123!' },
      ],
      [
        'password missing number',
        { key: 'anykey', newpassword: 'Passwordddd!' },
      ],
      [
        'password missing special character',
        { key: 'anykey', newpassword: 'Password1234' },
      ],
      ['password too short', { key: 'anykey', newpassword: 'Sh1!' }],
    ])('%s', async (_desc, { key, newpassword }) => {
      const response = await resetPassword(key, newpassword)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: expect.any(String),
              message: expect.any(String),
            },
          ],
        },
      })
    })
  })
})
