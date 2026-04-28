'use client'

import Link from 'next/link'
import {
  PRO_ESTETICA_CORPORAL_BASE_PATH,
  PRO_ESTETICA_CORPORAL_NOEL_PATH,
} from '@/config/pro-estetica-corporal-menu'
import { PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM } from '@/config/pro-estetica-corporal-noel-focus'

const NOEL = PRO_ESTETICA_CORPORAL_NOEL_PATH

export default function ProEsteticaCorporalResolverHome() {
  return (
    <div className="mx-auto max-w-lg space-y-8 pb-4 lg:max-w-2xl">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600">Pro Estética Corporal</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">O que você quer resolver hoje?</h1>
        <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
          Escolha a dor que mais pesa agora — a gente abre o Noel já no tema e você ainda pode ir para links, mensagens e
          retorno quando quiser esticar a ferramenta.
        </p>
      </header>

      <ul className="space-y-4">
        <li>
          <article className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50/90 to-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">Atrair clientes</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">Não sei o que postar</h2>
            <p className="mt-2 text-sm text-gray-600">Ideias e legenda no seu contexto — sem ficar olhando tela em branco.</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href={`${NOEL}?${PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM}=atrair`}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                Ideias para postar agora
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Também:{' '}
              <Link href={`${PRO_ESTETICA_CORPORAL_BASE_PATH}/biblioteca-links?tab=prontos`} className="font-medium text-violet-700 underline hover:text-violet-900">
                Biblioteca de modelos e links
              </Link>
            </p>
          </article>
        </li>

        <li>
          <article className="overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/90 to-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Responder e conduzir</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">Não sei o que falar</h2>
            <p className="mt-2 text-sm text-gray-600">Depois do interesse — preço, dúvida, silêncio no WhatsApp.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`${NOEL}?${PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM}=responder`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sky-700"
              >
                Mensagens para responder agora
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Também:{' '}
              <Link href={`${PRO_ESTETICA_CORPORAL_BASE_PATH}/scripts`} className="font-medium text-sky-700 underline hover:text-sky-900">
                Mensagens prontas salvas
              </Link>
            </p>
          </article>
        </li>

        <li>
          <article className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/90 to-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Fazer voltar</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">Cliente sumiu</h2>
            <p className="mt-2 text-sm text-gray-600">Reativar com mensagem certa, sem parecer desesperada.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`${NOEL}?${PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM}=reativar`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Reativar com o Noel
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Também:{' '}
              <Link href={`${PRO_ESTETICA_CORPORAL_BASE_PATH}/retencao`} className="font-medium text-emerald-700 underline hover:text-emerald-900">
                Jornada de retenção
              </Link>
            </p>
          </article>
        </li>
      </ul>

      <footer className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        <p>
          <strong className="text-gray-900">Noel</strong> e <strong className="text-gray-900">Links</strong> trabalham
          juntos: comece por uma dor e vá aprofundando quando fizer sentido no dia a dia.
        </p>
      </footer>
    </div>
  )
}
