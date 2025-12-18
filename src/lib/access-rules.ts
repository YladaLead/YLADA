/**
 * Sistema de Regras de Acesso Centralizado
 * 
 * Define quais páginas requerem autenticação e assinatura,
 * e para onde redirecionar usuários sem acesso.
 */

export type Area = 'wellness' | 'nutri' | 'coach' | 'nutra' | 'c'

export interface AccessRule {
  /** Padrão de URL que corresponde a esta regra (regex ou string) */
  pattern: string | RegExp
  /** Se esta página requer autenticação */
  requiresAuth: boolean
  /** Se esta página requer assinatura ativa */
  requiresSubscription: boolean
  /** Para onde redirecionar se não autenticado (padrão: /pt/{area}/login) */
  redirectIfNotAuth?: string
  /** Para onde redirecionar se não tem assinatura (padrão: /pt/{area}/checkout) */
  redirectIfNoSubscription?: string
  /** Se esta é uma página pública (não requer nada) */
  isPublic?: boolean
}

/**
 * Páginas que são sempre públicas (não requerem autenticação nem assinatura)
 */
const PUBLIC_PAGES: (string | RegExp)[] = [
  // Landing pages
  /^\/pt\/(wellness|nutri|coach|nutra|c)\/?$/,
  
  // Páginas de login
  /\/login$/,
  
  // Páginas de checkout (precisa estar logado, mas não precisa ter assinatura)
  /\/checkout$/,
  
  // Páginas de pagamento
  /\/pagamento-sucesso$/,
  
  // HOM gravada: /pt/wellness/[user-slug]/hom
  /^\/pt\/wellness\/[^/]+\/hom$/,
  
  // Ferramentas públicas: /pt/[area]/[user-slug]/[tool-slug]
  /^\/pt\/(wellness|nutri|coach|nutra|c)\/[^/]+\/[^/]+$/,
  
  // Portais públicos: /pt/[area]/[user-slug]/portal/[slug]
  /^\/pt\/(wellness|nutri|coach|nutra|c)\/[^/]+\/portal\/[^/]+$/,
  
  // Quizzes públicos: /pt/[area]/[user-slug]/quiz/[slug]
  /^\/pt\/(wellness|nutri|coach|nutra|c)\/[^/]+\/quiz\/[^/]+$/,
  
  // Formulários públicos: /f/[formId]
  /^\/f\/[^/]+$/,
  
  // Links curtos: /p/[code]
  /^\/p\/[^/]+$/,
  
  // Páginas de vendas/recrutamento
  /\/system\/recrutar/,
  /\/system\/vender/,
  
  // Página raiz
  /^\/$/,
]

/**
 * Páginas que requerem autenticação mas NÃO requerem assinatura
 */
const AUTH_ONLY_PAGES: (string | RegExp)[] = [
  // Checkout (precisa estar logado para fazer checkout)
  /\/checkout$/,
  
  // Páginas de suporte
  /\/suporte$/,
]

/**
 * Páginas que requerem assinatura ativa
 * Se não corresponder a nenhuma regra acima, assume que requer assinatura
 */
const SUBSCRIPTION_REQUIRED_PAGES: (string | RegExp)[] = [
  // Dashboard
  /\/dashboard/,
  /\/home$/,
  
  // Ferramentas (criar/editar)
  /\/ferramentas/,
  
  // Templates
  /\/templates/,
  
  // Configurações
  /\/configuracao/,
  
  // Leads
  /\/leads/,
  
  // Relatórios
  /\/relatorios/,
  
  // Cursos
  /\/cursos/,
  
  // Quizzes (criar/editar)
  /\/quizzes/,
  
  // Portais (criar/editar)
  /\/portals/,
  
  // Formulários (criar/editar)
  /\/formularios/,
  
  // Clientes
  /\/clientes/,
  
  // Biblioteca
  /\/biblioteca/,
  
  // Plano
  /\/plano/,
  
  // Evolução
  /\/evolucao/,
  
  // Fluxos
  /\/fluxos/,
  
  // Tutoriais
  /\/tutoriais/,
]

/**
 * Verifica se uma URL corresponde a um padrão
 */
function matchesPattern(pathname: string, pattern: string | RegExp): boolean {
  if (typeof pattern === 'string') {
    return pathname === pattern || pathname.startsWith(pattern)
  }
  return pattern.test(pathname)
}

/**
 * Verifica se uma página é pública (não requer autenticação nem assinatura)
 */
export function isPublicPage(pathname: string): boolean {
  return PUBLIC_PAGES.some(pattern => matchesPattern(pathname, pattern))
}

/**
 * Verifica se uma página requer apenas autenticação (não requer assinatura)
 */
export function isAuthOnlyPage(pathname: string): boolean {
  return AUTH_ONLY_PAGES.some(pattern => matchesPattern(pathname, pattern))
}

/**
 * Verifica se uma página requer assinatura ativa
 */
export function requiresSubscription(pathname: string): boolean {
  // Se é pública, não requer assinatura
  if (isPublicPage(pathname)) {
    return false
  }
  
  // Se requer apenas auth, não requer assinatura
  if (isAuthOnlyPage(pathname)) {
    return false
  }
  
  // Se corresponde a páginas que requerem assinatura
  if (SUBSCRIPTION_REQUIRED_PAGES.some(pattern => matchesPattern(pathname, pattern))) {
    return true
  }
  
  // Por padrão, se não é pública e não é auth-only, requer assinatura
  // (páginas protegidas dentro de /pt/[area]/)
  if (/^\/pt\/(wellness|nutri|coach|nutra|c)\//.test(pathname)) {
    return true
  }
  
  return false
}

/**
 * Verifica se uma página requer autenticação
 */
export function requiresAuth(pathname: string): boolean {
  // Se é pública, não requer autenticação
  if (isPublicPage(pathname)) {
    return false
  }
  
  // Todas as outras páginas requerem autenticação
  return true
}

/**
 * Obtém a área (wellness, nutri, coach, nutra, c) de uma URL
 */
export function getAreaFromPath(pathname: string): Area | null {
  const match = pathname.match(/^\/pt\/(wellness|nutri|coach|nutra|c)\//)
  if (match) {
    return match[1] as Area
  }
  
  // Tentar detectar área de outras formas
  if (pathname.includes('/wellness')) return 'wellness'
  if (pathname.includes('/nutri')) return 'nutri'
  if (pathname.includes('/coach') || pathname.includes('/c/')) return 'coach'
  if (pathname.includes('/nutra')) return 'nutra'
  
  return null
}

/**
 * Obtém o caminho de redirecionamento para login baseado na área
 */
export function getLoginPath(area: Area | null): string {
  if (!area) return '/pt/wellness/login'
  return `/pt/${area}/login`
}

/**
 * Obtém o caminho de redirecionamento para checkout baseado na área
 */
export function getCheckoutPath(area: Area | null): string {
  if (!area) return '/pt/wellness/checkout'
  return `/pt/${area}/checkout`
}

/**
 * Obtém o caminho de redirecionamento para home baseado na área
 */
export function getHomePath(area: Area | null): string {
  if (!area) return '/pt/wellness/home'
  return `/pt/${area}/home`
}

/**
 * Obtém regra de acesso completa para uma URL
 */
export function getAccessRule(pathname: string): AccessRule {
  const area = getAreaFromPath(pathname)
  
  // Página pública
  if (isPublicPage(pathname)) {
    return {
      pattern: pathname,
      requiresAuth: false,
      requiresSubscription: false,
      isPublic: true,
    }
  }
  
  // Página que requer apenas autenticação
  if (isAuthOnlyPage(pathname)) {
    return {
      pattern: pathname,
      requiresAuth: true,
      requiresSubscription: false,
      redirectIfNotAuth: getLoginPath(area),
    }
  }
  
  // Página que requer assinatura
  const requiresSub = requiresSubscription(pathname)
  
  return {
    pattern: pathname,
    requiresAuth: true,
    requiresSubscription: requiresSub,
    redirectIfNotAuth: getLoginPath(area),
    redirectIfNoSubscription: requiresSub ? getCheckoutPath(area) : undefined,
  }
}
















