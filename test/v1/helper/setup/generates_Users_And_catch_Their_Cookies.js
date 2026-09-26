import createuser from 'test/hooks/userfortests.js'
import userRoleAdmin from 'test/hooks/userRoleAdminForTests'
import jwt from 'jsonwebtoken'
export async function generates_Users_And_catch_Their_Cookies() {
  const emailUser = `commonusersetup${Date.now()}@gmail.com`
  const passwordCommonUser = `commonUserPass@321`
  const user = await createuser.fakeuser.user(
    emailUser,
    'renan',
    passwordCommonUser
  )

  const passwordAdmin = 'AdminPass23!'
  const emailAdmin = `adminusersetup${Date.now()}@gmail.com`
  await userRoleAdmin('renanadmin', emailAdmin, passwordAdmin)
  const setcookieadmin = await fetch('http://localhost:3000/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: `${emailAdmin}`,
      senha: passwordAdmin,
    }),
  })
  const getCookieUser = user[2].headers.getSetCookie()
  const cookieCommonUser = getCookieUser[0]

  const getCookieAdmin = setcookieadmin.headers.getSetCookie()
  const cookieAdmin = getCookieAdmin[0]
  const userToken = extractTokenFromCookie(cookieCommonUser)
  const Admintoken = extractTokenFromCookie(cookieAdmin)

  const decodedCommonUsertoken = decodeJwt(userToken)
  const decodedAdmintoken = decodeJwt(Admintoken)
  return {
    userAdmin: {
      cookie: cookieAdmin,
      email: emailAdmin,
      password: passwordAdmin,
      decoded_token: decodedAdmintoken,
    },
    commonUser: {
      cookie: cookieCommonUser,
      email: emailUser,
      password: passwordCommonUser,
      decoded_token: decodedCommonUsertoken,
    },
  }
}

function extractTokenFromCookie(cookie) {
  return cookie.replace(/^.*?=|;/g, '').split(' ')[0]
}
function decodeJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}
