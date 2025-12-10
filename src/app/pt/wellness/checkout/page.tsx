'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function WellnessCheckoutPage() {
  const router = useRouter()
  const { user, userProfile, loading: authLoading } = useAuth()
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)
  const [email, setEmail] = useState('')
  const [planFromUrl, setPlanFromUrl] = useState<boolean>(false)
  
  // IMPORTANTE: Esta página NÃO requer autenticação
  // Permitir visualizar sempre, mesmo sem login
  // O checkout funciona apenas com e-mail

  // Resetar loading se travar por mais de 30 segundos
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        if (loading) {
          console.warn('⚠️ Loading travado há mais de 30s, resetando...')
          setLoading(false)
          setError('O processo demorou muito. Por favor, verifique sua conexão e tente novamente.')
        }
      }, 30000) // 30 segundos
      return () => clearTimeout(timeout)
    }
  }, [loading])

  // Log de debug para verificar estado de autenticação
  useEffect(() => {
    console.log('🔍 Checkout - Estado de autenticação:', {
      hasUser: !!user,
      userId: user?.id,
      authLoading,
      loading,
      email,
      timestamp: new Date().toISOString()
    })
  }, [user, authLoading, loading, email])

  // Detectar parâmetros da URL usando window.location (mais confiável)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const plan = params.get('plan')
      const canceledParam = params.get('canceled')
      
      if (plan === 'annual') {
        setPlanType('annual')
        setPlanFromUrl(true)
      } else if (plan === 'monthly') {
        setPlanType('monthly')
        setPlanFromUrl(true)
      }
      
      if (canceledParam === 'true') {
        setCanceled(true)
      }
    }
  }, [])

  const handleCheckout = async () => {
    console.log('🔘 ========================================')
    console.log('🔘 BOTÃO DE CHECKOUT CLICADO')
    console.log('🔘 ========================================')
    console.log('🔘 Estado:', { 
      hasUser: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      emailField: email,
      planType,
      authLoading,
    })
    
    // Determinar e-mail a usar (prioridade: campo email > user.email)
    const userEmail = email || user?.email || ''
    console.log('🔘 E-mail a usar:', userEmail)
    
    // Validar e-mail (obrigatório sempre)
    if (!userEmail || !userEmail.includes('@')) {
      console.error('❌ E-mail inválido:', userEmail)
      setError('Por favor, informe seu e-mail para continuar.')
      setLoading(false)
      return
    }
    
    console.log('🔘 ✅ Validações passadas, iniciando checkout...')

    setLoading(true)
    setError(null)
    console.log('📤 Enviando requisição de checkout...', {
      planType,
      userEmail,
      hasUser: !!user,
    })

    // Criar AbortController para timeout (fora do try para estar disponível no catch)
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | null = null

    try {
      timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

      // Usar a nova API unificada que detecta automaticamente o gateway (Mercado Pago ou Stripe)
      // AGORA ACEITA CHECKOUT SEM AUTENTICAÇÃO (apenas e-mail)
      const response = await fetch('/api/wellness/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({ 
          planType,
          language: 'pt', // Idioma português para Brasil
          email: userEmail, // E-mail (obrigatório mesmo se autenticado)
          // Plano mensal sempre usa assinatura automática (cartão)
          // Plano anual sempre usa assinatura recorrente (cartão)
        }),
      })

      if (timeoutId) clearTimeout(timeoutId)

      console.log('📥 Resposta recebida:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      })

      if (!response.ok) {
        let errorMessage = 'Erro ao criar sessão de checkout'
        
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
          console.error('❌ Erro da API:', data)
        } catch (parseError) {
          console.error('❌ Erro ao parsear resposta:', parseError)
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Dados recebidos:', {
        hasUrl: !!data.url,
        gateway: data.gateway,
        sessionId: data.sessionId,
      })

      if (!data.url) {
        throw new Error('URL de checkout não retornada pela API')
      }

      // Redirecionar para checkout (Mercado Pago ou Stripe, dependendo do país)
      console.log(`🔄 Redirecionando para checkout: ${data.gateway}`)
      window.location.href = data.url
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId)
      
      if (err.name === 'AbortError') {
        console.error('⏱️ Timeout na requisição de checkout')
        setError('A requisição demorou muito. Por favor, verifique sua conexão e tente novamente.')
      } else {
        console.error('❌ Erro no checkout:', {
          name: err.name,
          message: err.message,
          stack: err.stack,
        })
        setError(err.message || 'Erro ao processar checkout. Tente novamente.')
      }
      setLoading(false)
    }
  }

  const planDetails = {
    monthly: {
      price: 97.00,
      priceFormatted: 'R$ 97,00',
      period: 'mês',
      description: 'Plano Mensal',
    },
    annual: {
      price: 718.80, // Valor total (12x de R$ 59,90)
      priceFormatted: 'R$ 718,80',
      period: 'ano',
      description: 'Plano Anual',
      monthlyEquivalent: 59.90, // 12x de R$ 59,90 (parcelado pelo vendedor)
      totalParcelado: 718.80, // Total parcelado
      savings: 445.20, // (97.00 * 12) - 718.80 = 1164.00 - 718.80 = 445.20
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
              src="/images/logo/wellness-horizontal.png"
              alt="WELLNESS - Your Leading Data System"
              width={572}
              height={150}
              className="bg-transparent object-contain h-14 sm:h-16 lg:h-20 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">

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

          {/* Seleção de Plano - Só mostra se não veio da URL */}
          {!planFromUrl && (
            <div className="mb-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Plano Mensal */}
                <button
                  onClick={() => setPlanType('monthly')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    planType === 'monthly'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Mensal
                    </h3>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      R$ 97,00
                    </div>
                    <div className="text-sm text-gray-600">/mês</div>
                  </div>
                </button>

                {/* Plano Anual - Sempre com fundo verde */}
                <button
                  onClick={() => setPlanType('annual')}
                  className="p-6 rounded-lg border-2 border-green-500 bg-green-50 transition-all relative hover:bg-green-100"
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    RECOMENDADO
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Anual
                    </h3>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      R$ 59,90
                    </div>
                    <div className="text-sm text-gray-600">/mês</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Total: R$ 718,80/ano (12x de R$ 59,90)
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Mostrar plano selecionado quando veio da URL */}
          {planFromUrl && (
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {planType === 'annual' ? 'Plano Anual' : 'Plano Mensal'}
                  </h3>
                  {planType === 'annual' ? (
                    <>
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        12x de R$ 59,90
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Total: R$ 718,80/ano
                      </div>
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      R$ 97,00
                    </div>
                  )}
                  <div className="text-sm text-gray-600">/mês</div>
                </div>
              </div>
            </div>
          )}

          {/* Campo de E-mail (se não estiver logado ou ainda carregando) */}
          {(!user || authLoading) && (
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail {user && '(você está logado, mas pode alterar se necessário)'}
              </label>
              <input
                id="email"
                type="email"
                value={email || user?.email || ''}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                {user 
                  ? 'Seu e-mail será usado para o pagamento. Você pode alterar se necessário.'
                  : 'Seu e-mail será usado para criar sua conta automaticamente após o pagamento.'
                }
              </p>
            </div>
          )}

          {/* Aviso sobre Parcelamento (Plano Anual) */}
          {planType === 'annual' && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    💳 Parcelamento Disponível
                  </h3>
                  <p className="text-sm text-blue-800">
                    Após preencher os dados do seu cartão na próxima página, você poderá escolher <strong>12x de R$ 59,90</strong>. O parcelamento aparecerá automaticamente após inserir o número do cartão.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Checkout */}
          <button
            onClick={(e) => {
              e.preventDefault()
              console.log('🔘 Botão clicado - Estado:', { loading, authLoading, hasUser: !!user, hasEmail: !!email, emailValue: email || user?.email })
              // Permitir checkout se tiver e-mail, mesmo que authLoading seja true
              const hasEmail = email || user?.email
              if (!loading && hasEmail) {
                handleCheckout()
              } else {
                console.warn('⚠️ Botão clicado mas está desabilitado:', { loading, authLoading, hasEmail })
              }
            }}
            disabled={loading || (!user && !email)}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : '💚 Continuar para Pagamento'}
          </button>

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

