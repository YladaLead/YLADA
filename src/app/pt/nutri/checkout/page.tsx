'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { trackNutriCheckoutAnnual } from '@/lib/facebook-pixel'

export default function NutriCheckoutPage() {
  const router = useRouter()
  const { user, userProfile, loading: authLoading } = useAuth()
  // Área Nutri: único plano vendido é o anual (sem mensal e sem trial de 3 dias)
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('annual')
  const [planLocked, setPlanLocked] = useState(false)
  const [productTypeOverride, setProductTypeOverride] = useState<
    'platform_monthly' | 'platform_monthly_12x' | 'platform_annual' | 'formation_only' | null
  >(null)
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

  // ref=paula (ou outro) para atribuir venda ao vendedor
  const [refVendedor, setRefVendedor] = useState<string | null>(null)

  // Detectar parâmetros da URL usando window.location (mais confiável)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const plan = params.get('plan')
      const canceledParam = params.get('canceled')
      const productTypeParam = params.get('productType')
      const ref = params.get('ref')
      if (ref && ref.trim()) {
        setRefVendedor(ref.trim())
      }
      
      if (plan === 'annual') {
        setPlanType('annual')
        setPlanLocked(true)
        trackNutriCheckoutAnnual()
      } else {
        // Nutri vende apenas plano anual; ?plan=monthly ou sem plan → forçar anual
        setPlanType('annual')
        if (plan === 'monthly' && typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.set('plan', 'annual')
          window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString())
        }
        trackNutriCheckoutAnnual()
      }

      // Suportar link direto para "terceiro produto" (mensal parcelado em até 12x)
      // Exemplo: /pt/nutri/checkout?plan=monthly&productType=platform_monthly_12x
      if (
        productTypeParam &&
        ['platform_monthly', 'platform_monthly_12x', 'platform_annual', 'formation_only'].includes(productTypeParam)
      ) {
        setProductTypeOverride(productTypeParam as any)
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
          productType: productTypeOverride || (planType === 'annual' ? 'platform_annual' : 'platform_monthly'),
          language: 'pt', // Idioma português para Brasil
          email: userEmail, // E-mail (obrigatório mesmo se autenticado)
          // Mensal padrão: assinatura automática (Preapproval)
          // Mensal parcelado (terceiro produto): pagamento único (Preference) com parcelas
          paymentMethod: planType === 'monthly' && productTypeOverride === 'platform_monthly_12x' ? undefined : 'auto',
          refVendedor: (refVendedor ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ref') : null)) || undefined, // Atribuição de venda (ex: paula)
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
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <p className="text-sm text-red-800 mb-3">{error}</p>
              {error.includes('América Latina') && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-red-900 mb-2">Entre em contato conosco:</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://wa.me/5519996049800"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp: 55 1999604-9800
                    </a>
                    <a
                      href="mailto:suporte@ylada.com"
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      E-mail: suporte@ylada.com
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Plano Anual — único plano, visual limpo */}
          <div className="mb-6">
            <div className="max-w-md mx-auto p-6 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Plano Anual
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  12× de R$ 97
                </div>
                <p className="text-sm text-gray-600 mb-1">Total: R$ 1.164,00/ano</p>
                <p className="text-sm text-gray-600">
                  Mentoria LYA, links inteligentes e rotina que gera agenda previsível
                </p>
              </div>
            </div>
          </div>

          {/* Argumento de fechamento — antes do e-mail */}
          <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-700 text-center">
              Você está a um passo de sair do improviso e ter clareza do que fazer todos os dias.
              <span className="block mt-2 font-medium text-gray-800">
                Garantia de 7 dias: se não for pra você, devolvemos 100%.
              </span>
            </p>
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
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-medium mb-1">
                💡 Dica: PIX e Boleto disponíveis
              </p>
              <p className="text-xs text-blue-700">
                No checkout do Mercado Pago, você verá as opções: <strong>Cartão, PIX e Boleto</strong> na tela inicial. 
                Se não aparecer, clique em "Voltar" para ver todas as opções.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



