'use client'

import Link from 'next/link'

import { getProLideresWhatsappUrl, PRO_LIDERES_WHATSAPP_LABEL } from '@/lib/pro-lideres-whatsapp'

export function ProLideresHomeBody() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-blue-600">YLADA Pro Líderes</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
          Estrutura para quem lidera equipe. Plano claro, padrão e menos improviso.
        </h1>
      </div>

      <section
        className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6"
        aria-labelledby="pro-lideres-acesso-heading"
      >
        <h2 id="pro-lideres-acesso-heading" className="text-base font-semibold text-gray-900">
          Acesso Pro Líderes
        </h2>
        <p className="mt-2 text-sm text-gray-700 sm:text-base">
          Esta área é para <strong className="text-gray-900">líderes</strong> que já passaram por{' '}
          <strong className="text-gray-900">reuniões estratégicas</strong> com a YLADA antes da ativação. Se você
          chegou aqui e ainda não fez esse alinhamento, fale com a gente: explicamos o próximo passo e se faz sentido
          para a sua equipe.
        </p>
        <a
          href={getProLideresWhatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:bg-[#20bd5a]"
        >
          WhatsApp {PRO_LIDERES_WHATSAPP_LABEL}
        </a>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">O que você espera que a equipe faça</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>
            Equipe <strong className="font-semibold text-gray-900">mais motivada</strong>, fazendo porque acredita que é possível.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Padronização</strong> na mensagem e na forma de abordar, sem cada um reinventar sozinho.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Liderança com clareza</strong>. Você conduz com direção, não só apagar incêndio.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Constância</strong>: menos depender de talento individual, mais todo mundo na mesma linha.
          </li>
        </ul>
        <p className="text-sm text-gray-600">
          Quando isso falha, quase nunca é falta de vontade. É falta de <strong className="font-medium text-gray-800">estrutura repetível</strong>.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/pro-lideres/entrar"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white hover:bg-blue-700"
        >
          Entrar
        </Link>
        <Link
          href="/pro-lideres/painel"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50"
        >
          Painel do líder
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
