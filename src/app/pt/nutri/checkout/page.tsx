'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function NutriCheckoutPage() {
  const router = useRouter()
  const { user, userProfile, loading: authLoading } = useAuth()
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)
  const [email, setEmail] = useState('')
  
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
    console.log('🔍 Checkout Nutri - Estado de autenticação:', {
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
      } else if (plan === 'monthly') {
        setPlanType('monthly')
      }
      
      if (canceledParam === 'true') {
        setCanceled(true)
      }
    }
  }, [])

  const handleCheckout = async () => {
    console.log('🔘 ========================================')
    console.log('🔘 BOTÃO DE CHECKOUT CLICADO (NUTRI)')
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

      // Usar a API de checkout para Nutri
      const response = await fetch('/api/nutri/checkout', {
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
      price: 297.00,
      priceFormatted: 'R$ 297,00',
      period: 'mês',
      description: 'Plano Mensal',
    },
    annual: {
      price: 2364.00, // Valor total anual (12× de R$ 197)
      priceFormatted: 'R$ 2.364,00',
      period: 'ano',
      description: 'Plano Anual',
      monthlyEquivalent: 197.00, // Equivalente mensal (12× de R$ 197)
      savings: 0, // Sem economia no plano anual
    },
  }

  const currentPlan = planDetails[planType]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/nutri">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="Nutri by YLADA"
              width={280}
              height={84}
              className="bg-transparent object-contain h-14 sm:h-16 lg:h-20 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
          {/* Botão Voltar */}
          <button
            onClick={() => router.push('/pt/nutri')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            aria-label="Voltar para página de vendas"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline font-medium">Voltar</span>
          </button>
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

          {/* Seleção de Plano */}
          <div className="mb-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Plano Mensal */}
              <button
                onClick={() => setPlanType('monthly')}
                className={`p-6 rounded-lg border-2 transition-all relative ${
                  planType === 'monthly'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="text-center">
                  {planType === 'monthly' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      SELECIONADO
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Mensal
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    R$ 297,00
                  </div>
                  <div className="text-sm text-gray-600">/mês</div>
                </div>
              </button>

              {/* Plano Anual */}
              <button
                onClick={() => setPlanType('annual')}
                className={`p-6 rounded-lg border-2 transition-all relative ${
                  planType === 'annual'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </div>
                {planType === 'annual' && (
                  <div className="absolute -top-3 right-4 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded">
                    SELECIONADO
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Anual
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    R$ 197
                  </div>
                  <div className="text-sm text-gray-600">/mês</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Total: R$ 2.364,00/ano (12× de R$ 197)
                  </div>
                </div>
              </button>
            </div>
          </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                {user 
                  ? 'Seu e-mail será usado para o pagamento. Você pode alterar se necessário.'
                  : 'Seu e-mail será usado para criar sua conta automaticamente após o pagamento.'
                }
              </p>
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
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : '💙 Continuar para Pagamento'}
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
