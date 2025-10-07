import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Detectar domínio do projeto (subdomínio)
  const subdomain = hostname.split('.')[0]
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'ylada.com'
  
  // Se não é um subdomínio válido ou é o domínio principal, continuar normalmente
  if (hostname.includes('localhost') || hostname.includes('vercel.app') || subdomain === 'www') {
    return NextResponse.next()
  }
  
  // Verificar se é um domínio de projeto válido
  const isValidProjectDomain = subdomain !== baseDomain.split('.')[0] && 
                               subdomain.length >= 3 && 
                               subdomain.length <= 30 &&
                               /^[a-z0-9-]+$/.test(subdomain)
  
  if (!isValidProjectDomain) {
    return NextResponse.next()
  }
  
  // Adicionar header para identificar o projeto
  const response = NextResponse.next()
  response.headers.set('x-project-domain', subdomain)
  
  // Adicionar contexto do projeto para páginas de auth e ferramentas
  if (url.pathname.startsWith('/tools/') || 
      url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/user')) {
    // Adicionar parâmetro de contexto do projeto
    url.searchParams.set('project', subdomain)
    return NextResponse.redirect(url)
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}