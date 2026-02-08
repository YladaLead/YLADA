'use client'

import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

const TAG_LABELS: Record<string, string> = {
  participou_aula: 'Participou',
  nao_participou_aula: 'Não participou',
  adiou_aula: 'Adiou',
  fez_apresentacao: 'Fez apresentação',
  veio_aula_pratica: 'Aula Prática',
  recebeu_link_workshop: 'Link Workshop',
  interessado: 'Interessado',
  cliente_nutri: 'Cliente Nutri',
  perdeu: 'Perdeu',
}

const PARTICIPACAO_TAGS = ['participou_aula', 'nao_participou_aula', 'adiou_aula', 'fez_apresentacao']

interface Conversation {
  id: string
  phone: string
  name?: string
  context?: { tags?: string[]; [k: string]: unknown }
  last_message_at?: string
}

function AtualizarFasesContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const getTags = (conv: Conversation): string[] => {
    const ctx = conv.context || {}
    return Array.isArray(ctx.tags) ? ctx.tags : []
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ status: 'active', limit: '500', area: 'nutri' })
      const res = await fetch(`/api/whatsapp/conversations?${params}`, { credentials: 'include' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Erro ${res.status}`)
      }
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao carregar'
      alert(msg)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const visibleConversations = conversations
    .filter((conv) => {
      if (!tagFilter) return true
      const tags = getTags(conv)
      if (tagFilter === 'sem_participacao') {
        return !PARTICIPACAO_TAGS.some((t) => tags.includes(t))
      }
      return tags.includes(tagFilter)
    })
    .filter((conv) => {
      if (!searchTerm.trim()) return true
      const q = searchTerm.trim().toLowerCase()
      const name = (conv.name || '').toLowerCase()
      const phone = (conv.phone || '').toLowerCase()
      return name.includes(q) || phone.includes(q)
    })
    .sort((a, b) => {
      const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0
      const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0
      return bt - at
    })

  const handleMarcarComo = async (conv: Conversation, tag: string) => {
    const tags = getTags(conv)
    if (tags.includes(tag)) return
    const newTags = [...new Set([...tags, tag])]
    try {
      setUpdatingId(conv.id)
      const res = await fetch(`/api/whatsapp/conversations/${conv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ context: { tags: newTags } }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Erro ${res.status}`)
      }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv.id ? { ...c, context: { ...(c.context || {}), tags: newTags } } : c
        )
      )
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao atualizar'
      alert(msg)
    } finally {
      setUpdatingId(null)
    }
  }

  const formatPhone = (p: unknown): string => {
    const s = typeof p === 'string' ? p : typeof p === 'number' ? String(p) : ''
    const d = (s || '').replace(/\D/g, '')
    if (d.length >= 12) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 9)}-${d.slice(9)}`
    if (d.length >= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    return s || '-'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Voltar ao admin
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Atualizar fases manualmente</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <p className="text-sm text-gray-600">
          Atualize as tags de cada conversa um por um. Nenhuma mensagem é enviada.
        </p>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div>
          <span className="text-xs text-gray-500 mr-2">Filtrar por fase:</span>
          <div className="flex gap-1.5 flex-wrap mt-1">
            {[
              { id: null, label: 'Todas' },
              { id: 'sem_participacao', label: 'Sem tag de participação' },
              { id: 'participou_aula', label: 'Participou' },
              { id: 'nao_participou_aula', label: 'Não participou' },
              { id: 'fez_apresentacao', label: 'Fez apresentação' },
            ].map((t) => (
              <button
                key={t.id ?? 'all'}
                type="button"
                onClick={() => setTagFilter(t.id)}
                className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap ${
                  tagFilter === t.id ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Carregando conversas...</div>
        ) : visibleConversations.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            {conversations.length === 0
              ? 'Nenhuma conversa encontrada.'
              : 'Nenhuma conversa corresponde ao filtro.'}
          </div>
        ) : (
          <ul className="space-y-2">
            {visibleConversations.map((conv) => {
              const tags = getTags(conv)
              const isUpdating = updatingId === conv.id
              const displayName =
                conv.name && conv.name.trim() && conv.name.toLowerCase() !== 'ylada nutri'
                  ? conv.name
                  : formatPhone(conv.phone)

              return (
                <li
                  key={conv.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">{displayName}</div>
                    <div className="text-xs text-gray-500 truncate">{formatPhone(conv.phone)}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {TAG_LABELS[t] ?? t}
                        </span>
                      ))}
                      {tags.length > 5 && (
                        <span className="text-xs text-gray-400">+{tags.length - 5}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!tags.includes('participou_aula') && (
                      <button
                        type="button"
                        onClick={() => handleMarcarComo(conv, 'participou_aula')}
                        disabled={isUpdating}
                        className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                      >
                        {isUpdating ? '…' : 'Participou'}
                      </button>
                    )}
                    {!tags.includes('nao_participou_aula') && (
                      <button
                        type="button"
                        onClick={() => handleMarcarComo(conv, 'nao_participou_aula')}
                        disabled={isUpdating}
                        className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                      >
                        {isUpdating ? '…' : 'Não participou'}
                      </button>
                    )}
                    {!tags.includes('fez_apresentacao') && (
                      <button
                        type="button"
                        onClick={() => handleMarcarComo(conv, 'fez_apresentacao')}
                        disabled={isUpdating}
                        className="px-2 py-1 rounded text-xs bg-teal-100 text-teal-800 hover:bg-teal-200 disabled:opacity-50"
                      >
                        {isUpdating ? '…' : 'Fez apresentação'}
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function AtualizarFasesPage() {
  return (
    <AdminProtectedRoute>
      <AtualizarFasesContent />
    </AdminProtectedRoute>
  )
}
