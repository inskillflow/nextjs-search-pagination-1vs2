import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log des requêtes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`${request.method} ${request.nextUrl.pathname} - ${new Date().toISOString()}`)
  }

  // Headers CORS
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}

export const config = {
  matcher: '/api/:path*'
}
