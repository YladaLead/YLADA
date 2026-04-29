'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PRO_ESTETICA_CAPILAR_BASE_PATH } from '@/config/pro-estetica-capilar-menu'

const HUB_MEUS = `${PRO_ESTETICA_CAPILAR_BASE_PATH}/biblioteca-links?tab=meus`

type SortMode = 'cliques' | 'diagnosticos' | 'whatsapp'

type ApiLink = {
  id: string
  slug: string
  title?: string | null
  status: string
  url: string
  pro_lideres_preset?: boolean
  stats?: {
    view?: number
    cta_click?: number
    diagnosis_count?: number
    complete?: number
  }
}

/** Mesmo critério que Pro Estética Corporal: sem presets automáticos nem links de recrutamento. */
function filterProEsteticaCapilarLinks(rows: ApiLink[]): ApiLink[] {
  return rows.filter((l) => {
    if (l.pro_lideres_preset) return false
    if (String(l.slug).includes('-recrut-')) return false
    return true
  })
}

function contagemDiagnosticos(l: ApiLink): number {
  return l.stats?.diagnosis_count ?? l.stats?.complete ?? 0
}

function score(l: ApiLink, mode: SortMode): number {
  if (mode === 'cliques') return l.stats?.view ?? 0
  if (mode === 'diagnosticos') return contagemDiagnosticos(l)
  return l.stats?.cta_click ?? 0
}

const SORT_OPTIONS: { id: SortMode; label: string; hint: string }[] = [
  { id: 'cliques', label: 'Mais cliques', hint: 'Cliques no link (aberturas da página do fluxo)' },
  { id: 'diagnosticos', label: 'Mais diagnósticos', hint: 'Quizzes / diagnósticos concluídos neste link' },
  { id: 'whatsapp', label: 'Mais WhatsApp', hint: 'Cliques no botão para falar contigo' },
]

export default function ProEsteticaCapilarLinksAnaliseClient() {
  const [sort, setSort] = useState<SortMode>('diagnosticos')
  const [rows, setRows] = useState<ApiLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ylada/links', { credentials: 'include', cache: 'no-store' })
      const json = (await res.json()) as { success?: boolean; data?: ApiLink[]; error?: string }
      if (!res.ok || !json.success || !Array.isArray(json.data)) {
        setError(typeof json.error === 'string' ? json.error : 'Não foi possível carregar os links.')
        setRows([])
        return
      }
      setRows(filterProEsteticaCapilarLinks(json.data))
    } catch {
      setError('Não foi possível carregar os links.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const d = score(b, sort) - score(a, sort)
      if (d !== 0) return d
      return String(a.title || a.slug).localeCompare(String(b.title || b.slug), 'pt')
    })
    return copy
  }, [rows, sort])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Análise dos links</h1>
        <p className="mt-1 text-sm text-gray-600 leading-snug">
          Ordena os teus fluxos por desempenho. Para copiar URL, QR ou editar, vai a{' '}
          <Link href={HUB_MEUS} className="font-medium text-sky-700 underline hover:text-sky-900">
            Links → Os teus links
          </Link>
          .
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-1 sm:inline-flex sm:flex-wrap sm:gap-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            title={opt.hint}
            onClick={() => setSort(opt.id)}
            className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors sm:w-auto sm:px-4 sm:text-center ${
              sort === opt.id ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
          <p className="text-sm text-gray-500">A carregar…</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
          Ainda sem links nesta conta. Cria um na{' '}
          <Link href={`${PRO_ESTETICA_CAPILAR_BASE_PATH}/biblioteca-links?tab=prontos`} className="font-medium text-sky-700 underline">
            Biblioteca
          </Link>{' '}
          ou no Noel.
        </div>
      ) : (
        <ol className="space-y-2">
          {sorted.map((link, index) => (
            <li
              key={link.id}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums text-gray-400">#{index + 1}</span>
                    <span className="truncate text-sm font-semibold text-gray-900">{link.title || link.slug}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        link.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : link.status === 'paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {link.status === 'active' ? 'Ativo' : link.status === 'paused' ? 'Pausado' : 'Arquivado'}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-[11px] text-gray-400">{link.url}</p>
                </div>
                <dl className="flex shrink-0 gap-4 text-right text-xs sm:gap-5">
                  <div>
                    <dt className="font-medium text-gray-600">Clique</dt>
                    <dd className="font-semibold tabular-nums text-gray-900">{link.stats?.view ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">Diagnósticos</dt>
                    <dd className="font-semibold tabular-nums text-gray-900">{contagemDiagnosticos(link)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">WhatsApp</dt>
                    <dd className="font-semibold tabular-nums text-gray-900">{link.stats?.cta_click ?? 0}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
