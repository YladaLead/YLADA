import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'

type Area = 'wellness' | 'nutri' | 'coach' | 'nutra'

interface AuthValidationResult {
  session: any
  user: any
  profile: any
  hasSubscription: boolean
  canBypass: boolean
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
      const referer = headersList.get('referer') || ''
      
      // Extrair pathname do referer
      if (referer) {
        // Procurar por padrão /pt/{area}/{rota}
        const areaPattern = `\/pt\/${area}\/(.+)`
        const match = referer.match(new RegExp(areaPattern))
        if (match && match[1]) {
          actualPath = '/' + match[1].split('?')[0] // Remover query params
        }
      }
      
      // Verificar se a rota atual está na lista de exceções
      isExcludedRoute = excludeRoutesFromSubscription.some(route => {
        const routePath = route.startsWith('/') ? route : '/' + route
        return actualPath.includes(routePath) || actualPath.startsWith(routePath)
      })
      
      if (isExcludedRoute) {
        console.log(`ℹ️ ProtectedLayout [${area}]: Rota excluída de verificação de assinatura: ${actualPath}`)
      }
    } catch (e) {
      // Se não conseguir obter, assumir que não é rota excluída
      console.warn('⚠️ Não foi possível obter pathname, assumindo rota normal:', e)
    }
  } else if (actualPath) {
    // Se currentPath foi fornecido, verificar diretamente
    isExcludedRoute = excludeRoutesFromSubscription.some(route => {
      const routePath = route.startsWith('/') ? route : '/' + route
      return actualPath.includes(routePath) || actualPath.startsWith(routePath)
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

    // 2. Verificar autenticação (usar getUser() para segurança)
    // getUser() valida com o servidor Supabase, mais seguro que getSession()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log(`❌ ProtectedLayout [${area}]: Usuário não autenticado, redirecionando para login`)
      redirect(`/pt/${area}/login`)
    }

    // 3. Buscar perfil
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, user_id, perfil, is_admin, is_support, nome_completo, email, diagnostico_completo')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error(`❌ ProtectedLayout [${area}]: Erro ao buscar perfil:`, profileError)
      redirect(`/pt/${area}/login`)
    }

    if (!profile) {
      console.log(`❌ ProtectedLayout [${area}]: Perfil não encontrado, redirecionando para login`)
      redirect(`/pt/${area}/login`)
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
      canBypass = await canBypassSubscription(user.id)
      
      if (!canBypass) {
        hasSubscription = await hasActiveSubscription(user.id, area)
        
        if (!hasSubscription) {
          // 🚨 EXCEÇÃO ESPECIAL PARA ÁREA NUTRI:
          // Se usuário não tem diagnóstico, SEMPRE permitir acesso sem assinatura
          // (usuário precisa completar diagnóstico antes de assinar)
          // O RequireDiagnostico (client-side) vai cuidar de redirecionar para onboarding se necessário
          if (area === 'nutri' && !profile.diagnostico_completo) {
            console.log(`ℹ️ ProtectedLayout [${area}]: Usuário sem diagnóstico - permitindo acesso sem assinatura`)
            hasSubscription = true // Virtualmente "tem assinatura" - permite acesso para completar diagnóstico
          } else {
            // Usuário tem diagnóstico ou não é área nutri - exige assinatura normalmente
            // 🚨 EXCEÇÃO: Não redirecionar para checkout se estiver tentando acessar onboarding ou diagnostico
            const shouldRedirectToCheckout = !isExcludedRoute
            
            if (shouldRedirectToCheckout) {
              console.log(`❌ ProtectedLayout [${area}]: Sem assinatura, redirecionando para checkout`)
              redirect(`/pt/${area}/checkout`)
            } else {
              console.log(`ℹ️ ProtectedLayout [${area}]: Rota de onboarding/diagnóstico - permitindo acesso sem assinatura`)
              hasSubscription = true // Virtualmente "tem assinatura" para essas rotas
            }
          }
        }
      } else {
        hasSubscription = true // Admin/suporte tem "assinatura" virtual
      }
    } else {
      // Se não requer assinatura, considerar como tendo
      hasSubscription = true
    }

    // Buscar sessão apenas para retornar (não para validação)
    const { data: { session } } = await supabase.auth.getSession()

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
    // Em caso de erro real, redirecionar para login
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

