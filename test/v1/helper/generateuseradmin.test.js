/* eslint-disable jest/expect-expect */
/* eslint-disable no-console */
import { generateNoPaginationTestKey } from 'test/hooks/file/testkey/generateNoPaginationTestKey'
import { generates_Users_And_catch_Their_Cookies } from './setup/generates_Users_And_catch_Their_Cookies'
test('admin', async () => {
  const token = await generates_Users_And_catch_Their_Cookies()
  console.log(token)
})

test('generate', async () => {
  const token = await generateNoPaginationTestKey()
  console.log(token)
})
