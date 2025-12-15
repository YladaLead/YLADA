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
    pathname.startsWith('/videos/') || // Arquivos de vídeo estáticos
    pathname.startsWith('/images/') || // Arquivos de imagem estáticos
    pathname.startsWith('/logos/') || // Arquivos de logo estáticos
    pathname.includes('.') || // Qualquer arquivo com extensão
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

  // Redirecionar rotas de FERRAMENTAS da área Coach para /c/ (apenas links de ferramentas)
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

  // NOTA: Páginas regulares (login, home, dashboard, sales, quizzes, portais administrativos, etc.) devem permanecer em /pt/coach/
  // Apenas links de ferramentas (formulários, clientes, leads, ferramentas) são redirecionados para /c/
  // Links públicos de quizzes individuais já usam /pt/c/[user-slug]/quiz/[slug] diretamente
  // Links públicos de portais individuais já usam /pt/c/portal/[slug] diretamente
  
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
     * - videos (video files)
     * - images (image files)
     * - logos (logo files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|videos|images|logos|favicon.ico).*)',
  ],
}
