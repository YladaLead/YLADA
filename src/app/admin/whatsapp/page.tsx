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
  instance_id?: string | null // UUID da tabela z_api_instances
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
  const [tagsModalOpen, setTagsModalOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState('')
  const [carolModalOpen, setCarolModalOpen] = useState(false)
  const [carolDiagnostic, setCarolDiagnostic] = useState<any>(null)
  const [activatingCarol, setActivatingCarol] = useState(false)
  const [sessionSelectModalOpen, setSessionSelectModalOpen] = useState(false)
  const [availableSessions, setAvailableSessions] = useState<any[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [contactMenuOpen, setContactMenuOpen] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const userClearedSelectionRef = useRef(false) // Flag para indicar que o usuário explicitamente limpou a seleção
  const hasInitializedFromUrlRef = useRef(false) // Flag para indicar se já inicializou a partir da URL

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

  // Carregar conversas
  useEffect(() => {
    loadConversations()
    // Atualizar a cada 5 segundos
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [areaFilter, listTab, searchTerm])

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
      
      // Agrupamento adicional no frontend (fallback caso API não agrupe corretamente)
      // IMPORTANTE: Preservar códigos de país para suportar outros países
      const phoneMap = new Map<string, Conversation>()
      conversationsList.forEach((conv: Conversation) => {
        // Normalizar telefone preservando código do país
        let phoneKey = (conv.phone || '').replace(/\D/g, '')
        
        // Para números brasileiros: agrupar variantes com/sem código 55
        if (phoneKey.startsWith('55') && phoneKey.length >= 13) {
          const withoutCountry = phoneKey.substring(2)
          phoneKey = `BR_${withoutCountry}`
        } else if (phoneKey.length >= 10 && phoneKey.length <= 11 && !phoneKey.match(/^[1-9]/)) {
          if (phoneKey.startsWith('0')) {
            phoneKey = phoneKey.substring(1)
          }
          phoneKey = `BR_${phoneKey}`
        } else if (phoneKey.length < 10) {
          phoneKey = `id_${conv.id}`
        }
        // Para outros países, manter código do país (não agrupar)
        
        if (!phoneMap.has(phoneKey)) {
          phoneMap.set(phoneKey, conv)
        } else {
          const existing = phoneMap.get(phoneKey)!
          const existingDate = existing.last_message_at 
            ? new Date(existing.last_message_at).getTime() 
            : (existing.created_at ? new Date(existing.created_at).getTime() : 0)
          const currentDate = conv.last_message_at 
            ? new Date(conv.last_message_at).getTime() 
            : (conv.created_at ? new Date(conv.created_at).getTime() : 0)
          
          if (currentDate > existingDate) {
            phoneMap.set(phoneKey, conv)
          }
        }
      })
      
      conversationsList = Array.from(phoneMap.values())
      console.log('✅ Conversas carregadas e agrupadas:', {
        antes: data.conversations?.length || 0,
        depois: conversationsList.length
      })
      setConversations(conversationsList)

      // Manter conversa selecionada (evita "voltar" para outra conversa)
      // IMPORTANTE: usar update funcional para evitar closures antigas do setInterval
      setSelectedConversation((prev) => {
        const list: Conversation[] = conversationsList || []
        if (list.length === 0) return null
        
        // Se o usuário explicitamente limpou a seleção (clicou em "← Conversas"),
        // não selecionar automaticamente nenhuma conversa
        if (userClearedSelectionRef.current) {
          return null
        }
        
        if (!prev) {
          // Apenas selecionar automaticamente na primeira carga (quando não há flag de limpeza)
          return list[0]
        }
        
        // Buscar conversa selecionada na lista atualizada
        const stillExists = list.find((c) => c.id === prev.id)
        
        if (stillExists) {
          // Conversa ainda existe na lista - manter selecionada
          return stillExists
        } else {
          // Conversa não existe mais na lista (foi removida/arquivada)
          // NÃO voltar para list[0] automaticamente - manter prev para não mudar de conversa
          // Isso evita que o sistema "pule" para outra conversa quando você está lendo uma
          console.log('[WhatsApp Admin] ⚠️ Conversa selecionada não encontrada na lista atualizada, mantendo seleção:', prev.id)
          return prev
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

      const response = await fetch(`/api/whatsapp/conversations/${conversationId}/messages`, {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`⚠️ Conversa ${conversationId} não encontrada`)
          return // Não mostrar erro para conversas que podem ter sido deletadas
        }
        throw new Error(`Erro ao carregar mensagens: ${response.status}`)
      }

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
    if (!phone) return 'Sem telefone'
    
    // Remover caracteres não numéricos e espaços
    let clean = phone.replace(/\D/g, '')
    
    // Se contém @, é ID do WhatsApp - extrair apenas o número
    if (phone.includes('@')) {
      const match = phone.match(/(\d{10,15})/)
      if (match) {
        clean = match[1]
      } else {
        // Se não conseguir extrair, retornar como está
        return phone
      }
    }
    
    // Validar se é um telefone válido (10-15 dígitos)
    if (clean.length < 10 || clean.length > 15) {
      // Número inválido - pode ser ID ou outro formato
      console.warn('[formatPhone] Número inválido:', { original: phone, clean, length: clean.length })
      return phone.length > 25 ? phone.substring(0, 25) + '...' : phone
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
    }
    
    // Se não conseguir formatar, retornar limpo
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
    const ctx = (conv.context || {}) as any
    const override = typeof ctx.display_name === 'string' ? ctx.display_name.trim() : ''
    
    // Se tem override e não é "Ylada Nutri" (nome padrão), usar
    if (override && override.toLowerCase() !== 'ylada nutri' && override.toLowerCase() !== 'ylada') {
      return override
    }
    
    // Se tem nome real e não é "Ylada Nutri", usar
    if (conv.name && conv.name.trim() && conv.name.toLowerCase() !== 'ylada nutri' && conv.name.toLowerCase() !== 'ylada') {
      return conv.name.trim()
    }
    
    // Senão, usar telefone formatado (como WhatsApp Web faz)
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
      
      // Tags antigas (compatibilidade)
      'form_lead': { label: 'Form', color: 'bg-blue-100 text-blue-700', icon: '📝' },
      'workshop_invited': { label: 'Workshop', color: 'bg-purple-100 text-purple-700', icon: '📅' },
    }
    
    return tagMap[tag] || { label: tag, color: 'bg-gray-100 text-gray-600', icon: '🏷️' }
  }

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
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Mobile-First */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
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
            <Link
              href="/admin/whatsapp/workshop"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-3"
              title="Agenda do Workshop"
              aria-label="Agenda do Workshop"
            >
              📅
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
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conv.name && conv.name.trim() && conv.name.toLowerCase() !== 'ylada nutri' 
                            ? conv.name 
                            : formatPhone(conv.phone)}
                        </h3>
                        {pinned && <span className="text-xs text-gray-400">📌</span>}
                        {fav && <span className="text-xs text-yellow-500">★</span>}
                      </div>
                      <div className="text-xs text-gray-400 ml-2 shrink-0">
                        {timeSource ? formatTime(timeSource) : ''}
                      </div>
                    </div>
                    {/* Mostrar preview ou telefone formatado */}
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="min-w-0 flex-1">
                        {preview ? (
                          <p className="text-sm text-gray-600 truncate">{preview}</p>
                        ) : (
                          <p className="text-sm text-gray-500 truncate">
                            {conv.name && conv.name.trim() && conv.name.toLowerCase() !== 'ylada nutri'
                              ? formatPhone(conv.phone)
                              : 'Sem mensagens'}
                          </p>
                        )}
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
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
                        {/* Exibir tags */}
                        {getTags(conv).map((tag) => {
                          const tagInfo = getTagInfo(tag)
                          return (
                            <span
                              key={tag}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${tagInfo.color}`}
                              title={tag}
                            >
                              {tagInfo.icon} {tagInfo.label}
                            </span>
                          )
                        })}
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
              {/* Header da Conversa - Fixo */}
              <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
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
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        {/* Tags */}
                        {getTags(selectedConversation).map((tag) => {
                          const tagInfo = getTagInfo(tag)
                          return (
                            <span
                              key={tag}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${tagInfo.color}`}
                              title={tag}
                            >
                              {tagInfo.icon} {tagInfo.label}
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
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botão Desativar Carol (visível quando ativa) */}
                    {selectedConversation && getTags(selectedConversation).includes('carol_ativa') && (
                      <>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!selectedConversation) return
                            
                            // Buscar sessões disponíveis
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
                          className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                          title="Enviar opção de sessão e deixar Carol continuar"
                        >
                          📅 Enviar Opção
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
                          className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Desativar Carol - Ela não responderá mais automaticamente"
                        >
                          🚫 Desativar Carol
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `/api/whatsapp/conversations/${selectedConversation.id}/send-workshop-invite`,
                            { method: 'POST', credentials: 'include' }
                          )
                          const json = await res.json().catch(() => ({}))
                          if (!res.ok) throw new Error(json.error || 'Erro ao enviar convite')
                          setTimeout(() => {
                            loadMessages(selectedConversation.id)
                            loadConversations()
                          }, 200)
                        } catch (err: any) {
                          alert(err.message || 'Erro ao enviar convite')
                        }
                      }}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700"
                      title="Enviar flyer + detalhes da próxima aula"
                      aria-label="Enviar flyer + detalhes da próxima aula"
                    >
                      📩
                    </button>
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
                              const current = ((selectedConversation.context as any)?.tags || [])
                              setSelectedTags([...current])
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
                    className="sticky bottom-4 ml-auto mr-0 h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50"
                    title="Voltar ao fim"
                    aria-label="Voltar ao fim"
                  >
                    ⬇️
                  </button>
                )}
              </div>

              {/* Input de Mensagem - Fixo no rodapé */}
              <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
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
                  {/* Botão para enviar como cliente e ativar Carol */}
                  {selectedConversation && getTags(selectedConversation).includes('carol_ativa') && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!selectedConversation || !newMessage.trim()) return
                        if (!confirm('Enviar esta mensagem como se fosse do cliente e deixar a Carol responder automaticamente?')) return
                        
                        const messageText = newMessage.trim() // Salvar antes de limpar
                        
                        try {
                          setSending(true)
                          
                          // 1. Salvar mensagem como se fosse do cliente
                          // Buscar instância: instance_id na conversa é o UUID da tabela z_api_instances
                          let instanceId: string | null = null
                          
                          if (selectedConversation.instance_id) {
                            // Tentar buscar pelo ID da instância da conversa
                            const { data: instance } = await supabase
                              .from('z_api_instances')
                              .select('id')
                              .eq('id', selectedConversation.instance_id)
                              .single()
                            
                            if (instance) {
                              instanceId = instance.id
                            }
                          }
                          
                          // Fallback: buscar pela área se não encontrou pelo ID
                          if (!instanceId) {
                            const { data: instanceByArea } = await supabase
                              .from('z_api_instances')
                              .select('id')
                              .eq('area', selectedConversation.area || 'nutri')
                              .eq('status', 'connected')
                              .limit(1)
                              .single()
                            
                            if (!instanceByArea) {
                              throw new Error('Instância não encontrada. Verifique se há uma instância Z-API conectada para a área ' + (selectedConversation.area || 'nutri'))
                            }
                            
                            instanceId = instanceByArea.id
                          }
                          
                          // Salvar mensagem do cliente no banco
                          await supabase.from('whatsapp_messages').insert({
                            conversation_id: selectedConversation.id,
                            instance_id: instanceId,
                            sender_type: 'customer',
                            sender_name: selectedConversation.name || 'Cliente',
                            message: messageText,
                            message_type: 'text',
                            status: 'delivered',
                            is_bot_response: false,
                          })
                          
                          // Atualizar última mensagem da conversa
                          await supabase
                            .from('whatsapp_conversations')
                            .update({
                              last_message_at: new Date().toISOString(),
                              last_message_from: 'customer',
                            })
                            .eq('id', selectedConversation.id)
                          
                          // 2. Limpar campo de mensagem
                          setNewMessage('')
                          
                          // 3. Recarregar mensagens
                          await loadMessages(selectedConversation.id)
                          
                          // 4. Aguardar um pouco e processar com Carol
                          setTimeout(async () => {
                            try {
                              const carolResult = await fetch('/api/admin/whatsapp/test-carol', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({
                                  conversationId: selectedConversation.id,
                                  message: messageText, // Usar o valor salvo
                                }),
                              })
                              
                              const data = await carolResult.json()
                              
                              if (data.success && data.response) {
                                // Recarregar mensagens para ver a resposta da Carol
                                await loadMessages(selectedConversation.id)
                                await loadConversations()
                              } else {
                                console.error('Carol não respondeu:', data.error)
                              }
                            } catch (err: any) {
                              console.error('Erro ao processar com Carol:', err)
                            }
                          }, 1000)
                          
                        } catch (err: any) {
                          alert(err.message || 'Erro ao enviar mensagem')
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">🤖 Ativar Carol nesta Conversa</h2>
              <button
                type="button"
                onClick={() => {
                  setCarolModalOpen(false)
                  setCarolDiagnostic(null)
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
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
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
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
                    loadConversations() // Atualizar lista
                  } catch (err: any) {
                    alert(err.message || 'Erro ao salvar tags')
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
              <h2 className="text-xl font-bold text-gray-900">📅 Escolher Sessão para Enviar</h2>
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
                    
                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={async () => {
                          try {
                            setSending(true)
                            const res = await fetch('/api/admin/whatsapp/carol/enviar-opcao', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                conversationId: selectedConversation.id,
                                sessionId: session.id,
                              }),
                            })
                            
                            const data = await res.json()
                            if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
                            
                            alert('✅ Opção enviada! A Carol continuará o fluxo automaticamente.')
                            setSessionSelectModalOpen(false)
                            setAvailableSessions([])
                            await loadMessages(selectedConversation.id)
                            await loadConversations()
                          } catch (err: any) {
                            alert(err.message || 'Erro ao enviar opção')
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
                            {sending ? 'Enviando...' : '→'}
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
    </div>
  )
}

export default WhatsAppChatPage
