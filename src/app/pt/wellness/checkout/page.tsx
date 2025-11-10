'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function WellnessCheckoutPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }>
        <WellnessCheckoutContent />
      </Suspense>
    </ProtectedRoute>
  )
}

function WellnessCheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userProfile, loading: authLoading } = useAuth()
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canceled = searchParams.get('canceled') === 'true'
  
  // Verificar se está pronto para checkout
  // Para checkout, não precisamos do perfil completo, apenas do user
  // O perfil será verificado na API
  const isReady = !authLoading && !!user

  useEffect(() => {
    // Detectar tipo de plano da URL
    const plan = searchParams.get('plan')
    if (plan === 'annual') {
      setPlanType('annual')
    }
  }, [searchParams])

  const handleCheckout = async () => {
    console.log('🔘 Botão de checkout clicado', { 
      hasUser: !!user, 
      userId: user?.id,
      hasProfile: !!userProfile,
      profilePerfil: userProfile?.perfil,
      isReady 
    })
    
    // Verificar se está pronto (apenas user, perfil será verificado na API)
    if (!isReady || !user) {
      console.error('❌ Não está pronto para checkout', { 
        authLoading, 
        hasUser: !!user
      })
      setError('Aguarde enquanto carregamos suas informações...')
      return
    }

    setLoading(true)
    setError(null)
    console.log('📤 Enviando requisição de checkout...')

    try {
      // Usar a nova API unificada que detecta automaticamente o gateway (Mercado Pago ou Stripe)
      const response = await fetch('/api/wellness/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          planType,
          language: 'pt', // Idioma português para Brasil
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        
        // Se for erro 401 (não autenticado), redirecionar para login
        if (response.status === 401) {
          console.error('❌ Não autenticado, redirecionando para login')
          router.push('/pt/wellness/login')
          return
        }
        
        throw new Error(data.error || 'Erro ao criar sessão de checkout')
      }

      const { url, gateway } = await response.json()

      if (!url) {
        throw new Error('URL de checkout não retornada')
      }

      // Redirecionar para checkout (Mercado Pago ou Stripe, dependendo do país)
      console.log(`🔄 Redirecionando para checkout: ${gateway}`)
      window.location.href = url
    } catch (err: any) {
      console.error('Erro no checkout:', err)
      setError(err.message || 'Erro ao processar checkout. Tente novamente.')
      setLoading(false)
    }
  }

  const planDetails = {
    monthly: {
      price: 59.90,
      priceFormatted: 'R$ 59,90',
      period: 'mês',
      description: 'Plano Mensal',
    },
    annual: {
      price: 574.80,
      priceFormatted: 'R$ 574,80',
      period: 'ano',
      description: 'Plano Anual',
      monthlyEquivalent: 47.90,
      savings: 144.00,
    },
  }

  const currentPlan = planDetails[planType]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/wellness">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finalizar Assinatura
            </h1>
            <p className="text-gray-600">
              Escolha seu plano e complete o pagamento
            </p>
          </div>

          {/* Alerta de cancelamento */}
          {canceled && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="text-sm">
                Pagamento cancelado. Você pode tentar novamente quando quiser.
              </p>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Seleção de Plano */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Plano Mensal */}
              <button
                onClick={() => setPlanType('monthly')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  planType === 'monthly'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Mensal
                  </h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    R$ 59,90
                  </div>
                  <div className="text-sm text-gray-600">/mês</div>
                </div>
              </button>

              {/* Plano Anual */}
              <button
                onClick={() => setPlanType('annual')}
                className={`p-6 rounded-lg border-2 transition-all relative ${
                  planType === 'annual'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  ECONOMIA DE 20%
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Anual
                  </h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    R$ 47,90
                  </div>
                  <div className="text-sm text-gray-600">/mês</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Total: R$ 574,80/ano
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo da Assinatura
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plano:</span>
                <span className="font-medium text-gray-900">
                  {currentPlan.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-bold text-green-600 text-lg">
                  {currentPlan.priceFormatted}
                  {planType === 'annual' && '/ano'}
                  {planType === 'monthly' && '/mês'}
                </span>
              </div>
              {planType === 'annual' && (
                <div className="flex justify-between text-green-600">
                  <span>Economia:</span>
                  <span className="font-medium">
                    R$ {currentPlan.savings}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-gray-900 text-xl">
                    {currentPlan.priceFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Checkout */}
          {!isReady ? (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg cursor-not-allowed"
            >
              ⏳ Carregando informações...
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : '💚 Continuar para Pagamento'}
            </button>
          )}

          {/* Informações de Segurança */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Pagamento seguro processado pelo Mercado Pago
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Ao continuar, você será redirecionado para a página de pagamento segura
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

