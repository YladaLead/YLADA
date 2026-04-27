'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import {
  PRO_ESTETICA_CAPILAR_RITMO_PLACEBO_METRICS,
  shouldShowProEsteticaCapilarRitmoPlacebo,
} from '@/config/pro-estetica-capilar-ritmo-demo'

const BASE = '/pro-estetica-capilar/painel'

const CARDS = [
  { key: 'conv', title: 'Conversas iniciadas', desc: 'Novos contatos via links e WhatsApp' },
  { key: 'resp', title: 'Quem respondeu', desc: 'Depois do primeiro contacto' },
  { key: 'acoes', title: 'Ações na plataforma', desc: 'Noel, links, mensagens' },
  { key: 'dias', title: 'Dias com uso', desc: 'Consistência na semana' },
] as const

export default function ProEsteticaCapilarResultadosClient() {
  const { user } = useAuth()
  const placebo = shouldShowProEsteticaCapilarRitmoPlacebo(user?.email ?? null)
  const m = PRO_ESTETICA_CAPILAR_RITMO_PLACEBO_METRICS

  function placeboValue(key: (typeof CARDS)[number]['key']): string {
    if (key === 'dias') return `${m.diasAtivos}/${m.diasTotal}`
    if (key === 'conv') return String(m.conversas)
    if (key === 'resp') return String(m.respostas)
    return String(m.acoes)
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-4 lg:max-w-2xl">
      <div>
        <p className="text-sm font-medium text-blue-600">Ritmo</p>
        <h1 className="text-2xl font-bold text-gray-900">O que está travando seus resultados</h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">Em poucos segundos você vê o foco e resolve agora.</p>
      </div>

      {placebo ? (
        <p className="rounded-lg border border-dashed border-amber-200 bg-amber-50/80 px-3 py-2 text-center text-[11px] font-medium text-amber-900">
          Demonstração: números abaixo são ilustrativos para apresentação — não são totais reais da sua conta.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {CARDS.map(({ key, title, desc }) => (
          <div key={key} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">{title}</p>
            {placebo ? (
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-900">{placeboValue(key)}</p>
            ) : (
              <>
                <p className="mt-1.5 text-lg font-semibold text-gray-400" aria-hidden>
                  —
                </p>
                <p className="mt-1.5 text-[9px] leading-tight text-gray-400">Indicador quando houver base na sua conta</p>
              </>
            )}
            <p className="mt-1 text-[10px] leading-snug text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/95 p-4 sm:p-5">
        <p className="text-sm font-semibold text-amber-950">Você pode estar perdendo clientes depois do preço</p>
        <p className="mt-2 text-sm leading-relaxed text-amber-950/95">
          Você até conversa com as pessoas… mas não conduz até a resposta. O problema nem sempre é falta de cliente: é
          falta de condução depois do interesse.
        </p>
        <p className="mt-3 text-sm font-semibold text-gray-900">
          Foco agora: <span className="text-amber-950">transformar interesse em resposta</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`${BASE}/noel?focus=destravar`}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
        >
          Resolver isso agora
        </Link>
        <Link
          href={`${BASE}/scripts`}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          Ver mensagens para resposta
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/90 p-3.5 text-xs leading-relaxed text-gray-700 sm:text-sm">
        <p className="font-medium text-gray-900">Movimento na semana</p>
        {placebo ? (
          <p className="mt-1.5">
            Você está se movimentando mais: semana passada <strong>{m.semanaPassada}</strong> conversas · esta semana{' '}
            <strong>{m.semanaAtual}</strong>{' '}
            <span className="text-emerald-700">(+{m.evolucaoPct}% de novas conversas)</span>
            <span className="block pt-1 text-[11px] text-gray-500">Ilustração para demonstração.</span>
          </p>
        ) : (
          <p className="mt-1.5">
            Quando você usa links e o Noel com regularidade, dá para comparar semanas — os totais aparecem aqui quando
            houver histórico na conta.
          </p>
        )}
      </div>

      <p className="text-center text-xs text-gray-500 sm:text-left">
        Quanto mais você executa na plataforma, mais claro fica o gargalo. O Noel ajuda a destravar com mensagens no seu
        contexto.
      </p>
    </div>
  )
}
