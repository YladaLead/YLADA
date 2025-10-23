import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Rotas que não precisam de prefixo de idioma
  const excludedRoutes = [
    '/templates-environment',
    '/template/',
    '/api/',
    '/_next/',
    '/favicon.ico'
  ]
  
  // Verificar se é uma rota excluída
  const isExcludedRoute = excludedRoutes.some(route => pathname.startsWith(route))
  
  // Verificar se já tem idioma na URL
  const hasLanguage = pathname.startsWith('/pt') || pathname.startsWith('/en') || pathname.startsWith('/es')
  
  // Se não tem idioma e não é uma rota excluída
  if (!hasLanguage && !isExcludedRoute && !pathname.includes('.')) {
    // Detectar idioma preferido do usuário
    const acceptLanguage = request.headers.get('accept-language') || ''
    let preferredLang = 'pt' // padrão
    
    if (acceptLanguage.includes('en')) {
      preferredLang = 'en'
    } else if (acceptLanguage.includes('es')) {
      preferredLang = 'es'
    }
    
    // Redirecionar para a versão com idioma
    const url = request.nextUrl.clone()
    url.pathname = `/${preferredLang}${pathname}`
    return NextResponse.redirect(url)
  }
  
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
