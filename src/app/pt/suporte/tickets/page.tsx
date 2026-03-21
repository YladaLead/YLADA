'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface Ticket {
  id: string
  assunto: string
  status: string
  prioridade: string
  ultima_mensagem_em?: string
  created_at: string
  mensagens_count: number
}

export default function PlatformSupportTicketsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/pt/login')
    }
  }, [user, authLoading, router])

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/platform/support/tickets', { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar')
      }
      setTickets(data.tickets || [])
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar conversas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  const criarTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assunto.trim() || !mensagem.trim() || creating) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/platform/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          assunto: assunto.trim(),
          primeira_mensagem: mensagem.trim(),
          categoria: 'plataforma',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar conversa')
      }
      setAssunto('')
      setMensagem('')
      router.push(`/pt/suporte/tickets/${data.ticket.id}`)
    } catch (e: any) {
      setError(e.message || 'Erro ao criar conversa')
    } finally {
      setCreating(false)
    }
  }

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
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[status] || 'bg-slate-100 text-slate-700'}`}>
        {label[status] || status}
      </span>
    )
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-indigo-600">YLADA</p>
        <h1 className="text-2xl font-semibold text-slate-900">Suporte</h1>
        <p className="mt-1 text-sm text-slate-600">
          Abra uma conversa com a equipe. Respondemos por aqui, no mesmo estilo de um chat.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Nova conversa</h2>
        <form onSubmit={criarTicket} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600">Assunto</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              placeholder="Ex.: Não consigo acessar uma área"
              maxLength={200}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Mensagem</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={4}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Descreva o que está acontecendo…"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !assunto.trim() || !mensagem.trim()}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {creating ? 'Enviando…' : 'Enviar para o suporte'}
          </button>
        </form>
      </section>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Suas conversas</h2>
          <button
            type="button"
            onClick={load}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : tickets.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
            Nenhuma conversa ainda. Use o formulário acima para falar com a equipe.
          </p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/pt/suporte/tickets/${t.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900 line-clamp-2">{t.assunto}</span>
                    {badge(t.status)}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {t.ultima_mensagem_em
                      ? new Date(t.ultima_mensagem_em).toLocaleString('pt-BR')
                      : new Date(t.created_at).toLocaleString('pt-BR')}
                    {' · '}
                    {t.mensagens_count || 0} mensagens
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
