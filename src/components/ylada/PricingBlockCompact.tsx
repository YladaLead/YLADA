'use client'

import Link from 'next/link'

/**
 * Bloco compacto de preços para landings de área.
 * Destaca o plano anual como "Mais escolhido" e inclui gatilho de economia.
 */
export function PricingBlockCompact({
  ctaHref = '/pt/nutri/checkout?plan=annual',
  ctaLabel = 'Começar agora',
}: {
  ctaHref?: string
  ctaLabel?: string
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-sm text-gray-600">Plano mensal</p>
          <p className="text-xl font-bold text-gray-900">R$ 97 <span className="text-sm font-normal">/ mês</span></p>
        </div>
        <div className="relative bg-white rounded-xl p-4 border-2 border-blue-300 text-center bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            ⭐ Mais escolhido
          </div>
          <p className="text-xs font-semibold text-blue-700 mb-1 mt-1">Plano anual</p>
          <p className="text-xl font-bold text-gray-900">R$ 59 <span className="text-sm font-normal">/ mês</span></p>
          <p className="text-gray-600 text-xs">(cobrança anual)</p>
          <p className="text-green-600 text-xs font-semibold mt-1">Economize mais de 35%</p>
        </div>
      </div>
      <ul className="space-y-2 text-gray-700 text-sm mb-6">
        <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Criação de avaliações</li>
        <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Diagnósticos inteligentes</li>
        <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Diagnósticos automáticos</li>
        <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Sem limite de avaliações ou diagnósticos</li>
      </ul>
      <Link
        href={ctaHref}
        className="block w-full text-center py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
      >
        {ctaLabel}
      </Link>
    </>
  )
}
