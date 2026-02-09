'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'
import { normalizePhoneBr } from '@/lib/phone-br'

const supabase = createClient()

interface Conversation {
  id: string
  phone: string
  name: string | null
  customer_name?: string | null
  area: string | null
  status: string
  last_message_at: string
  created_at?: string | null
  unread_count: number
  total_messages: number
  context?: any
  last_message_preview?: string
  last_message_type?: string | null
  last_message_created_at?: string | null
  last_message_sender_type?: string | null
  instance_id?: string | null // UUID da tabela z_api_instances
  z_api_instances: {
    name: string
    area: string
    status?: string
  } | null
  /** Nome de workshop_inscricoes/contact_submissions (enriquecido pela API). */
  display_name?: string | null
  /** Telefone formatado das inscrições (enriquecido pela API). */
  display_phone?: string | null
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
  is_bot_response?: boolean | null
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
  const [tagFilter, setTagFilter] = useState<string | null>(null) // Filtro por fase/tag: null | 'sem_participacao' | 'participou_aula' | 'nao_participou_aula' | 'fez_apresentacao'
  const [tagsModalOpen, setTagsModalOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState('')
  const [carolModalOpen, setCarolModalOpen] = useState(false)
  const [carolDiagnostic, setCarolDiagnostic] = useState<any>(null)
  const [activatingCarol, setActivatingCarol] = useState(false)
  const [sessionSelectModalOpen, setSessionSelectModalOpen] = useState(false)
  const [sessionModalPurpose, setSessionModalPurpose] = useState<'opcao' | 'link'>('opcao')
  const [availableSessions, setAvailableSessions] = useState<any[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [messagePhaseModalOpen, setMessagePhaseModalOpen] = useState(false)
  const [messagePhaseTipo, setMessagePhaseTipo] = useState<'fechamento' | 'remarketing' | null>(null)
  const [messagePhasePreview, setMessagePhasePreview] = useState('')
  const [messagePhaseLoading, setMessagePhaseLoading] = useState(false)
  const [sendingWorkshopInvite, setSendingWorkshopInvite] = useState(false)
  const [sendOptionsOpen, setSendOptionsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [contactMenuOpen, setContactMenuOpen] = useState(false)
  const [carolActionsOpen, setCarolActionsOpen] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [carolStatus, setCarolStatus] = useState<{ disabled: boolean; message?: string } | null>(null)
  const [carolStatusToggling, setCarolStatusToggling] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const carolActionsRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const userClearedSelectionRef = useRef(false) // Flag para indicar que o usuário explicitamente limpou a seleção
  const hasInitializedFromUrlRef = useRef(false) // Flag para indicar se já inicializou a partir da URL
  const latestConversationsRef = useRef<Conversation[]>([]) // Lista mais recente para uso no callback de setSelectedConversation (evita "list is not defined")

  // Verificar parâmetro da URL na primeira carga
  useEffect(() => {
    if (hasInitializedFromUrlRef.current) return // Já inicializou
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const conversationId = params.get('conversation')
      if (conversationId && conversations.length > 0) {
        const conv = conversations.find(c => c.id === conversationId)
        if (conv) {
          userClearedSelectionRef.current = false // Resetar flag quando seleciona via URL
          setSelectedConversation(conv)
          hasInitializedFromUrlRef.current = true
          // Limpar parâmetro da URL sem recarregar a página
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('conversation')
          window.history.replaceState({}, '', newUrl.toString())
        }
      }
    }
  }, [conversations])

  // Status da automação Carol (ligada/desligada) para exibir no admin
  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/whatsapp/carol/status', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.disabled === 'boolean') {
          setCarolStatus({ disabled: data.disabled, message: data.message })
        }
      })
      .catch(() => {
        if (!cancelled) setCarolStatus(null)
      })
    return () => { cancelled = true }
  }, [])

  // Carregar conversas (polling a cada 12s para não sobrecarregar rede/servidor)
  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 12000)
    return () => clearInterval(interval)
  }, [areaFilter, listTab, searchTerm])

  // Carregar mensagens quando selecionar conversa (polling a cada 8s para não pesar)
  useEffect(() => {
    if (selectedConversation) {
      setContactMenuOpen(false)
      setCarolActionsOpen(false)
      shouldAutoScrollRef.current = true
      loadMessages(selectedConversation.id)
      const interval = setInterval(() => loadMessages(selectedConversation.id), 8000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  // Fechar menu "O que a Carol faça?" ao clicar fora
  useEffect(() => {
    if (!carolActionsOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (carolActionsRef.current && !carolActionsRef.current.contains(e.target as Node)) {
        setCarolActionsOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [carolActionsOpen])

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
      const params = new URLSearchParams({
        status: statusParam,
        limit: '200', // Aumentado para carregar mais conversas
      })
      if (areaFilter !== 'all') {
        params.set('area', areaFilter)
      }
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim())
      }
      const url = `/api/whatsapp/conversations?${params.toString()}`
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
      let conversationsList = data.conversations || []
      
      // Agrupamento no frontend (mesma lógica da API: BR 12→13 dígitos, preferir conversa com nome)
      const phoneMap = new Map<string, Conversation>()
      const hasName = (c: Conversation) => {
        const n = (c.name || '').trim()
        const d = ((c.context as any)?.display_name || '').trim()
        const cust = (c.customer_name || '').trim()
        const reject = (s: string) => !s || /^[\d\s\-\+\(\)]{8,}$/.test(s)
        return (n && !reject(n)) || (d && !reject(d)) || (cust && !reject(cust))
      }
      const mergeContext = (winner: Conversation, other: Conversation) => {
        const w = (winner.context as any) || {}
        const o = (other.context as any) || {}
        const merged = { ...w, ...o }
        // Tags: usar as da conversa principal para a tag não "voltar" (ex.: manual_welcome_sent)
        if (Array.isArray(w.tags)) merged.tags = w.tags
        return merged
      }
      conversationsList.forEach((conv: Conversation) => {
        let digits = (conv.phone || '').replace(/\D/g, '')
        if (digits.startsWith('55') && digits.length === 12) digits = normalizePhoneBr(digits)
        let phoneKey: string
        if (digits.startsWith('55') && digits.length >= 13) phoneKey = `BR_${digits.substring(2)}`
        else if (digits.length >= 10 && digits.length <= 11) {
          if (digits.startsWith('0')) digits = digits.slice(1)
          phoneKey = `BR_${digits}`
        } else if (digits.length < 10) phoneKey = `id_${conv.id}`
        else phoneKey = digits

        if (!phoneMap.has(phoneKey)) {
          phoneMap.set(phoneKey, conv)
        } else {
          const existing = phoneMap.get(phoneKey)!
          const existingDate = existing.last_message_at ? new Date(existing.last_message_at).getTime() : (existing.created_at ? new Date(existing.created_at).getTime() : 0)
          const currentDate = conv.last_message_at ? new Date(conv.last_message_at).getTime() : (conv.created_at ? new Date(conv.created_at).getTime() : 0)
          const existingHasName = hasName(existing)
          const currentHasName = hasName(conv)
          let winner: Conversation = currentDate > existingDate ? conv : existing
          if (existingHasName && !currentHasName) winner = existing
          else if (currentHasName && !existingHasName) winner = conv
          else if (currentDate > existingDate) winner = conv
          else winner = existing
          const other = winner === conv ? existing : conv
          winner = { ...winner, context: mergeContext(winner, other) } as Conversation
          phoneMap.set(phoneKey, winner)
        }
      })
      
      conversationsList = Array.from(phoneMap.values())
      latestConversationsRef.current = conversationsList
      console.log('✅ Conversas carregadas e agrupadas:', {
        antes: data.conversations?.length || 0,
        depois: conversationsList.length
      })
      setConversations(conversationsList)

      // Manter conversa selecionada (evita "voltar" para outra conversa)
      // Usar ref para ler a lista (nunca usar variável "list" solta para evitar ReferenceError em produção)
      const currentList = latestConversationsRef.current ?? []
      setSelectedConversation((prev) => {
        try {
          if (!Array.isArray(currentList) || currentList.length === 0) return null
          if (userClearedSelectionRef.current) return null
          if (!prev) return currentList[0]
          const stillExists = currentList.find((c) => c.id === prev.id)
          if (stillExists) return stillExists
          console.log('[WhatsApp Admin] ⚠️ Conversa selecionada não encontrada na lista atualizada, mantendo seleção:', prev.id)
          return prev
        } catch (e) {
          console.error('[WhatsApp Admin] Erro ao atualizar conversa selecionada:', e)
          return prev ?? null
        }
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

      const response = await fetch(
        `/api/whatsapp/conversations/${conversationId}/messages?limit=500`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`⚠️ Conversa ${conversationId} não encontrada`)
          return // Não mostrar erro para conversas que podem ter sido deletadas
        }
        throw new Error(`Erro ao carregar mensagens: ${response.status}`)
      }

      const data = await response.json()
      const nextMessages: Message[] = data.messages || []
      // Evitar re-render/auto-scroll quando não mudou nada
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

  const formatPhone = (phone: string | unknown) => {
    const s = typeof phone === 'string' ? phone : typeof phone === 'number' ? String(phone) : ''
    if (!s) return 'Sem telefone'
    
    // Remover caracteres não numéricos e espaços
    let clean = s.replace(/\D/g, '')
    
    // Se contém @, é ID do WhatsApp - extrair apenas o número
    if (s.includes('@')) {
      const match = s.match(/(\d{10,15})/)
      if (match) {
        clean = match[1]
      } else {
        return s
      }
    }
    
    // Validar se é um telefone válido (10-15 dígitos)
    if (clean.length < 10 || clean.length > 15) {
      if (typeof phone === 'object' && phone !== null) {
        return 'Sem telefone'
      }
      return s.length > 25 ? s.substring(0, 25) + '...' : s
    }
    
    // Formatar telefone brasileiro: 5511999999999 -> +55 11 99999-9999 (formato WhatsApp Web)
    // Formato exato do WhatsApp Web: +55 XX XXXXX-XXXX
    if (clean.startsWith('55') && clean.length === 13) {
      const ddd = clean.substring(2, 4)
      const part1 = clean.substring(4, 9)  // 5 dígitos
      const part2 = clean.substring(9)     // 4 dígitos
      return `+55 ${ddd} ${part1}-${part2}`
    }
    
    // Formatar telefone brasileiro sem código: 11999999999 -> +55 11 99999-9999
    if (clean.length === 11 && clean.startsWith('1')) {
      const ddd = clean.substring(0, 2)
      const part1 = clean.substring(2, 7)  // 5 dígitos
      const part2 = clean.substring(7)     // 4 dígitos
      return `+55 ${ddd} ${part1}-${part2}`
    }
    
    // Formatar telefone brasileiro com 10 dígitos: 1999999999 -> +55 19 99999-9999
    if (clean.length === 10) {
      const ddd = clean.substring(0, 2)
      const part1 = clean.substring(2, 7)  // 5 dígitos
      const part2 = clean.substring(7)     // 4 dígitos
      return `+55 ${ddd} ${part1}-${part2}`
    }
    
    // Para outros países: formato genérico
    // EUA/Canadá: +1 XXX XXX-XXXX
    if (clean.startsWith('1') && clean.length === 11) {
      const area = clean.substring(1, 4)
      const part1 = clean.substring(4, 7)
      const part2 = clean.substring(7)
      return `+1 ${area} ${part1}-${part2}`
    }
    
    // Outros países: tentar formatar com código do país
    // Assumir que primeiros 2 dígitos são código do país
    if (clean.length >= 12 && clean.length <= 15) {
      const countryCode = clean.substring(0, 2)
      const rest = clean.substring(2)
      
      // Se resto tem 10 dígitos (formato brasileiro), formatar
      if (rest.length === 10) {
        const ddd = rest.substring(0, 2)
        const part1 = rest.substring(2, 7)
        const part2 = rest.substring(7)
        return `+${countryCode} ${ddd} ${part1}-${part2}`
      }
      
      // Se resto tem 9 dígitos, formatar sem DDD
      if (rest.length === 9) {
        const part1 = rest.substring(0, 5)
        const part2 = rest.substring(5)
        return `+${countryCode} ${part1}-${part2}`
      }

      // BR com dígito extra na frente: 15581999999999 → tratar como 55 81 99999-9999
      if (clean.startsWith('155') && clean.length === 14) {
        const d = clean.slice(2)
        if (d.length === 12) {
          const ddd = d.substring(0, 2)
          const part1 = d.substring(2, 7)
          const part2 = d.substring(7)
          return `+55 ${ddd} ${part1}-${part2}`
        }
      }
      // 15 dígitos começando com 55: usar 55 + 11 dígitos (descartar extras)
      if (clean.startsWith('55') && clean.length >= 13) {
        const d = clean.slice(0, 13)
        const ddd = d.substring(2, 4)
        const part1 = d.substring(4, 9)
        const part2 = d.substring(9)
        return `+55 ${ddd} ${part1}-${part2}`
      }
    }
    
    // Sempre numeração completa: quando não der para formatar, exibir o número inteiro
    return `+${clean}`
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
    const reject = (s: string) =>
      !s || s.toLowerCase() === 'ylada nutri' || s.toLowerCase() === 'ylada' || /^[\d\s\-\+\(\)]{8,}$/.test(s.trim())
    // 1) Nome do workshop (o que preencheu na inscrição)
    const fromWorkshop = typeof conv.display_name === 'string' ? conv.display_name.trim() : ''
    if (fromWorkshop && !reject(fromWorkshop)) return fromWorkshop
    // 2) Nome que aparece no próprio WhatsApp (perfil do contato)
    if (conv.name && conv.name.trim() && !reject(conv.name)) return conv.name.trim()
    // 3) customer_name e context.display_name
    const cust = typeof conv.customer_name === 'string' ? conv.customer_name.trim() : ''
    if (cust && !reject(cust)) return cust
    const ctx = (conv.context || {}) as any
    const override = typeof ctx.display_name === 'string' ? ctx.display_name.trim() : ''
    if (override && !reject(override)) return override
    // Sem nome: usar telefone do cadastro (display_phone) quando existir, para não exibir número grande
    if (typeof conv.display_phone === 'string' && conv.display_phone.trim()) return conv.display_phone.trim()
    return formatPhone(conv.phone)
  }

  /** Telefone para exibição: prioriza o enriquecido (inscrições), senão formata conv.phone */
  const getDisplayPhone = (conv: Conversation) => {
    if (typeof conv.display_phone === 'string' && conv.display_phone.trim()) {
      return conv.display_phone.trim()
    }
    return formatPhone(conv.phone)
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
  
  const getTags = (conv: Conversation): string[] => {
    const ctx = (conv.context || {}) as any
    return Array.isArray(ctx.tags) ? ctx.tags : []
  }

  const getTagInfo = (tag: string): { label: string; color: string; icon: string } => {
    const tagMap: Record<string, { label: string; color: string; icon: string }> = {
      // Fase 1: Captação
      'veio_aula_pratica': { label: 'Aula Prática', color: 'bg-blue-100 text-blue-700', icon: '📝' },
      'primeiro_contato': { label: '1º Contato', color: 'bg-blue-50 text-blue-600', icon: '👋' },
      'cliente_iniciou': { label: 'Cliente Iniciou', color: 'bg-blue-100 text-blue-700', icon: '👤' },
      'agente_iniciou': { label: 'Agente Iniciou', color: 'bg-blue-50 text-blue-600', icon: '👨‍💼' },
      'carol_ativa': { label: 'Carol Ativa', color: 'bg-purple-100 text-purple-700', icon: '🤖' },
      'aguardando_resposta': { label: 'Aguardando Resposta', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      
      // Fase 2: Convite
      'recebeu_link_workshop': { label: 'Link Workshop', color: 'bg-purple-100 text-purple-700', icon: '📅' },
      'recebeu_segundo_link': { label: '2º Link', color: 'bg-purple-200 text-purple-800', icon: '📅📅' },
      
      // Fase 3: Participação
      'participou_aula': { label: 'Participou', color: 'bg-green-100 text-green-700', icon: '✅' },
      'nao_participou_aula': { label: 'Não Participou', color: 'bg-red-100 text-red-700', icon: '❌' },
      'adiou_aula': { label: 'Adiou', color: 'bg-yellow-100 text-yellow-700', icon: '⏸️' },
      'fez_apresentacao': { label: 'Fez Apresentação', color: 'bg-teal-100 text-teal-700', icon: '🎤' },
      
      // Fase 4: Remarketing
      'interessado': { label: 'Interessado', color: 'bg-purple-50 text-purple-600', icon: '💡' },
      'duvidas': { label: 'Dúvidas', color: 'bg-indigo-100 text-indigo-700', icon: '❓' },
      'analisando': { label: 'Analisando', color: 'bg-yellow-50 text-yellow-600', icon: '🤔' },
      'objeções': { label: 'Objeções', color: 'bg-orange-100 text-orange-700', icon: '🚫' },
      'negociando': { label: 'Negociando', color: 'bg-orange-50 text-orange-600', icon: '💰' },
      
      // Fase 5: Conversão
      'cliente_nutri': { label: 'Cliente Nutri', color: 'bg-green-200 text-green-800', icon: '🎉' },
      'perdeu': { label: 'Perdeu', color: 'bg-gray-200 text-gray-700', icon: '😔' },
      
      // Extras
      'retorno': { label: 'Retorno', color: 'bg-cyan-100 text-cyan-700', icon: '🔄' },
      'urgencia': { label: 'Urgência', color: 'bg-red-200 text-red-800', icon: '⚡' },
      'manual_welcome_sent': { label: 'Boas-vindas enviadas', color: 'bg-slate-100 text-slate-700', icon: '✉️' },
      'agendou_aula': { label: 'Agendou aula', color: 'bg-teal-100 text-teal-700', icon: '📅' },
      'atendimento_manual': { label: 'Carol pausada (manual)', color: 'bg-amber-100 text-amber-700', icon: '🛑' },
      'manual_mode': { label: 'Carol pausada (manual)', color: 'bg-amber-100 text-amber-700', icon: '🛑' },
      
      // Tags antigas (compatibilidade)
      'form_lead': { label: 'Form', color: 'bg-blue-100 text-blue-700', icon: '📝' },
      'workshop_invited': { label: 'Workshop', color: 'bg-purple-100 text-purple-700', icon: '📅' },
    }
    
    return tagMap[tag] || { label: tag, color: 'bg-gray-100 text-gray-600', icon: '🏷️' }
  }

  const PARTICIPACAO_TAGS = ['participou_aula', 'nao_participou_aula', 'adiou_aula', 'fez_apresentacao']

  const visibleConversations = conversations
    .filter((conv) => {
      if (listTab === 'unread') return conv.unread_count > 0
      if (listTab === 'favorites') return isFavorite(conv)
      if (listTab === 'groups') return isGroup(conv)
      return true
    })
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
      const name = getDisplayName(conv).toLowerCase()
      const phone = getDisplayPhone(conv).toLowerCase()
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
    <div className="min-h-screen min-h-[100dvh] h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Mobile-First — touch targets 44px+ no mobile */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 z-10 pt-[env(safe-area-inset-top,0px)]">
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Link
              href="/admin"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center -m-2 p-2 text-gray-600 hover:text-gray-900 active:bg-gray-100 rounded-lg text-sm touch-manipulation"
              aria-label="Voltar ao admin"
              title="Voltar ao painel admin"
            >
              ← Voltar
            </Link>
            <div className="text-center flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">WhatsApp</h1>
              <p className="text-xs text-gray-500">Nutri</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/admin/whatsapp/automation"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50 active:bg-green-100 text-lg"
                title="Configurações de automação — ligar/desligar Carol, horários permitidos"
                aria-label="Configurações de automação"
              >
                ⚙️
              </Link>
              <Link
                href="/admin/whatsapp/workshop"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100 text-lg"
                title="Agenda do workshop — ver e criar sessões de aula (datas/horários)"
                aria-label="Agenda do workshop"
              >
                📅
              </Link>
              <Link
                href="/admin/whatsapp/cadastros-workshop"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-amber-700 hover:text-amber-800 hover:bg-amber-50 active:bg-amber-100 text-lg"
                title="Cadastros do workshop — lista de inscritos e disparo manual de boas-vindas"
                aria-label="Cadastros do workshop"
              >
                🧾
              </Link>
              <Link
                href="/admin/whatsapp/fluxo"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100 text-lg"
                title="Fluxo e textos — editar as mensagens que a Carol envia no fluxo"
                aria-label="Fluxo e textos"
              >
                📋
              </Link>
              <Link
                href="/admin/whatsapp/atualizar-fases"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 active:bg-teal-100 text-lg"
                title="Atualizar fases — marcar participou/não participou em lote"
                aria-label="Atualizar fases"
              >
                🏷️
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span title="Total de conversas na lista">{conversations.length} conversas</span>
            {unreadTotal > 0 && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full" title="Conversas com mensagens ainda não lidas">
                {unreadTotal} não lidas
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status Carol: ligada / desligada — controle pelo admin (sem .env nem Vercel) */}
      {carolStatus && (
        <div
          className={`flex-shrink-0 px-4 py-2 text-sm ${
            carolStatus.disabled
              ? 'bg-amber-50 border-b border-amber-200 text-amber-800'
              : 'bg-green-50 border-b border-green-200 text-green-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-medium">
              {carolStatus.disabled ? (
                <>🤖 Carol: <strong>desligada</strong></>
              ) : (
                <>🤖 Carol: <strong>ligada</strong></>
              )}
            </span>
            <button
              type="button"
              disabled={carolStatusToggling}
              onClick={async () => {
                setCarolStatusToggling(true)
                try {
                  const res = await fetch('/api/admin/whatsapp/carol/status', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ disabled: !carolStatus.disabled }),
                  })
                  const data = await res.json()
                  if (data.success) {
                    setCarolStatus({ disabled: data.disabled, message: data.message })
                  } else {
                    alert(data.error || 'Erro ao alterar')
                  }
                } catch (e: any) {
                  alert(e?.message || 'Erro ao alterar')
                } finally {
                  setCarolStatusToggling(false)
                }
              }}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg touch-manipulation ${
                carolStatus.disabled
                  ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:opacity-50'
                  : 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50'
              }`}
              title={carolStatus.disabled ? 'Ligar Carol — reativa respostas automáticas em todas as conversas' : 'Desligar Carol — para respostas automáticas em todas as conversas (só você atende)'}
            >
              {carolStatusToggling ? '…' : carolStatus.disabled ? 'Ligar Carol' : 'Desligar Carol'}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Lista de Conversas - Scroll Independente */}
        <div
          className={[
            'w-full md:w-80 bg-white md:border-r border-gray-200 flex flex-col overflow-hidden',
            // Mobile: se uma conversa está selecionada, mostra somente o chat
            selectedConversation ? 'hidden md:flex' : 'flex',
          ].join(' ')}
        >
          {/* Tabs + Busca (estilo WhatsApp) - Fixo no topo */}
          <div className="flex-shrink-0 bg-white border-b border-gray-100">
            <div className="px-3 pt-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar conversa..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="px-2 py-2 flex gap-2 overflow-x-auto touch-pan-x">
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
                  className={`min-h-[44px] px-4 py-2 rounded-full text-sm whitespace-nowrap touch-manipulation ${
                    listTab === (t.id as any)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="px-2 pb-2">
              <span className="text-xs text-gray-500 mr-2">Por fase:</span>
              <div className="flex gap-1.5 flex-wrap">
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
                    className={`min-h-[40px] px-3 py-2 rounded-full text-xs whitespace-nowrap touch-manipulation ${
                      tagFilter === t.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Conversas - Scroll Independente */}
          <div className="flex-1 min-h-0 overflow-y-auto">
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
              const displayPhone = getDisplayPhone(conv)
              const avatarUrl = getAvatarUrl(conv)
              const preview = conv.last_message_preview || ''
              const timeSource = conv.last_message_created_at || conv.last_message_at
              const pinned = isPinned(conv)
              const fav = isFavorite(conv)

              return (
              <button
                key={conv.id}
                onClick={() => {
                  userClearedSelectionRef.current = false // Resetar flag quando usuário seleciona uma conversa
                  setSelectedConversation(conv)
                }}
                className={`w-full px-3 py-3 min-h-[72px] border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 text-left touch-manipulation ${
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
                        <h3 className="font-semibold text-gray-900 truncate" title={displayName}>
                          {displayName}
                        </h3>
                        {pinned && <span className="text-xs text-gray-400">📌</span>}
                        {fav && <span className="text-xs text-yellow-500">★</span>}
                      </div>
                      <div className="text-xs text-gray-400 ml-2 shrink-0">
                        {timeSource ? formatTime(timeSource) : ''}
                      </div>
                    </div>
                    {/* Telefone sempre visível na 2ª linha para localizar; preview depois quando couber */}
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500 truncate" title={displayPhone}>
                          {displayPhone}{preview ? ` · ${preview}` : ''}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
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
                        {/* Tags (mobile-first): não empilha; usa scroll + "+N" */}
                        <div className="flex items-center gap-1 max-w-full overflow-x-auto touch-pan-x whitespace-nowrap sm:whitespace-normal sm:flex-wrap sm:overflow-visible">
                          {(() => {
                            const tags = getTags(conv)
                            const mobileVisible = tags.slice(0, 2)
                            const hiddenCount = tags.length - mobileVisible.length
                            return (
                              <>
                                {/* Mobile: limita + mostra "+N" */}
                                <span className="flex items-center gap-1 sm:hidden">
                                  {mobileVisible.map((tag) => {
                                    const tagInfo = getTagInfo(tag)
                                    return (
                                      <span
                                        key={tag}
                                        className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${tagInfo.color} whitespace-nowrap`}
                                        title={tag}
                                      >
                                        <span aria-hidden="true">{tagInfo.icon}</span>
                                        <span className="max-w-[10rem] truncate">{tagInfo.label}</span>
                                      </span>
                                    )
                                  })}
                                  {hiddenCount > 0 && (
                                    <span
                                      className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 whitespace-nowrap"
                                      title={`${hiddenCount} tag(s) a mais`}
                                    >
                                      +{hiddenCount}
                                    </span>
                                  )}
                                </span>

                                {/* Desktop: mostra todas */}
                                <span className="hidden sm:flex sm:items-center sm:gap-1 sm:flex-wrap">
                                  {tags.map((tag) => {
                                    const tagInfo = getTagInfo(tag)
                                    return (
                                      <span
                                        key={tag}
                                        className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${tagInfo.color}`}
                                        title={tag}
                                      >
                                        <span aria-hidden="true">{tagInfo.icon}</span>
                                        <span className="max-w-[14rem] truncate">{tagInfo.label}</span>
                                      </span>
                                    )
                                  })}
                                </span>
                              </>
                            )
                          })()}
                        </div>
                      </div>

                      {/* Ações rápidas */}
                      <div className="flex items-center gap-2 shrink-0">
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
        </div>

        {/* Área de Chat - Mobile First - Scroll Independente */}
        <div
          className={[
            'flex-1 min-w-0 flex flex-col overflow-hidden',
            // Mobile: só mostra o chat quando tem conversa selecionada
            selectedConversation ? 'flex' : 'hidden md:flex',
          ].join(' ')}
        >
          {selectedConversation ? (
            <>
              {/* Header da Conversa - Fixo (touch-friendly no mobile) */}
              <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
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
                      <p className="text-sm text-gray-500 truncate" title={getDisplayPhone(selectedConversation)}>
                        {getDisplayPhone(selectedConversation)}
                      </p>
                      <div className="mt-1 flex items-center gap-2 flex-nowrap overflow-x-auto touch-pan-x whitespace-nowrap sm:flex-wrap sm:overflow-visible sm:whitespace-normal">
                        {/* Tags (mobile-first): faixa rolável, sem empilhar */}
                        {getTags(selectedConversation).map((tag) => {
                          const tagInfo = getTagInfo(tag)
                          return (
                            <span
                              key={tag}
                              className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${tagInfo.color} whitespace-nowrap`}
                              title={tag}
                            >
                              <span aria-hidden="true">{tagInfo.icon}</span>
                              <span className="max-w-[12rem] truncate">{tagInfo.label}</span>
                            </span>
                          )
                        })}
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
                      {/* Aviso: Carol pausada nesta conversa (você desativou no admin) */}
                      {(getTags(selectedConversation).includes('atendimento_manual') || getTags(selectedConversation).includes('manual_mode') || (selectedConversation.context as any)?.manual_mode === true) && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                          <strong>🤖 Carol está pausada nesta conversa.</strong> Ela não vai responder automaticamente até você ativar de novo. Menu <strong>⋮</strong> (três pontinhos) → <strong>Ativar Carol</strong>.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        loadConversations()
                        if (selectedConversation) loadMessages(selectedConversation.id)
                      }}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 touch-manipulation"
                      title="Atualizar — atualiza a lista de conversas e as mensagens desta conversa"
                      aria-label="Atualizar"
                    >
                      🔄
                    </button>
                    {/* Botão Desativar Carol (visível quando ativa) */}
                    {selectedConversation && getTags(selectedConversation).includes('carol_ativa') && (
                      <>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!selectedConversation) return
                            
                            // Buscar sessões disponíveis (modal para enviar opção)
                            setSessionModalPurpose('opcao')
                            setLoadingSessions(true)
                            setSessionSelectModalOpen(true)
                            
                            try {
                              const res = await fetch('/api/admin/whatsapp/workshop-sessions?area=nutri&onlyActive=true', {
                                credentials: 'include',
                              })
                              const data = await res.json()
                              const sessions = data.sessions || []
                              
                              // Filtrar apenas futuras
                              const now = new Date()
                              const futureSessions = sessions.filter((s: any) => new Date(s.starts_at) > now)
                              
                              setAvailableSessions(futureSessions)
                              
                              if (futureSessions.length === 0) {
                                alert('Não há sessões disponíveis. Crie uma sessão primeiro em /admin/whatsapp/workshop')
                                setSessionSelectModalOpen(false)
                              }
                            } catch (err: any) {
                              alert(err.message || 'Erro ao buscar sessões')
                              setSessionSelectModalOpen(false)
                            } finally {
                              setLoadingSessions(false)
                            }
                          }}
                          disabled={sending}
                          className="min-h-[44px] px-3 py-2 sm:py-1.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 active:bg-purple-300 transition-colors disabled:opacity-50 touch-manipulation"
                          title="Enviar opção de sessão — envia as opções de data/hora para o cliente escolher; a Carol continua respondendo"
                          aria-label="Enviar opção de sessão"
                        >
                          <span className="sm:hidden" aria-hidden="true">📅</span>
                          <span className="hidden sm:inline">📅 Enviar Opção</span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm('Desativar Carol nesta conversa? Ela não responderá mais automaticamente.')) {
                              return
                            }
                            try {
                              const currentTags = getTags(selectedConversation)
                              const newTags = currentTags
                                .filter(t => t !== 'carol_ativa')
                                .concat('atendimento_manual')
                              
                              await patchConversation(selectedConversation.id, {
                                context: {
                                  ...(selectedConversation.context as any),
                                  tags: newTags,
                                  carol_disabled_at: new Date().toISOString(),
                                }
                              })
                              
                              alert('✅ Carol desativada com sucesso!')
                              await loadConversations()
                              if (selectedConversation) {
                                await loadMessages(selectedConversation.id)
                              }
                            } catch (err: any) {
                              alert(err.message || 'Erro ao desativar Carol')
                            }
                          }}
                          className="min-h-[44px] px-3 py-2 sm:py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-xl hover:bg-red-200 active:bg-red-300 transition-colors touch-manipulation"
                          title="Desativar Carol só nesta conversa — ela para de responder automaticamente só aqui; nas outras conversas continua ativa"
                          aria-label="Desativar Carol nesta conversa"
                        >
                          <span className="sm:hidden" aria-hidden="true">🚫</span>
                          <span className="hidden sm:inline">🚫 Desativar Carol</span>
                        </button>
                      </>
                    )}
                    <div className="relative">
                      <button
                        type="button"
                        disabled={sendingWorkshopInvite}
                        onClick={() => {
                          setContactMenuOpen(false)
                          setSendOptionsOpen((v) => !v)
                        }}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 disabled:opacity-50 disabled:pointer-events-none touch-manipulation"
                        title="Opções de envio — flyer + link da aula, ou definir sessão e enviar link agora"
                        aria-label="Opções de envio"
                        aria-expanded={sendOptionsOpen}
                      >
                        {sendingWorkshopInvite ? '…' : '📩'}
                      </button>
                      {sendOptionsOpen && (
                        <div className="absolute right-0 mt-2 w-64 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            Enviar para esta conversa
                          </div>
                          <button
                            type="button"
                            disabled={sendingWorkshopInvite}
                            onClick={async () => {
                              if (!selectedConversation || sendingWorkshopInvite) return
                              setSendingWorkshopInvite(true)
                              try {
                                const res = await fetch(
                                  `/api/whatsapp/conversations/${selectedConversation.id}/send-workshop-invite`,
                                  { method: 'POST', credentials: 'include' }
                                )
                                let json: { error?: string } = {}
                                try {
                                  const text = await res.text()
                                  if (text.trim()) json = JSON.parse(text)
                                } catch (_) {
                                  if (!res.ok) throw new Error(res.status === 500 ? 'Erro no servidor ao enviar. Tente de novo.' : `Erro ${res.status}`)
                                }
                                if (!res.ok) throw new Error(json.error || 'Erro ao enviar convite')
                                setSendOptionsOpen(false)
                                alert('✅ Flyer e link enviados!')
                                await loadMessages(selectedConversation.id)
                                await loadConversations()
                              } catch (err: any) {
                                alert(err.message || 'Erro ao enviar convite')
                              } finally {
                                setSendingWorkshopInvite(false)
                              }
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <span>📅</span>
                            <span>Enviar flyer + link da aula</span>
                          </button>
                          <p className="px-4 py-1 text-xs text-gray-500 border-t border-gray-100">
                            Usa a sessão já definida na conversa ou a próxima ativa.
                          </p>
                          <button
                            type="button"
                            disabled={sendingWorkshopInvite}
                            onClick={async () => {
                              if (!selectedConversation) return
                              setSendOptionsOpen(false)
                              setSessionModalPurpose('link')
                              setLoadingSessions(true)
                              setSessionSelectModalOpen(true)
                              try {
                                const res = await fetch('/api/admin/whatsapp/workshop-sessions?area=nutri&onlyActive=true', { credentials: 'include' })
                                const data = await res.json()
                                const sessions = (data.sessions || []).filter((s: any) => new Date(s.starts_at) > new Date())
                                setAvailableSessions(sessions)
                                if (sessions.length === 0) {
                                  alert('Não há sessões futuras. Crie em /admin/whatsapp/workshop')
                                  setSessionSelectModalOpen(false)
                                }
                              } catch (err: any) {
                                alert(err.message || 'Erro ao buscar sessões')
                                setSessionSelectModalOpen(false)
                              } finally {
                                setLoadingSessions(false)
                              }
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                          >
                            <span>📅</span>
                            <span>Definir sessão e enviar link agora</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(`/api/whatsapp/conversations/${selectedConversation.id}/export`, '_blank')}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 touch-manipulation"
                      title="Exportar conversa — baixar o histórico desta conversa (abre em nova aba)"
                      aria-label="Exportar conversa"
                    >
                      ⬇️
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setSendOptionsOpen(false)
                          setContactMenuOpen((v) => !v)
                        }}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 touch-manipulation"
                        title="Mais opções — etiquetas (tags), editar nome, ativar/desativar Carol nesta conversa, Carol responder à última mensagem"
                        aria-label="Mais opções"
                      >
                        ⋮
                      </button>
                      {contactMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 min-w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!selectedConversation) return
                              setContactMenuOpen(false)
                              try {
                                const res = await fetch('/api/admin/whatsapp/carol/reprocess-last', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({ conversationId: selectedConversation.id }),
                                })
                                const data = await res.json()
                                if (data.success) {
                                  await loadMessages(selectedConversation.id)
                                  await loadConversations()
                                  alert('✅ Carol respondeu à última mensagem do cliente.')
                                } else {
                                  alert(data.error || 'Erro ao reprocessar com Carol')
                                }
                              } catch (err: any) {
                                alert(err?.message || 'Erro ao chamar Carol')
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-purple-600"
                            title="Quando a Carol não respondeu automaticamente (ex.: webhook atrasou)"
                          >
                            🔄 Carol: responder à última mensagem
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = prompt('Nome do contato (aparece na lista):', getDisplayName(selectedConversation))
                              setContactMenuOpen(false)
                              if (next === null) return
                              const nome = (next || '').trim()
                              patchConversation(selectedConversation.id, {
                                name: nome || undefined,
                                context: { display_name: nome || undefined },
                              }).catch((err) => alert(err.message))
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
                              const conv = conversations.find((c) => c.id === selectedConversation.id) || selectedConversation
                              const current = ((conv.context as any)?.tags || [])
                              setSelectedTags(Array.isArray(current) ? [...current] : [])
                              setNewTagInput('')
                              setTagsModalOpen(true)
                              setContactMenuOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            🏷️ Etiquetas (tags)
                          </button>
                          {getTags(selectedConversation).includes('carol_ativa') ? (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!selectedConversation) return
                                if (!confirm('Desativar Carol nesta conversa? Ela não responderá mais automaticamente.')) {
                                  return
                                }
                                setContactMenuOpen(false)
                                try {
                                  setActivatingCarol(true)
                                  const currentTags = getTags(selectedConversation)
                                  const newTags = currentTags
                                    .filter(t => t !== 'carol_ativa')
                                    .concat('atendimento_manual')
                                  
                                  await patchConversation(selectedConversation.id, {
                                    context: {
                                      ...(selectedConversation.context as any),
                                      tags: newTags,
                                      carol_disabled_at: new Date().toISOString(),
                                    }
                                  })
                                  
                                  alert('✅ Carol desativada com sucesso!')
                                  await loadConversations()
                                  if (selectedConversation) {
                                    await loadMessages(selectedConversation.id)
                                  }
                                } catch (err: any) {
                                  alert(err.message || 'Erro ao desativar Carol')
                                } finally {
                                  setActivatingCarol(false)
                                }
                              }}
                              disabled={activatingCarol}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                            >
                              {activatingCarol ? '⏳ Desativando...' : '🚫 Desativar Carol'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!selectedConversation) return
                                setContactMenuOpen(false)
                                try {
                                  setActivatingCarol(true)
                                  const res = await fetch(
                                    `/api/admin/whatsapp/diagnose-conversation?id=${selectedConversation.id}`,
                                    { credentials: 'include' }
                                  )
                                  const data = await res.json()
                                  if (data.diagnostic) {
                                    setCarolDiagnostic(data.diagnostic)
                                    setCarolModalOpen(true)
                                  } else {
                                    alert(data.error || 'Erro ao diagnosticar conversa')
                                  }
                                } catch (err: any) {
                                  alert(err.message || 'Erro ao diagnosticar conversa')
                                } finally {
                                  setActivatingCarol(false)
                                }
                              }}
                              disabled={activatingCarol}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-purple-600"
                            >
                              {activatingCarol ? '⏳ Diagnosticando...' : '🤖 Ativar Carol'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={async () => {
                              const current = (selectedConversation.context as any)?.carol_instruction || ''
                              const next = prompt(
                                'Instrução para a Carol (será usada na próxima resposta e depois apagada).\n\nMantenha a Carol ATIVA. A instrução só é usada quando:\n• a pessoa enviar a próxima mensagem no WhatsApp, ou\n• você usar o botão "Carol" (roxo) para simular uma mensagem dela.\n\nEx.: "Essa pessoa fez a apresentação, gostou e ficou de pensar. Continuar daqui."',
                                current
                              )
                              setContactMenuOpen(false)
                              if (next === null) return
                              try {
                                await patchConversation(selectedConversation.id, { context: { carol_instruction: next.trim() || null } })
                                alert('✅ Instrução salva!\n\nSerá usada quando esta pessoa enviar a próxima mensagem (ou quando você clicar no botão "Carol" para simular). Depois a Carol apaga a instrução.\n\nMantenha a Carol ativa nesta conversa.')
                                setTimeout(() => loadConversations(), 0)
                              } catch (err: any) {
                                alert(err?.message || 'Erro ao salvar instrução')
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            🤖 Instrução para Carol
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const current = (selectedConversation.context as any)?.admin_situacao || ''
                              const next = prompt(
                                'Situação desta pessoa (remarketing) – fica salva até você mudar.\nA Carol usa isso em toda resposta para continuar daqui. Mantenha a Carol ativa.\n\nEx.: "Não participou da última aula. Fazer remarketing oferecendo quarta 20h."\nEx.: "Fez apresentação, gostou e ficou de pensar – continuar daqui."',
                                current
                              )
                              setContactMenuOpen(false)
                              if (next === null) return
                              try {
                                await patchConversation(selectedConversation.id, { context: { admin_situacao: next.trim() || null } })
                                alert('✅ Situação salva!\n\nA Carol vai usar isso em todas as respostas até você mudar. Mantenha a Carol ativa.')
                                setTimeout(() => loadConversations(), 0)
                              } catch (err: any) {
                                alert(err?.message || 'Erro ao salvar situação')
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            📋 Situação / Remarketing
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setContactMenuOpen(false)
                              setMessagePhaseTipo(null)
                              setMessagePhasePreview('')
                              setMessagePhaseModalOpen(true)
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            📤 Enviar mensagem de fase
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
                      onClick={() => {
                        userClearedSelectionRef.current = true // Marcar que o usuário explicitamente limpou a seleção
                        setSelectedConversation(null)
                      }}
                      className="md:hidden shrink-0 min-h-[44px] px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:bg-gray-300 touch-manipulation"
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
                          {/* Nome do remetente (apenas para mensagens do cliente) */}
                          {msg.sender_type === 'customer' && msg.sender_name && (
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              {msg.sender_name}
                            </p>
                          )}
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
                            {/* Botão para deletar mensagens da Carol */}
                            {(msg.is_bot_response || msg.sender_name?.includes('Carol') || msg.sender_type === 'bot') && (
                              <button
                                onClick={async () => {
                                  if (!confirm('Tem certeza que deseja deletar esta mensagem da Carol?')) return
                                  try {
                                    const res = await fetch(
                                      `/api/whatsapp/conversations/${selectedConversation?.id}/messages/${msg.id}`,
                                      { method: 'DELETE', credentials: 'include' }
                                    )
                                    const json = await res.json().catch(() => ({}))
                                    if (!res.ok) throw new Error(json.error || 'Erro ao deletar mensagem')
                                    // Recarregar mensagens
                                    if (selectedConversation) {
                                      await loadMessages(selectedConversation.id)
                                    }
                                  } catch (err: any) {
                                    alert(err.message || 'Erro ao deletar mensagem')
                                  }
                                }}
                                className="text-[10px] text-red-600 hover:text-red-800 px-1"
                                title="Deletar esta mensagem"
                              >
                                🗑️
                              </button>
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
                    className="sticky bottom-4 ml-auto mr-0 min-h-[48px] min-w-[48px] sm:h-10 sm:w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                    title="Voltar ao fim"
                    aria-label="Voltar ao fim"
                  >
                    ⬇️
                  </button>
                )}
              </div>

              {/* Input de Mensagem - Fixo no rodapé (safe area + touch no mobile) */}
              <div className="flex-shrink-0 bg-white border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex gap-2 sm:gap-3 items-center">
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
                    className="min-h-[48px] min-w-[48px] sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 touch-manipulation shrink-0"
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
                    className="flex-1 min-w-0 min-h-[48px] sm:min-h-0 px-4 py-3 sm:py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-base touch-manipulation"
                    disabled={sending || uploading}
                  />
                  {/* Menu "O que a Carol faça?" — ações pré-montadas (só quando Carol ativa) */}
                  {selectedConversation && getTags(selectedConversation).includes('carol_ativa') && (
                    <div ref={carolActionsRef} className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setCarolActionsOpen((o) => !o)}
                        disabled={sending || uploading}
                        className="min-h-[48px] sm:min-h-0 flex items-center gap-1 px-3 py-2.5 sm:py-2 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 active:bg-purple-300 disabled:opacity-50 text-sm font-medium touch-manipulation shrink-0"
                        title="Clique e escolha o que a Carol deve fazer (textos pré-montados)"
                      >
                        <span className="hidden sm:inline">O que a Carol faça?</span>
                        <span className="sm:hidden">Carol</span>
                        <span className="text-xs">▼</span>
                      </button>
                      {carolActionsOpen && (
                        <div className="absolute bottom-full left-0 right-0 sm:right-auto sm:w-72 mb-1 mx-0 sm:mx-0 max-h-[70vh] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-30">
                          <div className="p-2 border-b border-gray-100 bg-gray-50 text-xs text-gray-600 font-medium">
                            Texto fixo = menu. IA = só “responder à última mensagem”.
                          </div>
                          {[
                            { id: 'boas_vindas', label: '👋 Enviar boas-vindas (1ª mensagem)', isReprocess: true as const, title: 'Faz a Carol enviar boas-vindas + opções de horário (ex.: quem clicou no botão e não recebeu)' },
                            { id: 'pergunta_nao_respondeu', label: '💬 Perguntar interesse (não respondeu)', templateId: 'pergunta_interesse_nao_respondeu' as const },
                            { id: 'pergunta_nao_participou', label: '💬 Perguntar interesse (não participou)', templateId: 'pergunta_interesse_nao_participou' as const },
                            { id: 'ficou_pensar', label: '💭 Participou e ficou de pensar', templateId: 'followup_ficou_pensar' as const },
                            { id: 'ultima_chance', label: '⏱️ Última chance (limite respeitoso)', templateId: 'ultima_chance' as const },
                            { id: 'chama', label: '📞 Follow-up (chama ela / ficou de ver data)', simulateMsg: 'chama ela' as const },
                            { id: 'lembrete', label: '📅 Lembrete da aula de hoje', simulateMsg: 'Envie lembrete da aula de hoje' as const },
                            { id: 'reprocess', label: '🤖 Carol: responder à última mensagem (IA)', isReprocess: true as const },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              disabled={sending}
                              onClick={async () => {
                                setCarolActionsOpen(false)
                                const conv = selectedConversation
                                if (!conv) return
                                const conversationId = conv.id
                                try {
                                  setSending(true)
                                  if ('isReprocess' in item && item.isReprocess) {
                                    const res = await fetch('/api/admin/whatsapp/carol/reprocess-last', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({ conversationId }),
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                      try {
                                        await loadMessages(conversationId)
                                        await loadConversations()
                                      } catch (refreshErr: any) {
                                        console.error('[WhatsApp Admin] Erro ao atualizar lista após enviar:', refreshErr)
                                        alert('✅ Mensagem enviada, mas a lista não atualizou. Atualize a página (F5) se precisar.')
                                      }
                                      alert(item.id === 'boas_vindas' ? '✅ Boas-vindas enviadas! A Carol enviou a mensagem com as opções de horário.' : '✅ Carol respondeu à última mensagem do cliente.')
                                    } else {
                                      alert(data.error || 'Erro ao reprocessar com Carol')
                                    }
                                  } else if ('templateId' in item && item.templateId) {
                                    const res = await fetch('/api/admin/whatsapp/carol/send-template', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({
                                        conversationId,
                                        templateId: item.templateId,
                                      }),
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                      try {
                                        await loadMessages(conversationId)
                                        await loadConversations()
                                      } catch (refreshErr: any) {
                                        console.error('[WhatsApp Admin] Erro ao atualizar lista após enviar:', refreshErr)
                                        alert('✅ Mensagem enviada, mas a lista não atualizou. Atualize a página (F5) se precisar.')
                                      }
                                      alert('✅ Mensagem enviada (texto fixo).')
                                    } else {
                                      alert(data.error || 'Erro ao enviar')
                                    }
                                  } else if ('simulateMsg' in item && item.simulateMsg) {
                                    const res = await fetch('/api/admin/whatsapp/carol/simulate-message', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      credentials: 'include',
                                      body: JSON.stringify({
                                        conversationId,
                                        message: item.simulateMsg,
                                      }),
                                    })
                                    const data = await res.json()
                                    if (data.success) {
                                      try {
                                        await loadMessages(conversationId)
                                        await loadConversations()
                                      } catch (refreshErr: any) {
                                        console.error('[WhatsApp Admin] Erro ao atualizar lista após enviar:', refreshErr)
                                        alert('✅ Mensagem enviada, mas a lista não atualizou. Atualize a página (F5) se precisar.')
                                      }
                                      alert(data.response || '✅ Ação enviada.')
                                    } else {
                                      alert(data.error || 'Erro ao enviar')
                                    }
                                  }
                                } catch (err: any) {
                                  const msg = err?.message ?? String(err)
                                  alert(msg === 'list is not defined' ? 'Erro ao atualizar a tela. Atualize a página (F5) e tente de novo.' : msg || 'Erro ao enviar')
                                } finally {
                                  setSending(false)
                                }
                              }}
                              className="w-full text-left px-4 py-3 sm:py-2 min-h-[48px] sm:min-h-0 text-sm hover:bg-purple-50 active:bg-purple-100 text-gray-800 touch-manipulation flex items-center"
                              title={'title' in item ? (item as { title?: string }).title : undefined}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Botão para disparar remarketing diretamente */}
                  {selectedConversation && getTags(selectedConversation).includes('nao_participou_aula') && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!selectedConversation) return
                        if (!confirm('Enviar mensagem de remarketing para esta pessoa com novas opções de aula?')) return
                        
                        try {
                          setSending(true)
                          const res = await fetch('/api/admin/whatsapp/carol/processar-especificos', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              telefones: [selectedConversation.phone],
                              tipo: 'remarketing'
                            })
                          })
                          
                          const data = await res.json()
                          if (data.success) {
                            const result = data.results?.[0]
                            if (result?.success) {
                              alert(`✅ Remarketing enviado com sucesso para ${selectedConversation.name || 'esta pessoa'}!`)
                            } else {
                              alert(`⚠️ ${result?.error || 'Erro ao enviar remarketing'}`)
                            }
                            await loadMessages(selectedConversation.id)
                            await loadConversations()
                          } else {
                            alert(`❌ Erro: ${data.error || 'Erro ao enviar remarketing'}`)
                          }
                        } catch (err: any) {
                          alert(`❌ Erro: ${err.message || 'Erro ao enviar remarketing'}`)
                        } finally {
                          setSending(false)
                        }
                      }}
                      disabled={sending}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Enviar fluxo de remarketing (novas opções de aula)"
                    >
                      🔄 Remarketing
                    </button>
                  )}
                  {/* Botão para enviar como cliente e ativar Carol (tudo no servidor → evita RLS em z_api_instances) */}
                  {selectedConversation && getTags(selectedConversation).includes('carol_ativa') && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!selectedConversation || !newMessage.trim()) return
                        if (!confirm('Enviar esta mensagem como se fosse do cliente e deixar a Carol responder automaticamente?')) return
                        
                        const messageText = newMessage.trim()
                        try {
                          setSending(true)
                          setNewMessage('')
                          const res = await fetch('/api/admin/whatsapp/carol/simulate-message', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              conversationId: selectedConversation.id,
                              message: messageText,
                            }),
                          })
                          const data = await res.json()
                          if (data.success) {
                            await loadMessages(selectedConversation.id)
                            loadConversations()
                          } else {
                            alert(data.error || 'Erro ao simular mensagem e processar com Carol')
                          }
                        } catch (err: any) {
                          alert(err?.message || 'Erro ao enviar mensagem')
                        } finally {
                          setSending(false)
                        }
                      }}
                      disabled={!newMessage.trim() || sending || uploading}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Enviar como cliente e deixar Carol responder"
                    >
                      🤖 Carol
                    </button>
                  )}
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

      {/* Modal de Ativação Carol */}
      {carolModalOpen && selectedConversation && carolDiagnostic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl max-w-2xl w-full max-h-[90dvh] flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-2">🤖 Ativar Carol nesta Conversa</h2>
              <button
                type="button"
                onClick={() => {
                  setCarolModalOpen(false)
                  setCarolDiagnostic(null)
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 active:bg-gray-100 rounded-lg text-2xl touch-manipulation"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Diagnóstico */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Diagnóstico da Conversa</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de mensagens:</span>
                    <span className="font-medium">{carolDiagnostic.totalMessages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mensagens do cliente:</span>
                    <span className="font-medium">{carolDiagnostic.customerMessages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mensagens do agente:</span>
                    <span className="font-medium">{carolDiagnostic.agentMessages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quem começou:</span>
                    <span className="font-medium">
                      {carolDiagnostic.firstMessageFrom === 'customer' ? '👤 Cliente' :
                       carolDiagnostic.firstMessageFrom === 'agent' ? '👨‍💼 Agente' :
                       carolDiagnostic.firstMessageFrom === 'bot' ? '🤖 Bot' : '❓ Desconhecido'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última mensagem:</span>
                    <span className="font-medium">
                      {carolDiagnostic.lastMessageFrom === 'customer' ? '👤 Cliente' :
                       carolDiagnostic.lastMessageFrom === 'agent' ? '👨‍💼 Agente' :
                       carolDiagnostic.lastMessageFrom === 'bot' ? '🤖 Bot' : '❓ Desconhecido'}
                    </span>
                  </div>
                  {carolDiagnostic.hasWorkshopContext && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-green-600 font-medium">✅ Tem contexto de workshop</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Atuais */}
              {carolDiagnostic.currentTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">🏷️ Tags Atuais</h3>
                  <div className="flex flex-wrap gap-2">
                    {carolDiagnostic.currentTags.map((tag: string) => {
                      const tagInfo = getTagInfo(tag)
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${tagInfo.color}`}
                        >
                          {tagInfo.icon} {tagInfo.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tags Sugeridas */}
              {carolDiagnostic.suggestedTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">💡 Tags Sugeridas</h3>
                  <div className="flex flex-wrap gap-2">
                    {carolDiagnostic.suggestedTags.map((tag: string) => {
                      const tagInfo = getTagInfo(tag)
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${tagInfo.color}`}
                        >
                          {tagInfo.icon} {tagInfo.label}
                        </span>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Essas tags serão adicionadas automaticamente ao ativar Carol
                  </p>
                </div>
              )}

              {/* Status de Ativação */}
              {!carolDiagnostic.canActivateCarol && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">⚠️ Não é possível ativar Carol</p>
                  <p className="text-xs text-red-600 mt-1">{carolDiagnostic.reason}</p>
                </div>
              )}
              {carolDiagnostic.canActivateCarol && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">✅ Pronto para ativar Carol</p>
                  <p className="text-xs text-green-600 mt-1">
                    A Carol será ativada e começará a responder automaticamente nesta conversa
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setCarolModalOpen(false)
                  setCarolDiagnostic(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              {/* Forçar ativação: quando bloqueado só por "atendimento manual", permitir remover bloqueio */}
              {!carolDiagnostic.canActivateCarol && carolDiagnostic.reason === 'Conversa marcada para atendimento manual' && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!selectedConversation) return
                    if (!confirm('Remover a marca de atendimento manual e ativar a Carol nesta conversa?')) return
                    try {
                      setActivatingCarol(true)
                      const res = await fetch('/api/admin/whatsapp/activate-carol', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          conversationIds: [selectedConversation.id],
                          tags: carolDiagnostic.suggestedTags,
                          force: true,
                        }),
                      })
                      const data = await res.json()
                      if (data.success || data.message) {
                        alert('✅ Carol ativada com sucesso!')
                        setCarolModalOpen(false)
                        setCarolDiagnostic(null)
                        await loadConversations()
                        if (selectedConversation) await loadMessages(selectedConversation.id)
                      } else {
                        alert(data.error || 'Erro ao ativar Carol')
                      }
                    } catch (err: any) {
                      alert(err.message || 'Erro ao ativar Carol')
                    } finally {
                      setActivatingCarol(false)
                    }
                  }}
                  disabled={activatingCarol}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  {activatingCarol ? 'Ativando...' : '🔓 Remover bloqueio e ativar Carol'}
                </button>
              )}
              {carolDiagnostic.canActivateCarol && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!selectedConversation) return
                    try {
                      setActivatingCarol(true)
                      const res = await fetch('/api/admin/whatsapp/activate-carol', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          conversationIds: [selectedConversation.id],
                          tags: carolDiagnostic.suggestedTags,
                        }),
                      })
                      const data = await res.json()
                      if (data.success || data.message) {
                        alert('✅ Carol ativada com sucesso!')
                        setCarolModalOpen(false)
                        setCarolDiagnostic(null)
                        await loadConversations()
                        if (selectedConversation) {
                          await loadMessages(selectedConversation.id)
                        }
                      } else {
                        alert(data.error || 'Erro ao ativar Carol')
                      }
                    } catch (err: any) {
                      alert(err.message || 'Erro ao ativar Carol')
                    } finally {
                      setActivatingCarol(false)
                    }
                  }}
                  disabled={activatingCarol}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {activatingCarol ? 'Ativando...' : '✅ Ativar Carol'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Tags */}
      {tagsModalOpen && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">🏷️ Gerenciar Etiquetas (Tags)</h2>
              <button
                type="button"
                onClick={() => setTagsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-xs text-gray-500 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <strong>Dica:</strong> &quot;Boas-vindas enviadas&quot; (✉️) só indica que a 1ª mensagem já foi enviada. Para <em>pausar a Carol</em> nesta conversa, use a tag &quot;Manual (pausar Carol)&quot; na seção Extras.
              </p>
              {/* Tags Selecionadas */}
              {selectedTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags Selecionadas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => {
                      const tagInfo = getTagInfo(tag)
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${tagInfo.color} cursor-pointer hover:opacity-80`}
                          onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                        >
                          {tagInfo.icon} {tagInfo.label}
                          <span className="ml-1">×</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tags Pré-definidas por Fase */}
              <div className="space-y-6">
                {/* FASE 1: CAPTAÇÃO */}
                <div>
                  <h3 className="text-sm font-semibold text-blue-700 mb-3">📝 Fase 1: Captação</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'veio_aula_pratica', label: 'Aula Prática', icon: '📝' },
                      { tag: 'primeiro_contato', label: '1º Contato', icon: '👋' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 2: CONVITE */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-700 mb-3">📅 Fase 2: Convite</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'recebeu_link_workshop', label: 'Link Workshop', icon: '📅' },
                      { tag: 'recebeu_segundo_link', label: '2º Link', icon: '📅📅' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 3: PARTICIPAÇÃO */}
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-3">✅ Fase 3: Participação</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'participou_aula', label: 'Participou', icon: '✅' },
                      { tag: 'nao_participou_aula', label: 'Não Participou', icon: '❌' },
                      { tag: 'adiou_aula', label: 'Adiou', icon: '⏸️' },
                      { tag: 'fez_apresentacao', label: 'Fez Apresentação', icon: '🎤' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 4: REMARKETING */}
                <div>
                  <h3 className="text-sm font-semibold text-orange-700 mb-3">💡 Fase 4: Remarketing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'interessado', label: 'Interessado', icon: '💡' },
                      { tag: 'duvidas', label: 'Dúvidas', icon: '❓' },
                      { tag: 'analisando', label: 'Analisando', icon: '🤔' },
                      { tag: 'objeções', label: 'Objeções', icon: '🚫' },
                      { tag: 'negociando', label: 'Negociando', icon: '💰' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-orange-100 border-orange-500 text-orange-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 5: CONVERSÃO */}
                <div>
                  <h3 className="text-sm font-semibold text-green-800 mb-3">🎉 Fase 5: Conversão</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'cliente_nutri', label: 'Cliente Nutri', icon: '🎉' },
                      { tag: 'perdeu', label: 'Perdeu', icon: '😔' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-green-200 border-green-600 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-green-400'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EXTRAS */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">🔄 Extras</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'retorno', label: 'Retorno', icon: '🔄' },
                      { tag: 'urgencia', label: 'Urgência', icon: '⚡' },
                      { tag: 'atendimento_manual', label: 'Manual (pausar Carol)', icon: '🛑' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-cyan-100 border-cyan-500 text-cyan-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-cyan-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criar Nova Tag */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">➕ Criar Nova Tag</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTagInput.trim()) {
                        const newTag = newTagInput.trim().toLowerCase().replace(/\s+/g, '_')
                        if (!selectedTags.includes(newTag)) {
                          setSelectedTags([...selectedTags, newTag])
                        }
                        setNewTagInput('')
                      }
                    }}
                    placeholder="Digite o nome da tag (ex: tag_personalizada)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTagInput.trim()) {
                        const newTag = newTagInput.trim().toLowerCase().replace(/\s+/g, '_')
                        if (!selectedTags.includes(newTag)) {
                          setSelectedTags([...selectedTags, newTag])
                        }
                        setNewTagInput('')
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Adicionar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  A tag será criada automaticamente em minúsculas com underscores
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTagsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                    try {
                    await patchConversation(selectedConversation.id, { context: { tags: selectedTags } })
                    setTagsModalOpen(false)
                    // patchConversation já atualiza lista e conversa selecionada com a resposta da API
                  } catch (err: any) {
                    alert('Erro ao salvar tags: ' + (err?.message || 'Tente novamente.'))
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Salvar Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Sessão */}
      {sessionSelectModalOpen && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {sessionModalPurpose === 'link' ? '📅 Definir sessão e enviar link' : '📅 Escolher Sessão para Enviar'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSessionSelectModalOpen(false)
                  setAvailableSessions([])
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingSessions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Carregando sessões...</div>
                </div>
              ) : availableSessions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Não há sessões disponíveis.</p>
                  <p className="text-sm text-gray-500">
                    Crie uma sessão primeiro em{' '}
                    <Link href="/admin/whatsapp/workshop" className="text-purple-600 hover:underline">
                      /admin/whatsapp/workshop
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione a sessão que deseja enviar para <strong>{selectedConversation.name || 'esta pessoa'}</strong>:
                  </p>
                  {availableSessions.map((session) => {
                    const date = new Date(session.starts_at)
                    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
                    const dateStr = date.toLocaleDateString('pt-BR')
                    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    const isLinkMode = sessionModalPurpose === 'link'
                    
                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={async () => {
                          if (!selectedConversation) return
                          try {
                            setSending(true)
                            if (isLinkMode) {
                              // Definir sessão na conversa e enviar flyer + link
                              await patchConversation(selectedConversation.id, {
                                context: {
                                  ...(selectedConversation.context as any),
                                  workshop_session_id: session.id,
                                  scheduled_date: session.starts_at,
                                },
                              })
                              const res = await fetch(
                                `/api/whatsapp/conversations/${selectedConversation.id}/send-workshop-invite`,
                                { method: 'POST', credentials: 'include' }
                              )
                              let data: { error?: string } = {}
                              try {
                                const text = await res.text()
                                if (text.trim()) data = JSON.parse(text)
                              } catch (_) {
                                if (!res.ok) throw new Error(res.status === 500 ? 'Erro no servidor ao enviar link. Tente de novo.' : `Erro ${res.status}`)
                              }
                              if (!res.ok) throw new Error(data.error || 'Erro ao enviar link')
                              alert('✅ Sessão definida e link enviado!')
                            } else {
                              const res = await fetch('/api/admin/whatsapp/carol/enviar-opcao', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({
                                  conversationId: selectedConversation.id,
                                  sessionId: session.id,
                                }),
                              })
                              let data: { error?: string } = {}
                              try {
                                const text = await res.text()
                                if (text.trim()) data = JSON.parse(text)
                              } catch (_) {
                                if (!res.ok) throw new Error(res.status === 500 ? 'Erro no servidor. Tente de novo.' : `Erro ${res.status}`)
                              }
                              if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
                              alert('✅ Opção enviada! A Carol continuará o fluxo automaticamente.')
                            }
                            setSessionSelectModalOpen(false)
                            setAvailableSessions([])
                            await loadMessages(selectedConversation.id)
                            await loadConversations()
                          } catch (err: any) {
                            alert(err.message || (isLinkMode ? 'Erro ao enviar link' : 'Erro ao enviar opção'))
                          } finally {
                            setSending(false)
                          }
                        }}
                        disabled={sending}
                        className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {weekday.charAt(0).toUpperCase() + weekday.slice(1)}, {dateStr}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              🕒 {timeStr} (horário de Brasília)
                            </div>
                            {session.title && (
                              <div className="text-xs text-gray-500 mt-1">{session.title}</div>
                            )}
                          </div>
                          <div className="text-purple-600 font-medium">
                            {sending ? 'Enviando...' : isLinkMode ? 'Enviar link' : '→'}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSessionSelectModalOpen(false)
                  setAvailableSessions([])
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={sending}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Enviar mensagem de fase */}
      {messagePhaseModalOpen && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Enviar mensagem de fase</h2>
              <button
                type="button"
                onClick={() => {
                  setMessagePhaseModalOpen(false)
                  setMessagePhaseTipo(null)
                  setMessagePhasePreview('')
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Escolha a fase, gere o preview e confira antes de enviar. Nenhuma mensagem é enviada até você clicar em Enviar.
              </p>
              <div>
                <span className="text-sm font-medium text-gray-700">Fase:</span>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => { setMessagePhaseTipo('fechamento'); setMessagePhasePreview('') }}
                    className={`px-3 py-2 rounded-lg text-sm ${messagePhaseTipo === 'fechamento' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Fechamento (participou)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMessagePhaseTipo('remarketing'); setMessagePhasePreview('') }}
                    className={`px-3 py-2 rounded-lg text-sm ${messagePhaseTipo === 'remarketing' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Remarketing (não participou)
                  </button>
                </div>
              </div>
              {messagePhaseTipo && (
                <button
                  type="button"
                  onClick={async () => {
                    setMessagePhaseLoading(true)
                    try {
                      const res = await fetch('/api/admin/whatsapp/carol/message-phase', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          conversationId: selectedConversation.id,
                          tipo: messagePhaseTipo,
                          action: 'preview',
                        }),
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data.error || 'Erro ao gerar preview')
                      setMessagePhasePreview(data.message || '')
                    } catch (err: any) {
                      alert(err.message || 'Erro ao gerar preview')
                    } finally {
                      setMessagePhaseLoading(false)
                    }
                  }}
                  disabled={messagePhaseLoading}
                  className="px-3 py-2 rounded-lg text-sm bg-teal-100 text-teal-800 hover:bg-teal-200 disabled:opacity-50"
                >
                  {messagePhaseLoading ? 'Gerando...' : 'Gerar preview'}
                </button>
              )}
              {messagePhasePreview && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Preview da mensagem:</span>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto">
                    {messagePhasePreview}
                  </pre>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setMessagePhaseModalOpen(false)
                  setMessagePhaseTipo(null)
                  setMessagePhasePreview('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!messagePhasePreview) {
                    alert('Gere o preview antes de enviar.')
                    return
                  }
                  setMessagePhaseLoading(true)
                  try {
                    const res = await fetch('/api/admin/whatsapp/carol/message-phase', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        conversationId: selectedConversation.id,
                        tipo: messagePhaseTipo,
                        action: 'send',
                        message: messagePhasePreview,
                      }),
                    })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
                    alert('Mensagem enviada com sucesso.')
                    setMessagePhaseModalOpen(false)
                    setMessagePhaseTipo(null)
                    setMessagePhasePreview('')
                    await loadMessages(selectedConversation.id)
                    await loadConversations()
                  } catch (err: any) {
                    alert(err.message || 'Erro ao enviar')
                  } finally {
                    setMessagePhaseLoading(false)
                  }
                }}
                disabled={!messagePhasePreview || messagePhaseLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {messagePhaseLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WhatsAppChatPage
