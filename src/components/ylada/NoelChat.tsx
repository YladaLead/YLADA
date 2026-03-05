'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

function LinkWithCopy({ href, children }: { href?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    if (!href) return
    navigator.clipboard.writeText(href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [href])
  if (!href) return <>{children}</>
  return (
    <span className="flex flex-col gap-2 mt-2 mb-4 pb-4 border-b border-sky-200">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 w-fit px-3 py-2 rounded-lg bg-sky-50 text-sky-700 font-medium hover:bg-sky-100 transition-colors border border-sky-200"
      >
        <span className="truncate">{children}</span>
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1.5 w-fit px-3 py-2 rounded-lg bg-sky-100/80 text-sky-700 text-sm font-medium hover:bg-sky-200/80 transition-colors border border-sky-200"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copiado!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-4-4V6" />
            </svg>
            Copiar link
          </>
        )}
      </button>
    </span>
  )
}

export type NoelArea = 'med' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'coach'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const STORAGE_KEY_PREFIX = 'noel_ylada_'
const LAST_LINK_KEY_PREFIX = 'noel_ylada_last_link_'

type LastLinkContext = {
  flow_id: string
  interpretacao: Record<string, unknown>
  questions: Array<{ id: string; label: string; type?: string }>
  url?: string
  title?: string
  link_id?: string
}

function loadLastLinkContext(area: NoelArea): LastLinkContext | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${LAST_LINK_KEY_PREFIX}${area}`)
    if (!raw) return null
    return JSON.parse(raw) as LastLinkContext
  } catch {
    return null
  }
}

function saveLastLinkContext(area: NoelArea, ctx: LastLinkContext | null) {
  if (typeof window === 'undefined') return
  try {
    if (ctx) localStorage.setItem(`${LAST_LINK_KEY_PREFIX}${area}`, JSON.stringify(ctx))
    else localStorage.removeItem(`${LAST_LINK_KEY_PREFIX}${area}`)
  } catch {
    // ignore
  }
}

function loadMessages(area: NoelArea): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${area}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as (Omit<Message, 'timestamp'> & { timestamp: string })[]
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
  } catch {
    return []
  }
}

function saveMessages(area: NoelArea, messages: Message[]) {
  if (typeof window === 'undefined') return
  try {
    const toSave = messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() }))
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${area}`, JSON.stringify(toSave))
  } catch {
    // ignore
  }
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Olá! Sou o Noel, seu mentor. Como posso te ajudar hoje?',
  timestamp: new Date(),
}

interface NoelChatProps {
  area?: NoelArea
  className?: string
}

export default function NoelChat({ area = 'med', className = '' }: NoelChatProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages(area)
    return saved.length > 0 ? saved : [WELCOME]
  })
  const [lastLinkContext, setLastLinkContext] = useState<LastLinkContext | null>(() => loadLastLinkContext(area))
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const authenticatedFetch = useAuthenticatedFetch()
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    const saved = loadMessages(area)
    if (saved.length > 0) setMessages(saved)
    else setMessages([WELCOME])
    setLastLinkContext(loadLastLinkContext(area))
  }, [area])

  useEffect(() => {
    saveLastLinkContext(area, lastLinkContext)
  }, [area, lastLinkContext])

  useEffect(() => {
    saveMessages(area, messages)
  }, [area, messages])

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const conversationHistory = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await authenticatedFetch('/api/ylada/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory,
          area,
          lastLinkContext: lastLinkContext ?? undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao processar mensagem.')
      }

      const data = (await res.json()) as { response?: string; lastLinkContext?: LastLinkContext | null }
      if (data.lastLinkContext) {
        setLastLinkContext(data.lastLinkContext)
        saveLastLinkContext(area, data.lastLinkContext) // persistir imediatamente (evita perda se componente desmontar)
      }
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.response?.trim() || 'Desculpe, não consegui processar. Tente novamente.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro de conexão. Tente novamente.'
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: `❌ ${msg}`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, messages, area, authenticatedFetch, lastLinkContext])

  const clearChat = () => {
    setMessages([WELCOME])
    setLastLinkContext(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const hasLink = (text: string) => /\[([^\]]+)\]\(([^)]+)\)/.test(text)

  /** Extrai apenas o script da última mensagem do Noel (para copiar sem o resto). */
  function extractScriptFromMessage(content: string): string {
    const trimmed = content.trim()
    if (!trimmed) return trimmed

    // 1. Bloco de código (```...```) — scripts costumam vir em code block
    const codeBlockMatch = trimmed.match(/```(?:[\w]*)\n?([\s\S]*?)```/)
    if (codeBlockMatch) {
      const inner = codeBlockMatch[1].trim()
      if (inner.length > 20) return inner
    }

    // 2. Após "Script:" ou "📝 Script:" ou "💬 Script:" ou "Script sugerido:" ou "Script pronto:"
    const scriptHeaderMatch = trimmed.match(
      /(?:📝|💬)?\s*(?:Script\s*(?:sugerido|pronto)?\s*:?\s*|Chamada para Ação\s*:?\s*)\n+([\s\S]*?)(?=\n###|\n---|\n📝|\n💬|\n🔗|\n💡|$)/i
    )
    if (scriptHeaderMatch) {
      const extracted = scriptHeaderMatch[1].trim()
      if (extracted.length > 15) return extracted
    }

    // 3. Seção ### Chamada para Ação
    const ctaMatch = trimmed.match(/###\s*Chamada para Ação\s*\n+([\s\S]*?)(?=\n###|$)/i)
    if (ctaMatch) {
      const extracted = ctaMatch[1].trim()
      if (extracted.length > 15) return extracted
    }

    // 4. Bloco que parece mensagem para enviar (começa com Oi/Olá, várias linhas)
    const msgBlockMatch = trimmed.match(/(?:^|\n)((?:Oi|Olá|Olá\s+\[?nome\]?)[\s\S]*?)(?=\n\n(?:###|📝|🔗|💡|$)|\n---|$)/i)
    if (msgBlockMatch) {
      const extracted = msgBlockMatch[1].trim()
      if (extracted.length > 30) return extracted
    }

    // 5. Fallback: retorna a mensagem inteira
    return trimmed
  }

  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null)
  const copyScript = useCallback((msg: Message) => {
    const script = extractScriptFromMessage(msg.content)
    navigator.clipboard.writeText(script).then(() => {
      setCopiedScriptId(msg.id)
      setTimeout(() => setCopiedScriptId(null), 2000)
    })
  }, [])

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant')

  return (
    <div className={`flex flex-col rounded-2xl border border-sky-100 bg-white shadow-lg overflow-hidden ${className}`}>
      <div className="flex-1 overflow-y-auto min-h-[320px] max-h-[60vh] p-4 sm:p-5 space-y-4 bg-gradient-to-b from-sky-50/50 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                  : hasLink(msg.content)
                    ? 'bg-white text-gray-800 border-2 border-sky-100 shadow-md'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div>
                  <div className="prose prose-sm max-w-none prose-p:my-4 prose-p:leading-relaxed prose-ul:my-5 prose-li:my-2 prose-li:leading-relaxed prose-strong:text-gray-900 prose-a:no-underline hover:prose-a:underline [&_h3]:border-l-4 [&_h3]:border-sky-400 [&_h3]:pl-3 [&_h3]:-ml-1 [&_h3]:border-b [&_h3]:border-sky-100 [&_h3]:pb-2 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-sky-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children }) => <LinkWithCopy href={href}>{children}</LinkWithCopy>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {lastAssistantMsg?.id === msg.id && (
                    <button
                      type="button"
                      onClick={() => copyScript(msg)}
                      className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 transition-colors border border-sky-200"
                    >
                      {copiedScriptId === msg.id ? (
                        <>
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copiado!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-4-4V6" />
                          </svg>
                          Copiar script
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl px-4 py-3 bg-white border border-sky-100 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        {lastLinkContext?.link_id && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href={`/pt/links/editar/${lastLinkContext.link_id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar quiz
            </Link>
            <button
              type="button"
              onClick={() => router.push('/pt/links')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 text-sm font-medium border border-sky-200 hover:bg-sky-100 transition-colors touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Concordo, ver meus links
            </button>
          </div>
        )}
        <div ref={scrollEndRef} />
      </div>

      <div className="border-t border-sky-100 p-3 sm:p-4 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            rows={1}
            disabled={loading}
            className="flex-1 min-h-[44px] max-h-32 px-3 py-2.5 text-sm border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 resize-none disabled:opacity-60 placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="h-[44px] px-5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shrink-0 shadow-sm"
          >
            Enviar
          </button>
        </div>
        {messages.length > 1 && (
          <button
            type="button"
            onClick={clearChat}
            className="mt-2 text-xs text-sky-600 hover:text-sky-800"
          >
            Limpar conversa
          </button>
        )}
      </div>
    </div>
  )
}
