'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'

function PrecosPageFallback() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex gap-4">
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Método</Link>
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Fazer diagnóstico</Link>
          </div>
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Carregando...</p>
      </main>
    </div>
  )
}

function PrecosPageContent() {
  const searchParams = useSearchParams()
  const fromDiagnostico = searchParams.get('source') === 'diagnostico'
  const perfilTitulo = searchParams.get('perfil_titulo') || ''

  const mostraBlocoResultado = fromDiagnostico && perfilTitulo

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex gap-4">
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Método
            </Link>
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Fazer diagnóstico
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Bloco resultado — só quando veio do diagnóstico com perfil */}
        {mostraBlocoResultado && (
          <div className="mb-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 sm:p-8">
            <p className="text-sm font-semibold text-blue-900 mb-2">Seu perfil: {perfilTitulo}</p>
            <p className="text-gray-700 text-sm mb-4">
              Você acabou de experimentar um diagnóstico. Agora use isso no seu negócio.
            </p>
            <Link
              href="#planos"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Ver planos
            </Link>
          </div>
        )}

        {/* Planos — direto ao valor */}
        <section id="planos" className="scroll-mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Comece grátis. Evolua quando quiser.
          </h1>
          <p className="text-gray-600 text-center mb-10 max-w-lg mx-auto">
            Crie seu primeiro diagnóstico, teste com clientes reais e assine só quando fizer sentido.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Plano Free — destaque */}
            <div className="relative bg-gradient-to-b from-sky-50 to-white rounded-2xl border-2 border-sky-300 p-6 sm:p-8 flex flex-col shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                Para experimentar
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 mt-2">Grátis</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">R$ 0</p>
              <p className="text-gray-600 text-sm mb-6 flex-1">Comece grátis e teste com clientes reais.</p>
              <Link
                href="/pt/cadastro"
                className="block w-full text-center py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
              >
                Começar grátis
              </Link>
            </div>

            {/* Plano mensal Pro */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Pro mensal</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">R$ 300</p>
              <p className="text-gray-600 text-sm mb-4">Para profissionais que querem escalar a geração de contatos.</p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Vários diagnósticos ativos',
                  'Contatos ilimitados no WhatsApp',
                  'Noel sem limite',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-green-600">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/pt/precos/checkout?plan=monthly"
                className="block w-full text-center py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors border border-gray-200"
              >
                Assinar Pro
              </Link>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-500">
                <li className="flex items-center gap-2">✔ Cancelamento fácil</li>
                <li className="flex items-center gap-2">✔ Sem fidelidade no plano mensal</li>
                <li className="flex items-center gap-2">✔ Comece a criar diagnósticos em minutos</li>
              </ul>
            </div>

            {/* Plano anual — destacado */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-400 shadow-xl p-6 sm:p-9 flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                ⭐ Melhor custo-benefício
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 mt-2">Pro anual (recomendado)</h3>
              <p className="text-2xl font-bold text-gray-900">12x de R$ 150</p>
              <p className="text-gray-600 text-sm mb-4">Para quem quer usar a YLADA como canal real de geração de clientes.</p>
              <p className="text-green-600 text-sm font-semibold mb-4">Economize mais de 35% no plano anual</p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Vários diagnósticos ativos',
                  'Contatos ilimitados no WhatsApp',
                  'Noel sem limite',
                  'Economia significativa no ano',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-green-600">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/pt/precos/checkout?plan=annual"
                className="block w-full text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
              >
                Assinar Pro
              </Link>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-500">
                <li className="flex items-center gap-2">✔ Cancelamento fácil</li>
                <li className="flex items-center gap-2">✔ Garantia de 7 dias</li>
                <li className="flex items-center gap-2">✔ Comece a criar diagnósticos em minutos</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function PrecosPage() {
  return (
    <Suspense fallback={<PrecosPageFallback />}>
      <PrecosPageContent />
    </Suspense>
  )
}
