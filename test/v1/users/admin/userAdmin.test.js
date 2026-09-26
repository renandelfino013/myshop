import orchestrator from 'test/orchestrator'
import { generates_Users_And_catch_Their_Cookies } from 'test/v1/helper/setup/generates_Users_And_catch_Their_Cookies'
let usersetup
const apiurl = 'http://localhost:3000/api/v1'
beforeAll(async () => {
  await orchestrator.waitForAllServices()
  usersetup = await generates_Users_And_catch_Their_Cookies()
})

describe('ADMIN route (/users)', () => {
  describe('GET, admin route /users', () => {
    describe('Get, happy path (admin)', () => {
      test('Get all users (no query)', async () => {
        const response = await fetch(`${apiurl}/users`, {
          method: 'GET',
          headers: {
            cookie: `${usersetup.userAdmin.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        console.dir(body.data, { depth: null })
        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data.length).toBeGreaterThanOrEqual(1)
        expect(body.data[0].users.length).toBeGreaterThanOrEqual(2)
        expect(body.message).toEqual('users found')
        expect(response.status).toBe(200)
      })

      test('Get all users with pagination (limit/page)', async () => {
        const response = await fetch(`${apiurl}/users?limit=10&page=1`, {
          method: 'GET',
          headers: {
            cookie: `${usersetup.userAdmin.cookie}`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data[0].users.length).toBe(10)
        expect(response.status).toBe(200)
      })

      test('Get user by id', async () => {
        const response = await fetch(
          `${apiurl}/users?id=${encodeURIComponent(usersetup.commonUser.decoded_token.id)}`,
          {
            method: 'GET',
            headers: {
              cookie: `${usersetup.userAdmin.cookie}`,
              'Content-Type': 'application/json',
            },
          }
        )
        const body = await response.json()
        expect(body.data[0].id).toBe(usersetup.commonUser.decoded_token.id)
        expect(body.message).toEqual('user found')
        expect(response.status).toBe(200)
      })
    })

    describe('Get invalid cases', () => {
      test('Get, without cookie/token (returns 401)', async () => {
        const response = await fetch(`${apiurl}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
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
        const response = await fetch(`${apiurl}/users`, {
          method: 'GET',
          headers: {
            cookie: `invalidtoken`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(body).toEqual({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'invalid token' }],
          },
        })
        expect(response.status).toBe(401)
      })

      test('Get, with common user (returns 403)', async () => {
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
        expect(response.status).toBe(403)
      })

      test('Get by id, with common user (returns 403)', async () => {
        const response = await fetch(
          `${apiurl}/users?id=${usersetup.commonUser.decoded_token.id}`,
          {
            method: 'GET',
            headers: {
              cookie: `${usersetup.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          }
        )
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
        expect(response.status).toBe(403)
      })

      test('Get by invalid id (returns 400 validation error)', async () => {
        const response = await fetch(`${apiurl}/users?id=abc`, {
          method: 'GET',
          headers: {
            cookie: `${usersetup.userAdmin.cookie}`,
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
        expect(response.status).toBe(400)
      })
    })
  })

  describe('DELETE, admin route /users', () => {
    describe('Delete, happy path (admin)', () => {
      test('Delete user by id', async () => {
        const target = await generates_Users_And_catch_Their_Cookies()
        const response = await fetch(
          `${apiurl}/users?id=${target.commonUser.decoded_token.id}`,
          {
            method: 'DELETE',
            headers: {
              cookie: `${usersetup.userAdmin.cookie}`,
              'Content-Type': 'application/json',
            },
          }
        )
        const body = await response.json()
        expect(body.message).toEqual('user removed')
        expect(response.status).toBe(200)
      })

      describe('Deleted user cannot access protected routes with revoked token (returns 404)', () => {
        let target

        beforeAll(async () => {
          target = await generates_Users_And_catch_Their_Cookies()
          await fetch(
            `${apiurl}/users?id=${target.commonUser.decoded_token.id}`,
            {
              method: 'DELETE',
              headers: {
                cookie: `${usersetup.userAdmin.cookie}`,
                'Content-Type': 'application/json',
              },
            }
          )
        })

        test('Get, with excluded token on /users/me', async () => {
          const response = await fetch(`${apiurl}/users/me`, {
            method: 'GET',
            headers: {
              cookie: `${target.commonUser.cookie}`,
              'Content-Type': 'application/json',
            },
          })
          const body = await response.json()
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

    describe('Delete, invalid cases', () => {
      test('Delete, without cookie/token (returns 401)', async () => {
        const response = await fetch(`${apiurl}/users?id=10`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
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
        const response = await fetch(`${apiurl}/users?id=10`, {
          method: 'DELETE',
          headers: {
            cookie: `invalidtoken`,
            'Content-Type': 'application/json',
          },
        })
        const body = await response.json()
        expect(body).toEqual({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'invalid token' }],
          },
        })
        expect(response.status).toBe(401)
      })

      test('Delete, with common user (returns 403)', async () => {
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
        expect(response.status).toBe(403)
      })

      test('Delete, without query params (returns 400 validation error)', async () => {
        const response = await fetch(`${apiurl}/users`, {
          method: 'DELETE',
          headers: {
            cookie: `${usersetup.userAdmin.cookie}`,
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
        expect(response.status).toBe(400)
      })
    })
  })

  describe('NOT ALLOWED METHODS (PUT, PATCH) (returns 405)', () => {
    test('PUT', async () => {
      const response = await fetch(`${apiurl}/users`, {
        method: 'PUT',
        headers: { cookie: `${usersetup.userAdmin.cookie}` },
      })
      const body = await response.json()

      expect(response.status).toBe(405)
      expect(body).toHaveProperty('error')
    })

    test('PATCH', async () => {
      const response = await fetch(`${apiurl}/users`, {
        method: 'PATCH',
        headers: { cookie: `${usersetup.userAdmin.cookie}` },
      })
      const body = await response.json()

      expect(response.status).toBe(405)
      expect(body).toHaveProperty('error')
    })
  })
})

describe('ADMIN accessing own user (/users/me)', () => {
  describe('GET, admin happy path', () => {
    test('Admin gets their own user on /me', async () => {
      usersetup = await generates_Users_And_catch_Their_Cookies()

      const response = await fetch(`${apiurl}/users/me`, {
        method: 'GET',
        headers: {
          cookie: `${usersetup.userAdmin.cookie}`,
          'Content-Type': 'application/json',
        },
      })
      const body = await response.json()
      console.dir(body, { depth: null })
      expect(body.data[0].id).toBe(usersetup.userAdmin.decoded_token.id)
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.data.length).toBeGreaterThanOrEqual(1)
      expect(response.status).toBe(200)
    })
  })

  describe('DELETE, admin happy path', () => {
    test('Admin deletes their own user on /me', async () => {
      usersetup = await generates_Users_And_catch_Their_Cookies()

      const response = await fetch(`${apiurl}/users/me`, {
        method: 'DELETE',
        headers: {
          cookie: `${usersetup.userAdmin.cookie}`,
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

    test('Admin cannot access /me anymore after self-delete (returns 404)', async () => {
      const response = await fetch(`${apiurl}/users/me`, {
        method: 'GET',
        headers: {
          cookie: `${usersetup.userAdmin.cookie}`,
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
