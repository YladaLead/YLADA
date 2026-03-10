'use client'

import Link from 'next/link'
import Image from 'next/image'

/**
 * Página de Renovação - Para usuários que completaram o trial de 3 dias
 * 
 * Acessível sem login. Oferece:
 * - Checkout direto (assinar só com e-mail - SEM precisar de login)
 * - Login (se já tem conta e prefere)
 * - Recuperar acesso (se esqueceu senha)
 */
export default function RenovarPage() {
  const checkoutUrl = '/pt/wellness/checkout?from=renovar'

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎁</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Seu período de teste acabou
            </h1>
            <p className="text-gray-600 mb-4">
              Você aproveitou os 3 dias gratuitos. Para continuar usando a plataforma Wellness com todos os recursos, faça sua assinatura.
            </p>
            <p className="text-sm font-medium text-green-700 bg-green-50 rounded-lg py-3 px-4">
              ✅ Não precisa fazer login — use o mesmo e-mail do seu teste e assine em 1 minuto
            </p>
          </div>

          {/* CTA principal - Assinar sem login */}
          <div className="space-y-4">
            <Link
              href={checkoutUrl}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors shadow-lg shadow-green-600/25"
            >
              💚 Assinar Agora — Continuar para Pagamento
            </Link>
            <p className="text-xs text-center text-gray-500">
              Você será redirecionado para a página de pagamento. Use o mesmo e-mail do seu trial.
            </p>

            <div className="border-t border-gray-200 pt-6 mt-6 space-y-3">
              <p className="text-sm text-gray-600 text-center font-medium">
                Outras opções:
              </p>
              <Link
                href={`/pt/wellness/login?redirect=${encodeURIComponent(checkoutUrl)}`}
                className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Fazer Login (se preferir entrar antes)
              </Link>
              <Link
                href="/pt/wellness/recuperar-acesso"
                className="flex items-center justify-center w-full text-green-600 hover:text-green-700 py-2 text-sm font-medium"
              >
                Esqueci minha senha → Enviar link de acesso
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Precisa de ajuda?{' '}
              <Link href="/pt/wellness/suporte" className="text-green-600 hover:text-green-700 font-medium">
                Entre em contato com nosso suporte
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
