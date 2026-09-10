import orchestrator from 'test/orchestrator.js'
import createuser from 'test/hooks/userfortests.js'
import {
  requestResetPassword,
  getResetKey,
  resetPassword,
} from 'test/hooks/reset-password-helper.js'
import jwt from 'jsonwebtoken'

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

describe('session invalidation after password change', () => {
  test('should invalidate the previous session after password reset', async () => {
    // Arrange: create a user and store the initial session token
    const email = `teste${Date.now()}@gmail.com`

    const registerResponse = await createuser.fakeuser.user(
      email,
      'renan',
      'Abcdef12!@dfd'
    )

    const oldToken = registerResponse[1].data[0].token

    const decodedOldToken = jwt.verify(oldToken, process.env.JWT_SECRET)

    const oldSessionVersion = decodedOldToken.session_version

    // Act: request a password reset
    const resetRequestResponse = await requestResetPassword(email)
    const resetRequestBody = await resetRequestResponse.json()

    expect(resetRequestResponse.status).toBe(200)
    expect(resetRequestBody).toMatchObject({
      success: true,
      message: expect.any(String),
    })

    const resetKey = await getResetKey(email)

    // Act: change the user's password
    const resetResponse = await resetPassword(resetKey, VALID_PASSWORD)

    const resetBody = await resetResponse.json()

    expect(resetResponse.status).toBe(200)
    expect(resetBody).toEqual({
      success: true,
      message: 'password updated successfully',
    })

    // Act: login again to create a new session
    const loginResponse = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        senha: 'NewPassword123!',
      }),
    })

    const loginBody = await loginResponse.json()

    expect(loginResponse.status).toBe(200)

    const newToken = loginBody.data[0].token

    const decodedNewToken = jwt.verify(newToken, process.env.JWT_SECRET)

    const newSessionVersion = decodedNewToken.session_version

    // Assert: the new session must have a different version
    expect(newSessionVersion).not.toBe(oldSessionVersion)

    // Act: try to access a protected route using the old session
    const categoryName = `Categoria ${Date.now()}`

    const categoryResponse = await fetch(
      'http://localhost:3000/api/v1/categorias',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${oldToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: categoryName,
        }),
      }
    )

    const categoryBody = await categoryResponse.json()

    // Assert: the old session must no longer be valid
    expect(categoryResponse.status).toBe(401)
    expect(categoryBody).toMatchObject({
      success: false,
    })
  })
})
