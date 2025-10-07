import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Detectar subdomínio
  const subdomain = hostname.split('.')[0]
  
  // Lista de subdomínios válidos
  const validSubdomains = ['fitness', 'nutrition', 'wellness', 'business', 'beauty', 'health', 'lifestyle']
  
  // Se não é um subdomínio válido ou é o domínio principal, continuar normalmente
  if (!validSubdomains.includes(subdomain) || hostname.includes('localhost') || hostname.includes('vercel.app')) {
    return NextResponse.next()
  }
  
  // Adicionar header para identificar o subdomínio
  const response = NextResponse.next()
  response.headers.set('x-subdomain', subdomain)
  
  // Se estiver acessando uma ferramenta, adicionar contexto do subdomínio
  if (url.pathname.startsWith('/tools/')) {
    // Adicionar parâmetro de contexto do subdomínio
    url.searchParams.set('business_type', subdomain)
    return NextResponse.redirect(url)
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}