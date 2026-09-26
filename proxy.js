/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { AsyncLocalStorage } from 'node:async_hooks'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import jwt from 'jsonwebtoken'
import { ValidateAndExtractDatafile } from 'utils/helper/proxy/extractDatafile'

const redis = Redis.fromEnv()
const environment = process.env.VERCEL_ENV || 'development'
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  prefix: `@upstash/ratelimit:${environment}`,
  analytics: true,
})
async function checkauthorization(request) {
  const path = request.nextUrl.pathname
  if (
    path.startsWith('/api/v1/marcas') ||
    path.startsWith('/api/v1/produtos') ||
    path.startsWith('/api/v1/pedidos') ||
    path.startsWith('/api/v1/categorias') ||
    path.startsWith('/api/v1/users')
  ) {
    const authHeader = request.headers.get('cookie')
    if (
      !authHeader &&
      request.method === 'GET' &&
      !path.startsWith('/api/v1/pedidos') &&
      !path.startsWith('/api/v1/users')
    ) {
      return NextResponse.next()
    } else if (!authHeader) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'token is missing' }],
          },
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const token = authHeader.replace(/^.*?=|;/g, '').split(' ')[0]

    const tokenTestProvider = request.headers.get('x-test-provider')

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', decoded.id) //
      requestHeaders.set('x-token', token)
      requestHeaders.set('x-user-email', decoded.email)
      requestHeaders.set('x-user-role', decoded.role)
      requestHeaders.set('x-user-session_version', decoded.session_version)

      if (
        (path.startsWith('/api/v1/produtos') && request.method === 'POST') ||
        (path.startsWith('/api/v1/produtos') && request.method === 'PUT')
      ) {
        const clonedrequest = request.clone()
        const [isvalid, file] = await ValidateAndExtractDatafile(clonedrequest)
        if (!isvalid) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              error: {
                code: 'UNSUPPORTED_MEDIA_TYPE',
                details: [
                  {
                    field: 'file',
                    message: 'Unsupported file type',
                  },
                ],
              },
            }),
            {
              status: 415,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }

        if (file.namefile) {
          requestHeaders.set('x-file-name', file.namefile)
          requestHeaders.set('x-file-size', file.filesize)
          requestHeaders.set('x-file-type', file.mimetype)
        }

        if (tokenTestProvider) {
          const decodedTokenTest = jwt.verify(
            tokenTestProvider,
            process.env.JWT_SECRET
          )
          requestHeaders.set(
            'x-test-provider',
            decodedTokenTest.storageProvider
          )
        }
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('Error verifying token in proxy:', error)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: [{ field: 'token', message: 'invalid token' }],
          },
        }),
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
      JSON.stringify({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          details: [
            {
              message: 'Rate limit exceeded',
              limit,
              remaining,
            },
          ],
        },
      }),
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

  const authResponse = await checkauthorization(request)
  if (authResponse) return authResponse

  return NextResponse.next()
}
export const config = {
  matcher: '/api/:path*',
}
