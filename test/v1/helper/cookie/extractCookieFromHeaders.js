export async function extractCookieFromHeaders(headers) {
  const cookie = headers.get('set-cookie')
  return cookie.replace(/^.*?=|;/g, '').split(' ')[0]
}
