import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'

type Area = 'wellness' | 'nutri' | 'coach' | 'nutra'

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
            // Se referer não for URL válida, tentar regex
            const areaPattern = `\/pt\/${area}\/(.+)`
            const match = referer.match(new RegExp(areaPattern))
            if (match && match[1]) {
              pathnameFromHeader = '/' + match[1].split('?')[0]
            }
          }
        }
      }
      
      // 3. Extrair apenas a parte após /pt/{area}/
      if (pathnameFromHeader) {
        const areaPattern = `\/pt\/${area}\/(.+)`
        const match = pathnameFromHeader.match(new RegExp(areaPattern))
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
      redirect(`/pt/${area}/login`)
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
        redirect(`/pt/${area}/login`)
      }
    }

    // 4. Verificar se perfil corresponde (admin/suporte pode bypassar)
    const canBypassProfile = (allowAdmin && profile.is_admin) || (allowSupport && profile.is_support)
    
    if (profile.perfil !== area && !canBypassProfile) {
      console.log(`❌ ProtectedLayout [${area}]: Perfil incorreto (${profile.perfil}), redirecionando para login`)
      redirect(`/pt/${area}/login`)
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
          // 🚨 PRIORIDADE 1: EXCEÇÃO ESPECIAL PARA ÁREA NUTRI SEM DIAGNÓSTICO
          // Se usuário não tem diagnóstico, SEMPRE permitir acesso sem assinatura
          // (usuário precisa completar diagnóstico antes de assinar)
          // O RequireDiagnostico (client-side) vai cuidar de redirecionar para onboarding se necessário
          if (area === 'nutri' && !profile.diagnostico_completo) {
            console.log(`ℹ️ ProtectedLayout [${area}]: Usuário sem diagnóstico - permitindo acesso sem assinatura`)
            hasSubscription = true // Virtualmente "tem assinatura" - permite acesso para completar diagnóstico
          }
          // 🚨 PRIORIDADE 2: Verificar se é rota excluída (onboarding/diagnóstico)
          // Se for rota excluída, SEMPRE permitir acesso sem assinatura
          else if (isExcludedRoute) {
            console.log(`ℹ️ ProtectedLayout [${area}]: Rota excluída (onboarding/diagnóstico) - permitindo acesso sem assinatura`)
            hasSubscription = true // Virtualmente "tem assinatura" para essas rotas
          } else {
            // Usuário tem diagnóstico ou não é área nutri - exige assinatura normalmente
            console.log(`❌ ProtectedLayout [${area}]: Sem assinatura e não é exceção, redirecionando para checkout`, {
              area,
              hasDiagnostico: profile.diagnostico_completo,
              isExcludedRoute,
              actualPath
            })
            redirect(`/pt/${area}/checkout`)
          }
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
    redirect(`/pt/${area}/login`)
  }
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

