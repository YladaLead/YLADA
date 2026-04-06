'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

type Row = {
  id: string
  created_at: string
  answers: Record<string, unknown>
}

function truncCell(s: unknown, max: number): string {
  if (s === null || s === undefined) return '—'
  const t = String(s).replace(/\s+/g, ' ').trim()
  if (!t) return '—'
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`
}

export default function AdminClinicasEsteticaCorporalPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/ylada/clinicas-estetica-corporal-intake?limit=500', {
        credentials: 'include',
      })
      const json = await res.json()
      if (json.success) {
        setRows(json.data ?? [])
        setTotal(json.total ?? 0)
      } else {
        setError(json.error || 'Erro ao carregar')
      }
    } catch {
      setError('Erro de rede')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const csvFilename = useMemo(() => {
    const d = new Date().toISOString().slice(0, 10)
    return `clinicas-estetica-corporal-intake-${d}.csv`
  }, [])

  const downloadCsv = useCallback(() => {
    const headers = ['id', 'data_hora', 'clinic_name', 'phone', 'email', 'contact_name', 'answers_json']
    const lines = [headers.join(';')]
    for (const r of rows) {
      const a = r.answers || {}
      const json = JSON.stringify(a)
      const cols = [
        r.id,
        r.created_at,
        String(a.clinic_name ?? ''),
        String(a.phone ?? ''),
        String(a.email ?? ''),
        String(a.contact_name ?? ''),
        json,
      ].map((c) => `"${String(c).replace(/"/g, '""')}"`)
      lines.push(cols.join(';'))
    }
    const bom = '\uFEFF'
    const blob = new Blob([bom + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = csvFilename
    a.click()
    URL.revokeObjectURL(url)
  }, [rows, csvFilename])

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">
              ← Painel admin
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Clínicas estética corporal — intake</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">
              Respostas de{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">/pt/clinicas-estetica-corporal</code>. Tabela:{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">ylada_clinicas_estetica_corporal_intake</code>.
              Notificação por e-mail: <code className="text-xs bg-gray-100 px-1 rounded">RESEND</code> +{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">CONTACT_NOTIFICATION_EMAIL</code> (ou{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">CLINICAS_ESTETICA_CORPORAL_NOTIFY_EMAIL</code>).
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={load}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Atualizar
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={rows.length === 0}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              Baixar CSV (até 500 linhas)
            </button>
            <span className="text-sm text-gray-600">
              Total no banco: <strong>{total}</strong>
              {rows.length < total && (
                <>
                  {' '}
                  · Exibindo: <strong>{rows.length}</strong>
                </>
              )}
            </span>
          </div>

          {loading && <p className="text-gray-500">Carregando…</p>}
          {error && <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-100 p-3">{error}</p>}

          {!loading && !error && total === 0 && (
            <p className="text-gray-600">
              Nenhuma resposta ainda. Rode o SQL da migration <strong>300</strong> no Supabase e teste o envio pela página
              pública.
            </p>
          )}

          <section className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Respostas</h2>
              <p className="text-xs text-gray-600 mt-0.5">Abra cada linha para ver o JSON completo.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {rows.map((r) => {
                const a = r.answers || {}
                return (
                  <details key={r.id} className="group px-4 py-3 hover:bg-teal-50/30">
                    <summary className="cursor-pointer list-none flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span className="text-gray-500 tabular-nums text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString('pt-BR')}
                      </span>
                      <span className="font-mono text-xs text-gray-400 truncate max-w-[200px]">{r.id}</span>
                      <span className="text-gray-800">
                        <strong>{truncCell(a.clinic_name, 48)}</strong>
                      </span>
                      <span className="text-gray-700">{truncCell(a.phone || a.email, 28)}</span>
                      <span className="text-gray-600">
                        {truncCell(a.contact_name, 28)} · {truncCell(a.pain || a.challenge, 32)}
                      </span>
                    </summary>
                    <pre className="mt-3 text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto max-h-80 overflow-y-auto">
                      {JSON.stringify(a, null, 2)}
                    </pre>
                  </details>
                )
              })}
            </div>
            {rows.length === 0 && !loading && !error && total > 0 && (
              <p className="p-6 text-center text-gray-500 text-sm">Nenhuma linha nesta página.</p>
            )}
          </section>
        </main>
      </div>
    </AdminProtectedRoute>
  )
}
