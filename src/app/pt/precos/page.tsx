'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

/** Áreas para a página de preços — Nutri e Wellness têm links específicos (oferta/checkout) */
const AREAS_PRECOS = [
  { label: 'Nutricionistas', href: '/pt/nutri/oferta', slogan: 'Explicar melhor o processo antes da primeira consulta' },
  { label: 'Wellness', href: '/pt/wellness', slogan: 'Construir carreira em marketing com renda extra' },
  ...YLADA_LANDING_AREAS.filter((a) => !['nutri'].includes(a.codigo)).map((a) => ({
    label: a.label,
    href: a.href,
    slogan: a.slogan,
  })),
]

export default function PrecosPage() {
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
        {/* 1. Título forte */}
        <section className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            Aplique o Método YLADA na sua profissão
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use diagnósticos inteligentes para iniciar conversas com mais contexto e atrair clientes mais preparados.
          </p>
        </section>

        {/* Mensagem anti-confusão */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-12 text-center">
          <p className="text-gray-800 text-sm sm:text-base">
            <strong>Todas as profissões usam o mesmo plano YLADA.</strong>
            <br />
            <span className="text-gray-600">Você recebe diagnósticos e exemplos prontos adaptados para sua área.</span>
          </p>
        </div>

        {/* 2. Escolher a área — cards com título, slogan e botão */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">
            Escolha sua área
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AREAS_PRECOS.map((area) => (
              <Link
                key={area.href + area.label}
                href={area.href}
                className="block bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{area.label}</h3>
                <p className="text-gray-600 text-sm mb-4">{area.slogan}</p>
                <span className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium">
                  👉 Ver diagnósticos
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Plano YLADA — dois cards lado a lado, anual destacado */}
        <section className="mb-16">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {/* Plano mensal */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Plano mensal</h2>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                R$ 97 <span className="text-base font-normal text-gray-600">/ mês</span>
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Acesso completo à plataforma',
                  'Criação de avaliações',
                  'Diagnósticos automáticos',
                  'Cancelamento a qualquer momento',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-green-600">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/pt/nutri/checkout?plan=monthly"
                className="block w-full text-center py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors border border-gray-200"
              >
                Começar agora
              </Link>
            </div>

            {/* Plano anual — destacado */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-400 shadow-xl p-6 sm:p-9 flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                ⭐ Mais escolhido
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 mt-2">Plano anual</h2>
              <p className="text-2xl font-bold text-gray-900">
                R$ 59 <span className="text-base font-normal text-gray-600">/ mês</span>
              </p>
              <p className="text-gray-600 text-sm mb-2">(cobrança anual)</p>
              <p className="text-green-600 text-sm font-semibold mb-4">
                Economize mais de 35% no plano anual
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Acesso completo à plataforma',
                  'Criação de avaliações',
                  'Diagnósticos automáticos',
                  'Economia significativa no ano',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-green-600">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/pt/nutri/checkout?plan=annual"
                className="block w-full text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Primeiros passos — aumenta conversão */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            Primeiros passos no YLADA
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { num: '1', text: 'Cria seu primeiro diagnóstico em minutos' },
              { num: '2', text: 'Compartilha o link no Instagram ou WhatsApp' },
              { num: '3', text: 'Pessoas respondem' },
              { num: '4', text: 'Você recebe contatos qualificados' },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {item.num}
                </span>
                <p className="text-gray-700 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
