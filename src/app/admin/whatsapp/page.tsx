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
  z_api_instances: {
    name: string
    area: string
  } | null
}

interface Message {
  id: string
  sender_type: 'customer' | 'agent' | 'bot'
  sender_name: string | null
  message: string
  message_type: string
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
  const [areaFilter, setAreaFilter] = useState<string>('nutri') // Apenas Nutri por padrão
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar conversas
  useEffect(() => {
    loadConversations()
    // Atualizar a cada 5 segundos
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [areaFilter])

  // Carregar mensagens quando selecionar conversa
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      // Atualizar mensagens a cada 3 segundos
      const interval = setInterval(() => loadMessages(selectedConversation.id), 3000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      const url = `/api/whatsapp/conversations?status=active${
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
      const response = await fetch(`/api/whatsapp/conversations/${conversationId}/messages`, {
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Erro ao carregar mensagens')

      const data = await response.json()
      setMessages(data.messages || [])
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

  const unreadTotal = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

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
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
              Carregando conversas...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conversa ainda</h3>
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
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left ${
                  selectedConversation?.id === conv.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.name || formatPhone(conv.phone)}
                      </h3>
                      {conv.unread_count > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {formatPhone(conv.phone)}
                    </p>
                    {conv.area && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {conv.area}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 ml-2">
                    {formatTime(conv.last_message_at)}
                  </div>
                </div>
              </button>
            ))
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
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">
                      {selectedConversation.name || formatPhone(selectedConversation.phone)}
                    </h2>
                    <p className="text-sm text-gray-500 truncate">{formatPhone(selectedConversation.phone)}</p>
                    {selectedConversation.area && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {selectedConversation.area}
                      </span>
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

              {/* Mensagens */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#efeae2]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${
                      msg.sender_type === 'customer' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                        msg.sender_type === 'customer'
                          ? 'bg-white'
                          : 'bg-[#dcf8c6] text-gray-900'
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          msg.sender_type === 'customer' ? 'text-gray-900' : 'text-gray-900'
                        }`}
                      >
                        {msg.message}
                      </p>
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender_type === 'customer' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de Mensagem */}
              <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex gap-2 items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={() => {
                      // UI pronto para anexos; envio via Z-API será implementado depois
                      if (fileInputRef.current?.files?.length) {
                        alert('Anexos: em breve (UI já pronta).')
                        fileInputRef.current.value = ''
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    aria-label="Anexar arquivo"
                    title="Anexar"
                  >
                    📎
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
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
