'use client'

import Link from 'next/link'

import { getProLideresWhatsappUrl } from '@/lib/pro-lideres-whatsapp'

export function ProEsteticaCapilarHomeBody() {
  const whatsappHref = getProLideresWhatsappUrl()
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-blue-600">YLADA Pro Estética Capilar</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
          Aumente a performance do seu trabalho em estética capilar com um sistema completo de desenvolvimento.
        </h1>
        <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
          Um método simples para elevar sua confiança na triagem e na conversa, padronizar o que você comunica e
          transformar esforço em adesão ao plano e recorrência todos os dias.
        </p>
        <p className="rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-semibold leading-snug text-gray-900 sm:text-base">
          Você fica com <span className="text-blue-800">controle total e clareza</span> sobre captação, conversa e
          acompanhamento: enxerga o que está funcionando e sabe exatamente onde corrigir em cada cliente.
        </p>
      </div>

      <section
        className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
        aria-label="Por que falta estrutura segura o crescimento"
      >
        <p className="text-sm font-medium leading-relaxed text-gray-900 sm:text-base">
          A maioria dos negócios em estética capilar não cresce no ritmo que poderiam porque falta estrutura repetível
        </p>
        <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
          Não é falta de dedicação, é falta de direção clara no dia a dia
        </p>
      </section>

      <section
        className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6"
        aria-labelledby="pro-estetica-capilar-acesso-heading"
      >
        <h2
          id="pro-estetica-capilar-acesso-heading"
          className="text-base font-semibold leading-snug text-gray-900 sm:text-lg"
        >
          Se você quer aumentar a performance do seu atendimento e ter previsibilidade nos resultados
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
          Nós te mostramos como estruturar o que você fala na triagem, como abordar e como manter consistência entre uma
          sessão e outra.
        </p>
        <div className="mt-4 space-y-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#20bd5a] sm:w-auto"
          >
            Quero aumentar a performance do meu trabalho
          </a>
          <p className="text-xs text-gray-600 sm:text-sm">
            Você vai entender como aplicar isso na prática em poucos minutos.
          </p>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="pro-estetica-capilar-dor-heading">
        <h2 id="pro-estetica-capilar-dor-heading" className="text-base font-semibold text-gray-900">
          Se isso acontece no seu dia a dia
        </h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>Você trava na hora de explicar valor, protocolo ou compromisso com o plano</li>
          <li>Cada atendimento soa diferente e a mensagem sobre resultado se perde</li>
          <li>Falta constância no acompanhamento entre uma sessão e outra</li>
          <li>A cliente começa animada e perde o ritmo antes do resultado aparecer</li>
          <li>O ritmo do acompanhamento depende só de você, sem um padrão que organize o próximo passo</li>
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="pro-estetica-capilar-transformacao-heading">
        <h2 id="pro-estetica-capilar-transformacao-heading" className="text-base font-semibold text-gray-900">
          O que muda quando você estrutura seu atendimento
        </h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>Você passa a conduzir com clareza porque sabe exatamente o que falar em cada etapa</li>
          <li>Você mantém a mesma linha em triagem, plano e retorno, sem inventar tudo de novo</li>
          <li>Você deixa de apagar incêndio e assume o controle do crescimento do seu trabalho</li>
          <li>Os resultados deixam de depender só dos dias em que você está “no auge”</li>
        </ul>
      </section>

      <div>
        <Link
          href="/pro-estetica-capilar/entrar"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50"
        >
          Entrar no painel
        </Link>
      </div>
    </div>
  )
}
