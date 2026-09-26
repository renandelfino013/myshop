/* eslint-disable no-console */
import userRoleAdmin from 'test/hooks/userRoleAdminForTests'
test('admin', async () => {
  const senha = '321776Renan@'
  const token = await userRoleAdmin('renan1234R', 'tertte12@gmail.com', senha)
  console.log(token)
})
