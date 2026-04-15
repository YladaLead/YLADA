'use client'

import Link from 'next/link'
import {
  PRO_ESTETICA_CORPORAL_BASE_PATH,
  PRO_ESTETICA_CORPORAL_NOEL_PATH,
} from '@/config/pro-estetica-corporal-menu'
import { PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM } from '@/config/pro-estetica-corporal-noel-focus'

const NOEL = PRO_ESTETICA_CORPORAL_NOEL_PATH
const q = (focus: string) => `${NOEL}?${PRO_ESTETICA_CORPORAL_NOEL_FOCUS_PARAM}=${focus}`

export default function ProEsteticaRetencaoExecucao() {
  return (
    <div className="mx-auto max-w-lg space-y-6 pb-6 lg:max-w-xl">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-emerald-700">Retenção</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">Fazer cliente voltar</h1>
        <p className="text-sm text-gray-600 sm:text-base">Mensagens e ações para não perder cliente — escolha e o Noel já começa no tema.</p>
      </header>

      <ul className="space-y-3">
        <li>
          <article className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/90 to-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Cliente faltou</p>
            <h2 className="mt-1 text-base font-bold text-gray-900">Não veio ou sumiu</h2>
            <p className="mt-1 text-xs text-gray-600">Reativar sem soar cobrando.</p>
            <div className="mt-4">
              <Link
                href={q('ret_faltou')}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Enviar mensagem de reativação
              </Link>
            </div>
          </article>
        </li>

        <li>
          <article className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Próxima sessão</p>
            <h2 className="mt-1 text-base font-bold text-gray-900">Confirmar sem parecer insistente</h2>
            <p className="mt-1 text-xs text-gray-600">Lembrete leve, humano.</p>
            <div className="mt-4">
              <Link
                href={q('ret_confirmar')}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Enviar confirmação leve
              </Link>
            </div>
          </article>
        </li>

        <li>
          <article className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Pós-atendimento</p>
            <h2 className="mt-1 text-base font-bold text-gray-900">Manter engajada</h2>
            <p className="mt-1 text-xs text-gray-600">Depois da sessão, próximo passo claro.</p>
            <div className="mt-4">
              <Link
                href={q('ret_pos')}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Enviar mensagem de pós
              </Link>
            </div>
          </article>
        </li>
      </ul>

      <p className="text-center text-xs text-gray-500">
        <Link href={`${PRO_ESTETICA_CORPORAL_BASE_PATH}/biblioteca-links?tab=prontos`} className="font-medium text-emerald-700 underline hover:text-emerald-900">
          Biblioteca e links
        </Link>{' '}
        quando quiser ir além das mensagens.
      </p>

      <footer className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-center text-sm leading-relaxed text-emerald-950">
        <p className="font-semibold">Você não precisa pensar no que falar</p>
        <p className="mt-1 text-emerald-900/90">O Noel faz isso com você</p>
      </footer>
    </div>
  )
}
