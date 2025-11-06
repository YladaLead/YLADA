'use client'

import { Suspense, useEffect, useState } from 'react'
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
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Verificar se a sessão foi processada corretamente
    const verifySession = async () => {
      if (!sessionId) {
        setError('Sessão de pagamento não encontrada')
        setLoading(false)
        return
      }

      // Aguardar alguns segundos para o webhook processar
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }

    verifySession()
  }, [sessionId])

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
            Sua assinatura foi ativada com sucesso. Agora você tem acesso completo ao YLADA Wellness.
          </p>

          {/* Informações */}
          {error ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2">
                Se o pagamento foi processado, sua assinatura será ativada em alguns instantes.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm font-medium">
                🎉 Bem-vindo ao YLADA Wellness!
              </p>
            </div>
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

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pt/wellness/dashboard"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              🚀 Acessar Dashboard
            </Link>
            <Link
              href="/pt/wellness/templates"
              className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ver Templates
            </Link>
          </div>

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

