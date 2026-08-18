/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import jwt from 'jsonwebtoken'

const redis = Redis.fromEnv()
const environment = process.env.VERCEL_ENV || 'development'
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  prefix: `@upstash/ratelimit:${environment}`,
  analytics: true,
})
function checkauthorization(request) {
  const path = request.nextUrl.pathname
  if (path.startsWith('/api/v1/marcas')) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', message: 'Token is missing' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', decoded.id) //
      requestHeaders.set('x-token', token)
      requestHeaders.set('x-user-email', decoded.email)
      requestHeaders.set('x-user-role', decoded.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid token' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  } else {
    return null
  }
}
async function checkratelimit(request) {
  if (process.env.APP_ENV === 'test') return null
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1'

  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  }

  if (!success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests', limit, remaining }),
      {
        status: 429,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}

export async function proxy(request) {
  const rateLimitResponse = await checkratelimit(request)
  if (rateLimitResponse) return rateLimitResponse

  const authResponse = checkauthorization(request)
  if (authResponse) return authResponse

  return NextResponse.next()
}
export const config = {
  matcher: '/api/:path*',
}
