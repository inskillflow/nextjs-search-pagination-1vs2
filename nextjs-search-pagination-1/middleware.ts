import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Logging des requêtes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`${request.method} ${request.nextUrl.pathname} - ${new Date().toISOString()}`)
  }

  // Configuration CORS
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Gérer les requêtes OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: '/api/:path*'
}
