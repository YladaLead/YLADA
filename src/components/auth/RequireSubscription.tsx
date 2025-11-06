'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

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
  
  // IMPORTANTE: Hooks devem estar sempre no topo, antes de qualquer retorno condicional
  useEffect(() => {
    if (!userProfile && user) {
      const timer = setTimeout(() => {
        setProfileCheckTimeout(true)
      }, 2000) // 2 segundos
      return () => clearTimeout(timer)
    } else {
      setProfileCheckTimeout(false)
    }
  }, [userProfile, user])

  useEffect(() => {
    const checkSubscription = async () => {
      if (authLoading || !user) {
        return
      }

      try {
        setCheckingSubscription(true)

        // IMPORTANTE: Se admin/suporte, permitir acesso imediatamente mesmo sem perfil carregado
        // Isso evita bloqueio quando o perfil está demorando para carregar
        if (userProfile?.is_admin || userProfile?.is_support) {
          console.log('✅ RequireSubscription: Admin/Suporte detectado, bypassando verificação de assinatura')
          setCanBypass(true)
          setHasSubscription(true)
          setCheckingSubscription(false)
          return
        }

        // Se não tem perfil ainda, aguardar um pouco (mas não bloquear indefinidamente)
        if (!userProfile) {
          console.log('⏳ RequireSubscription: Aguardando carregamento do perfil...')
          // Aguardar até 2 segundos para o perfil carregar
          for (let i = 0; i < 20; i++) {
            await new Promise(resolve => setTimeout(resolve, 100))
            // Verificar novamente se o perfil foi carregado
            // O useEffect será re-executado quando userProfile mudar
          }
          console.log('⏳ RequireSubscription: Aguardou 2s pelo perfil')
          
          // Após aguardar, verificar novamente se é admin/suporte
          // Se ainda não carregou mas já passou tempo suficiente, permitir temporariamente
          // O perfil pode estar demorando por problemas de RLS ou rede
        }

        // Verificar assinatura via API
        const response = await fetch(`/api/${area}/subscription/check`, {
          credentials: 'include',
        })

        if (!response.ok) {
          console.error('❌ Erro ao verificar assinatura')
          setHasSubscription(false)
          setCheckingSubscription(false)
          return
        }

        const data = await response.json()
        setHasSubscription(data.hasActiveSubscription || data.bypassed)
        setCanBypass(data.bypassed || false)

        // Se tem assinatura, buscar detalhes
        if (data.hasActiveSubscription) {
          const subResponse = await fetch(`/api/${area}/subscription`, {
            credentials: 'include',
          })
          if (subResponse.ok) {
            const subData = await subResponse.json()
            setSubscriptionData(subData.subscription)
          }
        }

        setCheckingSubscription(false)
      } catch (error) {
        console.error('❌ Erro ao verificar assinatura:', error)
        setHasSubscription(false)
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [user, userProfile, authLoading, area])

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

  // IMPORTANTE: Se é admin mas perfil ainda não carregou, permitir acesso temporariamente
  // Isso evita bloqueio quando há problemas de carregamento de perfil
  const [profileCheckTimeout, setProfileCheckTimeout] = useState(false)
  
  useEffect(() => {
    if (!userProfile && user) {
      const timer = setTimeout(() => {
        setProfileCheckTimeout(true)
      }, 2000) // 2 segundos
      return () => clearTimeout(timer)
    } else {
      setProfileCheckTimeout(false)
    }
  }, [userProfile, user])

  // Se passou timeout e ainda não tem perfil, mas tem usuário autenticado,
  // permitir acesso temporariamente (assumindo que pode ser admin)
  // Isso é especialmente importante para evitar bloqueios
  if (!userProfile && profileCheckTimeout && user && !checkingSubscription) {
    console.warn('⚠️ RequireSubscription: Perfil não carregou após 2s, permitindo acesso temporário')
    return <>{children}</>
  }

  // Se não está autenticado, redirecionar para login
  if (!user) {
    const loginPath = redirectTo || `/pt/${area}/login`
    router.push(loginPath)
    return null
  }

  // Se passou timeout e ainda não tem perfil, mas tem usuário autenticado,
  // permitir acesso temporariamente (assumindo que pode ser admin)
  // Isso é especialmente importante para evitar bloqueios
  if (!userProfile && profileCheckTimeout && user && !checkingSubscription) {
    console.warn('⚠️ RequireSubscription: Perfil não carregou após 2s, permitindo acesso temporário')
    return <>{children}</>
  }

  // Loading enquanto verifica assinatura ou aguarda perfil
  if (checkingSubscription || (authLoading && !userProfile && !profileCheckTimeout)) {
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

  // Se tem assinatura ou pode bypassar, mostrar conteúdo
  if (hasSubscription || canBypass) {
    return (
      <>
        {children}
        {/* Mostrar banner de vencimento se próximo */}
        {subscriptionData && !canBypass && (
          <SubscriptionExpiryBanner subscription={subscriptionData} area={area} />
        )}
      </>
    )
  }

  // Se não tem assinatura, mostrar página de upgrade
  return <UpgradeRequiredPage area={area} />
}

/**
 * Banner mostrando quando a assinatura vai vencer
 */
function SubscriptionExpiryBanner({
  subscription,
  area,
}: {
  subscription: any
  area: string
}) {
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null)

  useEffect(() => {
    if (subscription?.current_period_end) {
      const expiryDate = new Date(subscription.current_period_end)
      const now = new Date()
      const diffTime = expiryDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysUntilExpiry(diffDays)
    }
  }, [subscription])

  // Mostrar banner apenas se faltam 7 dias ou menos
  if (!daysUntilExpiry || daysUntilExpiry > 7) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-50 border-t border-yellow-200 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-sm font-medium text-yellow-900">
              Sua assinatura vence em {daysUntilExpiry} {daysUntilExpiry === 1 ? 'dia' : 'dias'}
            </p>
            <p className="text-xs text-yellow-700">
              Renove agora para continuar usando todas as funcionalidades
            </p>
          </div>
        </div>
        <Link
          href={`/pt/${area}/checkout?plan=${subscription.plan_type === 'annual' ? 'annual' : 'monthly'}`}
          className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Renovar Assinatura
        </Link>
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

