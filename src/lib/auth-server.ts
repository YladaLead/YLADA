import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'

type Area = 'wellness' | 'nutri' | 'coach' | 'nutra' | 'ylada' | 'psi' | 'psicanalise' | 'odonto'

interface AuthValidationResult {
  session: any
  user: any
  profile: any
  hasSubscription: boolean
  canBypass: boolean
}

function isNetworkError(err: any): boolean {
  const msg = (err?.message || '').toString().toLowerCase()
  return (
    msg.includes('fetch failed') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout') ||
    msg.includes('enotfound') ||
    msg.includes('network') ||
    err?.status === 0
  )
}

/**
 * Helper para validação completa de autenticação no server-side
 * Usado em layouts protegidos
 */
export async function validateProtectedAccess(
  area: Area,
  options: {
    requireSubscription?: boolean
    allowAdmin?: boolean
    allowSupport?: boolean
    excludeRoutesFromSubscription?: string[] // Rotas que não exigem assinatura
    currentPath?: string // Pathname atual (opcional)
  } = {}
): Promise<AuthValidationResult> {
  const {
    requireSubscription = true,
    allowAdmin = true,
    allowSupport = true,
    excludeRoutesFromSubscription = [],
    currentPath = '',
  } = options
  
  // Tentar obter pathname da requisição atual
  let actualPath = currentPath
  let isExcludedRoute = false
  
  if (!actualPath && excludeRoutesFromSubscription.length > 0) {
    try {
      const headersList = await headers()
      
      // 🚨 CORREÇÃO: Tentar obter pathname de múltiplas fontes
      // 1. Tentar do header 'x-pathname' (se middleware definir)
      let pathnameFromHeader = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
      
      // 2. Se não tiver, tentar do referer
      if (!pathnameFromHeader) {
        const referer = headersList.get('referer') || ''
        if (referer) {
          // Extrair pathname do referer (URL completa)
          try {
            const refererUrl = new URL(referer)
            pathnameFromHeader = refererUrl.pathname
          } catch (e) {
            // Se referer não for URL válida, tentar regex (ylada usa /pt/..., outras áreas /pt/{area}/...)
            const areaPattern = area === 'ylada' ? /\/pt\/(.+)/ : new RegExp(`\\/pt\\/${area}\\/(.+)`)
            const match = referer.match(areaPattern)
            if (match && match[1]) {
              pathnameFromHeader = '/' + match[1].split('?')[0]
            }
          }
        }
      }
      
      // 3. Extrair apenas a parte após /pt/ (ylada) ou /pt/{area}/ (demais áreas)
      if (pathnameFromHeader) {
        const areaPattern = area === 'ylada' ? /\/pt\/(.+)/ : new RegExp(`\\/pt\\/${area}\\/(.+)`)
        const match = pathnameFromHeader.match(areaPattern)
        if (match && match[1]) {
          actualPath = '/' + match[1].split('?')[0] // Remover query params
        } else if (pathnameFromHeader.startsWith('/')) {
          // Se já começa com /, usar diretamente (pode ser pathname completo)
          actualPath = pathnameFromHeader.split('?')[0]
        }
      }
      
      // Verificar se a rota atual está na lista de exceções
      if (actualPath) {
        isExcludedRoute = excludeRoutesFromSubscription.some(route => {
          const routePath = route.startsWith('/') ? route : '/' + route
          // Verificar se actualPath contém ou começa com routePath
          return actualPath === routePath || actualPath.startsWith(routePath + '/') || actualPath.includes(routePath)
        })
        
        if (isExcludedRoute) {
          console.log(`ℹ️ ProtectedLayout [${area}]: Rota excluída de verificação de assinatura: ${actualPath}`)
        } else {
          console.log(`ℹ️ ProtectedLayout [${area}]: Rota NÃO excluída: ${actualPath}`)
        }
      }
    } catch (e) {
      // Se não conseguir obter, assumir que não é rota excluída
      console.warn('⚠️ Não foi possível obter pathname, assumindo rota normal:', e)
    }
  } else if (actualPath) {
    // Se currentPath foi fornecido, verificar diretamente
    isExcludedRoute = excludeRoutesFromSubscription.some(route => {
      const routePath = route.startsWith('/') ? route : '/' + route
      return actualPath === routePath || actualPath.startsWith(routePath + '/') || actualPath.includes(routePath)
    })
  }
  
  // Se for rota excluída, não exigir assinatura
  const shouldRequireSubscription = requireSubscription && !isExcludedRoute

  try {
    // Validar variáveis de ambiente
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error(`❌ ProtectedLayout [${area}]: Variáveis de ambiente do Supabase não configuradas`)
      throw new Error('Supabase não configurado')
    }

    // 1. Criar cliente Supabase server-side
    const cookieStore = await cookies()
    
    // 🚨 DEBUG: Verificar se há cookies de sessão
    const allCookies = cookieStore.getAll()
    const hasAuthCookies = allCookies.some(c => 
      c.name.includes('sb-') || c.name.includes('supabase') || c.name.includes('auth')
    )
    
    if (!hasAuthCookies) {
      console.log(`⚠️ ProtectedLayout [${area}]: Nenhum cookie de autenticação encontrado`, {
        totalCookies: allCookies.length,
        cookieNames: allCookies.map(c => c.name)
      })
    }
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Cookies serão setados automaticamente pela resposta
          },
        },
      }
    )

    // 2. Verificar autenticação
    // 🚨 CORREÇÃO: Tentar getSession() primeiro (mais rápido e confiável no server-side)
    // No server-side, getSession() lê dos cookies, que é a fonte de verdade
    let user = null
    let userError = null
    let session = null // Declarar session aqui para usar em todo o escopo
    
    // Primeiro tentar getSession() (lê dos cookies no server)
    const sessionResult = await supabase.auth.getSession()
    session = sessionResult.data?.session || null
    
    if (session?.user) {
      user = session.user
      console.log(`✅ ProtectedLayout [${area}]: Usuário autenticado via getSession() para user:`, user.email)
    } else {
      // Fallback: Tentar getUser() se getSession() não retornar sessão
      // Isso pode acontecer se os cookies não estiverem sincronizados
      const getUserResult = await supabase.auth.getUser()
      user = getUserResult.data?.user || null
      userError = getUserResult.error || null
      
      if (user) {
        console.log(`✅ ProtectedLayout [${area}]: Usuário autenticado via getUser() (fallback) para user:`, user.email)
        // Se getUser() funcionou mas getSession() não, tentar buscar sessão novamente
        if (!session) {
          const sessionResultRetry = await supabase.auth.getSession()
          session = sessionResultRetry.data?.session || null
        }
      } else {
        console.log(`⚠️ ProtectedLayout [${area}]: getSession() e getUser() não retornaram usuário`, { 
          sessionExists: !!session, 
          hasAccessToken: !!session?.access_token,
          getUserError: userError?.message 
        })
      }
    }

    if (userError || !user) {
      console.log(`❌ ProtectedLayout [${area}]: Usuário não autenticado, redirecionando para login`, {
        hasError: !!userError,
        errorMessage: userError?.message,
        hasUser: !!user,
        hasSession: !!session,
        hasAccessToken: !!session?.access_token
      })
      redirect(area === 'ylada' ? '/pt/login' : `/pt/${area}/login`)
    }

    // 3. Buscar perfil
    let profile: any = null
    let profileError: any = null

    try {
      const res = await supabase
        .from('user_profiles')
        .select('id, user_id, perfil, is_admin, is_support, nome_completo, email, diagnostico_completo')
        .eq('user_id', user.id)
        .maybeSingle()

      profile = res.data
      profileError = res.error
    } catch (e: any) {
      profileError = e
    }

    // Fallback: em caso de instabilidade, tentar via service role (menos dependência de auth).
    if ((profileError || !profile) && supabaseAdmin) {
      try {
        const adminRes = await supabaseAdmin
          .from('user_profiles')
          .select('id, user_id, perfil, is_admin, is_support, nome_completo, email, diagnostico_completo')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!adminRes.error && adminRes.data) {
          profile = adminRes.data
          profileError = null
        } else if (adminRes.error) {
          profileError = profileError || adminRes.error
        }
      } catch (e: any) {
        profileError = profileError || e
      }
    }

    // Último fallback: em DEV, não “deslogar” por falha de rede.
    if (!profile) {
      if (process.env.NODE_ENV !== 'production' && isNetworkError(profileError)) {
        console.warn(`⚠️ ProtectedLayout [${area}]: Falha de rede ao buscar perfil. Permitindo fallback em DEV.`)
        profile = {
          id: null,
          user_id: user.id,
          perfil: area,
          is_admin: false,
          is_support: true,
          nome_completo: user?.user_metadata?.full_name || null,
          email: user?.email || null,
          diagnostico_completo: true,
        }
        profileError = null
      } else {
        console.error(`❌ ProtectedLayout [${area}]: Erro ao buscar perfil:`, profileError)
        redirect(area === 'ylada' ? '/pt/login' : `/pt/${area}/login`)
      }
    }

    // 4. Verificar se perfil corresponde (admin/suporte pode bypassar)
    const canBypassProfile = (allowAdmin && profile.is_admin) || (allowSupport && profile.is_support)
    const profileMatchesArea = profile.perfil === area || (area === 'ylada' && profile.perfil === 'med')

    if (!profileMatchesArea && !canBypassProfile) {
      console.log(`❌ ProtectedLayout [${area}]: Perfil incorreto (${profile.perfil}), redirecionando para login`)
      redirect(area === 'ylada' ? '/pt/login' : `/pt/${area}/login`)
    }

    // 5. Verificar assinatura (se necessário)
    let hasSubscription = false
    let canBypass = false

    if (shouldRequireSubscription) {
      // DEV: não bloquear navegação por assinatura (evita loop quando Supabase oscila).
      if (process.env.NODE_ENV !== 'production') {
        hasSubscription = true
        canBypass = true
      } else {
      canBypass = await canBypassSubscription(user.id)
      
      if (!canBypass) {
        hasSubscription = await hasActiveSubscription(user.id, area)
        
        if (!hasSubscription) {
          // Sem assinatura: redirecionar para planos. Nenhuma exceção (onboarding/diagnóstico deixam de ser livres).
          console.log(`❌ ProtectedLayout [${area}]: Sem assinatura ativa, redirecionando para checkout`, {
            area,
            actualPath
          })
          redirect(area === 'ylada' ? '/pt/checkout' : `/pt/${area}/checkout`)
        }
      } else {
        hasSubscription = true // Admin/suporte tem "assinatura" virtual
      }
      }
    } else {
      // Se não requer assinatura, considerar como tendo
      hasSubscription = true
    }

    // Buscar sessão apenas para retornar (não para validação)
    // 🚨 CORREÇÃO: session já foi declarado e buscado acima, apenas garantir que está disponível
    // Se por algum motivo session ainda não foi definido, buscar novamente
    if (!session) {
      const sessionResultForReturn = await supabase.auth.getSession()
      session = sessionResultForReturn.data?.session || null
    }

    return {
      session,
      user,
      profile,
      hasSubscription,
      canBypass,
    }
  } catch (error: any) {
    // Next.js redirect() lança uma exceção especial (NEXT_REDIRECT)
    // Não capturar redirects, apenas outros erros
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error // Re-lançar redirect
    }
    
    console.error(`❌ ProtectedLayout [${area}]: Erro na validação:`, error)
    // Em DEV, não redirecionar para login por falha de rede (evita loop).
    if (process.env.NODE_ENV !== 'production' && isNetworkError(error)) {
      console.warn(`⚠️ ProtectedLayout [${area}]: Falha de rede em DEV. Permitindo acesso com fallback.`)
      return {
        session: null,
        user: null,
        profile: null,
        hasSubscription: true,
        canBypass: true,
      }
    }
    redirect(area === 'ylada' ? '/pt/login' : `/pt/${area}/login`)
  }
}

/**
 * Rotas da área wellness que NÃO exigem assinatura (acesso público ou pós-login sem assinatura).
 * Qualquer outra rota /pt/wellness/* exige login + assinatura ativa.
 */
const WELLNESS_PUBLIC_PREFIXES: (string | RegExp)[] = [
  '/pt/wellness/login',
  '/pt/wellness/checkout',
  '/pt/wellness/pagamento-sucesso',
  '/pt/wellness/trial',
  '/pt/wellness/recuperar-senha',
  '/pt/wellness/recuperar-acesso',
  '/pt/wellness/reset-password',
  '/pt/wellness/bem-vindo',
  '/pt/wellness/acesso',
  '/pt/wellness/testar-email',
  /^\/pt\/wellness\/templates(\/|$)/,
  /^\/pt\/wellness\/portal\/[^/]+$/, // portal/[slug] público
  // Links públicos por user-slug: /pt/wellness/[user-slug]/[tool-slug], quiz, portal, hom
  /^\/pt\/wellness\/[^/]+\/(hom|quiz|portal|formulario)(\/|$)/,
  /^\/pt\/wellness\/[^/]+\/[^/]+\/.+/, // 3+ segmentos após wellness = link público
]

/** Segmentos que são rotas da aplicação (área logada), não user-slug. */
const WELLNESS_APP_SEGMENTS = new Set([
  'dashboard', 'home', 'system', 'ferramentas', 'cursos', 'portals', 'modulos', 'treinos', 'links',
  'configuracao', 'tutoriais', 'plano', 'comunidade', 'suporte', 'conta', 'biblioteca', 'fluxos',
  'perfil', 'evolucao', 'clientes', 'workshop', 'noel', 'filosofia-lada', 'quizzes', 'acesso',
  'bem-vindo', 'trial', 'pagamento-sucesso', 'reset-password', 'recuperar-senha', 'recuperar-acesso',
  'testar-email', 'templates', 'portal', 'login', 'checkout',
])

/**
 * Retorna true se o pathname é uma rota pública da área wellness (não exige assinatura).
 */
export function isWellnessPublicPath(pathname: string): boolean {
  return isAreaPublicPath(pathname, 'wellness', WELLNESS_PUBLIC_PREFIXES, WELLNESS_APP_SEGMENTS)
}

/** Rotas Nutri que NÃO exigem assinatura. */
const NUTRI_PUBLIC_PREFIXES: (string | RegExp)[] = [
  '/pt/nutri/login',
  '/pt/nutri/checkout',
  '/pt/nutri/cadastro',
  '/pt/nutri/pagamento-sucesso',
  '/pt/nutri/recuperar-senha',
  '/pt/nutri/reset-password',
  /^\/pt\/nutri\/portal\/[^/]+$/, // portal público
  /^\/pt\/nutri\/[^/]+\/(quiz|formulario)(\/|$)/,
  /^\/pt\/nutri\/[^/]+\/[^/]+\/.+/,
]

const NUTRI_APP_SEGMENTS = new Set([
  'dashboard', 'home', 'ferramentas', 'metodo', 'formacao', 'clientes', 'leads', 'formularios',
  'diagnostico', 'onboarding', 'agenda', 'anotacoes', 'configuracao', 'portals', 'cursos',
  'acompanhamento', 'quizzes', 'relatorios-gestao', 'gsal', 'suporte', 'workshop', 'video',
  'quiz-personalizado', 'descobrir', 'pagamento-sucesso', 'recuperar-senha', 'reset-password',
  'login', 'checkout', 'cadastro', 'portals', 'portal', 'configuracoes', 'relatorios',
])

export function isNutriPublicPath(pathname: string): boolean {
  return isAreaPublicPath(pathname, 'nutri', NUTRI_PUBLIC_PREFIXES, NUTRI_APP_SEGMENTS)
}

/** Rotas Coach que NÃO exigem assinatura. */
const COACH_PUBLIC_PREFIXES: (string | RegExp)[] = [
  '/pt/coach/login',
  '/pt/coach/checkout',
  '/pt/coach/pagamento-sucesso',
  '/pt/coach/recuperar-senha',
  '/pt/coach/reset-password',
  /^\/pt\/coach\/portal\/[^/]+$/,
  /^\/pt\/coach\/[^/]+\/(quiz|formulario)(\/|$)/,
  /^\/pt\/coach\/[^/]+\/[^/]+\/.+/,
]

const COACH_APP_SEGMENTS = new Set([
  'dashboard', 'home', 'ferramentas', 'clientes', 'formularios', 'configuracao', 'portals',
  'cursos', 'acompanhamento', 'quizzes', 'leads', 'agenda', 'relatorios-gestao', 'protocolos',
  'login', 'checkout', 'pagamento-sucesso', 'recuperar-senha', 'reset-password', 'portal',
  'c', 'configuracoes', 'relatorios', 'suporte', 'quiz-personalizado',
])

export function isCoachPublicPath(pathname: string): boolean {
  return isAreaPublicPath(pathname, 'coach', COACH_PUBLIC_PREFIXES, COACH_APP_SEGMENTS)
}

function isAreaPublicPath(
  pathname: string,
  area: 'wellness' | 'nutri' | 'coach',
  publicPrefixes: (string | RegExp)[],
  appSegments: Set<string>
): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  const areaPath = `/pt/${area}`
  if (path === areaPath) return true
  for (const p of publicPrefixes) {
    if (typeof p === 'string') {
      if (path === p || path.startsWith(p + '/')) return true
    } else if (p.test(path)) return true
  }
  const match = path.match(new RegExp(`^/pt/${area}/([^/]+)(?:/|$)`))
  if (match && match[1] && !appSegments.has(match[1])) return true
  return false
}

/**
 * Helper simplificado para apenas verificar sessão (sem assinatura)
 * Útil para páginas que requerem apenas autenticação
 */
export async function requireAuthOnly(area: Area): Promise<AuthValidationResult> {
  return validateProtectedAccess(area, {
    requireSubscription: false,
  })
}

