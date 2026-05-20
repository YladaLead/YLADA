'use client'

import Link from 'next/link'
import Image from 'next/image'

/**
 * Renovação pós-trial na URL do segmento Coach de bem-estar (não /pt/wellness/renovar).
 * Pagamento continua no checkout wellness (mesmo produto Stripe).
 */
export default function CoachBemEstarRenovarPage() {
  const checkoutUrl = '/pt/wellness/checkout?from=renovar'
  const loginWithReturn = `/pt/coach-bem-estar/login?redirect=${encodeURIComponent(checkoutUrl)}`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/coach-bem-estar/login">
            <Image
              src="/images/logo/ylada/novo/ylada-horizontal-claro.png"
              alt="YLADA — Coach de bem-estar"
              width={280}
              height={84}
              className="bg-transparent object-contain h-12 sm:h-14 lg:h-16 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎁</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Seu período de teste acabou</h1>
            <p className="text-gray-600 mb-4">
              Para continuar na área <strong>Coach de bem-estar</strong> com todos os recursos, faça sua assinatura.
            </p>
            <p className="text-sm font-medium text-blue-800 bg-blue-50 rounded-lg py-3 px-4">
              Use o mesmo e-mail do seu teste — em cerca de 1 minuto você conclui o pagamento
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href={checkoutUrl}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors shadow-lg shadow-blue-600/25"
            >
              Assinar agora — continuar para pagamento
            </Link>
            <p className="text-xs text-center text-gray-500">
              Na etapa de pagamento o endereço pode mostrar o fluxo técnico de checkout; sua conta continua no Coach de
              bem-estar.
            </p>

            <div className="border-t border-gray-200 pt-6 mt-6 space-y-3">
              <p className="text-sm text-gray-600 text-center font-medium">Outras opções</p>
              <Link
                href={loginWithReturn}
                className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Fazer login antes de assinar
              </Link>
              <Link
                href="/pt/coach-bem-estar/recuperar-senha"
                className="flex items-center justify-center w-full text-blue-600 hover:text-blue-800 py-2 text-sm font-medium"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Precisa de ajuda?{' '}
              <Link href="/pt/coach-bem-estar/suporte" className="text-blue-600 hover:text-blue-800 font-medium">
                Suporte
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
