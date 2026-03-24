'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { getCarolWhatsAppUrl } from '@/config/ylada-support'
import type { NoelArea } from '@/config/noel-ux-content'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const storageKeyFor = (area: string) => `ylada_nina_support_${area}`

const QUICK_PROMPTS: { label: string; text: string }[] = [
  { label: 'Onde fica meu perfil?', text: 'Onde eu completo ou edito meu perfil empresarial?' },
  { label: 'Criar link / diagnóstico', text: 'Como eu crio um link ou diagnóstico na plataforma?' },
  { label: 'Ver leads', text: 'Onde vejo meus leads e respostas?' },
  { label: 'Assinatura', text: 'Onde fica minha assinatura e plano?' },
]

function loadMessages(area: string): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKeyFor(area))
    if (!raw) return []
    const parsed = JSON.parse(raw) as (Omit<Message, 'timestamp'> & { timestamp: string })[]
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
  } catch {
    return []
  }
}

function saveMessages(area: string, messages: Message[]) {
  try {
    const toSave = messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() }))
    localStorage.setItem(storageKeyFor(area), JSON.stringify(toSave))
  } catch {
    // ignore
  }
}

const welcomeContent = `Olá! Sou a **Nina**, suporte do YLADA.

Posso te ajudar a usar o app: menu, links, leads, Noel mentor, Crescimento e mais.

Se preferir falar com uma pessoa, use o WhatsApp da **Carol** no card acima.`

interface NinaSupportContentProps {
  areaCodigo: NoelArea
  areaLabel: string
}

export default function NinaSupportContent({ areaCodigo, areaLabel }: NinaSupportContentProps) {
  const carolUrl = getCarolWhatsAppUrl()
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages(areaCodigo)
    if (saved.length > 0) return saved
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
      },
    ]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const authFetch = useAuthenticatedFetch()

  useEffect(() => {
    const saved = loadMessages(areaCodigo)
    if (saved.length > 0) setMessages(saved)
    else {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeContent,
          timestamp: new Date(),
        },
      ])
    }
  }, [areaCodigo])

  useEffect(() => {
    saveMessages(areaCodigo, messages)
  }, [areaCodigo, messages])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      setInput('')
      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setLoading(true)

      try {
        // Histórico sem a mensagem atual — a API acrescenta `message` no turno
        const conversationHistory = messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .filter((m) => m.id !== 'welcome')
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await authFetch('/api/ylada/noel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            conversationHistory,
            area: areaCodigo,
            channel: 'support',
          }),
        })

        const data = (await res.json().catch(() => ({}))) as {
          response?: string
          error?: string
          message?: string
        }

        if (!res.ok) {
          throw new Error(data.message || data.error || 'Não foi possível enviar.')
        }

        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.response?.trim() || 'Sem resposta. Tente novamente.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro de conexão.'
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: 'assistant',
            content: `Não consegui responder agora: ${msg}\n\nSe continuar, fale com a **Carol** no WhatsApp.`,
            timestamp: new Date(),
          },
        ])
      } finally {
        setLoading(false)
        textareaRef.current?.focus()
      }
    },
    [loading, messages, areaCodigo, authFetch]
  )

  const clearChat = useCallback(() => {
    const initial: Message[] = [
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
      },
    ]
    setMessages(initial)
    saveMessages(areaCodigo, initial)
  }, [areaCodigo])

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Suporte</h1>
        <p className="text-sm text-gray-600 mt-1">
          Área <span className="font-medium text-gray-800">{areaLabel}</span> — Nina (IA) e Carol (WhatsApp).
        </p>
      </div>

      <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-green-900">Falar com a Carol</p>
            <p className="text-sm text-green-800/90 mt-1">
              Atendimento humano pelo WhatsApp — ideal para casos que precisam de alguém da equipe.
            </p>
          </div>
          <a
            href={carolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 shrink-0 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Abrir WhatsApp
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[420px] max-h-[min(70vh,640px)] sm:max-h-[min(72vh,680px)]">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-bold shrink-0"
              aria-hidden
            >
              N
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Nina</p>
              <p className="text-xs text-gray-500">Assistente de suporte · respostas automáticas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearChat}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            Limpar conversa
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#ece5dd]/90">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                  m.role === 'user'
                    ? 'bg-[#dcf8c6] text-gray-900 rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-100'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-headings:text-gray-900">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md border border-gray-100 px-4 py-3 text-sm text-gray-500 shadow-sm">
                Nina está digitando…
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-3 border-t border-gray-100 bg-white space-y-2">
          <p className="text-xs text-gray-500 px-1">Perguntas frequentes</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={loading}
                onClick={() => sendText(q.text)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendText(input)
                }
              }}
              placeholder="Digite sua dúvida sobre o sistema…"
              rows={2}
              disabled={loading}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-200 focus:border-violet-400 outline-none disabled:bg-gray-50"
            />
            <button
              type="button"
              disabled={loading || !input.trim()}
              onClick={() => sendText(input)}
              className="shrink-0 h-10 px-4 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Enviar
            </button>
          </div>
          <p className="text-[11px] text-gray-400 px-1">
            Chamados formais:{' '}
            <Link href="/pt/suporte/tickets" className="text-violet-600 hover:underline">
              tickets de suporte
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
