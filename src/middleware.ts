import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  console.log(`🔍 Middleware executando para: ${hostname}${url.pathname}`)
  
  // TEMPORÁRIO: Permitir TODOS os requests para resolver problema de roteamento
  console.log(`✅ Permitindo acesso a: ${url.pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}