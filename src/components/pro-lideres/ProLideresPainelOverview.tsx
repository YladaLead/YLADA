'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type {
  PainelMemberStatus,
  PainelOverviewPreset,
  ProLideresPainelOverviewPayload,
} from '@/lib/pro-lideres-painel-overview'

function spToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + delta))
  return dt.toISOString().slice(0, 10)
}

export function ProLideresPainelOverview() {
  const [preset, setPreset] = useState<PainelOverviewPreset>('7d')
  const [customFrom, setCustomFrom] = useState(() => addDaysYmd(spToday(), -6))
  const [customTo, setCustomTo] = useState(() => spToday())
  const [data, setData] = useState<ProLideresPainelOverviewPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (preset === 'custom') {
        params.set('from', customFrom)
        params.set('to', customTo)
      } else {
        params.set('preset', preset)
      }
      const res = await fetch(`/api/pro-lideres/painel-overview?${params.toString()}`, {
        credentials: 'include',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Não foi possível carregar o resumo.')
        setData(null)
        return
      }
      setData(json as ProLideresPainelOverviewPayload)
    } catch {
      setError('Erro de rede.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [preset, customFrom, customTo])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (data?.preset === 'custom') {
      setCustomFrom(data.rangeFrom)
      setCustomTo(data.rangeTo)
    }
  }, [data?.preset, data?.rangeFrom, data?.rangeTo])

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-8 text-center text-sm text-gray-500">
        Carregando painel de comando…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900">
        <p>{error || 'Resumo indisponível.'}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-2 font-medium text-amber-800 underline-offset-2 hover:underline"
        >
          Tentar de novo
        </button>
      </div>
    )
  }

  const th = data.thermometer
  const wowPct =
    th.weekVsWeekPct != null
      ? `${th.weekVsWeekDirection === 'down' ? '−' : th.weekVsWeekDirection === 'up' ? '+' : ''}${th.weekVsWeekPct}%`
      : '—'

  const focusWord = data.focusDayShortLabel
  const maxDate = spToday()
  const activeLabel =
    data.preset === 'yesterday'
      ? 'Ativos ontem'
      : data.preset === 'custom'
        ? data.rangeFrom === data.rangeTo
          ? 'Ativos neste dia'
          : `Ativos (${data.focusDayShortLabel})`
        : 'Ativos hoje'
  const inactiveLabel =
    data.preset === 'yesterday'
      ? 'Inativos ontem'
      : data.preset === 'custom'
        ? data.rangeFrom === data.rangeTo
          ? 'Inativos neste dia'
          : `Inativos (${data.focusDayShortLabel})`
        : 'Inativos hoje'
  const vsHint =
    data.preset === 'yesterday'
      ? 'Conclusões vs anteontem'
      : data.preset === '30d'
        ? 'Conclusões vs 30 dias anteriores'
        : data.preset === 'custom'
          ? 'Conclusões vs período anterior'
          : 'Conclusões vs semana anterior'

  return (
    <div className="space-y-8">
      {/* 1. Termômetro */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Performance da equipe · {data.periodLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-800">{th.situationLine}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="painel-periodo">
              Período
            </label>
            <select
              id="painel-periodo"
              value={preset}
              onChange={(e) => setPreset(e.target.value as PainelOverviewPreset)}
              disabled={loading}
              aria-busy={loading}
              className="rounded-lg border border-gray-200/90 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm outline-none ring-blue-100 transition hover:border-gray-300 focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
            >
              <option value="yesterday">Ontem</option>
              <option value="7d">7 dias</option>
              <option value="30d">30 dias</option>
              <option value="custom">Escolher datas…</option>
            </select>
            {preset === 'custom' ? (
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-200/80 bg-white/90 px-2 py-1.5 text-xs text-gray-700 shadow-sm">
                <span className="text-gray-500">De</span>
                <input
                  type="date"
                  value={customFrom}
                  min="2020-01-01"
                  max={customTo || maxDate}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="max-w-[9.5rem] rounded border border-gray-200 bg-white px-1 py-0.5 text-xs text-gray-800"
                  aria-label="Data inicial"
                />
                <span className="text-gray-500">até</span>
                <input
                  type="date"
                  value={customTo}
                  min={customFrom || '2020-01-01'}
                  max={maxDate}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="max-w-[9.5rem] rounded border border-gray-200 bg-white px-1 py-0.5 text-xs text-gray-800"
                  aria-label="Data final"
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              Atualizar
            </button>
            {loading && data ? (
              <span className="text-xs text-gray-500" aria-live="polite">
                Atualizando…
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <ThermoPill
            emoji="🔥"
            label={activeLabel}
            value={`${th.activeToday}/${th.totalMembers || '—'}`}
            hint={`Com tarefa em ${focusWord}`}
          />
          <ThermoPill
            emoji="⚠️"
            label={inactiveLabel}
            value={String(th.inactiveToday)}
            hint={`Sem tarefa em ${focusWord}`}
          />
          <ThermoPill
            emoji="📊"
            label="Engajamento"
            value={`${th.engagementPct}%`}
            hint="Com tarefa no período"
          />
          <ThermoPill
            emoji="💬"
            label="WhatsApp (rastreado)"
            value={String(th.whatsappConversations)}
            hint="Cliques com rastreio da equipe"
          />
          <ThermoPill
            emoji="📈"
            label="Variação"
            value={wowPct}
            hint={vsHint}
          />
          <ThermoPill
            emoji="✓"
            label="Período"
            value={`${formatPtDate(data.rangeFrom)} – ${formatPtDate(data.rangeTo)}`}
            hint={`Agora: ${formatPtDate(data.today)}`}
          />
        </div>
      </section>

      {/* 2. Alertas */}
      {data.alerts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Alertas do líder</h2>
          <ul className="space-y-2">
            {data.alerts.map((a) => (
              <li
                key={a.id}
                className={`flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  a.variant === 'critical'
                    ? 'border-red-200 bg-red-50/90'
                    : a.variant === 'warning'
                      ? 'border-amber-200 bg-amber-50/90'
                      : 'border-sky-200 bg-sky-50/80'
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{a.title}</p>
                  <p className="text-sm text-gray-700">{a.body}</p>
                </div>
                <Link
                  href={a.ctaHref}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  {a.ctaLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 3. Ranking */}
      <section id="ranking-equipe" className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ranking da equipe</h2>
            <p className="text-sm text-gray-600">
              Ordenado por pontos no período. Status ajuda a ver quem precisa de atenção.
            </p>
          </div>
          <Link href="/pro-lideres/painel/tarefas" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Tarefas diárias
          </Link>
        </div>

        {data.teamMemberCount === 0 ? (
          <p className="text-sm text-gray-600">Não há membros na equipe ainda. Convide pessoas para encher este ranking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                  <th className="pb-2 pr-2">#</th>
                  <th className="pb-2 pr-2">Nome</th>
                  <th className="pb-2 pr-2">Pontos</th>
                  <th className="pb-2 pr-2">Tarefas</th>
                  <th className="pb-2 pr-2">WhatsApp</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.teamRanking.map((m, i) => (
                  <tr key={m.userId} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5 pr-2 font-medium text-gray-500">{i + 1}</td>
                    <td className="py-2.5 pr-2 font-medium text-gray-900">{m.displayName}</td>
                    <td className="py-2.5 pr-2 font-medium text-gray-800">{m.points}</td>
                    <td className="py-2.5 pr-2 text-gray-700">
                      {m.completionsInRange}
                      {m.completedToday > 0 ? (
                        <span className="ml-1 text-emerald-700">
                          (+{m.completedToday} {data.focusDayShortLabel})
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2.5 pr-2 text-gray-700">{m.trackedWhatsapp}</td>
                    <td className="py-2.5">
                      <StatusBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Funil */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Funil dos seus links (período)</h2>
          <Link href="/pro-lideres/painel/catalogo" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Catálogo
          </Link>
        </div>
        <p className="mb-4 text-xs text-gray-500">
          Eventos nos links YLADA do líder. Rastreio por membro continua em Análise da equipe com <code className="rounded bg-gray-100 px-0.5">?pl_m=</code>.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <FunnelCard label="Visualizações" value={data.funnel.linkViews} icon="👀" />
          <FunnelCard label="Diagnósticos / fluxo" value={data.funnel.diagnosticsCompleted} icon="🧠" />
          <FunnelCard label="Cliques WhatsApp" value={data.funnel.whatsappClicks} icon="💬" />
        </div>
      </section>

      {/* 5. Links em destaque + rastreados */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900">Links mais vistos</h3>
            <Link href="/pro-lideres/painel/catalogo" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Ver catálogo
            </Link>
          </div>
          {data.topLinks.length === 0 ? (
            <p className="text-sm text-gray-600">Nenhuma visualização neste período.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.topLinks.map((l) => (
                <li
                  key={l.linkId}
                  className="flex items-start justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2"
                >
                  <span className="font-medium text-gray-800 line-clamp-2">{l.title}</span>
                  <span className="shrink-0 text-gray-600">
                    {l.views} views
                    {l.whatsappClicks > 0 ? ` · ${l.whatsappClicks} WA` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900">Uso rastreado (por pessoa)</h3>
            <Link href="/pro-lideres/painel/equipe" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Análise da equipe
            </Link>
          </div>
          {data.memberLinkActivity.filter((x) => x.views > 0 || x.whatsappClicks > 0).length === 0 ? (
            <p className="text-sm text-gray-600">
              Ninguém com cliques rastreados. Peça o link com <code className="rounded bg-gray-100 px-0.5">?pl_m=</code>.
            </p>
          ) : (
            <ul className="max-h-56 space-y-2 overflow-y-auto text-sm">
              {data.memberLinkActivity
                .filter((x) => x.views > 0 || x.whatsappClicks > 0)
                .map((m) => (
                  <li
                    key={m.userId}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <span className="truncate font-medium text-gray-800">{m.displayName}</span>
                    <span className="shrink-0 text-gray-600">
                      {m.views} views · {m.whatsappClicks} WA
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </section>

      {/* 6. Última atividade */}
      {data.recentCompletions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-gray-900">Quem fez tarefa recentemente</h3>
          <ul className="divide-y divide-gray-100 text-sm">
            {data.recentCompletions.map((r, i) => (
              <li
                key={`${r.memberUserId}-${r.completedOn}-${i}`}
                className="flex flex-wrap items-baseline justify-between gap-2 py-2"
              >
                <span className="font-medium text-gray-800">{r.displayName}</span>
                <span className="text-gray-600">
                  {r.taskTitle} · {formatPtDate(r.completedOn)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 7. Diagnóstico + ação Noel */}
      <section className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 shadow-sm">
        <h3 className="font-semibold text-violet-950">Diagnóstico e próximos passos</h3>
        <p className="mt-2 text-sm leading-relaxed text-violet-950/90">{data.diagnostic}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-violet-950/90">
          {data.nextSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/pro-lideres/painel/noel"
            className="inline-flex items-center justify-center rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800"
          >
            Gerar mensagem com o Noel
          </Link>
          <Link
            href="/pro-lideres/painel/links"
            className="inline-flex items-center justify-center rounded-lg border border-violet-300 bg-white px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100/80"
          >
            Convidar equipe
          </Link>
        </div>
      </section>
    </div>
  )
}

function ThermoPill({
  emoji,
  label,
  value,
  hint,
}: {
  emoji: string
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-3 shadow-sm">
      <p className="text-xs text-gray-500">
        <span className="mr-1">{emoji}</span>
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
      <p className="text-[11px] leading-snug text-gray-500">{hint}</p>
    </div>
  )
}

function FunnelCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-center">
      <p className="text-2xl">{icon}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-medium text-gray-600">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: PainelMemberStatus }) {
  const map =
    status === 'ativo'
      ? { label: 'Ativo', className: 'bg-emerald-100 text-emerald-900 ring-emerald-200' }
      : status === 'risco'
        ? { label: 'Em risco', className: 'bg-amber-100 text-amber-900 ring-amber-200' }
        : { label: 'Parado', className: 'bg-red-100 text-red-900 ring-red-200' }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${map.className}`}>
      {map.label}
    </span>
  )
}

function formatPtDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number)
  if (!y || !m || !d) return ymd
  try {
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  } catch {
    return ymd
  }
}
