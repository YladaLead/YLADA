import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Verificar se já tem idioma na URL
  const hasLanguage = pathname.startsWith('/pt') || pathname.startsWith('/en') || pathname.startsWith('/es')
  
  // Se não tem idioma e não é uma rota de API ou arquivo estático
  if (!hasLanguage && !pathname.startsWith('/api') && !pathname.includes('.')) {
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
