'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Conversation = {
  id: string
  phone: string
  nome: string | null
  email: string | null
  status: string
  hipotese: string | null
  paused: boolean
  nota_andre: string | null
  created_at: string
  updated_at: string
  last_message: { content: string; role: string; created_at: string } | null
  has_user_reply?: boolean
  has_outbound?: boolean
  follow_up_sent?: boolean
  awaiting_reply?: boolean
}

type ConversationStats = {
  total: number
  responded: number
  awaiting_reply: number
  follow_up_sent: number
}

type ReplyFilter = 'all' | 'responded' | 'awaiting' | 'follow_up'

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
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  novo:                   { label: 'Novo',          color: 'bg-gray-100 text-gray-600' },
  em_andamento:           { label: 'Ativo',          color: 'bg-blue-100 text-blue-700' },
  diagnostico_agendado:   { label: 'Agendado ✓',    color: 'bg-green-100 text-green-700' },
  diagnostico_feito:      { label: 'Diagnóstico ✓', color: 'bg-purple-100 text-purple-700' },
  proposta:               { label: 'Proposta',       color: 'bg-yellow-100 text-yellow-700' },
}

const STATUS_OPTIONS = [
  { value: 'novo',                label: 'Novo' },
  { value: 'em_andamento',        label: 'Ativo' },
  { value: 'diagnostico_agendado', label: '📅 Agendado' },
  { value: 'diagnostico_feito',   label: '✅ Diagnóstico feito' },
  { value: 'proposta',            label: '💰 Proposta enviada' },
]

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function ReplyBadge({ conversation: c }: { conversation: Conversation }) {
  if (c.has_user_reply) {
    return (
      <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
        Respondeu
      </span>
    )
  }
  if (c.follow_up_sent) {
    return (
      <span className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800">
        Follow-up ✓
      </span>
    )
  }
  if (c.awaiting_reply || c.has_outbound) {
    return (
      <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
        Sem resposta
      </span>
    )
  }
  return null
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
  stats,
  loading,
  onSelect,
  onRefresh,
}: {
  conversations: Conversation[]
  stats: ConversationStats | null
  loading: boolean
  onSelect: (c: Conversation) => void
  onRefresh: () => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<ReplyFilter>('all')

  const filtered = conversations.filter((c) => {
    if (filter === 'responded') return c.has_user_reply
    if (filter === 'awaiting') return c.awaiting_reply && !c.has_user_reply
    if (filter === 'follow_up') return c.follow_up_sent
    return true
  })

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Conversas da Carol</h1>
            <p className="text-xs text-gray-500">
              {filtered.length} de {conversations.length} lead{conversations.length !== 1 ? 's' : ''}
              {stats ? (
                <span className="text-gray-400">
                  {' '}
                  · {stats.responded} respondeu · {stats.awaiting_reply} sem resposta
                  {stats.follow_up_sent > 0 ? ` · ${stats.follow_up_sent} follow-up` : ''}
                </span>
              ) : null}
            </p>
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
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ['all', 'Todos'],
              ['responded', 'Respondeu'],
              ['awaiting', 'Sem resposta'],
              ['follow_up', 'Follow-up'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                filter === key
                  ? 'bg-[#075e54] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
              {key === 'awaiting' && stats ? ` (${stats.awaiting_reply})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 divide-y divide-gray-100">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <p className="text-4xl mb-2">💬</p>
            <p className="font-medium">
              {conversations.length === 0 ? 'Nenhuma conversa ainda' : 'Nenhuma neste filtro'}
            </p>
            <p className="text-sm mt-1">
              {conversations.length === 0
                ? 'Quando alguém falar com a Carol aparece aqui'
                : 'Tente outro filtro acima'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 rounded-xl bg-[#075e54] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Iniciar primeira conversa
            </button>
          </div>
        ) : (
          filtered.map((c) => (
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
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <ReplyBadge conversation={c} />
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {c.last_message
                    ? (c.last_message.role === 'assistant' ? '🤖 ' : '👤 ') +
                      c.last_message.content.slice(0, 60)
                    : 'Sem mensagens'}
                </p>
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
  const [paused, setPaused] = useState(conversation.paused ?? false)
  const [togglingPause, setTogglingPause] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(conversation.status)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [notaAndre, setNotaAndre] = useState(conversation.nota_andre ?? '')
  const [savingNota, setSavingNota] = useState(false)
  const [showNota, setShowNota] = useState(!!(conversation.nota_andre))
  const notaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    // Auto-refresh a cada 15s quando o painel está aberto
    const interval = setInterval(() => void load(), 15_000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [conversation.id])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
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

  async function handleTogglePause() {
    setTogglingPause(true)
    try {
      const res = await fetch('/api/admin/carol/toggle-pause', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, paused: !paused }),
      })
      if (res.ok) {
        setPaused(!paused)
      }
    } finally {
      setTogglingPause(false)
    }
  }

  async function handleSendReply() {
    if (!replyText.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/carol/send-message', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, text: replyText.trim() }),
      })
      if (res.ok) {
        setReplyText('')
        await load()
      }
    } finally {
      setSending(false)
    }
  }

  async function handleSaveNota(text: string) {
    setSavingNota(true)
    try {
      await fetch('/api/admin/carol/update-note', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, nota: text }),
      })
    } finally {
      setSavingNota(false)
    }
  }

  function handleNotaChange(text: string) {
    setNotaAndre(text)
    if (notaTimer.current) clearTimeout(notaTimer.current)
    notaTimer.current = setTimeout(() => void handleSaveNota(text), 1200)
  }

  async function handleUpdateStatus(newStatus: string) {
    setUpdatingStatus(true)
    try {
      const res = await fetch('/api/admin/carol/update-status', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, status: newStatus }),
      })
      if (res.ok) {
        setCurrentStatus(newStatus)
      }
    } finally {
      setUpdatingStatus(false)
      setShowStatusMenu(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSendReply()
    }
  }

  return (
    <div className="flex h-[calc(100dvh-52px)] flex-col overflow-hidden bg-[#e5ddd5]">
      {/* Header — fixo; scroll só na área de mensagens */}
      <div className="shrink-0 border-b border-gray-200 bg-[#075e54] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/30 active:bg-white/40"
          >
            ← Voltar
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
            {/* Toggle Pausar Carol */}
            <button
              onClick={() => void handleTogglePause()}
              disabled={togglingPause}
              title={paused ? 'Carol pausada — clique para reativar' : 'Pausar Carol e assumir conversa'}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                paused
                  ? 'bg-orange-400 text-white hover:bg-orange-500'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {paused ? '⏸ Pausada' : '🤖 Carol ativa'}
            </button>
            <button
              onClick={() => setShowNota(v => !v)}
              title="Nota de contexto para a Carol"
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                notaAndre
                  ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              📝 Nota
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/30"
            >
              Template
            </button>
            <div className="relative flex flex-col items-end gap-1">
              <button
                onClick={() => setShowStatusMenu((v) => !v)}
                disabled={updatingStatus}
                title="Alterar status"
                className="cursor-pointer"
              >
                <StatusBadge status={currentStatus} />
              </button>
              <button
                onClick={() => void load()}
                className="text-xs text-white/60 hover:text-white"
              >
                ↻
              </button>
              {/* Menu de status */}
              {showStatusMenu && (
                <div className="absolute right-0 top-7 z-50 min-w-[180px] rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/10">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Alterar status
                  </p>
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => void handleUpdateStatus(opt.value)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        currentStatus === opt.value ? 'font-semibold text-[#075e54]' : 'text-gray-700'
                      }`}
                    >
                      {currentStatus === opt.value && <span className="text-[#075e54]">✓</span>}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Aviso de pausa */}
      {paused && (
        <div className="shrink-0 border-b border-orange-200 bg-orange-50 px-4 py-2">
          <p className="text-xs font-semibold text-orange-700">
            ⏸ Carol pausada — você está no controle desta conversa. A Carol não vai responder automaticamente.
          </p>
        </div>
      )}

      {/* Nota do Andre */}
      {showNota && (
        <div className="shrink-0 border-b border-yellow-200 bg-yellow-50 px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-yellow-800">
              📝 Nota de contexto para a Carol
            </p>
            <p className="text-[10px] text-yellow-600">
              {savingNota ? 'Salvando...' : notaAndre ? '✓ Salvo' : ''}
            </p>
          </div>
          <textarea
            value={notaAndre}
            onChange={e => handleNotaChange(e.target.value)}
            placeholder="Ex: Ela atende em casa mas quer ter espaço próprio. Já contatei pelo meu pessoal. Reativar Carol com foco no sonho do espaço próprio."
            rows={3}
            className="w-full resize-none rounded-lg border border-yellow-300 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-yellow-500 placeholder-yellow-400"
          />
          <p className="mt-1 text-[10px] text-yellow-600">
            A Carol lê essa nota antes de responder — use para dar contexto da conversa que você teve no seu pessoal.
          </p>
        </div>
      )}

      {/* Mensagens */}
      <div ref={messagesContainerRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {loading && messages.length === 0 ? (
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
                const isAndre = msg.content.startsWith('[ANDRE]')
                const displayContent = isAndre
                  ? msg.content.replace(/^\[ANDRE\]\s*/, '')
                  : msg.content

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
                            : isAndre
                              ? 'rounded-tr-sm bg-blue-100 text-gray-900 border border-blue-200'
                              : 'rounded-tr-sm bg-[#dcf8c6] text-gray-900'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <p className={`mb-0.5 text-[10px] font-semibold ${
                          isTemplate ? 'text-amber-600' : isAndre ? 'text-blue-600' : 'text-[#075e54]'
                        }`}>
                          {isTemplate ? '📤 Template enviado' : isAndre ? '👤 Andre' : 'Carol'}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{displayContent}</p>
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
      </div>

      {/* Info do lead (se agendado) */}
      {currentStatus === 'diagnostico_agendado' && (
        <div className="shrink-0 border-t border-gray-200 bg-green-50 px-4 py-3">
          <p className="text-xs font-semibold text-green-700">✓ Diagnóstico agendado</p>
          {conversation.email && (
            <p className="text-xs text-green-600">📧 {conversation.email}</p>
          )}
        </div>
      )}

      {/* Campo de resposta manual */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-2">
        {!paused && (
          <p className="mb-1 text-center text-[10px] text-gray-400">
            Pause a Carol para responder manualmente
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!paused}
            placeholder={paused ? 'Responder como Andre... (Enter para enviar)' : 'Pause a Carol para digitar aqui'}
            rows={2}
            className={`flex-1 resize-none rounded-2xl border px-3 py-2 text-sm outline-none transition-colors ${
              paused
                ? 'border-blue-300 bg-white focus:border-blue-500 placeholder-gray-400'
                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          />
          <button
            onClick={() => void handleSendReply()}
            disabled={!paused || !replyText.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-white disabled:opacity-40"
          >
            {sending ? (
              <span className="text-xs">...</span>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {showModal && <SendTemplateModal onClose={() => setShowModal(false)} />}

      {/* Overlay invisível para fechar menu de status ao clicar fora */}
      {showStatusMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

function CarolConversasContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [stats, setStats] = useState<ConversationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Conversation | null>(null)

  const loadConversations = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/carol/conversations', { credentials: 'include' })
      const data = await res.json()
      setConversations(data.conversations ?? [])
      setStats(data.stats ?? null)
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
      stats={stats}
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
