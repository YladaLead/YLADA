'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { trackPurchase, trackNutriPurchase } from '@/lib/facebook-pixel'

function NutriPagamentoSucessoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  // Aceitar tanto session_id (Stripe) quanto payment_id (Mercado Pago)
  const sessionId = searchParams.get('session_id')
  const paymentId = searchParams.get('payment_id')
  const gateway = searchParams.get('gateway') || 'mercadopago'
  const status = searchParams.get('status') // 'pending' para pagamentos pendentes
  
  const paymentIdentifier = sessionId || paymentId
  
  // Iniciar como false se não tiver paymentIdentifier (modo visualização)
  const [loading, setLoading] = useState(!!paymentIdentifier)
  const [error, setError] = useState<string | null>(null)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Se não tiver paymentIdentifier, mostrar página imediatamente (modo visualização/teste)
  useEffect(() => {
    if (!paymentIdentifier) {
      console.log('ℹ️ Modo visualização - sem ID de pagamento')
      setLoading(false)
      return
    }
  }, [paymentIdentifier])

  useEffect(() => {
    // Verificar se a sessão foi processada corretamente
    const verifySession = async () => {
      // Se não tiver paymentIdentifier, não processar
      if (!paymentIdentifier) {
        return
      }

      console.log('✅ Pagamento identificado:', {
        id: paymentIdentifier,
        gateway,
        status,
        tipo: sessionId ? 'Stripe (session_id)' : 'Mercado Pago (payment_id)'
      })

      // 🚀 OTIMIZAÇÃO: Invalidar cache de assinatura imediatamente após pagamento
      // Isso garante que o usuário veja o acesso imediatamente após checkout
      if (user?.id) {
        try {
          const { invalidateSubscriptionCache } = await import('@/lib/subscription-cache')
          invalidateSubscriptionCache(user.id, 'nutri')
          console.log('✅ Cache de assinatura invalidado após pagamento')
        } catch (error) {
          console.warn('⚠️ Erro ao invalidar cache:', error)
        }
      }

      // Rastrear evento Purchase no Facebook Pixel
      // Tentar extrair valor do plano da URL ou usar valor padrão
      const planParam = searchParams.get('plan')
      let purchaseValue = 97 // Valor padrão (mensal)
      
      if (planParam === 'annual') {
        purchaseValue = 708 // Plano anual (12× de R$ 59)
      }
      
      // Aguardar alguns segundos para o webhook processar
      setTimeout(() => {
        setLoading(false)
        
        // Disparar evento Purchase após processamento (apenas se tiver paymentIdentifier)
        if (paymentIdentifier) {
          const planType = planParam === 'annual' ? 'annual' : 'monthly'
          
          // Evento padrão Purchase
          trackPurchase({
            content_name: 'Assinatura YLADA NUTRI',
            content_ids: planParam === 'annual' ? ['plano-anual-nutri'] : ['plano-mensal-nutri'],
            value: purchaseValue,
            currency: 'BRL',
            num_items: 1,
            content_category: 'NUTRI',
          })
          
          // Evento customizado NutriPurchase
          trackNutriPurchase({
            plan_type: planType,
            value: purchaseValue,
          })
        }
      }, 3000)
    }

    verifySession()
  }, [paymentIdentifier, gateway, status, user?.id, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando pagamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/nutri">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={133}
              height={40}
              className="bg-transparent object-contain h-8 sm:h-10 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Ícone de Sucesso */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">✅</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Pagamento Confirmado!
          </h1>

          {/* Informações */}
          {error ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2">
                Se o pagamento foi processado, sua assinatura será ativada em alguns instantes.
              </p>
            </div>
          ) : status === 'pending' ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm font-medium">
                ⏳ Pagamento Pendente
              </p>
              <p className="text-xs mt-2">
                Estamos processando seu pagamento. Você receberá um e-mail de confirmação em breve.
              </p>
            </div>
          ) : null}

          {/* Mensagem de reenvio */}
          {emailSent && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">
                ✅ E-mail reenviado com sucesso! Verifique sua caixa de entrada.
              </p>
            </div>
          )}

          {emailError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{emailError}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-col gap-4 justify-center">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                🎉 Parabéns! Seu pagamento foi confirmado
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                Sua conta foi criada automaticamente! Agora você precisa completar seu cadastro e acessar a plataforma.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p>📧 <strong>Verifique seu e-mail</strong> - Enviamos um link de acesso seguro</p>
                <p>✅ <strong>Complete seu cadastro</strong> - Adicione seu nome para personalizar sua experiência</p>
                <p>🚀 <strong>Comece a usar</strong> - Transforme-se em uma Nutri-Empresária</p>
              </div>
            </div>

            {user ? (
              <Link
                href="/pt/nutri/home?payment=success"
                className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center text-lg"
              >
                ✨ Continuar e Completar Cadastro
              </Link>
            ) : (
              <Link
                href="/pt/nutri/home?payment=success"
                className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center text-lg block"
              >
                ✨ Preencher seu Cadastro
              </Link>
            )}
            
            {user?.email && status !== 'pending' && (
              <button
                onClick={async () => {
                  setResendingEmail(true)
                  setEmailError(null)
                  setEmailSent(false)
                  
                  try {
                    const response = await fetch('/api/email/send-access-link', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: user.email }),
                    })

                    const data = await response.json()

                    if (response.ok) {
                      setEmailSent(true)
                    } else {
                      setEmailError(data.error || 'Erro ao reenviar e-mail')
                    }
                  } catch (err: any) {
                    setEmailError('Erro ao reenviar e-mail. Tente novamente.')
                    console.error('Erro:', err)
                  } finally {
                    setResendingEmail(false)
                  }
                }}
                disabled={resendingEmail}
                className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {resendingEmail ? '⏳ Enviando...' : '📧 Reenviar E-mail'}
              </button>
            )}

            {/* Link para login direto (se já tiver conta) */}
            <div className="mt-4">
              <Link
                href="/pt/nutri/login"
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Já tem conta? Fazer login
              </Link>
            </div>
          </div>

          {/* Link de recuperação */}
          {status !== 'pending' && (
            <div className="mt-4 text-center">
              <Link
                href="/pt/nutri/recuperar-senha"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Não recebeu o e-mail? Recuperar acesso
              </Link>
            </div>
          )}

          {/* Ajuda */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Precisa de ajuda?{' '}
              <a
                href="https://wa.me/5519997230912?text=Olá!%20Acabei%20de%20realizar%20um%20pagamento%20na%20YLADA%20Nutri%20e%20preciso%20de%20ajuda."
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Entre em contato com nosso suporte
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function NutriPagamentoSucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <NutriPagamentoSucessoContent />
    </Suspense>
  )
}

