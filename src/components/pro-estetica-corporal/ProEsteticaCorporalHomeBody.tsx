'use client'

import Link from 'next/link'

import { getProLideresWhatsappUrl } from '@/lib/pro-lideres-whatsapp'

export function ProEsteticaCorporalHomeBody() {
  const whatsappHref = getProLideresWhatsappUrl()
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-blue-600">YLADA Pro — Estética corporal</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
          Aumente a performance do seu negócio em estética corporal com um sistema completo de desenvolvimento.
        </h1>
        <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
          Um método simples para elevar sua confiança na abordagem, padronizar o que você comunica e transformar
          esforço em agenda cheia e constância de sessões todos os dias.
        </p>
        <p className="rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-semibold leading-snug text-gray-900 sm:text-base">
          Você fica com <span className="text-blue-800">controle total e clareza</span> sobre captação, conversa e
          retorno: enxerga o que está funcionando na sua rotina e sabe exatamente onde corrigir.
        </p>
      </div>

      <section
        className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
        aria-label="Por que falta estrutura segura o crescimento"
      >
        <p className="text-sm font-medium leading-relaxed text-gray-900 sm:text-base">
          A maioria dos negócios em estética não cresce no ritmo que poderiam porque falta estrutura repetível
        </p>
        <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
          Não é falta de dedicação, é falta de direção clara no dia a dia
        </p>
      </section>

      <section
        className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6"
        aria-labelledby="pro-estetica-corporal-acesso-heading"
      >
        <h2
          id="pro-estetica-corporal-acesso-heading"
          className="text-base font-semibold leading-snug text-gray-900 sm:text-lg"
        >
          Se você quer aumentar a performance do seu trabalho e ter previsibilidade na agenda e nos resultados
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
          Nós te mostramos como estruturar o que você comunica, como abordar e como manter consistência todos os dias.
        </p>
        <div className="mt-4 space-y-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#20bd5a] sm:w-auto"
          >
            Quero aumentar a performance do meu negócio
          </a>
          <p className="text-xs text-gray-600 sm:text-sm">
            Você vai entender como aplicar isso na prática em poucos minutos.
          </p>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="pro-estetica-corporal-dor-heading">
        <h2 id="pro-estetica-corporal-dor-heading" className="text-base font-semibold text-gray-900">
          Se isso acontece no seu dia a dia
        </h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>Você trava na hora de falar de investimento, pacote ou fechamento</li>
          <li>WhatsApp e redes ficam sempre no improviso, mensagem diferente a cada cliente</li>
          <li>A agenda oscila: sem previsibilidade de sessões e de retorno</li>
          <li>Você começa o mês motivada e perde o ritmo no meio do caminho</li>
          <li>Parece que o negócio depende demais de sorte ou de indicação solta</li>
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="pro-estetica-corporal-transformacao-heading">
        <h2 id="pro-estetica-corporal-transformacao-heading" className="text-base font-semibold text-gray-900">
          O que muda quando você estrutura seu negócio
        </h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>Você passa a agir com clareza porque sabe o próximo passo em captação e retorno</li>
          <li>Você fala a mesma língua em cada conversa, sem reinventar tudo do zero</li>
          <li>Você deixa de apagar incêndio e assume o controle do crescimento</li>
          <li>Os resultados deixam de depender só dos dias em que você está “no auge”</li>
        </ul>
      </section>

      <div>
        <Link
          href="/pro-estetica-corporal/entrar"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50"
        >
          Entrar no painel
        </Link>
      </div>
      <p className="text-center text-sm text-gray-500 sm:text-left">
        <Link href="/pro-estetica-corporal/acompanhar" className="font-medium text-blue-600 underline hover:text-blue-900">
          Acompanhar o que já existe
        </Link>{' '}
        <span className="text-gray-400">(página pública, sem login)</span>
      </p>
    </div>
  )
}
