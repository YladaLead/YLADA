'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { buildYladaSupportWhatsappPrefill, getCarolWhatsAppUrl } from '@/config/ylada-support'
import { getNinaNoelHref, getNinaSupportQuickChips } from '@/config/ylada-nina-support-ux'
import { useAuth } from '@/contexts/AuthContext'
import type { NoelArea } from '@/config/noel-ux-content'
import type { NinaSupportUi } from '@/lib/ylada-nina-support-prompt'
import NinaSupportTriage from '@/components/ylada/NinaSupportTriage'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const storageKeyFor = (area: string) => `ylada_nina_support_${area}`

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

const welcomeContent =
  'Oi! Sou a Nina. Acima está o mapa de canais (Nina, Noel, WhatsApp) e atalhos para dúvidas comuns. Por aqui te ajudo com **uso do app**. Como posso te ajudar?'

interface NinaSupportContentProps {
  areaCodigo: NoelArea
  areaLabel: string
  /** Wellness usa prompt e rotas /pt/wellness; matriz usa areaCodigo. */
  supportUi?: NinaSupportUi
}

export default function NinaSupportContent(props: NinaSupportContentProps) {
  const { areaCodigo, areaLabel, supportUi = 'matrix' } = props
  const chatStorageKey = supportUi === 'wellness' ? 'wellness' : areaCodigo
  const { user, userProfile } = useAuth()
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages(chatStorageKey)
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
    const saved = loadMessages(chatStorageKey)
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
  }, [chatStorageKey])

  useEffect(() => {
    saveMessages(chatStorageKey, messages)
  }, [chatStorageKey, messages])

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
        const conversationHistory = messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .filter((m) => m.id !== 'welcome')
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content }))

        const apiArea = supportUi === 'wellness' ? 'ylada' : areaCodigo
        const res = await authFetch('/api/ylada/noel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            conversationHistory,
            area: apiArea,
            channel: 'support',
            supportUi,
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
            content: `Algo deu errado: ${msg}\n\nTente de novo em instantes.`,
            timestamp: new Date(),
          },
        ])
      } finally {
        setLoading(false)
        textareaRef.current?.focus()
      }
    },
    [loading, messages, areaCodigo, authFetch, supportUi]
  )

  const quickChips = useMemo(
    () => getNinaSupportQuickChips({ supportUi, areaCodigo }),
    [supportUi, areaCodigo]
  )

  const noelHref = useMemo(
    () => getNinaNoelHref({ areaCodigo, supportUi }),
    [areaCodigo, supportUi]
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
    saveMessages(chatStorageKey, initial)
  }, [chatStorageKey])

  const whatsappUrl = useMemo(() => {
    if (!user) {
      return getCarolWhatsAppUrl()
    }
    const email = user.email ?? userProfile?.email ?? ''
    const nomeCompleto =
      userProfile?.nome_completo?.trim() ||
      (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '') ||
      (typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : '')
    const prefill = buildYladaSupportWhatsappPrefill({
      email,
      nomeCompleto: nomeCompleto || null,
      areaLabel,
      areaCodigo: supportUi === 'wellness' ? 'wellness' : areaCodigo,
      perfilConta: userProfile?.perfil ?? null,
      userId: user.id,
    })
    return getCarolWhatsAppUrl(prefill)
  }, [user, userProfile, areaLabel, areaCodigo, supportUi])

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Suporte</h1>

      <NinaSupportTriage
        noelHref={noelHref}
        whatsappUrl={whatsappUrl}
        chips={quickChips}
        onChipClick={sendText}
        chipsDisabled={loading}
      />

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[420px] max-h-[min(70vh,640px)] sm:max-h-[min(72vh,680px)]">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 shrink-0"
              aria-hidden
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </span>
            <p className="text-sm font-semibold text-gray-900">Conversa</p>
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
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl text-sm shadow-sm ${
                  m.role === 'user'
                    ? 'px-3.5 py-2.5 bg-[#dcf8c6] text-gray-900 rounded-br-md'
                    : 'px-4 py-3 bg-white text-gray-900 rounded-bl-md border border-gray-100'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none text-gray-900 prose-p:my-2 prose-p:leading-relaxed prose-p:first:mt-0 prose-p:last:mb-0 prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4 prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4 prose-li:my-1 prose-headings:text-gray-900 prose-headings:mt-3 prose-headings:mb-2 prose-a:text-violet-700 prose-a:font-medium prose-a:underline prose-strong:text-gray-900">
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
                Um momento…
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-3 border-t border-gray-100 bg-white">
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
              placeholder="Mensagem"
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
        </div>
      </div>
    </div>
  )
}
