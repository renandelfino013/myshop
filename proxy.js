/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const environment = process.env.VERCEL_ENV || 'development'
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  prefix: `@upstash/ratelimit:${environment}`,
  analytics: true,
})

export async function proxy(request) {
  if (process.env.APP_ENV === 'test') {
    return NextResponse.next()
  }

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

  const response = NextResponse.next()
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v))
  return response
}

export const config = {
  matcher: '/api/:path*',
}
