import orchestrator from 'test/orchestrator'
import { generates_Users_And_catch_Their_Cookies } from 'test/v1/helper/setup/generates_Users_And_catch_Their_Cookies'

const apiurl = 'http://localhost:3000/api/v1'
beforeAll(async () => {
  await orchestrator.waitForAllServices()
})
describe('COMMON USER accessing own user (/users/me/logout)', () => {
  test('Common user logs out their own user on /me/logout', async () => {
    const usersetup = await generates_Users_And_catch_Their_Cookies()

    const response = await fetch(`${apiurl}/users/me/logout`, {
      method: 'POST',
      headers: {
        cookie: `${usersetup.commonUser.cookie}`,
        'Content-Type': 'application/json',
      },
    })
    const body = await response.json()
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toEqual(0)
    expect(body.message).toEqual('user logged out')
    expect(response.status).toBe(200)
    const getCookieUser = await response.headers.getSetCookie()

    const cookie = getCookieUser[0]

    expect(getCookieUser).toHaveLength(1)
    expect(cookie).toMatch(/^token=;/)
    expect(cookie).toContain('Max-Age=0')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Path=/api/v1')
  })
})
