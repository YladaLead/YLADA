'use client'

import { useRouter } from 'next/navigation'
import { getAndroidWebCheckoutUrl } from '@/config/android-checkout'

/**
 * Tela exibida no app Android (TWA) no lugar de uma rota de compra, quando o
 * flag ANDROID_WEB_CHECKOUT_ENABLED está LIGADO (comportamento "B").
 *
 * Mostra um botão "Assinar no site" que abre o checkout web em um navegador
 * EXTERNO (`window.open(..., '_blank')`) — fora do app, sem Google Play Billing.
 * Abrir num contexto externo evita o loop do guard (lá a detecção de TWA não
 * vale, então a página de planos carrega normalmente).
 *
 * Só é usada com o flag ON; o padrão de produção é a tela neutra (sem venda).
 */
export default function AndroidWebCheckoutNotice({ homeHref = '/pt' }: { homeHref?: string }) {
  const router = useRouter()

  const abrirCheckout = () => {
    if (typeof window === 'undefined') return
    window.open(getAndroidWebCheckoutUrl(), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full">
        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">Assine o YLADA</h1>
        <p className="text-gray-600 text-sm mb-6">
          A contratação é feita no nosso site, no navegador. Toque abaixo para continuar.
        </p>
        <button
          type="button"
          onClick={abrirCheckout}
          className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
        >
          Assinar no site
        </button>
        <button
          type="button"
          onClick={() => router.push(homeHref)}
          className="mt-3 inline-flex w-full items-center justify-center px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Voltar ao app
        </button>
      </div>
    </div>
  )
}
