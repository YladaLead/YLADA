'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LeaderTenantTabulatorRow } from '@/lib/pro-lideres-tabulators'

export function ProLideresTabuladoresPanel() {
  const [items, setItems] = useState<LeaderTenantTabulatorRow[]>([])
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

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
        <p className="mb-2 text-xs font-medium text-gray-500">Lista no convite (a equipe escolhe um nome)</p>
        {loading ? (
          <p className="text-sm text-gray-600">A carregar…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-600">Ainda não há tabuladores. Adiciona pelo menos um para o convite funcionar.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {items.map((row) => (
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
        )}
      </div>
    </div>
  )
}
