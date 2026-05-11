'use client'

import { useCallback, useMemo, useState } from 'react'
import { Download } from 'lucide-react'

/** Data civil «hoje» no fuso América/São_Paulo (alinhado ao painel / API). */
function ymdTodaySp(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, day] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, day + delta))
  return dt.toISOString().slice(0, 10)
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

  const download = useCallback(async () => {
    setDownloading(true)
    setError(null)
    try {
      const url = `/api/pro-lideres/painel/export/xlsx?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
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
  }, [from, to])

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Exportar Excel (diagnóstico)</h2>
      <p className="mt-1 text-sm text-gray-600">
        Gera um arquivo com várias abas: equipe; ranking de links (funil + conversões); ranking de membros (uso
        rastreado, pontuação, taxas); detalhe membro × ferramenta; resumo por tabulador; tarefas. Período máximo de 90
        dias.
      </p>
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
          disabled={downloading}
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
