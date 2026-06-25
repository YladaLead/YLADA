'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'

import type { LeaderTenantTabulatorRow } from '@/lib/pro-lideres-tabulators'

/** Data civil «hoje» no fuso América/São_Paulo (alinhado ao painel / API). */
function ymdTodaySp(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, day] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, day + delta))
  return dt.toISOString().slice(0, 10)
}

function sortTabulatorsAlpha(rows: LeaderTenantTabulatorRow[]): LeaderTenantTabulatorRow[] {
  return [...rows].sort((a, b) => a.label.localeCompare(b.label, 'pt', { sensitivity: 'base' }))
}

function filterByQuery(rows: LeaderTenantTabulatorRow[], q: string): LeaderTenantTabulatorRow[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return rows
  return rows.filter((r) => r.label.toLowerCase().includes(needle))
}

export function ProLideresLeaderExportExcelSection() {
  const defaults = useMemo(() => {
    const to = ymdTodaySp()
    const from = addDaysYmd(to, -29)
    return { from, to }
  }, [])

  const [from, setFrom] = useState(defaults.from)
  const [to, setTo] = useState(defaults.to)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tabulators, setTabulators] = useState<LeaderTenantTabulatorRow[]>([])
  const [tabsLoading, setTabsLoading] = useState(true)
  const [selectedTabIds, setSelectedTabIds] = useState<Set<string>>(new Set())
  const [tabSearch, setTabSearch] = useState('')

  const sortedTabs = useMemo(() => sortTabulatorsAlpha(tabulators), [tabulators])
  const filteredTabs = useMemo(() => filterByQuery(sortedTabs, tabSearch), [sortedTabs, tabSearch])
  const allSelected = tabulators.length > 0 && selectedTabIds.size === tabulators.length
  const noneSelected = selectedTabIds.size === 0
  const partialSelection = !noneSelected && !allSelected

  const loadTabulators = useCallback(async () => {
    setTabsLoading(true)
    try {
      const res = await fetch('/api/pro-lideres/tabuladores', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setTabulators([])
        return
      }
      const items = (data as { items?: LeaderTenantTabulatorRow[] }).items ?? []
      setTabulators(items)
      setSelectedTabIds(new Set())
    } catch {
      setTabulators([])
    } finally {
      setTabsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTabulators()
  }, [loadTabulators])

  function toggleTab(id: string) {
    setSelectedTabIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAllTabs() {
    setSelectedTabIds(new Set(tabulators.map((row) => row.id)))
  }

  function clearTabSelection() {
    setSelectedTabIds(new Set())
  }

  const download = useCallback(async () => {
    if (noneSelected) {
      setError('Selecione ao menos um tabulador para exportar.')
      return
    }
    setDownloading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ from, to })
      if (partialSelection) {
        for (const row of tabulators) {
          if (selectedTabIds.has(row.id)) params.append('tab', row.label)
        }
      }
      const url = `/api/pro-lideres/painel/export/xlsx?${params.toString()}`
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError((j as { error?: string }).error || 'Não foi possível gerar o arquivo.')
        return
      }
      const blob = await res.blob()
      const cd = res.headers.get('Content-Disposition')
      const m = cd?.match(/filename="([^"]+)"/)
      const name = m?.[1] ?? `pro-lideres-export-${from}_${to}.xlsx`
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = href
      a.download = name
      a.rel = 'noopener'
      a.click()
      URL.revokeObjectURL(href)
    } catch {
      setError('Erro de rede.')
    } finally {
      setDownloading(false)
    }
  }, [from, to, noneSelected, partialSelection, selectedTabIds, tabulators])

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Exportar Excel (diagnóstico)</h2>
      <p className="mt-1 text-sm text-gray-600">
        Gera um arquivo com várias abas: equipe; ranking de links (funil + conversões); ranking de membros (uso
        rastreado, pontuação, taxas); detalhe membro × ferramenta; resumo por tabulador; tarefas. Escolha todos ou
        apenas os tabuladores desejados. Período máximo de 90 dias.
      </p>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-gray-700">Tabuladores a incluir</p>
          {!tabsLoading && tabulators.length > 0 && (
            <div className="flex gap-3 text-xs font-semibold">
              <button type="button" onClick={selectAllTabs} className="text-blue-600 hover:text-blue-800">
                Marcar todos
              </button>
              <button type="button" onClick={clearTabSelection} className="text-gray-600 hover:text-gray-800">
                Desmarcar todos
              </button>
            </div>
          )}
        </div>

        {tabsLoading ? (
          <p className="text-sm text-gray-500">Carregando tabuladores…</p>
        ) : tabulators.length === 0 ? (
          <p className="text-sm text-gray-500">
            Cadastre tabuladores abaixo para filtrar a exportação. Sem cadastro, o arquivo inclui toda a equipe.
          </p>
        ) : (
          <>
            <div className="relative mb-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="search"
                value={tabSearch}
                onChange={(e) => setTabSearch(e.target.value)}
                placeholder="Pesquisar tabuladores…"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900"
                autoComplete="off"
              />
            </div>
            <ul className="max-h-40 divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200">
              {filteredTabs.map((row) => (
                <li key={row.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedTabIds.has(row.id)}
                      onChange={() => toggleTab(row.id)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                    />
                    <span className="text-gray-900">{row.label}</span>
                  </label>
                </li>
              ))}
            </ul>
            {tabSearch.trim() && filteredTabs.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">Nenhum tabulador corresponde à pesquisa.</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {noneSelected
                ? 'Nenhum tabulador selecionado.'
                : allSelected
                  ? 'Todos os tabuladores serão incluídos.'
                  : `${selectedTabIds.size} de ${tabulators.length} tabulador(es) selecionado(s).`}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
          De
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
          Até
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          disabled={downloading || (tabulators.length > 0 && noneSelected)}
          onClick={() => void download()}
          className="inline-flex touch-manipulation items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <Download className="h-4 w-4 shrink-0" aria-hidden />
          {downloading ? 'Gerando…' : 'Baixar .xlsx'}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </section>
  )
}
