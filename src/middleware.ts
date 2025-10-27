import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Debug: log da rota
  console.log('Middleware - Rota:', pathname)
  
  // Rotas que NUNCA devem ser redirecionadas
  if (
    pathname.startsWith('/templates-environment') ||
    pathname.startsWith('/template/') ||
    pathname.startsWith('/calculadora-imc') ||
    pathname.startsWith('/admin-diagnosticos') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    console.log('Middleware - Rota excluída:', pathname)
    return NextResponse.next()
  }
  
  // Verificar se já tem idioma na URL
  const hasLanguage = pathname.startsWith('/pt') || pathname.startsWith('/en') || pathname.startsWith('/es')
  
  // Se não tem idioma, redirecionar para português
  if (!hasLanguage) {
    console.log('Middleware - Redirecionando para /pt:', pathname)
    const url = request.nextUrl.clone()
    url.pathname = `/pt${pathname}`
    return NextResponse.redirect(url)
  }
  
  console.log('Middleware - Permitindo:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
