'use client'

import Link from 'next/link'

/**
 * Seção de planos igual à da página de preços, para usar nas landings de cada profissional.
 * Os botões "Começar agora" redirecionam direto para o checkout da área (pagamento), sem voltar para /pt/precos.
 * @param checkoutBasePath - Base do checkout da área (ex: '/pt/coach/checkout', '/pt/nutri/checkout'). Se não informado, usa /pt/precos.
 */
export function PricingSectionLanding({
  checkoutBasePath = '/pt/precos',
}: {
  checkoutBasePath?: string
}) {
  const hrefMonthly = checkoutBasePath === '/pt/precos' ? '/pt/precos' : `${checkoutBasePath}?plan=monthly`
  const hrefAnnual = checkoutBasePath === '/pt/precos' ? '/pt/precos' : `${checkoutBasePath}?plan=annual`

  return (
    <section className="py-12 sm:py-16">
      <p className="text-center text-gray-600 mb-2">
        Acesso completo à plataforma.
      </p>
      <p className="text-center text-gray-600 mb-4">
        Crie quantos diagnósticos quiser.
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Comece a usar o YLADA
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
        {/* Plano mensal */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Plano mensal</h3>
          <p className="text-2xl font-bold text-gray-900 mb-2">R$ 97</p>
          <p className="text-gray-600 text-sm mb-4">Para quem quer começar e testar.</p>
          <ul className="space-y-2 mb-6 flex-1">
            {[
              'Acesso completo à plataforma',
              'Criação de avaliações',
              'Diagnósticos automáticos',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                <span className="text-green-600">✔</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={hrefMonthly}
            className="block w-full text-center py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors border border-gray-200"
          >
            Começar agora
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
          <h3 className="text-xl font-bold text-gray-900 mb-1 mt-2">Plano anual (recomendado)</h3>
          <p className="text-2xl font-bold text-gray-900">R$ 59<span className="text-base font-normal text-gray-600">/mês</span></p>
          <p className="text-gray-600 text-sm mb-4">Profissionais que querem usar diagnósticos continuamente.</p>
          <p className="text-green-600 text-sm font-semibold mb-4">Economize mais de 35% no plano anual</p>
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
            href={hrefAnnual}
            className="block w-full text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Começar agora
          </Link>
          <ul className="mt-4 space-y-1.5 text-xs text-gray-500">
            <li className="flex items-center gap-2">✔ Cancelamento fácil</li>
            <li className="flex items-center gap-2">✔ Garantia de 7 dias</li>
            <li className="flex items-center gap-2">✔ Comece a criar diagnósticos em minutos</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm mt-6">
        Após o pagamento você já pode acessar a plataforma.
      </p>
    </section>
  )
}
