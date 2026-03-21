'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Ticket {
  id: string
  assunto: string
  status: string
  prioridade: string
  user_name?: string
  user_email?: string | null
  ultima_mensagem_em?: string
  created_at: string
  mensagens_count: number
}

function AdminSuporteContent() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('todas')

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const q = filter === 'todas' ? '' : `?status=${filter}`
      const res = await fetch(`/api/admin/support/tickets${q}`, { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar')
      }
      setTickets(data.tickets || [])
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [filter])

  const badge = (status: string) => {
    const m: Record<string, string> = {
      aguardando: 'bg-amber-100 text-amber-900',
      em_atendimento: 'bg-sky-100 text-sky-900',
      resolvido: 'bg-emerald-100 text-emerald-900',
      fechado: 'bg-slate-200 text-slate-700',
    }
    const label: Record<string, string> = {
      aguardando: 'Aguardando',
      em_atendimento: 'Em atendimento',
      resolvido: 'Resolvido',
      fechado: 'Fechado',
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[status] || 'bg-slate-100'}`}>
        {label[status] || status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-slate-900">Suporte plataforma</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tickets da área central (usuários em /pt/suporte). Link direto para responder cada conversa.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-700">Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="todas">Todas</option>
            <option value="aguardando">Aguardando</option>
            <option value="em_atendimento">Em atendimento</option>
            <option value="resolvido">Resolvido</option>
            <option value="fechado">Fechado</option>
          </select>
          <button
            type="button"
            onClick={load}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Atualizar
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-2">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : tickets.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
              Nenhum ticket neste filtro.
            </p>
          ) : (
            tickets.map((t) => (
              <Link
                key={t.id}
                href={`/admin/suporte/tickets/${t.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-medium text-slate-900">{t.assunto}</span>
                  {badge(t.status)}
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {t.user_name}
                  {t.user_email ? ` · ${t.user_email}` : ''}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {t.ultima_mensagem_em
                    ? new Date(t.ultima_mensagem_em).toLocaleString('pt-BR')
                    : new Date(t.created_at).toLocaleString('pt-BR')}
                  {' · '}
                  {t.mensagens_count || 0} msgs
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminSuportePage() {
  return (
    <AdminProtectedRoute>
      <AdminSuporteContent />
    </AdminProtectedRoute>
  )
}
