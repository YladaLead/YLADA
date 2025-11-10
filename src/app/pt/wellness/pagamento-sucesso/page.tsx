'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

function WellnessPagamentoSucessoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  
  // Aceitar tanto session_id (Stripe) quanto payment_id (Mercado Pago)
  const sessionId = searchParams.get('session_id')
  const paymentId = searchParams.get('payment_id')
  const gateway = searchParams.get('gateway') || 'stripe'
  const status = searchParams.get('status') // 'pending' para pagamentos pendentes
  
  const paymentIdentifier = sessionId || paymentId

  useEffect(() => {
    // Verificar se a sessão foi processada corretamente
    const verifySession = async () => {
      if (!paymentIdentifier) {
        console.warn('⚠️ Nenhum ID de pagamento encontrado na URL')
        setError('Sessão de pagamento não encontrada')
        setLoading(false)
        return
      }

      console.log('✅ Pagamento identificado:', {
        id: paymentIdentifier,
        gateway,
        status,
        tipo: sessionId ? 'Stripe (session_id)' : 'Mercado Pago (payment_id)'
      })

      // Aguardar alguns segundos para o webhook processar
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }

    verifySession()
  }, [paymentIdentifier, gateway, status])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Ícone de Sucesso */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">✅</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado!
          </h1>

          {/* Mensagem */}
          <p className="text-lg text-gray-600 mb-8">
            {status === 'pending' 
              ? 'Seu pagamento está sendo processado. Você receberá um e-mail quando for confirmado.'
              : 'Sua assinatura foi ativada com sucesso. Agora você tem acesso completo ao YLADA Wellness.'
            }
          </p>

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
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm font-medium">
                  🎉 Bem-vindo ao YLADA Wellness!
                </p>
              </div>
              
              {/* Mensagem sobre e-mail */}
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm font-medium mb-2">
                  📧 E-mail de boas-vindas enviado!
                </p>
                <p className="text-xs">
                  Enviamos um e-mail com seu link de acesso ao dashboard. 
                  Verifique sua caixa de entrada e spam.
                </p>
              </div>
            </>
          )}

          {/* Próximos Passos */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Próximos Passos:
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">1.</span>
                <span>Acesse seu dashboard para criar suas primeiras ferramentas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">2.</span>
                <span>Personalize seu perfil com seu nome e cidade</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">3.</span>
                <span>Comece a compartilhar seus links e gerar novos contatos</span>
              </li>
            </ul>
          </div>

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/pt/wellness/dashboard"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                🚀 Acessar Dashboard
              </Link>
            ) : (
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm font-medium mb-1">📧 Verifique seu e-mail!</p>
                  <p className="text-xs">Enviamos um link de acesso para seu e-mail. Clique no link para acessar o dashboard.</p>
                </div>
                <Link
                  href="/pt/wellness/recuperar-acesso"
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center block"
                >
                  📧 Recuperar Acesso
                </Link>
              </div>
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
          </div>

          {/* Link de recuperação */}
          {status !== 'pending' && (
            <div className="mt-4 text-center">
              <Link
                href="/pt/wellness/recuperar-acesso"
                className="text-sm text-green-600 hover:text-green-700"
              >
                Não recebeu o e-mail? Recuperar acesso
              </Link>
            </div>
          )}

          {/* Ajuda */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Precisa de ajuda?{' '}
              <Link href="/pt/wellness/suporte" className="text-green-600 hover:text-green-700">
                Entre em contato com nosso suporte
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function WellnessPagamentoSucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <WellnessPagamentoSucessoContent />
    </Suspense>
  )
}

