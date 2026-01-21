'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

const supabase = createClient()

interface Conversation {
  id: string
  phone: string
  name: string | null
  area: string | null
  status: string
  last_message_at: string
  unread_count: number
  total_messages: number
  context?: any
  last_message_preview?: string
  last_message_type?: string | null
  last_message_created_at?: string | null
  last_message_sender_type?: string | null
  z_api_instances: {
    name: string
    area: string
    status?: string
  } | null
}

interface Message {
  id: string
  sender_type: 'customer' | 'agent' | 'bot'
  sender_name: string | null
  message: string
  message_type: string
  media_url?: string | null
  status?: string | null
  created_at: string
  read_at: string | null
}

function WhatsAppChatPage() {
  return (
    <AdminProtectedRoute>
      <WhatsAppChatContent />
    </AdminProtectedRoute>
  )
}

function WhatsAppChatContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [areaFilter, setAreaFilter] = useState<string>('nutri') // Apenas Nutri por padrão
  const [listTab, setListTab] = useState<'all' | 'unread' | 'favorites' | 'groups' | 'archived'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [contactMenuOpen, setContactMenuOpen] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar conversas
  useEffect(() => {
    loadConversations()
    // Atualizar a cada 5 segundos
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [areaFilter, listTab])

  // Carregar mensagens quando selecionar conversa
  useEffect(() => {
    if (selectedConversation) {
      setContactMenuOpen(false)
      // Ao trocar de conversa, voltar a auto-scrollar para o final
      shouldAutoScrollRef.current = true
      loadMessages(selectedConversation.id)
      // Atualizar mensagens a cada 3 segundos
      const interval = setInterval(() => loadMessages(selectedConversation.id), 3000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  const isNearBottom = (el: HTMLElement) => {
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    return distance < 120
  }

  // Scroll para última mensagem (somente quando precisa)
  useEffect(() => {
    if (!selectedConversation) return
    if (!shouldAutoScrollRef.current) return
    const el = messagesContainerRef.current
    if (!el) return
    // Instantâneo para não "puxar" a tela a cada refresh
    el.scrollTop = el.scrollHeight
    setShowScrollToBottom(false)
  }, [messages, selectedConversation])

  const loadConversations = async () => {
    try {
      const statusParam = listTab === 'archived' ? 'archived' : 'active'
      const url = `/api/whatsapp/conversations?status=${statusParam}${
        areaFilter !== 'all' ? `&area=${areaFilter}` : ''
      }`
      const response = await fetch(url, { credentials: 'include' })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Erro ao carregar conversas:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        
        if (response.status === 401) {
          console.error('❌ Não autenticado. Faça login como admin.')
          alert('⚠️ Você precisa estar logado como administrador para ver as conversas.\n\nFaça logout e login novamente.')
          return
        } else if (response.status === 403) {
          console.error('❌ Acesso negado. Você precisa ser admin.')
          alert('⚠️ Acesso negado.\n\nVocê precisa ter permissão de administrador para acessar esta área.\n\nVerifique se seu usuário tem is_admin = true no banco de dados.')
          return
        }
        
        // Para outros erros, apenas logar
        console.error('Erro desconhecido:', errorData)
        return
      }

      const data = await response.json()
      console.log('✅ Conversas carregadas:', data.conversations?.length || 0)
      setConversations(data.conversations || [])

      // Manter conversa selecionada (evita "voltar" para outra conversa)
      // IMPORTANTE: usar update funcional para evitar closures antigas do setInterval
      setSelectedConversation((prev) => {
        const list: Conversation[] = data.conversations || []
        if (list.length === 0) return null
        if (!prev) return list[0]
        const stillExists = list.find((c) => c.id === prev.id)
        return stillExists || list[0]
      })
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      // Não mostrar erro para o usuário, apenas logar
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const messagesEl = messagesContainerRef.current
      // Se o usuário estiver lendo mensagens antigas (scroll para cima), não forçar rolagem
      if (messagesEl) {
        shouldAutoScrollRef.current = isNearBottom(messagesEl)
      }

      const response = await fetch(`/api/whatsapp/conversations/${conversationId}/messages`, {
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Erro ao carregar mensagens')

      const data = await response.json()
      const nextMessages: Message[] = data.messages || []
      // Evitar re-render/auto-scroll quando não mudou nada (polling a cada 3s)
      setMessages((prev) => {
        const prevLastId = prev.length ? prev[prev.length - 1].id : null
        const nextLastId = nextMessages.length ? nextMessages[nextMessages.length - 1].id : null
        const same = prev.length === nextMessages.length && prevLastId === nextLastId
        return same ? prev : nextMessages
      })
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return

    try {
      setSending(true)

      const response = await fetch(
        `/api/whatsapp/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ message: newMessage }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Erro ao enviar mensagem:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(errorData.error || 'Erro ao enviar mensagem')
      }

      const data = await response.json()
      console.log('✅ Mensagem enviada com sucesso:', data)

      setNewMessage('')
      await loadMessages(selectedConversation.id)
      await loadConversations() // Atualizar lista de conversas
    } catch (error: any) {
      console.error('❌ Erro ao enviar mensagem:', error)
      alert(`Erro ao enviar mensagem: ${error.message || 'Tente novamente.'}`)
    } finally {
      setSending(false)
    }
  }

  const formatPhone = (phone: string) => {
    // Formatar telefone: 5511999999999 -> (11) 99999-9999
    if (phone.length === 13 && phone.startsWith('55')) {
      const ddd = phone.substring(2, 4)
      const part1 = phone.substring(4, 9)
      const part2 = phone.substring(9)
      return `(${ddd}) ${part1}-${part2}`
    }
    return phone
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
    return date.toLocaleDateString('pt-BR')
  }

  const formatDayLabel = (dateString: string) => {
    const d = new Date(dateString)
    const today = new Date()
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const diffDays = Math.round((dayStart - todayStart) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Hoje'
    if (diffDays === -1) return 'Ontem'
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getStatusTicks = (status?: string | null) => {
    // WhatsApp style: sent ✓, delivered ✓✓, read ✓✓ (blue)
    if (!status) return { text: '✓', className: 'text-gray-400' }
    if (status === 'failed') return { text: '⚠️', className: 'text-red-500' }
    if (status === 'sent') return { text: '✓', className: 'text-gray-400' }
    if (status === 'delivered') return { text: '✓✓', className: 'text-gray-400' }
    if (status === 'read') return { text: '✓✓', className: 'text-blue-500' }
    return { text: '✓', className: 'text-gray-400' }
  }

  const unreadTotal = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

  const getDisplayName = (conv: Conversation) => {
    const ctx = (conv.context || {}) as any
    const override = typeof ctx.display_name === 'string' ? ctx.display_name.trim() : ''
    return override || conv.name || formatPhone(conv.phone)
  }

  const getAvatarUrl = (conv: Conversation) => {
    const ctx = (conv.context || {}) as any
    return typeof ctx.avatar_url === 'string' && ctx.avatar_url.trim() ? ctx.avatar_url.trim() : null
  }

  const getInitials = (name: string) => {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
    if (parts.length === 0) return '👤'
    return parts.map((p) => p[0]?.toUpperCase()).join('')
  }

  const patchConversation = async (conversationId: string, patch: any) => {
    const response = await fetch(`/api/whatsapp/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(patch),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || 'Erro ao atualizar conversa')
    }
    const data = await response.json()
    // Atualizar lista local
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? (data.conversation as Conversation) : c))
    )
    setSelectedConversation((prev) =>
      prev?.id === conversationId ? (data.conversation as Conversation) : prev
    )
  }

  const isFavorite = (conv: Conversation) => !!(conv.context as any)?.favorite
  const isPinned = (conv: Conversation) => !!(conv.context as any)?.pinned
  const isGroup = (conv: Conversation) => !!(conv.context as any)?.is_group

  const visibleConversations = conversations
    .filter((conv) => {
      if (listTab === 'unread') return conv.unread_count > 0
      if (listTab === 'favorites') return isFavorite(conv)
      if (listTab === 'groups') return isGroup(conv)
      return true
    })
    .filter((conv) => {
      if (!searchTerm.trim()) return true
      const q = searchTerm.trim().toLowerCase()
      const name = getDisplayName(conv).toLowerCase()
      const phone = formatPhone(conv.phone).toLowerCase()
      const preview = (conv.last_message_preview || '').toLowerCase()
      return name.includes(q) || phone.includes(q) || preview.includes(q)
    })
    .sort((a, b) => {
      // Pinned primeiro
      if (isPinned(a) !== isPinned(b)) return isPinned(a) ? -1 : 1
      // Depois por última mensagem
      const at = a.last_message_created_at || a.last_message_at
      const bt = b.last_message_created_at || b.last_message_at
      return new Date(bt).getTime() - new Date(at).getTime()
    })

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-safe flex flex-col overflow-x-hidden">
      {/* Header Mobile-First */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Voltar
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold text-gray-900">WhatsApp</h1>
              <p className="text-xs text-gray-500">Nutri</p>
            </div>
            <Link
              href="/admin/whatsapp/automation"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              ⚙️
            </Link>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{conversations.length} conversas</span>
            {unreadTotal > 0 && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                {unreadTotal} não lidas
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Lista de Conversas */}
        <div
          className={[
            'w-full md:w-80 bg-white md:border-r border-gray-200 overflow-y-auto',
            // Mobile: se uma conversa está selecionada, mostra somente o chat
            selectedConversation ? 'hidden md:block' : 'block',
          ].join(' ')}
        >
          {/* Tabs + Busca (estilo WhatsApp) */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <div className="px-3 pt-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar conversa..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="px-2 py-2 flex gap-2 overflow-x-auto">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'unread', label: 'Não lidas' },
                { id: 'favorites', label: 'Favoritos' },
                { id: 'groups', label: 'Grupos' },
                { id: 'archived', label: 'Arquivadas' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setListTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    listTab === (t.id as any)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
              Carregando conversas...
            </div>
          ) : visibleConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm.trim() ? 'Nenhum resultado' : 'Nenhuma conversa ainda'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Quando alguém enviar mensagem para <strong>5519997230912</strong>, aparecerá aqui automaticamente.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-600">
                <p className="font-semibold mb-2">📱 Para testar:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Envie uma mensagem do seu WhatsApp para <strong>5519997230912</strong></li>
                  <li>Aguarde 5-10 segundos</li>
                  <li>A conversa aparecerá aqui automaticamente</li>
                </ol>
              </div>
            </div>
          ) : (
            visibleConversations.map((conv) => {
              const displayName = getDisplayName(conv)
              const avatarUrl = getAvatarUrl(conv)
              const preview = conv.last_message_preview || ''
              const timeSource = conv.last_message_created_at || conv.last_message_at
              const pinned = isPinned(conv)
              const fav = isFavorite(conv)

              return (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full px-3 py-3 border-b border-gray-100 hover:bg-gray-50 text-left ${
                  selectedConversation?.id === conv.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-11 w-11 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold">
                        {getInitials(displayName)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
                        {pinned && <span className="text-xs text-gray-400">📌</span>}
                        {fav && <span className="text-xs text-yellow-500">★</span>}
                      </div>
                      <div className="text-xs text-gray-400 ml-2 shrink-0">
                        {timeSource ? formatTime(timeSource) : ''}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-sm text-gray-600 truncate">
                        {preview || formatPhone(conv.phone)}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {conv.z_api_instances?.status === 'connected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-700">
                            <span className="h-2 w-2 bg-green-500 rounded-full" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                            <span className="h-2 w-2 bg-gray-300 rounded-full" />
                            Offline
                          </span>
                        )}
                        {isGroup(conv) && (
                          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            Grupo
                          </span>
                        )}
                      </div>

                      {/* Ações rápidas */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            patchConversation(conv.id, { context: { favorite: !fav } }).catch((err) =>
                              alert(err.message)
                            )
                          }}
                          className="text-xs text-gray-500 hover:text-yellow-600"
                          title={fav ? 'Desfavoritar' : 'Favoritar'}
                        >
                          {fav ? '★' : '☆'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            patchConversation(conv.id, { context: { pinned: !pinned } }).catch((err) =>
                              alert(err.message)
                            )
                          }}
                          className="text-xs text-gray-500 hover:text-gray-800"
                          title={pinned ? 'Desafixar' : 'Fixar'}
                        >
                          📌
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const nextStatus = conv.status === 'archived' ? 'active' : 'archived'
                            patchConversation(conv.id, { status: nextStatus }).catch((err) =>
                              alert(err.message)
                            )
                          }}
                          className="text-xs text-gray-500 hover:text-gray-800"
                          title={conv.status === 'archived' ? 'Desarquivar' : 'Arquivar'}
                        >
                          🗄️
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const nextUnread = conv.unread_count > 0 ? 0 : 1
                            patchConversation(conv.id, { unread_count: nextUnread }).catch((err) =>
                              alert(err.message)
                            )
                          }}
                          className="text-xs text-gray-500 hover:text-gray-800"
                          title={conv.unread_count > 0 ? 'Marcar como lida' : 'Marcar como não lida'}
                        >
                          👁️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              )
            })
          )}
        </div>

        {/* Área de Chat - Mobile First */}
        <div
          className={[
            'flex-1 min-w-0 flex-col',
            // Mobile: só mostra o chat quando tem conversa selecionada
            selectedConversation ? 'flex' : 'hidden md:flex',
          ].join(' ')}
        >
          {selectedConversation ? (
            <>
              {/* Header da Conversa */}
              <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">
                      {getAvatarUrl(selectedConversation) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getAvatarUrl(selectedConversation) as string}
                          alt={getDisplayName(selectedConversation)}
                          className="h-11 w-11 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold">
                          {getInitials(getDisplayName(selectedConversation))}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900 truncate">
                        {getDisplayName(selectedConversation)}
                      </h2>
                      <p className="text-sm text-gray-500 truncate">{formatPhone(selectedConversation.phone)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {selectedConversation.z_api_instances?.status === 'connected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-700">
                            <span className="h-2 w-2 bg-green-500 rounded-full" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                            <span className="h-2 w-2 bg-gray-300 rounded-full" />
                            Offline
                          </span>
                        )}
                        {selectedConversation.area && (
                          <span className="inline-block px-2 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded">
                            {selectedConversation.area}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => window.open(`/api/whatsapp/conversations/${selectedConversation.id}/export`, '_blank')}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                      title="Exportar conversa"
                      aria-label="Exportar conversa"
                    >
                      ⬇️
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setContactMenuOpen((v) => !v)}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                        title="Mais opções"
                        aria-label="Mais opções"
                      >
                        ⋮
                      </button>
                      {contactMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
                          <button
                            type="button"
                            onClick={() => {
                              const next = prompt('Nome do contato (aparece na lista):', getDisplayName(selectedConversation))
                              setContactMenuOpen(false)
                              if (next === null) return
                              patchConversation(selectedConversation.id, { context: { display_name: next } }).catch((err) =>
                                alert(err.message)
                              )
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            ✏️ Editar nome
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = prompt('URL do avatar (foto):', getAvatarUrl(selectedConversation) || '')
                              setContactMenuOpen(false)
                              if (next === null) return
                              patchConversation(selectedConversation.id, { context: { avatar_url: next } }).catch((err) =>
                                alert(err.message)
                              )
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            🖼️ Definir avatar (URL)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const current = ((selectedConversation.context as any)?.tags || []).join(', ')
                              const next = prompt('Etiquetas (separe por vírgula):', current)
                              setContactMenuOpen(false)
                              if (next === null) return
                              const tags = next
                                .split(',')
                                .map((t) => t.trim())
                                .filter(Boolean)
                              patchConversation(selectedConversation.id, { context: { tags } }).catch((err) => alert(err.message))
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            🏷️ Etiquetas (tags)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const current = (selectedConversation.context as any)?.notes || ''
                              const next = prompt('Notas internas (não vão para o cliente):', current)
                              setContactMenuOpen(false)
                              if (next === null) return
                              patchConversation(selectedConversation.id, { context: { notes: next } }).catch((err) => alert(err.message))
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            📝 Notas internas
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const mutedUntil = (selectedConversation.context as any)?.muted_until || null
                              const isMuted = mutedUntil && new Date(mutedUntil).getTime() > Date.now()
                              setContactMenuOpen(false)
                              if (isMuted) {
                                patchConversation(selectedConversation.id, { context: { muted_until: null } }).catch((err) => alert(err.message))
                              } else {
                                const until = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
                                patchConversation(selectedConversation.id, { context: { muted_until: until } }).catch((err) => alert(err.message))
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            🔇 Silenciar 8h
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const ok = confirm('Bloquear esta conversa? (ela ficará em status bloqueado)')
                              setContactMenuOpen(false)
                              if (!ok) return
                              patchConversation(selectedConversation.id, { status: 'blocked' }).catch((err) => alert(err.message))
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                          >
                            ⛔ Bloquear
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden shrink-0 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      aria-label="Voltar para lista de conversas"
                      title="Conversas"
                    >
                      ← Conversas
                    </button>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div
                ref={messagesContainerRef}
                onScroll={() => {
                  const el = messagesContainerRef.current
                  if (!el) return
                  const nearBottom = isNearBottom(el)
                  shouldAutoScrollRef.current = nearBottom
                  setShowScrollToBottom(!nearBottom)
                }}
                className="relative flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#efeae2]"
              >
                {messages.map((msg, index) => {
                  const currentDayKey = new Date(msg.created_at).toDateString()
                  const prevDayKey =
                    index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null
                  const showDayDivider = currentDayKey !== prevDayKey
                  const ticks = getStatusTicks(msg.status)

                  return (
                    <div key={msg.id}>
                      {showDayDivider && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-600 bg-white/70 px-3 py-1 rounded-full shadow-sm border border-gray-200">
                            {formatDayLabel(msg.created_at)}
                          </span>
                        </div>
                      )}

                      <div
                        className={`mb-2 flex ${
                          msg.sender_type === 'customer' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[92%] sm:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                            msg.sender_type === 'customer'
                              ? 'bg-white'
                              : 'bg-[#dcf8c6] text-gray-900'
                          }`}
                        >
                          {msg.media_url && msg.message_type === 'image' && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={msg.media_url}
                              alt="Imagem"
                              className="rounded-lg mb-2 max-h-72 w-auto"
                            />
                          )}
                          {msg.media_url && msg.message_type === 'video' && (
                            <video
                              src={msg.media_url}
                              controls
                              className="rounded-lg mb-2 max-h-72 w-full"
                            />
                          )}
                          {msg.media_url && msg.message_type === 'audio' && (
                            <audio src={msg.media_url} controls className="w-full mb-2" />
                          )}
                          {msg.media_url && msg.message_type === 'document' && (
                            <a
                              href={msg.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className="block mb-2 text-sm underline text-gray-700"
                            >
                              📎 Abrir documento
                            </a>
                          )}
                          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                            {msg.message}
                          </p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="text-[11px] text-gray-500">
                              {formatTime(msg.created_at)}
                            </span>
                            {msg.sender_type !== 'customer' && (
                              <span className={`text-[11px] ${ticks.className}`}>{ticks.text}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {showScrollToBottom && (
                  <button
                    type="button"
                    onClick={() => {
                      const el = messagesContainerRef.current
                      if (!el) return
                      shouldAutoScrollRef.current = true
                      el.scrollTop = el.scrollHeight
                      setShowScrollToBottom(false)
                    }}
                    className="sticky bottom-4 ml-auto mr-0 h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50"
                    title="Voltar ao fim"
                    aria-label="Voltar ao fim"
                  >
                    ⬇️
                  </button>
                )}
              </div>

              {/* Input de Mensagem */}
              <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex gap-2 items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={async () => {
                      if (!selectedConversation) return
                      const file = fileInputRef.current?.files?.[0]
                      if (!file) return
                      try {
                        setUploading(true)
                        const form = new FormData()
                        form.append('file', file)
                        // caption pode ser adicionado depois via UI; por enquanto vazio
                        const response = await fetch(
                          `/api/whatsapp/conversations/${selectedConversation.id}/media`,
                          {
                            method: 'POST',
                            credentials: 'include',
                            body: form,
                          }
                        )
                        if (!response.ok) {
                          const err = await response.json().catch(() => ({}))
                          throw new Error(err.error || 'Erro ao enviar anexo')
                        }
                        setTimeout(() => {
                          loadMessages(selectedConversation.id)
                          loadConversations()
                        }, 200)
                      } catch (err: any) {
                        alert(err.message || 'Erro ao enviar anexo')
                      } finally {
                        setUploading(false)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    aria-label="Anexar arquivo"
                    title="Anexar"
                    disabled={uploading || sending}
                  >
                    {uploading ? '⏳' : '📎'}
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={sending || uploading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending || uploading}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-500 p-8">
              <div className="text-6xl mb-4">👈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione uma conversa</h3>
              <p className="text-sm text-gray-500">
                Clique em uma conversa à esquerda para ver as mensagens e responder
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WhatsAppChatPage
