'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import type { InsightCard } from '@/lib/inteligencia-ylada-insights'
import {
  type InteligenciaApiData,
  orientacaoProximoPasso,
} from '@/lib/admin-orientacao'

const FREEMIUM_KIND_LABEL: Record<'noel' | 'whatsapp' | 'active_link', string> = {
  noel: 'Noel (mensal)',
  whatsapp: 'WhatsApp (mês)',
  active_link: 'Diagnóstico ativo',
}

const SEG_LABEL: Record<string, string> = {
  nutri: 'Nutrição',
  coach: 'Coach',
  med: 'Médicos',
  estetica: 'Estética',
  fitness: 'Fitness',
  joias: 'Joias e bijuterias',
  perfumaria: 'Perfumaria',
  nutra: 'Nutra',
  seller: 'Vendas',
  psi: 'Psicologia',
  psicanalise: 'Psicanálise',
  odonto: 'Odontologia',
}

const FUNIL_ETAPAS: { key: string; label: string }[] = [
  { key: 'funnel_landing_pt_view', label: 'Visitaram /pt' },
  { key: 'funnel_landing_cta_segmentos', label: 'Clicaram “Comece agora”' },
  { key: 'funnel_segmentos_view', label: 'Viram segmentos' },
  { key: 'funnel_hub_segmento_clicado', label: 'Clicaram num segmento' },
  { key: 'funnel_entrada_nicho', label: 'Escolheram nicho (entrada)' },
  { key: 'funnel_cadastro_view', label: 'Abriram cadastro' },
  { key: 'funnel_cadastro_area_selected', label: 'Escolheram área' },
  { key: 'user_created', label: 'Criaram conta' },
]

function variantClasses(v: InsightCard['variant']): string {
  switch (v) {
    case 'warning':
      return 'border-amber-200 bg-amber-50/80'
    case 'success':
      return 'border-emerald-200 bg-emerald-50/80'
    case 'info':
      return 'border-sky-200 bg-sky-50/80'
    default:
      return 'border-gray-200 bg-gray-50/90'
  }
}

function InteligenciaContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<InteligenciaApiData | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/admin/inteligencia-ylada', { credentials: 'include' })
        const json = await res.json()
        if (json.success && json.data) setData(json.data as InteligenciaApiData)
        else setError(json.error || 'Erro ao carregar')
      } catch (e) {
        setError('Não foi possível carregar.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Carregando Inteligência YLADA…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-red-600">{error || 'Sem dados'}</p>
        <Link href="/admin" className="text-blue-600 mt-4 inline-block">
          Voltar ao painel
        </Link>
      </div>
    )
  }

  const t = data.funnel.totals
  const maiorPerdaLabel =
    data.maiorPerda === 'cadastro'
      ? 'Maior perda aparente: entre abrir o cadastro e criar conta'
      : data.maiorPerda === 'landing'
        ? 'Maior perda aparente: entre visitar a página inicial e criar conta'
        : null

  const guia = orientacaoProximoPasso(data)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 mb-3 inline-block">
            ← Painel administrativo
          </Link>
          <p className="text-sm font-medium text-indigo-600 mb-1">Crescimento com dados</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Inteligência YLADA</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl leading-relaxed">
            Comportamento, intenção e o que leva o cliente à ação — em um só lugar.
          </p>
          <p className="mt-2 text-sm text-slate-500">{data.period.label}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Orientação: rotina + próximo passo (regras nos seus dados) */}
        <section className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Sua orientação (como usar o ecossistema)</h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Não precisa de outro produto nem de “IA solta”: isto aqui usa <strong>regras</strong> em cima dos{' '}
            <strong>mesmos números</strong> que você já vê. No futuro dá para o Noel sugerir frases com base
            nisso — mas a decisão continua sendo sua.
          </p>
          <p className="mt-3">
            <Link
              href="/admin/minha-orientacao"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 underline"
            >
              → Abrir página “Minha orientação” (checklist de tarefas da semana)
            </Link>
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-indigo-800 uppercase tracking-wide mb-3">
                Rotina (2× por semana — 15 min)
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-800">
                <li>
                  <strong>Inteligência</strong> (esta página) — pergunta: “O que está errado ou forte?”
                </li>
                <li>
                  <Link href="/admin/tracking" className="text-indigo-700 font-medium underline">
                    Tracking
                  </Link>{' '}
                  — só se precisar: “Onde exatamente cai?” (data + segmento + nicho)
                </li>
                <li>
                  <Link href="/admin/ylada/valuation" className="text-indigo-700 font-medium underline">
                    Valuation
                  </Link>{' '}
                  — “O que o cliente quer?” (dores / conversão por resposta)
                </li>
                <li>
                  <strong>Uma mudança só</strong> (texto, página, nicho ou pergunta) — mede de novo na semana
                  seguinte
                </li>
              </ol>
            </div>
            <div className="rounded-xl bg-white/90 border border-indigo-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900">{guia.titulo}</h3>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">{guia.texto}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {guia.links.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bloco 1 — Insights */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
            O que chama atenção agora
          </h2>
          <div className="grid gap-4 sm:grid-cols-1">
            {data.insights.map((card) => (
              <article
                key={card.id}
                className={`rounded-2xl border p-5 shadow-sm ${variantClasses(card.variant)}`}
              >
                <p className="text-2xl mb-2">{card.emoji}</p>
                <h3 className="text-lg font-semibold text-slate-900 leading-snug">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{card.detail}</p>
                <p className="mt-3 text-sm font-medium text-slate-800 border-t border-black/5 pt-3">
                  <span className="text-slate-500 font-normal">Sugestão: </span>
                  {card.suggestion}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Bloco 2 — Visão rápida */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">Visão geral rápida</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                icon: '👥',
                label: 'Visitas /pt',
                value: t['funnel_landing_pt_view'] ?? 0,
              },
              {
                icon: '🧠',
                label: 'Respostas diagnóstico',
                value: data.valuation.answersTotal,
              },
              {
                icon: '💬',
                label: 'Cliques WhatsApp',
                value: data.whatsappClicks,
              },
              {
                icon: '✅',
                label: 'Contas criadas',
                value: t['user_created'] ?? 0,
              },
              {
                icon: '📈',
                label: 'Conta ÷ escolheu área',
                value:
                  data.funnel.conversionCadastroContaPct != null
                    ? `${data.funnel.conversionCadastroContaPct}%`
                    : '—',
              },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-center"
              >
                <span className="text-2xl">{c.icon}</span>
                <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {typeof c.value === 'number' ? c.value.toLocaleString('pt-BR') : c.value}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-tight">{c.label}</p>
              </div>
            ))}
          </div>
          {data.funnel.truncated && (
            <p className="text-xs text-amber-700 mt-2">Muitos eventos — parte do funil pode estar truncada.</p>
          )}
        </section>

        {/* Bloco 2b — Free → Pro (freemium) */}
        <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Free → Pro (gatilhos de limite)</h2>
          <p className="text-sm text-slate-600 mb-4">
            Mesmo período ({data.period.label.toLowerCase()}). Limite = bloqueio no servidor; paywall = tela/modal;
            clique Pro = intenção de upgrade.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {data.freemiumConversion.totals.freemium_limit_hit.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-slate-500 mt-1">Limites atingidos</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {data.freemiumConversion.totals.freemium_paywall_view.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-slate-500 mt-1">Viu paywall</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-2xl font-bold text-emerald-800 tabular-nums">
                {data.freemiumConversion.totals.freemium_upgrade_cta_click.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-slate-500 mt-1">Cliques “Pro”</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-4">Gatilho</th>
                  <th className="py-2 text-right">Limite</th>
                  <th className="py-2 text-right">Paywall</th>
                  <th className="py-2 text-right">Clique Pro</th>
                  <th className="py-2 text-right">Clique ÷ limite</th>
                </tr>
              </thead>
              <tbody>
                {(['whatsapp', 'noel', 'active_link'] as const).map((k) => {
                  const row = data.freemiumConversion.byKind[k]
                  const pct =
                    row.limitHit > 0 ? Math.round((row.upgradeCta / row.limitHit) * 1000) / 10 : null
                  return (
                    <tr key={k} className="border-b border-slate-50">
                      <td className="py-2 pr-4 font-medium text-slate-800">{FREEMIUM_KIND_LABEL[k]}</td>
                      <td className="py-2 text-right tabular-nums">{row.limitHit.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right tabular-nums">{row.paywallView.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right font-semibold text-emerald-800 tabular-nums">
                        {row.upgradeCta.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-2 text-right tabular-nums text-slate-700">
                        {pct != null ? `${pct.toLocaleString('pt-BR')}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {data.freemiumConversion.truncated && (
            <p className="text-xs text-amber-700 mt-3">
              Amostra limitada a 12 mil eventos — volume muito alto no período.
            </p>
          )}
          <p className="text-xs text-slate-500 mt-3">
            Detalhes em{' '}
            <Link href="/admin/ylada/behavioral-data" className="text-emerald-700 font-medium underline">
              Dados comportamentais
            </Link>
            .
          </p>
        </section>

        {/* Bloco 3 — Funil resumido */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Funil resumido</h2>
          <p className="text-sm text-slate-500 mb-6">Números brutos por etapa (mesmo período).</p>
          <div className="flex flex-col items-center gap-0 max-w-md mx-auto">
            {FUNIL_ETAPAS.map((step, i) => {
              const n = t[step.key] ?? 0
              return (
                <div key={step.key} className="w-full flex flex-col items-center">
                  <div className="w-full rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-slate-700">{step.label}</span>
                    <span className="text-lg font-semibold text-slate-900 tabular-nums">
                      {n.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  {i < FUNIL_ETAPAS.length - 1 && (
                    <div className="text-slate-400 text-xl py-0.5" aria-hidden>
                      ↓
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {maiorPerdaLabel && (
            <p className="text-center text-sm text-amber-800 mt-6 font-medium">{maiorPerdaLabel}</p>
          )}
        </section>

        {/* Bloco 4 — Intenção */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Intenção (amostra)</h2>
          <p className="text-sm text-slate-500 mb-4">Respostas mais frequentes por segmento — detalhes no Valuation.</p>
          {data.valuation.intentTop.length === 0 ? (
            <p className="text-sm text-slate-500">Sem dados agregados de intenção (views podem precisar de migration).</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.valuation.intentTop.slice(0, 6).map((row, idx) => (
                <li key={`${row.segment}-${row.intent_category}-${idx}`} className="py-3 flex justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-indigo-600">
                      {SEG_LABEL[row.segment] || row.segment} · {row.intent_category}
                    </span>
                    <p className="text-sm text-slate-800 mt-0.5">{row.answer_display}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 tabular-nums shrink-0">
                    {row.cnt.toLocaleString('pt-BR')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Bloco 5 — Conversão (valuation) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Conversão (resposta → WhatsApp)</h2>
          <p className="text-sm text-slate-500 mb-4">Onde resposta e ação se conectam — útil para valuation.</p>
          {data.valuation.intentConversion.length === 0 ? (
            <p className="text-sm text-slate-500">Sem linhas com volume mínimo ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Segmento</th>
                    <th className="py-2 pr-4">Resposta</th>
                    <th className="py-2 text-right">Diagnósticos</th>
                    <th className="py-2 text-right">% WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {data.valuation.intentConversion.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-50">
                      <td className="py-2 pr-4 text-slate-700">{SEG_LABEL[row.segment] || row.segment}</td>
                      <td className="py-2 pr-4 text-slate-800 max-w-xs truncate">{row.answer_display}</td>
                      <td className="py-2 text-right tabular-nums">{row.diagnoses.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right font-semibold text-emerald-700 tabular-nums">
                        {row.conversion_pct.toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Bloco 6 — Ações sugeridas */}
        {data.acoesSugeridas.length > 0 && (
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Próximas ações sugeridas</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-800 text-sm">
              {data.acoesSugeridas.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Navegação */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">Ir mais fundo</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/admin/tracking"
              className="rounded-xl border-2 border-cyan-200 bg-cyan-50/80 p-4 hover:border-cyan-400 transition-colors"
            >
              <span className="text-xl">📍</span>
              <p className="font-semibold text-slate-900 mt-1">Funil completo</p>
              <p className="text-sm text-slate-600 mt-0.5">Filtros por data, segmento e nicho</p>
            </Link>
            <Link
              href="/admin/ylada/valuation"
              className="rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-indigo-300 transition-colors"
            >
              <span className="text-xl">🧠</span>
              <p className="font-semibold text-slate-900 mt-1">Intenção & valuation</p>
              <p className="text-sm text-slate-600 mt-0.5">Combinações e tendências</p>
            </Link>
            <Link
              href="/admin/ylada/behavioral-data"
              className="rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-violet-300 transition-colors"
            >
              <span className="text-xl">📈</span>
              <p className="font-semibold text-slate-900 mt-1">Dados comportamentais</p>
              <p className="text-sm text-slate-600 mt-0.5">Eventos operacionais</p>
            </Link>
            <Link
              href="/admin/motor-crescimento"
              className="rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-indigo-300 transition-colors"
            >
              <span className="text-xl">📚</span>
              <p className="font-semibold text-slate-900 mt-1">Motor de crescimento</p>
              <p className="text-sm text-slate-600 mt-0.5">Documentação e checklist</p>
            </Link>
          </div>
        </section>

        <footer className="text-center py-8 border-t border-slate-200">
          <p className="text-slate-600 italic text-sm">“Dados só têm valor quando viram decisão.”</p>
        </footer>
      </main>
    </div>
  )
}

export default function InteligenciaYladaPage() {
  return (
    <AdminProtectedRoute>
      <InteligenciaContent />
    </AdminProtectedRoute>
  )
}
