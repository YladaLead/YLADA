'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type DiagnosticRow = {
  linkId: string
  slug: string
  title: string
  views: number
  starts: number
  completions: number
  whatsappClicks: number
}

export function ProLideresEquipeAttributionPanel() {
  const [days] = useState(30)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<DiagnosticRow[]>([])
  const [truncated, setTruncated] = useState(false)
  const [sinceIso, setSinceIso] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [tableQuery, setTableQuery] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/pro-lideres/equipe/links-diagnostics?days=${days}`, {
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao carregar diagnóstico.')
        setRows([])
        return
      }
      setRows((data as { rows?: DiagnosticRow[] }).rows ?? [])
      setTruncated(Boolean((data as { truncated?: boolean }).truncated))
      setSinceIso(typeof (data as { sinceIso?: string }).sinceIso === 'string' ? (data as { sinceIso: string }).sinceIso : null)
    } catch {
      setError('Erro de rede.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    void load()
  }, [load])

  const filteredRows = useMemo(() => {
    const q = tableQuery.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const t = (r.title || '').toLowerCase()
      const s = (r.slug || '').toLowerCase()
      return t.includes(q) || s.includes(q)
    })
  }, [rows, tableQuery])

  const periodHint = sinceIso
    ? `Últimos ${days} dias (desde ${new Date(sinceIso).toLocaleDateString('pt-BR')})`
    : `Últimos ${days} dias`

  return (
    <section
      className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm"
      aria-labelledby="pl-links-diag-heading"
    >
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 border-b border-blue-50 bg-blue-50/50 px-4 py-3 text-left transition hover:bg-blue-50"
        aria-expanded={panelOpen}
      >
        <div className="min-w-0 space-y-1">
          <p id="pl-links-diag-heading" className="text-sm font-semibold text-gray-900">
            Diagnóstico das ferramentas (equipe)
          </p>
          <p className="text-xs leading-relaxed text-gray-600">
            Todas as ferramentas do catálogo numa só visão: <strong className="text-gray-800">aberturas</strong>,{' '}
            <strong className="text-gray-800">quem começou o fluxo</strong>, <strong className="text-gray-800">conclusões / resultado</strong> e{' '}
            <strong className="text-gray-800">cliques no WhatsApp</strong>. Em <strong className="text-gray-800">Pessoas neste espaço</strong>, expanda
            cada membro para ver o ranking do que ele ou ela mais usa (com link rastreado).
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!loading && rows.length > 0 ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-blue-100">
              {rows.length}
            </span>
          ) : null}
          <span className="text-gray-500" aria-hidden>
            {panelOpen ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {panelOpen ? (
        <div className="space-y-4 border-t border-blue-100/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
            <span>{periodHint}</span>
            <button
              type="button"
              disabled={loading}
              onClick={() => void load()}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Atualizando…' : 'Atualizar'}
            </button>
          </div>
          {truncated ? (
            <p className="text-xs text-amber-800">
              Atenção: há muitos eventos no período; a contagem pode estar limitada. Reduza o intervalo no servidor em
              versões futuras ou contate suporte se os números parecerem estranhos.
            </p>
          ) : null}

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          {loading ? (
            <p className="text-sm text-gray-500">Carregando…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-600">
              Nenhuma ferramenta de quiz, calculadora, diagnóstico ou triagem encontrada. Crie em{' '}
              <a href="/pt/links" className="font-medium text-blue-700 underline">
                Meus links
              </a>
              .
            </p>
          ) : (
            <>
              <div>
                <label htmlFor="pl-diag-search" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Filtrar por nome
                </label>
                <input
                  id="pl-diag-search"
                  type="search"
                  value={tableQuery}
                  onChange={(e) => setTableQuery(e.target.value)}
                  placeholder="Nome da ferramenta ou slug…"
                  autoComplete="off"
                  className="w-full max-w-md rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="max-h-[min(60vh,28rem)] overflow-x-auto overflow-y-auto overscroll-contain rounded-lg border border-gray-100">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 z-[1] bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 shadow-sm">
                    <tr>
                      <th className="px-3 py-2">Ferramenta</th>
                      <th className="px-3 py-2 text-right">Aberturas</th>
                      <th className="px-3 py-2 text-right">Começou</th>
                      <th className="px-3 py-2 text-right">Concluiu / viu resultado</th>
                      <th className="px-3 py-2 text-right">WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRows.map((r) => (
                      <tr key={r.linkId}>
                        <td className="px-3 py-2">
                          <p className="font-medium text-gray-900">{r.title}</p>
                          {r.slug ? (
                            <p className="text-[11px] text-gray-500">{r.slug}</p>
                          ) : null}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-gray-900">{r.views}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-gray-900">{r.starts}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-gray-900">{r.completions}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-emerald-800">{r.whatsappClicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>
  )
}
