'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Conversation = {
  id: string
  phone: string
  nome: string | null
  email: string | null
  status: string
  hipotese: string | null
  created_at: string
  updated_at: string
  last_message: { content: string; role: string; created_at: string } | null
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

type Template = {
  name: string
  label: string
  description: string
  variables: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('55') && d.length >= 12) {
    const local = d.slice(2)
    const ddd = local.slice(0, 2)
    const num = local.slice(2)
    return `+55 (${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`
  }
  return `+${phone}`
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  novo:                   { label: 'Novo',       color: 'bg-gray-100 text-gray-600' },
  em_andamento:           { label: 'Ativo',       color: 'bg-blue-100 text-blue-700' },
  diagnostico_agendado:   { label: 'Agendado ✓', color: 'bg-green-100 text-green-700' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

// ─── Modal: Enviar Template ───────────────────────────────────────────────────

function SendTemplateModal({ onClose }: { onClose: () => void }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [phone, setPhone] = useState('')
  const [nome, setNome] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/carol/send-template', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setTemplates(d.templates ?? [])
        if (d.templates?.length > 0) setSelectedTemplate(d.templates[0].name)
      })
      .catch(() => {})
  }, [])

  async function handleSend() {
    if (!phone || !nome || !selectedTemplate) return
    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/carol/send-template', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, template: selectedTemplate, nome }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ ok: true, msg: data.message })
        setPhone('')
        setNome('')
      } else {
        setResult({ ok: false, msg: data.error ?? 'Erro ao enviar' })
      }
    } catch {
      setResult({ ok: false, msg: 'Erro de conexão' })
    } finally {
      setSending(false)
    }
  }

  const selected = templates.find((t) => t.name === selectedTemplate)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 pb-0 sm:items-center sm:px-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Iniciar conversa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <p className="mb-4 text-xs text-gray-500">
          Envia um template aprovado pela Meta para iniciar uma conversa.
          A Carol assume automaticamente quando a pessoa responder.
        </p>

        {/* Número */}
        <label className="mb-1 block text-xs font-semibold text-gray-700">
          WhatsApp da pessoa
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="5519999990000 (com DDI e DDD)"
          className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />

        {/* Nome */}
        <label className="mb-1 block text-xs font-semibold text-gray-700">
          Nome da pessoa
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Juliana"
          className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />

        {/* Template */}
        <label className="mb-1 block text-xs font-semibold text-gray-700">
          Template
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        >
          {templates.map((t) => (
            <option key={t.name} value={t.name}>{t.label}</option>
          ))}
        </select>

        {selected && (
          <p className="mb-4 text-xs text-gray-400 italic">{selected.description}</p>
        )}

        {/* Resultado */}
        {result && (
          <div className={`mb-3 rounded-lg px-3 py-2 text-sm ${result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.ok ? '✓ ' : '✗ '}{result.msg}
          </div>
        )}

        <button
          onClick={() => void handleSend()}
          disabled={sending || !phone || !nome || !selectedTemplate}
          className="w-full rounded-xl bg-[#075e54] py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {sending ? 'Enviando...' : 'Enviar template'}
        </button>
      </div>
    </div>
  )
}

// ─── Painel de lista ──────────────────────────────────────────────────────────

function ConversationList({
  conversations,
  loading,
  onSelect,
  onRefresh,
}: {
  conversations: Conversation[]
  loading: boolean
  onSelect: (c: Conversation) => void
  onRefresh: () => void
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Conversas da Carol</h1>
            <p className="text-xs text-gray-500">{conversations.length} lead{conversations.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#075e54] px-3 py-2 text-sm font-medium text-white hover:bg-[#064f48]"
            >
              + Iniciar
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className={loading ? 'animate-spin' : ''}>↻</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 divide-y divide-gray-100">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            Carregando...
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <p className="text-4xl mb-2">💬</p>
            <p className="font-medium">Nenhuma conversa ainda</p>
            <p className="text-sm mt-1">Quando alguém falar com a Carol aparece aqui</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 rounded-xl bg-[#075e54] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Iniciar primeira conversa
            </button>
          </div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="flex w-full items-start gap-3 bg-white px-4 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100"
            >
              {/* Avatar */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                {(c.nome ?? c.phone).charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-gray-900">
                    {c.nome ?? formatPhone(c.phone)}
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">{relativeTime(c.updated_at)}</span>
                </div>
                {c.nome && (
                  <p className="text-xs text-gray-400">{formatPhone(c.phone)}</p>
                )}
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-sm text-gray-500">
                    {c.last_message
                      ? (c.last_message.role === 'assistant' ? '🤖 ' : '👤 ') +
                        c.last_message.content.slice(0, 60)
                      : 'Sem mensagens'}
                  </p>
                  <StatusBadge status={c.status} />
                </div>
              </div>

              <span className="shrink-0 text-gray-300">›</span>
            </button>
          ))
        )}
      </div>

      {showModal && <SendTemplateModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

// ─── Painel de detalhe ────────────────────────────────────────────────────────

function ConversationDetail({
  conversation,
  onBack,
}: {
  conversation: Conversation
  onBack: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/carol/conversations/${conversation.id}`, {
        credentials: 'include',
      })
      const data = await res.json()
      setMessages(data.messages ?? [])
    } finally {
      setLoading(false)
    }
  }, [conversation.id])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages])

  // Agrupa mensagens por data
  function groupByDate(msgs: Message[]) {
    const groups: { date: string; messages: Message[] }[] = []
    for (const msg of msgs) {
      const date = formatDate(msg.created_at)
      const last = groups[groups.length - 1]
      if (last?.date === date) {
        last.messages.push(msg)
      } else {
        groups.push({ date, messages: [msg] })
      }
    }
    return groups
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#e5ddd5]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-[#075e54] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            ‹
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-base font-bold text-white">
            {(conversation.nome ?? conversation.phone).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-white">
              {conversation.nome ?? formatPhone(conversation.phone)}
            </p>
            <p className="text-xs text-white/70">
              {conversation.nome ? formatPhone(conversation.phone) : ''}
              {conversation.email ? ` · ${conversation.email}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/30"
            >
              Template
            </button>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={conversation.status} />
              <button
                onClick={() => void load()}
                className="text-xs text-white/60 hover:text-white"
              >
                ↻
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {loading ? (
          <div className="flex justify-center py-10 text-gray-500">Carregando...</div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-10 text-gray-500">Sem mensagens</div>
        ) : (
          groupByDate(messages).map(({ date, messages: dayMsgs }) => (
            <div key={date}>
              {/* Separador de data */}
              <div className="my-3 flex justify-center">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-gray-500 shadow-sm">
                  {date}
                </span>
              </div>

              {dayMsgs.map((msg) => {
                const isTemplate = msg.content.startsWith('[TEMPLATE OUTBOUND:')
                return (
                  <div
                    key={msg.id}
                    className={`mb-1.5 flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`relative max-w-[78%] rounded-2xl px-3 py-2 shadow-sm ${
                        msg.role === 'user'
                          ? 'rounded-tl-sm bg-white text-gray-900'
                          : isTemplate
                            ? 'rounded-tr-sm bg-amber-50 text-gray-700 border border-amber-200'
                            : 'rounded-tr-sm bg-[#dcf8c6] text-gray-900'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <p className={`mb-0.5 text-[10px] font-semibold ${isTemplate ? 'text-amber-600' : 'text-[#075e54]'}`}>
                          {isTemplate ? '📤 Template enviado' : 'Carol'}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      <p className="mt-0.5 text-right text-[10px] text-gray-400">
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Info do lead (se agendado) */}
      {conversation.status === 'diagnostico_agendado' && (
        <div className="border-t border-gray-200 bg-green-50 px-4 py-3">
          <p className="text-xs font-semibold text-green-700">✓ Diagnóstico agendado</p>
          {conversation.email && (
            <p className="text-xs text-green-600">📧 {conversation.email}</p>
          )}
        </div>
      )}

      {showModal && <SendTemplateModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

function CarolConversasContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Conversation | null>(null)

  const loadConversations = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/carol/conversations', { credentials: 'include' })
      const data = await res.json()
      setConversations(data.conversations ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadConversations()
    // Auto-refresh a cada 30s
    const interval = setInterval(() => void loadConversations(), 30_000)
    return () => clearInterval(interval)
  }, [loadConversations])

  if (selected) {
    return (
      <ConversationDetail
        conversation={selected}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <ConversationList
      conversations={conversations}
      loading={loading}
      onSelect={setSelected}
      onRefresh={loadConversations}
    />
  )
}

export default function CarolConversasPage() {
  return (
    <AdminProtectedRoute>
      <CarolConversasContent />
    </AdminProtectedRoute>
  )
}
