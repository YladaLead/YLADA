'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

export type NoelArea = 'med' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'coach'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const STORAGE_KEY_PREFIX = 'noel_ylada_'

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
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages(area)
    return saved.length > 0 ? saved : [WELCOME]
  })
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
  }, [area])

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
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao processar mensagem.')
      }

      const data = (await res.json()) as { response?: string }
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
  }, [input, loading, messages, area, authenticatedFetch])

  const clearChat = () => {
    setMessages([WELCOME])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className={`flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}>
      <div className="flex-1 overflow-y-auto min-h-[320px] max-h-[60vh] p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2.5 bg-white border border-gray-200 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollEndRef} />
      </div>

      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            rows={1}
            disabled={loading}
            className="flex-1 min-h-[44px] max-h-32 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="h-[44px] px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shrink-0"
          >
            Enviar
          </button>
        </div>
        {messages.length > 1 && (
          <button
            type="button"
            onClick={clearChat}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Limpar conversa
          </button>
        )}
      </div>
    </div>
  )
}
