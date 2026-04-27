'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { formatLeaderOnboardingAnswersForAdmin } from '@/lib/pro-lideres-leader-onboarding-admin-format'

type OnboardingItem = {
  id: string
  leader_name: string
  invited_email: string
  segment_code: string
  status: string
  expires_at: string
  created_at: string
  response_completed_at: string | null
  questionnaire_answers?: Record<string, unknown> | null
}

function fmt(d: string | null | undefined): string {
  if (!d) return '-'
  return new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function AdminProLideresOnboardingPageContent() {
  const [leaderName, setLeaderName] = useState('')
  const [email, setEmail] = useState('')
  const [segmentCode, setSegmentCode] = useState('h-lider')
  const [creating, setCreating] = useState(false)
  const [newUrl, setNewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [items, setItems] = useState<OnboardingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [detailItem, setDetailItem] = useState<OnboardingItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!detailItem) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailItem(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailItem])

  async function load() {
    setLoading(true)
    const qs = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''
    const res = await fetch(`/api/admin/pro-lideres/leader-onboarding${qs}`, { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao carregar.')
      setItems([])
      setLoading(false)
      return
    }
    setItems(((data as { items?: OnboardingItem[] }).items ?? []) as OnboardingItem[])
    setLoading(false)
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onDeleteRow(item: OnboardingItem) {
    const label = `“${item.leader_name}” (${item.invited_email})`
    if (
      !window.confirm(
        `Excluir este link de onboarding? ${label}\n\nA pessoa deixa de poder usar o URL antigo. Esta ação não dá para desfazer.`
      )
    ) {
      return
    }
    setDeletingId(item.id)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/pro-lideres/leader-onboarding/${encodeURIComponent(item.id)}`,
        { method: 'DELETE', credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível excluir o link.')
        return
      }
      if (detailItem?.id === item.id) setDetailItem(null)
      await load()
    } finally {
      setDeletingId(null)
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError(null)
    setNewUrl(null)
    try {
      const res = await fetch('/api/admin/pro-lideres/leader-onboarding', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaderName,
          email,
          segmentCode,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao gerar link.')
        return
      }
      setNewUrl((data as { onboarding_url?: string }).onboarding_url ?? null)
      setLeaderName('')
      setEmail('')
      setSegmentCode('h-lider')
      await load()
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Pro Líderes - Onboarding do líder</h1>
          <p className="text-sm text-gray-600">
            Crie um link para o líder responder o questionário. As respostas ficam vinculadas ao e-mail.
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Link
              href="/pro-lideres/onboarding-exemplo"
              className="font-semibold text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noreferrer"
            >
              Ver pré-visualização do formulário (exemplo, não grava dados)
            </Link>
            <Link href="/admin/pro-lideres/manual-leader" className="font-semibold text-blue-600 underline hover:text-blue-800">
              Cadastro manual de líder (senha + acesso)
            </Link>
          </p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Gerar novo link</h2>
          <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => void onCreate(e)}>
            <input
              required
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="Nome do líder"
              className="rounded-lg border border-gray-300 px-3 py-2.5"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="rounded-lg border border-gray-300 px-3 py-2.5"
            />
            <input
              value={segmentCode}
              onChange={(e) => setSegmentCode(e.target.value)}
              placeholder="h-lider"
              className="rounded-lg border border-gray-300 px-3 py-2.5"
            />
            <button
              type="submit"
              disabled={creating}
              className="sm:col-span-3 min-h-[44px] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {creating ? 'Gerando link...' : 'Gerar link de onboarding'}
            </button>
          </form>
          {newUrl && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
              <p className="mb-1 font-semibold">Link criado:</p>
              <a className="break-all underline" href={newUrl} target="_blank" rel="noreferrer">
                {newUrl}
              </a>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Links criados</h2>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou e-mail"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Buscar
              </button>
            </div>
          </div>
          {loading ? (
            <p className="text-sm text-gray-600">Carregando...</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="px-2 py-2">Líder</th>
                    <th className="px-2 py-2">E-mail</th>
                    <th className="px-2 py-2">Segmento</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Criado</th>
                    <th className="px-2 py-2">Respondido</th>
                    <th className="px-2 py-2">Respostas</th>
                    <th className="px-2 py-2 w-[1%]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 align-top">
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => setDetailItem(item)}
                          className="text-left font-medium text-blue-700 underline decoration-blue-400 decoration-1 underline-offset-2 hover:text-blue-900"
                        >
                          {item.leader_name}
                        </button>
                      </td>
                      <td className="px-2 py-2 text-gray-700">{item.invited_email}</td>
                      <td className="px-2 py-2 text-gray-700">{item.segment_code}</td>
                      <td className="px-2 py-2 text-gray-700">{item.status}</td>
                      <td className="px-2 py-2 text-gray-600">{fmt(item.created_at)}</td>
                      <td className="px-2 py-2 text-gray-600">{fmt(item.response_completed_at)}</td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => setDetailItem(item)}
                          className="whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-gray-50"
                        >
                          Ver respostas
                        </button>
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => void onDeleteRow(item)}
                          className="whitespace-nowrap rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === item.id ? 'A excluir…' : 'Excluir'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-2 py-6 text-center text-gray-500">
                        Nenhum link encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {detailItem && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
            role="presentation"
            onClick={() => setDetailItem(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="onboarding-detail-title"
              className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
                <div>
                  <h2 id="onboarding-detail-title" className="text-lg font-bold text-gray-900">
                    Respostas do onboarding
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{detailItem.leader_name}</span>
                    {' · '}
                    {detailItem.invited_email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {detailItem.status}
                    {detailItem.response_completed_at
                      ? ` · Respondido em ${fmt(detailItem.response_completed_at)}`
                      : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailItem(null)}
                  className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
              <div className="max-h-[calc(90vh-5rem)] overflow-y-auto px-4 py-4 sm:px-5">
                {(() => {
                  const rows = formatLeaderOnboardingAnswersForAdmin(detailItem.questionnaire_answers)
                  if (rows.length === 0) {
                    return (
                      <p className="text-sm text-gray-600">
                        Ainda não há questionário guardado neste link (ou está vazio).
                      </p>
                    )
                  }
                  return (
                    <dl className="space-y-3 text-sm">
                      {rows.map((row) => (
                        <div key={row.label} className="border-b border-gray-100 pb-3 last:border-0">
                          <dt className="font-semibold text-gray-900">{row.label}</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-gray-700">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )
                })()}
                <details className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700">JSON bruto (avançado)</summary>
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all text-gray-600">
                    {JSON.stringify(detailItem.questionnaire_answers ?? null, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function AdminProLideresOnboardingPage() {
  return (
    <AdminProtectedRoute>
      <AdminProLideresOnboardingPageContent />
    </AdminProtectedRoute>
  )
}
