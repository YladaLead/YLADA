'use client'

import Link from 'next/link'

import { getProLideresWhatsappUrl, PRO_LIDERES_WHATSAPP_LABEL } from '@/lib/pro-lideres-whatsapp'

export function ProEsteticaCorporalHomeBody() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-blue-600">YLADA Pro Estética Corporal</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
          Qualificação, agenda cheia e comunicação orientada — para quem trabalha com resultados e constância de
          sessões.
        </h1>
      </div>

      <section
        className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6"
        aria-labelledby="pro-estetica-acesso-heading"
      >
        <h2 id="pro-estetica-acesso-heading" className="text-base font-semibold text-gray-900">
          Acesso Pro Estética
        </h2>
        <p className="mt-2 text-sm text-gray-700 sm:text-base">
          Esta edição do <strong className="text-gray-900">YLADA Pro</strong> é ativada após alinhamento com a YLADA
          (implantação e personalização). Se chegou aqui sem esse passo, fale connosco: explicamos o encaixe para a tua
          operação.
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
        <h2 className="text-base font-semibold text-gray-900">O que o sistema reforça</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
          <li>
            <strong className="font-semibold text-gray-900">Fluxos e links</strong> que qualificam antes da conversa
            humana.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Noel</strong> como mentor de postura, postagens e
            abordagens — no teu contexto profissional.
          </li>
          <li>
            <strong className="font-semibold text-gray-900">Padrão e previsibilidade</strong> sem depender só de “dom”
            individual.
          </li>
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/pro-estetica-corporal/entrar"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white hover:bg-blue-700"
        >
          Entrar
        </Link>
        <Link
          href="/pro-estetica-corporal/painel"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50"
        >
          Painel
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
