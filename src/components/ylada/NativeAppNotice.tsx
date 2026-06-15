'use client'

import { useRouter } from 'next/navigation'

/**
 * Tela neutra exibida no app iOS no lugar de qualquer página de
 * compra/checkout. Não mostra preço, plano, botão de assinatura nem
 * link para compra externa (guideline 3.1.1 da Apple). Só leva o
 * usuário de volta a usar o app com a conta dele.
 */
export default function NativeAppNotice({ homeHref = '/pt' }: { homeHref?: string }) {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full">
        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">Tudo pronto por aqui</h1>
        <p className="text-gray-600 text-sm mb-6">
          Use o YLADA normalmente com a sua conta. Se precisar de ajuda, fale com o suporte pelo app.
        </p>
        <button
          type="button"
          onClick={() => router.push(homeHref)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
        >
          Ir para o início
        </button>
      </div>
    </div>
  )
}
