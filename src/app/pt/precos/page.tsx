'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'

function PrecosPageFallback() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Voltar ao início
          </Link>
        </div>
      </header>
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex items-center justify-center min-h-[50vh]">
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
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Voltar ao início
          </Link>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
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
          <div className="max-w-[1100px] mx-auto">
            {/* Entrada principal compacta */}
            <div className="mb-6 sm:mb-8 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-sky-700 mb-1">Para experimentar</p>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Comece no grátis e evolua no seu tempo</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Sem risco para testar. Quando quiser escalar, escolha o plano Pro ideal para você.
                  </p>
                </div>
                <Link
                  href="/pt/cadastro"
                  className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold whitespace-nowrap"
                >
                  Começar grátis
                </Link>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3 text-center md:text-left">
              Quando quiser evoluir, escolha uma opção:
            </p>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
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

              {/* Aceleração com especialista */}
              <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 shadow-lg p-6 sm:p-8 flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  Aceleração humana
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 mt-2">Consultoria especializada</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Ajuste sua estratégia com especialistas da sua área.
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {[
                    'Diagnóstico da sua operação',
                    'Plano de ação para 30 dias',
                    'Ajuste de mensagem e conversão',
                    'Direcionamento personalizado por segmento',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="text-emerald-600">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-emerald-800 text-sm font-semibold mb-4">
                  Você vai ativar previsibilidade no seu crescimento.
                </p>
                <Link
                  href="/pt/consultoria"
                  className="block w-full text-center py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
                >
                  Falar com especialista
                </Link>
                <p className="mt-4 text-xs text-gray-500">
                  Vagas limitadas por agenda.
                </p>
              </div>
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
