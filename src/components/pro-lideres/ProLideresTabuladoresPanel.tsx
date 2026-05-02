'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { LeaderTenantTabulatorRow } from '@/lib/pro-lideres-tabulators'

function sortTabulatorsAlpha(rows: LeaderTenantTabulatorRow[]): LeaderTenantTabulatorRow[] {
  return [...rows].sort((a, b) => a.label.localeCompare(b.label, 'pt', { sensitivity: 'base' }))
}

function filterByQuery(rows: LeaderTenantTabulatorRow[], q: string): LeaderTenantTabulatorRow[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return rows
  return rows.filter((r) => r.label.toLowerCase().includes(needle))
}

export function ProLideresTabuladoresPanel() {
  const [items, setItems] = useState<LeaderTenantTabulatorRow[]>([])
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [listSearch, setListSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSearch, setModalSearch] = useState('')
  const modalPanelRef = useRef<HTMLDivElement>(null)

  const sortedAll = useMemo(() => sortTabulatorsAlpha(items), [items])
  const filteredMain = useMemo(() => filterByQuery(sortedAll, listSearch), [sortedAll, listSearch])
  const filteredModal = useMemo(() => filterByQuery(sortedAll, modalSearch), [sortedAll, modalSearch])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/tabuladores', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível carregar.')
        setItems([])
        return
      }
      setItems((data as { items?: LeaderTenantTabulatorRow[] }).items ?? [])
    } catch {
      setError('Erro de rede.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!modalOpen) return
    const t = window.setTimeout(() => modalPanelRef.current?.querySelector<HTMLInputElement>('input')?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [modalOpen])

  useEffect(() => {
    if (!modalOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen])

  async function onAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/tabuladores', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: trimmed }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível adicionar.')
        return
      }
      setLabel('')
      await load()
    } catch {
      setError('Erro de rede.')
    } finally {
      setSaving(false)
    }
  }

  async function onRemove(id: string) {
    if (!confirm('Remover este tabulador da lista?')) return
    setRemovingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/pro-lideres/tabuladores/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível remover.')
        return
      }
      await load()
    } catch {
      setError('Erro de rede.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
      )}

      <form onSubmit={(e) => void onAdd(e)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block min-w-0 flex-1">
          <span className="mb-1 block text-xs font-medium text-gray-600">Novo tabulador</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={120}
            placeholder="Nome que aparece no convite da equipe"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
            disabled={saving}
          />
        </label>
        <button
          type="submit"
          disabled={saving || !label.trim()}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'A guardar…' : 'Cadastrar'}
        </button>
      </form>

      <div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Lista no convite (a equipe escolhe um nome)</p>
            <p className="text-[11px] text-gray-400">Ordem alfabética (A–Z)</p>
          </div>
          {!loading && items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setModalSearch('')
                setModalOpen(true)
              }}
              className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Ver todos numa janela
            </button>
          )}
        </div>

        {!loading && items.length > 0 && (
          <div className="relative mb-3">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              placeholder="Pesquisar na lista…"
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900"
              autoComplete="off"
            />
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-600">A carregar…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-600">Ainda não há tabuladores. Adiciona pelo menos um para o convite funcionar.</p>
        ) : (
          <>
            {listSearch.trim() && (
              <p className="mb-2 text-xs text-gray-500">
                {filteredMain.length === 0
                  ? 'Nenhum resultado para a pesquisa.'
                  : `${filteredMain.length} de ${sortedAll.length} nome(s)`}
              </p>
            )}
            <ul className="max-h-[min(22rem,55vh)] divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 bg-white">
              {filteredMain.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm font-medium text-gray-900">{row.label}</span>
                  <button
                    type="button"
                    disabled={removingId === row.id}
                    onClick={() => void onRemove(row.id)}
                    className="shrink-0 text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {removingId === row.id ? 'A remover…' : 'Remover'}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false)
          }}
        >
          <div
            ref={modalPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tabuladores-modal-title"
            className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl border border-gray-200 bg-white shadow-xl sm:max-h-[85vh] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <h2 id="tabuladores-modal-title" className="text-lg font-bold text-gray-900">
                  Todos os tabuladores
                </h2>
                <p className="text-xs text-gray-500">{sortedAll.length} nome(s) · ordem A–Z</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="shrink-0 border-b border-gray-100 px-4 py-3 sm:px-5">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <input
                  type="search"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Pesquisar nesta lista…"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900"
                  autoComplete="off"
                />
              </div>
              {modalSearch.trim() && (
                <p className="mt-2 text-xs text-gray-500">
                  {filteredModal.length === 0
                    ? 'Nenhum resultado.'
                    : `${filteredModal.length} resultado(s)`}
                </p>
              )}
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto divide-y divide-gray-100 px-2 py-1 sm:px-3">
              {filteredModal.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 px-2 py-2.5 sm:px-3">
                  <span className="text-sm text-gray-900">{row.label}</span>
                  <button
                    type="button"
                    disabled={removingId === row.id}
                    onClick={() => void onRemove(row.id)}
                    className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {removingId === row.id ? '…' : 'Remover'}
                  </button>
                </li>
              ))}
            </ul>
            <div className="shrink-0 border-t border-gray-100 px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full min-h-[44px] rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
