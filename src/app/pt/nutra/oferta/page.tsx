'use client'

import Link from 'next/link'

/**
 * Página oficial de oferta Nutra — enxuta, foco em decisão.
 * Fluxo: Landing → /pt/nutra/oferta → Checkout.
 * Mesmo padrão da nutri, adaptada para vendedores de nutraceuticos e suplementos.
 */
export default function NutraOfertaPage() {
  const handleCheckout = (plan: 'monthly' | 'annual') => {
    window.location.href = `/pt/nutra/checkout?plan=${plan}`
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur h-14 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/pt/nutra" className="flex items-center gap-2">
            <span className="font-bold text-gray-900">YLADA</span>
            <span className="text-gray-500 text-sm">· Nutra</span>
          </Link>
          <Link
            href="/pt/nutra/login"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Já tenho conta
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 sm:py-14">
        {/* 1. Headline — filosofia YLADA: melhorar conversas, contexto */}
        <section className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Melhore suas conversas com clientes.
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-blue-600">
            Comece conversas com contexto.
          </p>
        </section>

        {/* 2. Benefício direto */}
        <section className="mb-10 text-center">
          <p className="text-gray-700 leading-relaxed">
            Links inteligentes com avaliações que despertam interesse real. O cliente responde, você recebe o perfil e inicia a conversa com contexto — sem improviso.
          </p>
        </section>

        {/* 3. O que você recebe */}
        <section className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">O que você recebe</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-lg">✓</span>
              Links personalizados com seu nome e foto
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-lg">✓</span>
              Avaliações e quizzes para nutraceuticos e suplementos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-lg">✓</span>
              Organização de leads e contatos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-lg">✓</span>
              7 dias de garantia incondicional
            </li>
          </ul>
        </section>

        {/* 4. Planos */}
        <section className="mb-10">
          <h2 className="font-bold text-gray-900 mb-4 text-center">Escolha seu plano</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 text-center">
              <p className="font-semibold text-gray-800">Mensal</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">R$ 97<span className="text-sm font-normal text-gray-600">/mês</span></p>
              <button
                type="button"
                onClick={() => handleCheckout('monthly')}
                className="mt-3 w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                Escolher mensal
              </button>
            </div>
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-center text-white border-2 border-blue-600 shadow-lg">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                ⭐ Mais escolhido
              </div>
              <p className="font-semibold mt-1">Anual</p>
              <p className="text-2xl font-bold mt-1">R$ 59<span className="text-sm font-normal text-white/90">/mês</span></p>
              <p className="text-sm text-white/90">(cobrança anual)</p>
              <p className="text-amber-200 text-sm font-semibold mt-1">Economize mais de 35% no plano anual</p>
              <button
                type="button"
                onClick={() => handleCheckout('annual')}
                className="mt-3 w-full py-2.5 rounded-lg bg-white text-blue-600 font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Começar agora
              </button>
            </div>
          </div>
        </section>

        {/* 5. Garantia */}
        <section className="mb-10 text-center bg-blue-50 rounded-xl p-6">
          <p className="text-2xl mb-2">🛡️</p>
          <h2 className="font-bold text-gray-900 mb-2">Garantia de 7 dias</h2>
          <p className="text-gray-700 text-sm">
            Teste sem medo. Devolvemos 100% se não funcionar para você.
          </p>
        </section>

        {/* 6. Botão checkout principal */}
        <section>
          <button
            type="button"
            onClick={() => handleCheckout('annual')}
            className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Começar com o YLADA Nutra agora
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            Mensal R$ 97/mês ou anual 12× R$ 59. Garantia 7 dias.
          </p>
        </section>
      </main>
    </div>
  )
}
