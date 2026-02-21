'use client'

import Link from 'next/link'
import Image from 'next/image'

/**
 * Página oficial de oferta — enxuta, foco em decisão.
 * Fluxo: Landing Método → /pt/nutri/oferta → Checkout.
 * Não é página institucional; é página de conversão.
 */
export default function NutriOfertaPage() {
  const handleCheckout = (plan: 'monthly' | 'annual') => {
    window.location.href = `/pt/nutri/checkout?plan=${plan}`
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur h-14 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/pt/nutri" className="flex items-center gap-2">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href="/pt/nutri/login"
            className="text-sm font-medium text-gray-600 hover:text-[#2563EB]"
          >
            Já tenho conta
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 sm:py-14">
        {/* 1. Headline forte */}
        <section className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Isso não é uma assinatura.
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-[#2563EB]">
            É uma decisão de sair do improviso.
          </p>
        </section>

        {/* 2. Benefício direto + Noel */}
        <section className="mb-10 text-center">
          <p className="text-gray-700 leading-relaxed">
            Noel é orientação que destrava: direcionamento diário e metodologia clara de captação. Estrutura para você encher agenda e parar de agendar ansiosa.
          </p>
        </section>

        {/* 3. O que você recebe */}
        <section className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">O que você recebe</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#29CC6A] text-lg">✓</span>
              Sistema de captação com orientação Noel (você não trava)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#29CC6A] text-lg">✓</span>
              Links inteligentes e rotina que gera agenda
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#29CC6A] text-lg">✓</span>
              Metodologia clara para encher agenda
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#29CC6A] text-lg">✓</span>
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
              <p className="text-2xl font-bold text-[#2563EB] mt-1">R$ 97<span className="text-sm font-normal text-gray-600">/mês</span></p>
              <button
                type="button"
                onClick={() => handleCheckout('monthly')}
                className="mt-3 w-full py-2.5 rounded-lg bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] transition-colors"
              >
                Escolher mensal
              </button>
            </div>
            <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl p-4 text-center text-white border-2 border-[#2563EB]">
              <p className="font-semibold">Anual</p>
              <p className="text-2xl font-bold mt-1">12× de R$ 59</p>
              <p className="text-sm text-white/90 mt-1">R$ 708/ano</p>
              <button
                type="button"
                onClick={() => handleCheckout('annual')}
                className="mt-3 w-full py-2.5 rounded-lg bg-white text-[#2563EB] font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Começar agora
              </button>
            </div>
          </div>
        </section>

        {/* 5. Garantia */}
        <section className="mb-10 text-center bg-[#E9F1FF] rounded-xl p-6">
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
            className="block w-full text-center bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-lg"
          >
            Começar com o YLADA agora
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            Mensal R$ 97/mês ou anual 12× R$ 59. Garantia 7 dias.
          </p>
        </section>
      </main>
    </div>
  )
}
