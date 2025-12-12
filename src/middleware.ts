import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Debug: log da rota
  console.log('Middleware - Rota:', pathname)
  
  // Rotas que NUNCA devem ser redirecionadas (verificar PRIMEIRO)
  if (
    pathname === '/' || // Página raiz - não redirecionar
    pathname === '/migrado' || // Página de acesso migrado - não redirecionar
    pathname.startsWith('/p/') || // IMPORTANTE: Links curtos (/p/code) - não redirecionar
    pathname.startsWith('/templates-environment') ||
    pathname.startsWith('/template/') ||
    pathname.startsWith('/calculadora-imc') ||
    pathname.startsWith('/admin') || // IMPORTANTE: Admin SEMPRE sem /pt
    pathname.startsWith('/cursos') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') || // Callback do Supabase
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    console.log('Middleware - Rota excluída (sem redirecionamento):', pathname)
    return NextResponse.next()
  }
  
  // Redirecionar /pt/w para /pt/wellness (atalho)
  if (pathname === '/pt/w' || pathname === '/pt/w/') {
    const url = request.nextUrl.clone()
    url.pathname = '/pt/wellness'
    return NextResponse.redirect(url)
  }

  // Redirecionar rotas legadas de admin-diagnósticos
  if (
    pathname === '/admin-diagnostic' ||
    pathname === '/admin-diagnosticos' ||
    pathname === '/pt/admin-diagnostic' ||
    pathname === '/pt/admin-diagnosticos'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/pt/nutri/ferramentas/templates'
    return NextResponse.redirect(url)
  }

  // Redirecionar rotas antigas da área Coach para novas rotas com /c/ (sem "coach" na URL)
  // /pt/coach/formularios/* -> /pt/c/formularios/*
  if (pathname.startsWith('/pt/coach/formularios')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/pt/coach/formularios', '/pt/c/formularios')
    return NextResponse.redirect(url)
  }

  // /pt/coach/clientes/* -> /pt/c/clientes/*
  if (pathname.startsWith('/pt/coach/clientes')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/pt/coach/clientes', '/pt/c/clientes')
    return NextResponse.redirect(url)
  }

  // /pt/coach/leads/* -> /pt/c/leads/*
  if (pathname.startsWith('/pt/coach/leads')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/pt/coach/leads', '/pt/c/leads')
    return NextResponse.redirect(url)
  }

  // /pt/coach/ferramentas/* -> /pt/c/ferramentas/*
  if (pathname.startsWith('/pt/coach/ferramentas/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/pt/coach/ferramentas/', '/pt/c/ferramentas/')
    return NextResponse.redirect(url)
  }

  // /pt/coach/portals/* -> /pt/c/portals/*
  if (pathname.startsWith('/pt/coach/portals/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/pt/coach/portals/', '/pt/c/portals/')
    return NextResponse.redirect(url)
  }

  // Redirecionar outras rotas /pt/coach/* para /pt/c/* (exceto as já tratadas acima)
  if (pathname.startsWith('/pt/coach/') && 
      !pathname.startsWith('/pt/coach/c/') && 
      !pathname.startsWith('/pt/coach/formularios') &&
      !pathname.startsWith('/pt/coach/clientes') &&
      !pathname.startsWith('/pt/coach/leads') &&
      !pathname.startsWith('/pt/coach/ferramentas/') &&
      !pathname.startsWith('/pt/coach/portals/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/pt/coach/', '/pt/c/')
    return NextResponse.redirect(url)
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
