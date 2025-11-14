'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

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
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [canBypass, setCanBypass] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [profileCheckTimeout, setProfileCheckTimeout] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  // Hooks para SubscriptionExpiryBanner - sempre inicializados para manter ordem consistente
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null)
  
  // IMPORTANTE: TODOS os Hooks devem estar sempre no topo, antes de qualquer retorno condicional
  // Hook 1: Timeout do perfil
  // 🚀 OTIMIZAÇÃO: Reduzido de 1s para 0.8s (com cache do useAuth, perfil carrega mais rápido)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (!userProfile && user) {
      timer = setTimeout(() => {
        setProfileCheckTimeout(true)
      }, 800) // Reduzido de 1s para 0.8s
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

        // Verificar assinatura via API (com timeout de 5s)
        controller = new AbortController()
        const timeoutId = setTimeout(() => controller?.abort(), 5000)
        
        try {
          const response = await fetch(`/api/${area}/subscription/check`, {
            credentials: 'include',
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
          
          setHasSubscription(data.hasActiveSubscription || data.bypassed)
          setCanBypass(data.bypassed || false)

          // Se tem assinatura, buscar detalhes (em background, não bloqueia)
          if (data.hasActiveSubscription) {
            fetch(`/api/${area}/subscription`, {
              credentials: 'include',
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
  // 🚀 OTIMIZAÇÃO: Reduzido de 3s para 2s (suficiente com as otimizações do useAuth)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (checkingSubscription) {
      timer = setTimeout(() => {
        console.warn('⚠️ RequireSubscription: Verificação demorou mais de 2s, permitindo acesso temporário')
        setShowLoading(false)
        setCheckingSubscription(false)
        setHasSubscription(true)
      }, 2000) // Reduzido de 3s para 2s
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
  if (!user) {
    const loginPath = redirectTo || `/pt/${area}/login`
    router.push(loginPath)
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
    return (
      <>
        {children}
        {/* Sempre renderizar banner, mas controlar visibilidade internamente */}
        <SubscriptionExpiryBanner 
          daysUntilExpiry={daysUntilExpiry} 
          area={area} 
          subscription={subscriptionData}
          canBypass={canBypass}
        />
      </>
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

  // Se não tem assinatura, mostrar página de upgrade
  return <UpgradeRequiredPage area={area} />
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
    <div className={`fixed bottom-0 left-0 right-0 ${bgColor} border-t shadow-lg z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <span className={`${textColor} text-2xl`}>{icon}</span>
            <div>
              <p className={`text-sm font-medium ${textColor}`}>
                {message}
              </p>
              <p className={`text-xs ${textColor.replace('800', '600')} mt-1`}>
                {subMessage}
              </p>
            </div>
          </div>
          <Link
            href={`/pt/${area}/checkout?plan=${subscription?.plan_type || 'monthly'}`}
            className={`${buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap`}
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
              src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
              alt="YLADA Logo"
              width={280}
              height={84}
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
          <p className="text-lg text-gray-600 mb-8">
            Para acessar o dashboard da área {areaLabel}, você precisa de uma assinatura ativa.
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

