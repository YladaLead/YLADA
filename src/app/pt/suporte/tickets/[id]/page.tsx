'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

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
  messages?: Message[]
}

export default function PlatformSupportTicketChatPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const ticketId = params?.id as string
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const sendingRef = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/pt/login')
    }
  }, [user, authLoading, router])

  const loadTicket = async () => {
    if (!ticketId) return
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/platform/support/tickets/${ticketId}`, { credentials: 'include' })
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

  const loadMessages = async () => {
    if (!ticketId) return
    try {
      const res = await fetch(`/api/platform/support/messages?ticket_id=${ticketId}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMessages(data.messages || [])
      }
    } catch {
      /* ignore polling errors */
    }
  }

  useEffect(() => {
    if (user && ticketId) {
      loadTicket()
      const id = setInterval(loadMessages, 4000)
      return () => clearInterval(id)
    }
  }, [user, ticketId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const t = text.trim()
    if (!t || sending || sendingRef.current) return
    sendingRef.current = true
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/platform/support/messages', {
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
      await loadMessages()
      const tr = await fetch(`/api/platform/support/tickets/${ticketId}`, { credentials: 'include' })
      const td = await tr.json()
      if (tr.ok && td.success && td.ticket) {
        setTicket((prev) => (prev ? { ...prev, ...td.ticket, messages: prev.messages } : td.ticket))
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao enviar')
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }

  if (authLoading || loading) {
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
        <Link href="/pt/suporte/tickets" className="mt-4 inline-block text-sm font-medium text-indigo-600">
          ← Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-4 pt-6">
      <header className="mb-4 flex-shrink-0 border-b border-slate-200 pb-4">
        <Link href="/pt/suporte/tickets" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
          ← Todas as conversas
        </Link>
        <h1 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-2">{ticket?.assunto}</h1>
        <p className="text-xs text-slate-500 capitalize">Status: {ticket?.status?.replace('_', ' ')}</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-white p-3 shadow-inner ring-1 ring-slate-100 min-h-[280px] max-h-[55vh]">
        {messages.map((m) => {
          const mine = m.sender_type === 'user'
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? 'rounded-br-md bg-indigo-600 text-white'
                    : 'rounded-bl-md bg-slate-100 text-slate-900'
                }`}
              >
                {!mine && (
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {m.sender_name}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{m.message}</p>
                <p
                  className={`mt-1 text-[10px] ${mine ? 'text-indigo-200' : 'text-slate-400'}`}
                >
                  {new Date(m.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {error && (
        <p className="mt-2 text-center text-xs text-red-600">{error}</p>
      )}

      <div className="mt-4 flex flex-shrink-0 gap-2">
        <textarea
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Escreva uma mensagem…"
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
  )
}
