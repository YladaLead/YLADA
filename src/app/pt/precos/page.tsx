'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

/** As 8 áreas na ordem da seção "Para quais profissionais o YLADA foi criado" — cada uma redireciona para a página da área */
const AREAS_PROFISSIONAIS = YLADA_LANDING_AREAS.map((a) => ({
  label: a.label,
  href: a.href,
  slogan: a.slogan,
}))

const EXEMPLOS_DIAGNOSTICOS = [
  'O que está travando seu emagrecimento',
  'Por que sua agenda não enche',
  'Seu marketing atrai curiosos ou clientes',
  'Qual fragrância combina com você',
]

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
        {/* 1. Bloco resultado no diagnóstico — só quando veio do diagnóstico com perfil */}
        {mostraBlocoResultado && (
          <div className="mb-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-3">
              <span aria-hidden>🧠</span> Seu resultado no diagnóstico
            </p>
            <p className="text-gray-700 text-sm mb-2">Perfil identificado:</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {perfilTitulo}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Muitos profissionais nesse perfil recebem perguntas sobre preço logo no início ou conversas que não avançam.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Isso normalmente acontece porque o cliente chega sem entender o próprio problema.
            </p>
            <p className="text-gray-800 font-medium text-sm sm:text-base mb-2">
              Diagnósticos mudam isso.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Eles ajudam o cliente a refletir antes da conversa.
            </p>
            <p className="text-blue-800 text-sm font-semibold mb-6 italic">
              Você acabou de experimentar o poder de um diagnóstico.
            </p>
            <p className="text-gray-900 font-semibold mb-4">
              Agora você pode aplicar isso no seu negócio
            </p>
            <p className="text-gray-700 text-sm mb-6">
              Use diagnósticos para atrair clientes mais preparados.
            </p>
            <Link
              href="#planos"
              className="inline-block w-full sm:w-auto text-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Começar a usar diagnósticos no meu negócio
            </Link>
          </div>
        )}

        {/* 2. Frase manifesto — logo abaixo do bloco resultado */}
        <div className="rounded-xl bg-slate-800 text-white p-6 sm:p-8 mb-14 text-center border-l-4 border-blue-400">
          <p className="text-xl sm:text-2xl font-bold mb-2">
            Boas conversas começam com boas perguntas.
          </p>
          <p className="text-slate-200 text-sm sm:text-base">
            YLADA transforma conhecimento profissional em diagnósticos que ajudam seus clientes a entender melhor o próprio problema antes da conversa.
          </p>
        </div>

        {/* 3. Como profissionais usam o YLADA — transição */}
        <section className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">
            Como profissionais usam o YLADA
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { emoji: '🧠', text: 'Criam diagnósticos' },
              { emoji: '🔗', text: 'Compartilham o link' },
              { emoji: '💬', text: 'Recebem conversas no WhatsApp' },
              { emoji: '🤝', text: 'Conversas mais preparadas' },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-5 border border-gray-200">
                <span className="text-2xl mb-2" aria-hidden>{item.emoji}</span>
                <p className="text-gray-800 font-medium text-sm sm:text-base">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Título só quando NÃO tem bloco resultado (evita repetir) */}
        {!mostraBlocoResultado && (
          <section className="text-center mb-10">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
              Agora aplique isso no seu negócio
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Você acabou de descobrir como sua comunicação profissional funciona.
              <br className="hidden sm:block" />
              Agora você pode usar diagnósticos para atrair clientes mais preparados.
            </p>
          </section>
        )}

        {/* 4. Escolha da área */}
        <section className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
            Para quais profissionais o YLADA foi criado
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Profissionais e vendedores consultivos usam diagnósticos para atrair clientes mais preparados.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AREAS_PROFISSIONAIS.map((area) => (
              <Link
                key={area.href + area.label}
                href={area.href}
                className="block bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <h3 className="text-base font-bold text-gray-900 mb-2">{area.label}</h3>
                <p className="text-gray-600 text-sm">{area.slogan}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="#planos"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 font-medium text-gray-800 transition-all"
            >
              Ver todas as áreas
            </Link>
          </div>
        </section>

        {/* 4b. Conexão experiência → produto — antes dos planos */}
        <div className="mb-12 rounded-xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">
            {mostraBlocoResultado
              ? 'Você acabou de experimentar um diagnóstico.'
              : 'Imagine fazer um diagnóstico com seus clientes.'}
          </p>
          <p className="text-gray-700">
            Agora imagine clientes passando pelo mesmo processo antes de conversar com você.
          </p>
          <p className="text-gray-600 text-sm mt-2 italic">
            Isso conecta experiência ao produto.
          </p>
        </div>

        {/* 5. Planos — Free em destaque, depois Pro */}
        <section id="planos" className="mb-16 scroll-mt-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
            Comece grátis. Evolua quando quiser.
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
            Crie seu primeiro diagnóstico, teste a YLADA e veja conversas começarem no WhatsApp.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Plano Free — destaque */}
            <div className="relative bg-gradient-to-b from-sky-50 to-white rounded-2xl border-2 border-sky-300 p-6 sm:p-8 flex flex-col shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                Para experimentar
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 mt-2">Grátis</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">R$ 0</p>
              <p className="text-gray-600 text-sm mb-4">Comece grátis e teste com clientes reais.</p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  '1 diagnóstico ativo',
                  'até 10 contatos no WhatsApp por mês',
                  'até 10 análises do Noel por mês',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-green-600">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/pt/escolha-perfil"
                className="block w-full text-center py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
              >
                Começar grátis
              </Link>
            </div>

            {/* Plano mensal Pro */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Pro mensal</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">R$ 97</p>
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
                href="/pt/nutri/checkout?plan=monthly"
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
              <p className="text-2xl font-bold text-gray-900">R$ 59<span className="text-base font-normal text-gray-600">/mês</span></p>
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
                href="/pt/nutri/checkout?plan=annual"
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

        {/* Frase pós-planos: ligação com o diagnóstico (quando veio do diagnóstico) */}
        {fromDiagnostico && (
          <div className="mb-14 rounded-xl bg-gray-50 border border-gray-200 p-6 text-center">
            <p className="text-gray-800 font-medium mb-2">
              O diagnóstico que você acabou de fazer é um exemplo.
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              Com YLADA você pode criar diagnósticos como esse para seus clientes.
            </p>
            <Link
              href="#exemplos"
              className="inline-flex items-center justify-center gap-2 mt-4 px-5 py-2.5 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 font-medium text-gray-800 text-sm transition-colors"
            >
              Ver exemplos de diagnósticos criados por profissionais
            </Link>
          </div>
        )}

        {/* 6. Como funciona na prática */}
        <section className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">
            Como funciona na prática
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { num: '1', text: 'Crie seu diagnóstico', sub: '(2 minutos)' },
              { num: '2', text: 'Compartilhe o link', sub: '(Instagram, WhatsApp, anúncios)' },
              { num: '3', text: 'Receba conversas no WhatsApp', sub: '(pessoas iniciam contato com você)' },
              { num: '4', text: 'Conversas mais preparadas', sub: '' },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                  {item.num}
                </span>
                <div>
                  <p className="text-gray-900 font-semibold">{item.text}</p>
                  {item.sub && <p className="text-gray-500 text-sm mt-0.5">{item.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Exemplos reais de diagnósticos */}
        <section id="exemplos" className="mb-14 scroll-mt-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
            Exemplos reais
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Exemplo de diagnósticos que profissionais criam:
          </p>
          <ul className="max-w-xl mx-auto space-y-3">
            {EXEMPLOS_DIAGNOSTICOS.map((item) => (
              <li key={item} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 text-gray-800 font-medium">
                <span className="text-blue-600">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 8. Por que diagnósticos funcionam */}
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-14">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            Por que diagnósticos funcionam
          </h2>
          <p className="text-gray-700 text-center mb-4">
            Médicos começam com diagnóstico.
          </p>
          <p className="text-gray-700 text-center mb-4">
            Consultores começam com diagnóstico.
          </p>
          <p className="text-gray-700 text-center mb-4">
            Treinadores começam com diagnóstico.
          </p>
          <p className="text-gray-900 font-semibold text-center">
            YLADA permite que profissionais façam o mesmo com seus clientes.
          </p>
        </div>

        {/* 9. CTA final */}
        <section className="text-center">
          <div className="rounded-xl bg-blue-50 border-l-4 border-blue-600 p-6 sm:p-8 max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Comece a usar diagnósticos no seu trabalho
            </h2>
            <p className="text-gray-700 text-sm mb-6">
              Leva menos de 5 minutos. Sem conhecimento técnico.
            </p>
            <Link
              href="#planos"
              className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Ver planos e começar
            </Link>
            <Link
              href="#exemplos"
              className="mt-4 inline-block w-full sm:w-auto text-center px-6 py-3 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 font-medium text-gray-800 text-sm transition-colors"
            >
              Ver exemplos de diagnósticos criados por profissionais
            </Link>
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
