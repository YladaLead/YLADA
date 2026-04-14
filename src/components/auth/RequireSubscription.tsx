'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { getCachedSubscription, setCachedSubscription } from '@/lib/subscription-cache'
import { getAccessRule, getRenewOrCheckoutPath, getHomePath, getAreaFromPath } from '@/lib/access-rules'
import { isPerfilMatrizYlada } from '@/lib/admin-matriz-constants'

interface RequireSubscriptionProps {
  children: React.ReactNode
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  redirectTo?: string
}

/**
 * Componente que verifica se usuário tem assinatura ativa
 * Se não tiver, mostra página de upgrade
 * Admin e suporte podem bypassar
 */
export default function RequireSubscription({
  children,
  area,
  redirectTo,
}: RequireSubscriptionProps) {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [canBypass, setCanBypass] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  /** Matriz YLADA: `pro` = pago/trial/cortesia; `freedom` = free com limites do freemium (links, WhatsApp, Noel). */
  const [matrixCommercialTier, setMatrixCommercialTier] = useState<'pro' | 'freedom' | 'none' | null>(null)
  const [matrixUpgradePath, setMatrixUpgradePath] = useState<string>('/pt/precos/checkout')
  const [profileCheckTimeout, setProfileCheckTimeout] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)
  // Hooks para SubscriptionExpiryBanner - sempre inicializados para manter ordem consistente
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null)
  
  // IMPORTANTE: TODOS os Hooks devem estar sempre no topo, antes de qualquer retorno condicional
  // Hook 1: Timeout do perfil
  // 🚀 OTIMIZAÇÃO: Reduzido para 400ms (com cache, perfil carrega instantaneamente)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (!userProfile && user) {
      // 🚀 OTIMIZAÇÃO: Verificar cache primeiro antes de usar timeout
      if (typeof window !== 'undefined') {
        const cacheKey = `user_profile_${user.id}`
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            const age = Date.now() - timestamp
            const TTL = 2 * 60 * 1000 // 2 minutos
            if (age < TTL) {
              // Cache válido - não precisa timeout
              setProfileCheckTimeout(false)
              return
            }
          } catch (e) {
            // Cache inválido, continuar com timeout
          }
        }
      }
      
      timer = setTimeout(() => {
        setProfileCheckTimeout(true)
      }, 400) // Reduzido de 800ms para 400ms (com cache, raramente necessário)
    } else {
      setProfileCheckTimeout(false)
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [userProfile, user])
  
  // Hook para calcular dias até vencimento (movido de SubscriptionExpiryBanner)
  // IMPORTANTE: Sempre executar, mesmo que subscriptionData seja null
  useEffect(() => {
    if (subscriptionData?.current_period_end) {
      const expiryDate = new Date(subscriptionData.current_period_end)
      const now = new Date()
      const diffTime = expiryDate.getTime() - now.getTime()
      // Usar Math.floor para arredondar para baixo (se faltam 2.1 dias, mostra 2 dias)
      // Math.ceil estava causando erro: se faltam 2.1 dias, mostrava 3 dias
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      setDaysUntilExpiry(diffDays)
    } else {
      setDaysUntilExpiry(null)
    }
    return () => {} // Sempre retornar função de cleanup
  }, [subscriptionData])

  // Hook 2: Verificação principal de assinatura
  useEffect(() => {
    let isMounted = true
    let controller: AbortController | null = null
    
    const checkSubscription = async () => {
      if (authLoading || !user) {
        return
      }

      try {
        if (!isMounted) return
        setCheckingSubscription(true)

        // IMPORTANTE: Se admin/suporte, permitir acesso imediatamente
        if (userProfile?.is_admin || userProfile?.is_support) {
          if (!isMounted) return
          console.log('✅ RequireSubscription: Admin/Suporte detectado, bypassando verificação de assinatura')
          setCanBypass(true)
          setHasSubscription(true)
          setCheckingSubscription(false)
          setShowLoading(false)
          return
        }

        // Se não tem perfil ainda, aguardar timeout
        if (!userProfile) {
          if (profileCheckTimeout) {
            if (!isMounted) return
            console.log('⚠️ RequireSubscription: Perfil não carregou, mas timeout passou. Permitindo acesso (assumindo admin).')
            setCanBypass(true)
            setHasSubscription(true)
            setCheckingSubscription(false)
            setShowLoading(false)
            return
          }
          console.log('⏳ RequireSubscription: Perfil ainda não carregado, aguardando...')
          return
        }

        // 🚀 OTIMIZAÇÃO: Verificar cache ANTES de chamar API
        const cached = getCachedSubscription(user?.id || '', area)
        if (cached) {
          if (!isMounted) return
          console.log('✅ RequireSubscription: Usando cache de assinatura (idade:', Math.round((Date.now() - cached.timestamp) / 1000), 's)')
          setHasSubscription(cached.hasSubscription)
          setCanBypass(cached.canBypass)
          setCheckingSubscription(false)
          setShowLoading(false)
          return
        }

        // 🚀 OTIMIZAÇÃO: Cache não encontrado ou expirado, verificar via API (com timeout reduzido para 1s)
        controller = new AbortController()
        const timeoutId = setTimeout(() => controller?.abort(), 1000) // Reduzido de 1500ms para 1000ms
        
        // Obter access token para enviar no header (fallback quando cookies falharem)
        let accessToken: string | null = null
        try {
          const { createClient } = await import('@/lib/supabase-client')
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.access_token) {
            accessToken = session.access_token
          }
        } catch (tokenErr) {
          // Se falhar, continuar sem token (vai tentar com cookies)
        }
        
        // Preparar headers com access token se disponível
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`
        }
        
        try {
          const response = await fetch(`/api/${area}/subscription/check`, {
            credentials: 'include',
            headers,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!isMounted) return

          if (!response.ok) {
            console.error('❌ Erro ao verificar assinatura')
            setHasSubscription(true)
            setCheckingSubscription(false)
            return
          }

          const data = await response.json()
          if (!isMounted) return
          
          const hasActive = data.hasActiveSubscription || data.bypassed
          const canBypassValue = data.bypassed || false
          
          // 🚀 OTIMIZAÇÃO: Salvar no cache para próximas verificações
          if (user?.id) {
            setCachedSubscription(user.id, area, hasActive, canBypassValue)
          }
          
          setHasSubscription(hasActive)
          setCanBypass(canBypassValue)

          // 🚀 OTIMIZAÇÃO: Se tem assinatura, buscar detalhes em paralelo (não bloqueia)
          // Usar requestIdleCallback para não bloquear renderização
          if (data.hasActiveSubscription) {
            const fetchDetails = () => {
              if (isPerfilMatrizYlada(userProfile?.perfil)) {
                fetch('/api/matrix/commercial-tier', { credentials: 'include', headers })
                  .then((r) => (r.ok ? r.json() : null))
                  .then((tierData) => {
                    if (!isMounted || !tierData?.onMatrix) return
                    if (tierData.matrixCommercialTier) {
                      setMatrixCommercialTier(tierData.matrixCommercialTier)
                    }
                    if (typeof tierData.upgradePath === 'string' && tierData.upgradePath) {
                      setMatrixUpgradePath(tierData.upgradePath)
                    }
                  })
                  .catch(() => {})
              }

              fetch(`/api/${area}/subscription`, {
                credentials: 'include',
                headers,
              })
                .then(subResponse => {
                  if (subResponse.ok) {
                    return subResponse.json()
                  }
                })
                .then(subData => {
                  if (isMounted && subData?.subscription) {
                    setSubscriptionData(subData.subscription)
                    // Calcular dias até vencimento imediatamente
                    if (subData.subscription?.current_period_end) {
                      const expiryDate = new Date(subData.subscription.current_period_end)
                      const now = new Date()
                      const diffTime = expiryDate.getTime() - now.getTime()
                      // Usar Math.floor para arredondar para baixo (se faltam 2.1 dias, mostra 2 dias)
                      // Math.ceil estava causando erro: se faltam 2.1 dias, mostrava 3 dias
                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                      setDaysUntilExpiry(diffDays)
                    }
                  }
                })
                .catch(err => {
                  console.error('Erro ao buscar detalhes da assinatura:', err)
                })
            }
            
            // Usar requestIdleCallback se disponível, senão setTimeout
            if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
              requestIdleCallback(fetchDetails, { timeout: 2000 })
            } else {
              setTimeout(fetchDetails, 0)
            }
          }

          setCheckingSubscription(false)
        } catch (error: any) {
          clearTimeout(timeoutId)
          if (error.name === 'AbortError') {
            if (!isMounted) return
            console.warn('⚠️ Timeout ao verificar assinatura, permitindo acesso temporariamente')
            setHasSubscription(true)
            setCheckingSubscription(false)
          } else {
            throw error
          }
        }
      } catch (error) {
        if (!isMounted) return
        console.error('❌ Erro ao verificar assinatura:', error)
        setHasSubscription(true)
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
    
    // Cleanup: cancelar requisições pendentes
    return () => {
      isMounted = false
      if (controller) {
        controller.abort()
      }
    }
  }, [user, userProfile, authLoading, area, profileCheckTimeout])

  // Hook 3: Timeout para verificação de assinatura
  // 🚀 OTIMIZAÇÃO: Reduzido para 600ms (com cache, verificação é instantânea)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (checkingSubscription) {
      timer = setTimeout(() => {
        console.warn('⚠️ RequireSubscription: Verificação demorou mais de 600ms, permitindo acesso temporário')
        setShowLoading(false)
        setCheckingSubscription(false)
        setHasSubscription(true)
      }, 600) // Reduzido de 1000ms para 600ms (com cache, raramente será necessário)
    } else {
      setShowLoading(false)
    }
    
    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [checkingSubscription])

  // Hook 4: Admin/suporte bypass
  useEffect(() => {
    if (userProfile && (userProfile.is_admin || userProfile.is_support) && checkingSubscription) {
      setCanBypass(true)
      setHasSubscription(true)
      setCheckingSubscription(false)
      setShowLoading(false)
    }
    return () => {} // Sempre retornar função de cleanup
  }, [userProfile, checkingSubscription])

  // Hook 5: Timeout do perfil bypass
  useEffect(() => {
    if (profileCheckTimeout && !userProfile && user && checkingSubscription) {
      console.log('⚠️ RequireSubscription: Timeout do perfil passou, permitindo acesso (assumindo admin)')
      setCanBypass(true)
      setHasSubscription(true)
      setCheckingSubscription(false)
      setShowLoading(false)
    }
    return () => {} // Sempre retornar função de cleanup
  }, [profileCheckTimeout, userProfile, user, checkingSubscription])

  // Loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, redirecionar para login
  // IMPORTANTE: Só redirecionar se não estiver já na página de login (evitar loop)
  if (!user && !authLoading) {
    const accessRule = pathname ? getAccessRule(pathname) : null
    const loginPath = redirectTo || accessRule?.redirectIfNotAuth || `/pt/${area}/login`
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    
    // Evitar loop: não redirecionar se já está na página de login
    if (!currentPath.includes('/login') && !hasRedirected) {
      console.log('🔄 RequireSubscription: Usuário não autenticado, redirecionando para:', loginPath)
      setHasRedirected(true)
      router.replace(loginPath) // Usar replace ao invés de push
    }
    return null
  }

  // Se perfil carregou e é admin/suporte, permitir acesso imediatamente
  if (userProfile && (userProfile.is_admin || userProfile.is_support)) {
    return <>{children}</>
  }

  // IMPORTANTE: Se passou timeout do perfil E ProtectedRoute já permitiu acesso (allowAdmin=true),
  // permitir acesso imediatamente SEM depender de canBypass (que pode não ter sido atualizado ainda)
  // Isso é CRÍTICO para evitar bloqueios em produção quando o perfil demora para carregar
  // Verificar ANTES de qualquer loading state
  if (profileCheckTimeout && !userProfile && user && !authLoading) {
    console.warn('⚠️ RequireSubscription: Perfil não carregou após timeout, mas ProtectedRoute permitiu acesso (allowAdmin=true). Permitindo acesso temporário.')
    return <>{children}</>
  }

  // Se tem assinatura ou pode bypassar, mostrar conteúdo
  if (hasSubscription || canBypass) {
    // Verificar se deve mostrar banner para adicionar padding
    const isMigrated = subscriptionData?.is_migrated || subscriptionData?.requires_manual_renewal
    const shouldShowBanner = daysUntilExpiry !== null && (
      (isMigrated && daysUntilExpiry <= 30) || 
      (!isMigrated && daysUntilExpiry <= 7)
    )
    
    const showFreedomBanner =
      isPerfilMatrizYlada(userProfile?.perfil) &&
      matrixCommercialTier === 'freedom' &&
      !canBypass

    return (
      <div
        className={
          (shouldShowBanner && !canBypass) || showFreedomBanner ? 'pb-24 sm:pb-20' : ''
        }
      >
        {children}
        {showFreedomBanner && <MatrixFreedomPlanBanner upgradeHref={matrixUpgradePath} />}
        {/* Sempre renderizar banner, mas controlar visibilidade internamente */}
        <SubscriptionExpiryBanner 
          daysUntilExpiry={daysUntilExpiry} 
          area={area} 
          subscription={subscriptionData}
          canBypass={canBypass}
        />
      </div>
    )
  }

  // Loading enquanto verifica assinatura ou aguarda perfil (com timeout de 3s)
  if (checkingSubscription && showLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!userProfile ? 'Carregando perfil...' : 'Verificando assinatura...'}
          </p>
        </div>
      </div>
    )
  }
  
  if (authLoading && !userProfile && !profileCheckTimeout) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não tem assinatura, redirecionar para checkout ou home
  // NOVA LÓGICA: Redirecionar automaticamente ao invés de mostrar página de upgrade
  useEffect(() => {
    if (!hasSubscription && !canBypass && !checkingSubscription && !authLoading && user && !hasRedirected) {
      const accessRule = pathname ? getAccessRule(pathname) : null
      const detectedArea = getAreaFromPath(pathname || '') || area
      
      // Decidir para onde redirecionar:
      // 1. Se tem redirectIfNoSubscription na regra, usar isso
      // 2. Se não, redirecionar para checkout (melhor para conversão)
      const redirectPath = accessRule?.redirectIfNoSubscription || getRenewOrCheckoutPath(detectedArea)
      
      console.log('🔄 RequireSubscription: Usuário sem assinatura, redirecionando para:', redirectPath)
      setHasRedirected(true)
      
      // 🚀 OTIMIZAÇÃO: Redirecionar imediatamente (sem delay)
      router.replace(redirectPath)
      
      return () => {}
    }
  }, [hasSubscription, canBypass, checkingSubscription, authLoading, user, hasRedirected, pathname, area, router])
  
  // Se não tem assinatura, mostrar loading enquanto redireciona
  if (!hasSubscription && !canBypass && user && !checkingSubscription && !authLoading) {
    // Se já redirecionou, não renderizar nada
    if (hasRedirected) {
      return null
    }
    
    // Enquanto prepara redirecionamento, mostrar loading
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
  }
  
  // Fallback: mostrar página de upgrade (caso o redirecionamento falhe ou não tenha usuário)
  if (!hasSubscription && !canBypass && !user) {
    return <UpgradeRequiredPage area={area} />
  }
  
  // Se chegou aqui e não tem assinatura, algo deu errado - mostrar página de upgrade
  if (!hasSubscription && !canBypass) {
    return <UpgradeRequiredPage area={area} />
  }
  
  // Este return nunca deve ser alcançado se a lógica acima estiver correta
  // Mas é necessário para TypeScript
  return null
}

/** Aviso fixo para quem está no plano Freedom na matriz YLADA (freemium: diagnósticos ativos, WhatsApp, Noel). */
function MatrixFreedomPlanBanner({ upgradeHref }: { upgradeHref: string }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] px-3 py-2.5 bg-amber-50 border-t border-amber-200 text-amber-950 text-sm shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      role="status"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="leading-snug">
          <span className="font-semibold">Plano Freedom:</span> na matriz valem os limites do plano gratuito
          (diagnóstico ativo, contatos no WhatsApp por mês e análises estratégicas do Noel). No Pro esses tetos
          são ampliados ou removidos.
        </p>
        <Link
          href={upgradeHref}
          className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors"
        >
          Ver plano Pro
        </Link>
      </div>
    </div>
  )
}

/**
 * Banner mostrando quando a assinatura vai vencer
 * IMPORTANTE: Hooks foram movidos para o componente pai para manter ordem consistente
 * Este componente agora é "puro" (sem Hooks) e sempre renderizado
 */
function SubscriptionExpiryBanner({
  daysUntilExpiry,
  area,
  subscription,
  canBypass,
}: {
  daysUntilExpiry: number | null
  area: string
  subscription: any
  canBypass: boolean
}) {
  // Não mostrar se é admin/suporte ou não tem subscription
  if (canBypass || !subscription) {
    return null
  }

  // Mostrar banner se vence em 30 dias ou menos (para assinaturas migradas)
  // Ou se vence em 7 dias ou menos (para todas)
  const isMigrated = subscription?.is_migrated || subscription?.requires_manual_renewal
  const shouldShow = daysUntilExpiry !== null && (
    (isMigrated && daysUntilExpiry <= 30) || 
    (!isMigrated && daysUntilExpiry <= 7)
  )

  if (!shouldShow) {
    return null
  }

  const isUrgent = daysUntilExpiry !== null && daysUntilExpiry <= 3
  const isCritical = daysUntilExpiry !== null && daysUntilExpiry <= 1

  const bgColor = isCritical 
    ? 'bg-red-50 border-red-200' 
    : isUrgent 
    ? 'bg-orange-50 border-orange-200' 
    : 'bg-yellow-50 border-yellow-200'
  
  const textColor = isCritical 
    ? 'text-red-800' 
    : isUrgent 
    ? 'text-orange-800' 
    : 'text-yellow-800'
  
  const buttonColor = isCritical 
    ? 'bg-red-600 hover:bg-red-700' 
    : isUrgent 
    ? 'bg-orange-600 hover:bg-orange-700' 
    : 'bg-yellow-600 hover:bg-yellow-700'

  const icon = isCritical ? '🚨' : isUrgent ? '⚠️' : '📅'

  const message = isCritical
    ? `Sua assinatura vence ${daysUntilExpiry === 0 ? 'hoje' : 'amanhã'}!`
    : isUrgent
    ? `Sua assinatura vence em ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'dia' : 'dias'}`
    : `Sua assinatura vence em ${daysUntilExpiry} dias`

  const subMessage = isMigrated
    ? 'Como sua assinatura foi migrada, você precisa refazer o checkout para continuar com renovação automática.'
    : 'Renove agora para continuar aproveitando todos os recursos'

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${bgColor} border-t-2 shadow-xl z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <span className={`${textColor} text-2xl sm:text-3xl flex-shrink-0`}>{icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm sm:text-base font-bold ${textColor} mb-1`}>
                {message}
              </p>
              <p className={`text-xs sm:text-sm ${textColor.replace('800', '600')} leading-relaxed`}>
                {subMessage}
              </p>
            </div>
          </div>
          <Link
            href={`/pt/${area}/checkout?plan=${subscription?.plan_type || 'monthly'}`}
            className={`${buttonColor} text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap flex-shrink-0 w-full sm:w-auto text-center shadow-md hover:shadow-lg`}
          >
            {isMigrated ? 'Refazer Checkout' : 'Renovar Agora'}
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Página mostrada quando usuário não tem assinatura
 */
function UpgradeRequiredPage({ area }: { area: string }) {
  const areaLabels: Record<string, string> = {
    wellness: 'Wellness',
    nutri: 'Nutrição',
    coach: 'Coach',
    nutra: 'Nutra',
  }

  const areaLabel = areaLabels[area] || area

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href={`/pt/${area}`}>
            <Image
              src={area === 'wellness' 
                ? "/images/logo/wellness-horizontal.png"
                : area === 'nutri'
                ? "/images/logo/nutri-horizontal.png"
                : area === 'coach'
                ? "/images/logo/coach-horizontal.png"
                : "/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
              }
              alt={area === 'wellness' 
                ? "WELLNESS - Your Leading Data System"
                : area === 'nutri'
                ? "Nutri by YLADA"
                : area === 'coach'
                ? "Coach by YLADA"
                : "YLADA Logo"
              }
              width={area === 'wellness' ? 572 : 280}
              height={area === 'wellness' ? 150 : 84}
              className="bg-transparent object-contain h-12 sm:h-14 lg:h-16 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Ícone */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🔒</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Assinatura Necessária
          </h1>

          {/* Mensagem */}
          <p className="text-lg text-gray-600 mb-4">
            Sua assinatura da área {areaLabel} está inativa. Por segurança, todos os seus links públicos foram temporariamente desativados.
          </p>
          <p className="text-base text-gray-600 mb-8">
            Regularize a assinatura para reativar imediatamente os links, dashboards e ferramentas do seu painel.
          </p>

          {/* Benefícios */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Com sua assinatura você terá acesso a:
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Todas as ferramentas e templates disponíveis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Links personalizados com seu nome e cidade</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Tracking de visualizações e leads</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Atualizações automáticas e suporte</span>
              </li>
            </ul>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/pt/${area}/checkout?plan=monthly`}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              💚 Assinar Agora
            </Link>
            <Link
              href={`/pt/${area}`}
              className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ver Planos
            </Link>
          </div>

          {/* Ajuda */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Já tem uma assinatura?{' '}
              <Link href={`/pt/${area}/suporte`} className="text-green-600 hover:text-green-700">
                Entre em contato com nosso suporte
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

