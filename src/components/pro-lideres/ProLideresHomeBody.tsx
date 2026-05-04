'use client'

import Link from 'next/link'

export function ProLideresHomeBody() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-blue-600">YLADA Pro Líderes</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
          Aumente a performance da sua equipe em campo com um sistema completo de desenvolvimento.
        </h1>
        <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
          Um método simples para elevar a confiança do time, padronizar a comunicação e transformar esforço em resultado
          real todos os dias.
        </p>
        <p className="rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-semibold leading-snug text-gray-900 sm:text-base">
          Você fica com <span className="text-blue-800">controle total e clareza</span> sobre as ações da sua equipe
          em campo: enxerga o que está sendo feito e sabe exatamente onde corrigir.
        </p>
      </div>

      <section
        className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
        aria-label="Por que falta estrutura segura o crescimento"
      >
        <p className="text-sm font-medium leading-relaxed text-gray-900 sm:text-base">
          A maioria das equipes não cresce porque falta estrutura repetível
        </p>
        <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
          Não é falta de esforço, é falta de direção clara no dia a dia
        </p>
      </section>

      <section
        className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6"
        aria-labelledby="pro-lideres-acesso-heading"
      >
        <h2 id="pro-lideres-acesso-heading" className="text-base font-semibold leading-snug text-gray-900 sm:text-lg">
          Se você quer aumentar a performance da sua equipe e ter previsibilidade nos resultados
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
          Nós te mostramos como estruturar o que o time fala, como abordar e como manter consistência todos os dias.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="pro-lideres-dor-heading">
        <h2 id="pro-lideres-dor-heading" className="text-base font-semibold text-gray-900">
          Se isso acontece no seu time
        </h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>Pessoas travam na hora de falar com o cliente</li>
          <li>Cada um fala de um jeito e a mensagem se perde</li>
          <li>Falta constância nas ações do dia a dia</li>
          <li>A equipe começa animada, mas perde o ritmo</li>
          <li>Você acaba tendo que puxar tudo sozinho</li>
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="pro-lideres-transformacao-heading">
        <h2 id="pro-lideres-transformacao-heading" className="text-base font-semibold text-gray-900">
          O que muda quando você estrutura sua equipe
        </h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>A equipe passa a agir com clareza porque sabe exatamente o que fazer</li>
          <li>Todos começam a falar a mesma língua, sem precisar inventar abordagem</li>
          <li>Você deixa de apagar incêndio e assume o controle do crescimento</li>
          <li>Os resultados deixam de depender apenas dos melhores do time</li>
        </ul>
      </section>

      <div>
        <Link
          href="/pro-lideres/entrar"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50"
        >
          Entrar no painel
        </Link>
      </div>
      <p className="text-center text-sm text-gray-500 sm:text-left">
        <Link href="/pro-lideres/acompanhar" className="font-medium text-blue-600 underline hover:text-blue-800">
          Acompanhar o que já existe
        </Link>{' '}
        <span className="text-gray-400">(página pública, sem login)</span>
      </p>
    </div>
  )
}
