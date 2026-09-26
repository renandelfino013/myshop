import orchestrator from 'test/orchestrator'
import { generates_Users_And_catch_Their_Cookies } from 'test/v1/helper/setup/generates_Users_And_catch_Their_Cookies'
let usersetup
const apiurl = 'http://localhost:3000/api/v1'
beforeAll(async () => {
  await orchestrator.waitForAllServices()
  usersetup = await generates_Users_And_catch_Their_Cookies()
})
describe('USER route (/users/me)', () => {
  describe('GET common User on /me', () => {
    describe('Get, happy path', () => {
      test('Get happy path', async () => {
        const response = await fetch(`${apiurl}/users/me`, {
          method: 'GET',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(body.data[0].id).toBe(usersetup.commonUser.decoded_token.id)
        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data.length).toBeGreaterThanOrEqual(1)
        if (response.status !== 200) {
          console.dir(body, { depth: null })
        }
        expect(response.status).toBe(200)
      })

      test('Get, with id in query result in user received the your only id', async () => {
        const response = await fetch(`${apiurl}/users/me?id=10`, {
          method: 'GET',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body, { depth: null })
        expect(body.data[0].id).toBe(usersetup.commonUser.decoded_token.id)
        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data.length).toBeGreaterThanOrEqual(1)
        expect(response.status).toBe(200)
      })
    })

    describe('Get invalid cases', () => {
      test('Get, without cookie/token (returns 401)', async () => {
        const response = await fetch(`${apiurl}/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body, { depth: null })
        expect(body).toEqual({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'token is missing' }],
          },
        })

        expect(response.status).toBe(401)
      })
      test('Get, with invalid token (returns 401)', async () => {
        const response = await fetch(`${apiurl}/users/me`, {
          method: 'GET',
          headers: {
            cookie: `invalidtoken`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body, { depth: null })
        expect(body).toEqual({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'invalid token' }],
          },
        })
        expect(response.status).toBe(401)
      })
    })
  })

  describe('DELETE, common User on /me', () => {
    describe('Delete, happy path (returns 200)', () => {
      test('Delete, happy path', async () => {
        usersetup = await generates_Users_And_catch_Their_Cookies()

        const response = await fetch(`${apiurl}/users/me`, {
          method: 'DELETE',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body, { depth: null })
        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data.length).toEqual(0)
        expect(body.message).toEqual('user removed')
        expect(response.status).toBe(200)
      })
      test('delete, with id in query result in user delete the your only id', async () => {
        usersetup = await generates_Users_And_catch_Their_Cookies()

        const response = await fetch(`${apiurl}/users/me?id=10`, {
          method: 'DELETE',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body, { depth: null })
        expect(response.status).toBe(200)
      })

      describe('Deleted user cannot access protected routes with revoked token (all returns 404)', () => {
        test('Get, with exclude token on /users/me', async () => {
          const response = await fetch(`${apiurl}/users/me`, {
            method: 'GET',
            headers: {
              cookie: `${usersetup.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          })
          const body = await response.json()
          console.dir(body, { depth: null })
          expect(body).toEqual({
            success: false,
            error: {
              code: 'NOT_FOUND',
              details: [{ field: 'user', message: 'User not found' }],
            },
          })
          expect(response.status).toBe(404)
        })
        test('Get, with exclude token on /users', async () => {
          const response = await fetch(`${apiurl}/users`, {
            method: 'GET',
            headers: {
              cookie: `${usersetup.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          })
          const body = await response.json()
          console.dir(body, { depth: null })
          expect(body).toEqual({
            success: false,
            error: {
              code: 'NOT_FOUND',
              details: [{ field: 'user', message: 'User not found' }],
            },
          })
          expect(response.status).toBe(404)
        })
        test('Get, with exclude token on /produtos', async () => {
          const response = await fetch(`${apiurl}/produtos`, {
            method: 'GET',
            headers: {
              cookie: `${usersetup.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          })
          const body = await response.json()
          console.dir(body, { depth: null })
          expect(body).toEqual({
            success: false,
            error: {
              code: 'NOT_FOUND',
              details: [{ field: 'user', message: 'User not found' }],
            },
          })
          expect(response.status).toBe(404)
        })
        test('Get, with exclude token on /marcas', async () => {
          const response = await fetch(`${apiurl}/marcas`, {
            method: 'GET',
            headers: {
              cookie: `${usersetup.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          })
          const body = await response.json()
          console.dir(body, { depth: null })
          expect(body).toEqual({
            success: false,
            error: {
              code: 'NOT_FOUND',
              details: [{ field: 'user', message: 'User not found' }],
            },
          })
          expect(response.status).toBe(404)
        })
        test('Get, with exclude token on /categorias', async () => {
          const response = await fetch(`${apiurl}/categorias`, {
            method: 'GET',
            headers: {
              cookie: `${usersetup.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          })
          const body = await response.json()
          console.dir(body, { depth: null })
          expect(body).toEqual({
            success: false,
            error: {
              code: 'NOT_FOUND',
              details: [{ field: 'user', message: 'User not found' }],
            },
          })
          expect(response.status).toBe(404)
        })
        test('Get, with exclude token on /pedidos', async () => {
          const response = await fetch(`${apiurl}/pedidos`, {
            method: 'GET',
            headers: {
              cookie: `${usersetup.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          })
          const body = await response.json()
          console.dir(body, { depth: null })
          expect(body).toEqual({
            success: false,
            error: {
              code: 'NOT_FOUND',
              details: [{ field: 'user', message: 'User not found' }],
            },
          })
          expect(response.status).toBe(404)
        })
      })
    })

    describe('Delete, Invalid cases', () => {
      test('Delete, without cookie/token (returns 401)', async () => {
        const response = await fetch(`${apiurl}/users/me`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body, { depth: null })
        expect(body).toEqual({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'token is missing' }],
          },
        })

        expect(response.status).toBe(401)
      })
      test('Delete, with invalid token (returns 401)', async () => {
        const response = await fetch(`${apiurl}/users/me`, {
          method: 'DELETE',
          headers: {
            cookie: `invalidtoken`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body, { depth: null })
        expect(body).toEqual({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'invalid token' }],
          },
        })
        expect(response.status).toBe(401)
      })
    })
  })
  describe('NOT ALLOWED METHODS (PUT,PATCH) (returns 405)', () => {
    test('PUT', async () => {
      usersetup = await generates_Users_And_catch_Their_Cookies()
      const response = await fetch(`${apiurl}/users/me`, {
        method: 'PUT',
        headers: { cookie: `${usersetup.commonUser.cookie}` },
      })
      const body = await response.json()

      expect(response.status).toBe(405)
      expect(body).toHaveProperty('error')
    })
    test('PATCH', async () => {
      const response = await fetch(`${apiurl}/users/me`, {
        method: 'PATCH',
        headers: { cookie: `${usersetup.commonUser.cookie}` },
      })
      const body = await response.json()

      expect(response.status).toBe(405)
      expect(body).toHaveProperty('error')
    })
  })
})
describe('ADMIN route (/users)', () => {
  describe('GET common User on /users (admin route)', () => {
    describe('Get, common user (returns 403)', () => {
      test('get all users', async () => {
        usersetup = await generates_Users_And_catch_Their_Cookies()
        const response = await fetch(`${apiurl}/users`, {
          method: 'GET',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(body).toEqual({
          success: false,
          error: {
            code: 'FORBIDDEN_ERROR',
            details: [
              {
                field: 'role',
                message: 'User does not have permission to view',
              },
            ],
          },
        })
        console.dir(body, { depth: null })
      })
      test('get user by id', async () => {
        usersetup = await generates_Users_And_catch_Their_Cookies()
        const response = await fetch(`${apiurl}/users?id=99`, {
          method: 'GET',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(body).toEqual({
          success: false,
          error: {
            code: 'FORBIDDEN_ERROR',
            details: [
              {
                field: 'role',
                message: 'User does not have permission to view',
              },
            ],
          },
        })
        console.dir(body, { depth: null })
      })
    })
  })
  describe('DELETE common User on/users (admin route)', () => {
    describe('Delete, common User (returns 403)', () => {
      test('Delete user by id', async () => {
        usersetup = await generates_Users_And_catch_Their_Cookies()
        const response = await fetch(`${apiurl}/users?id=10`, {
          method: 'DELETE',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(body).toEqual({
          success: false,
          error: {
            code: 'FORBIDDEN_ERROR',
            details: [
              {
                field: 'role',
                message: 'User does not have permission to remove',
              },
            ],
          },
        })
      })
      test('Delete user without query params', async () => {
        usersetup = await generates_Users_And_catch_Their_Cookies()
        const response = await fetch(`${apiurl}/users`, {
          method: 'DELETE',
          headers: {
            cookie: `${usersetup.commonUser.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(body).toEqual({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            details: [
              {
                field: 'id',
                message: 'Invalid input: expected number, received NaN',
              },
            ],
          },
        })
      })
    })
  })
})
