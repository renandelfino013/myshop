/* eslint-disable @typescript-eslint/no-unused-vars */
import orchestrator from 'test/orchestrator.js'

import createuser from 'test/hooks/userfortests.js'
import {
  requestResetPassword,
  getResetKey,
  resetPassword,
} from 'test/hooks/reset-password-helper.js'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
})
let twotimeskey = ''

test('reset password happy path', async () => {
  const email = `teste${Date.now()}@gmail.com`
  await createuser.fakeuser.user(email, 'renan', '1234Rnads')

  const request = await requestResetPassword(email)

  expect(request.status).toBe(200)

  const key = await getResetKey(email)
  twotimeskey = key

  const response = await resetPassword(key, 'Newpassword123')

  expect(response.status).toBe(200)

  expect(await response.json()).toEqual({
    sucess: 'true',
    message: 'password updated be sucessul!',
  })
})
test('reset password with invalid key', async () => {
  const email = `teste${Date.now()}@gmail.com`
  await createuser.fakeuser.user(email, 'renan', '1234Rnads')

  const request = await requestResetPassword(email)

  expect(request.status).toBe(200)

  const key = 'invalidkey'

  const response = await resetPassword(key, 'Newpassword123')
  let body = await response.json()

  expect(body.error).toBeDefined()
  expect(response.status).toBe(400)
  expect(body.error).toBe(
    'Failed to reset password: Invalid or expired reset key'
  )
  console.log(body, 'status: ', response.status)
})

test('reset password with incorrect password', async () => {
  const email = `teste${Date.now()}@gmail.com`
  await createuser.fakeuser.user(email, 'renan', '1234Rnads')

  const request = await requestResetPassword(email)
  const ckey = await getResetKey(email)

  expect(request.status).toBe(200)

  const key = ckey

  const response = await resetPassword(key, 'N12')
  let body = await response.json()

  expect(body.error).toBeDefined()
  expect(response.status).toBe(400)
  expect(body.error).toBe('Password must be at least 4 characters long.')
  console.log(body, 'status: ', response.status)
})
test('used reset key', async () => {
  const response = await resetPassword(twotimeskey, 'Newpassword123')
  let body = await response.json()

  expect(response.status).toBe(400)
  expect(body.error).toBe(
    'Failed to reset password: Invalid or expired reset key'
  )
  console.log(body, 'status: ', response.status)
})
