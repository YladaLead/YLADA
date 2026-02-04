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
    pathname.startsWith('/f/') || // IMPORTANTE: Formulários públicos (/f/formId) - não redirecionar
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
    const res = NextResponse.next()
    // Ajuda layouts protegidos a detectarem a rota real (evita depender de referer).
    res.headers.set('x-pathname', pathname)
    return res
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

  // NOTA: Páginas administrativas devem permanecer em /pt/coach/
  // Apenas links públicos de ferramentas usam /c/:
  // - Formulários públicos: /pt/c/[user-slug]/formulario/[slug]
  // - Ferramentas públicas: /pt/c/[user-slug]/[tool-slug]
  // - Quizzes públicos: /pt/c/[user-slug]/quiz/[slug]
  // - Portais públicos: /pt/c/portal/[slug]
  // 
  // Páginas administrativas (formularios, clientes, leads, etc.) NÃO devem ser redirecionadas
  // Elas devem permanecer em /pt/coach/ para manter a consistência

  // /us = inglês (EUA): redirecionar para /en para evitar /pt/us e 404
  if (pathname === '/us' || pathname === '/us/') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/us/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/en' + pathname.slice(4)
    return NextResponse.redirect(url)
  }
  // /pt/us ou /pt/us/... (URL antiga): redirecionar para /en
  if (pathname === '/pt/us' || pathname === '/pt/us/') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/pt/us/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/en' + pathname.slice(6)
    return NextResponse.redirect(url)
  }
  
  // Verificar se já tem idioma na URL (pt, en, es)
  const hasLanguage = pathname.startsWith('/pt') || pathname.startsWith('/en') || pathname.startsWith('/es')
  
  // Se não tem idioma, redirecionar para português
  if (!hasLanguage) {
    console.log('Middleware - Redirecionando para /pt:', pathname)
    const url = request.nextUrl.clone()
    url.pathname = `/pt${pathname}`
    return NextResponse.redirect(url)
  }
  
  console.log('Middleware - Permitindo:', pathname)
  const res = NextResponse.next()
  // Ajuda layouts protegidos a detectarem a rota real (evita depender de referer).
  res.headers.set('x-pathname', pathname)
  return res
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
