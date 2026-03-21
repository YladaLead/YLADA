'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Message {
  id: string
  sender_type: string
  sender_name: string
  message: string
  created_at: string
}

interface Ticket {
  id: string
  assunto: string
  status: string
  user_name?: string
  user_email?: string | null
  messages?: Message[]
}

function AdminSuporteTicketContent() {
  const params = useParams()
  const ticketId = params?.id as string
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    if (!ticketId) return
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/admin/support/tickets/${ticketId}`, { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao carregar')
      }
      setTicket(data.ticket)
      setMessages(data.ticket.messages || [])
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(() => {
      fetch(`/api/admin/support/tickets/${ticketId}`, { credentials: 'include' })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.ticket?.messages) {
            setMessages(data.ticket.messages)
          }
        })
        .catch(() => {})
    }, 4000)
    return () => clearInterval(id)
  }, [ticketId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const t = text.trim()
    if (!t || sending || !ticketId) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ticket_id: ticketId, message: t }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar')
      }
      setText('')
      await load()
    } catch (e: any) {
      setError(e.message || 'Erro ao enviar')
    } finally {
      setSending(false)
    }
  }

  const setStatus = async (status: string) => {
    if (!ticketId) return
    try {
      await fetch('/api/admin/support/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: ticketId, status }),
      })
      await load()
    } catch {
      /* ignore */
    }
  }

  if (loading && !ticket) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (error && !ticket) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <p className="text-red-700">{error}</p>
        <Link href="/admin/suporte" className="mt-4 inline-block text-sm text-indigo-600">
          ← Voltar à fila
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-2xl flex-col" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <header className="flex-shrink-0 border-b border-slate-200 pb-4">
          <Link href="/admin/suporte" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
            ← Fila de suporte
          </Link>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">{ticket?.assunto}</h1>
          <p className="text-sm text-slate-600">
            {ticket?.user_name}
            {ticket?.user_email ? ` · ${ticket.user_email}` : ''}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatus('em_atendimento')}
              className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-200"
            >
              Marcar em atendimento
            </button>
            <button
              type="button"
              onClick={() => setStatus('resolvido')}
              className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-200"
            >
              Resolver
            </button>
            <button
              type="button"
              onClick={() => setStatus('fechado')}
              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-300"
            >
              Fechar
            </button>
          </div>
        </header>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white p-4 shadow-inner ring-1 ring-slate-100 min-h-[320px] max-h-[50vh]">
          {messages.map((m) => {
            const staff = m.sender_type === 'agent' || m.sender_type === 'bot'
            return (
              <div key={m.id} className={`flex ${staff ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    staff
                      ? 'rounded-br-md bg-indigo-600 text-white'
                      : 'rounded-bl-md bg-slate-100 text-slate-900'
                  }`}
                >
                  {staff && (
                    <p className="mb-1 text-[10px] font-semibold uppercase text-indigo-200">
                      {m.sender_name}
                    </p>
                  )}
                  {!staff && (
                    <p className="mb-1 text-[10px] font-semibold uppercase text-slate-500">
                      {m.sender_name}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{m.message}</p>
                  <p className={`mt-1 text-[10px] ${staff ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(m.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={endRef} />
        </div>

        {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}

        <div className="mt-4 flex flex-shrink-0 gap-2">
          <textarea
            className="min-h-[48px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Resposta ao usuário…"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />
          <button
            type="button"
            onClick={send}
            disabled={sending || !text.trim()}
            className="self-end rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {sending ? '…' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminSuporteTicketPage() {
  return (
    <AdminProtectedRoute>
      <AdminSuporteTicketContent />
    </AdminProtectedRoute>
  )
}
