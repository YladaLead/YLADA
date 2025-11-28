'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

interface Message {
  id: string
  sender_type: 'user' | 'agent' | 'bot' | 'system'
  sender_name: string
  message: string
  created_at: string
}

interface Ticket {
  id: string
  assunto: string
  status: string
  prioridade: string
  categoria?: string
  user_name: string
  agent_name?: string
  created_at: string
  messages: Message[]
}

export default function TicketDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const ticketId = params?.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isAgent, setIsAgent] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/pt/nutri/dashboard')
      return
    }

    if (user && ticketId) {
      loadTicket()
      checkIfAgent()
      // Polling para novas mensagens a cada 3 segundos
      const interval = setInterval(() => {
        loadMessages()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [user, authLoading, ticketId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkIfAgent = async () => {
    try {
      const response = await fetch('/api/nutri/support/agents', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.agents && data.agents.length > 0) {
          setIsAgent(true)
        }
      }
    } catch (err) {
      console.error('Erro ao verificar se é atendente:', err)
    }
  }

  const loadTicket = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/nutri/support/tickets/${ticketId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar ticket')
      }

      const data = await response.json()
      if (data.success) {
        setTicket(data.ticket)
        setMessages(data.ticket.messages || [])
      } else {
        throw new Error(data.error || 'Erro ao carregar ticket')
      }
    } catch (err: any) {
      console.error('Erro ao carregar ticket:', err)
      setError(err.message || 'Erro ao carregar ticket')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/nutri/support/messages?ticket_id=${ticketId}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMessages(data.messages || [])
        }
      }
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err)
    }
  }

  const sendMessage = async () => {
    if (!messageInput.trim() || sending) return

    try {
      setSending(true)
      setError(null)

      const response = await fetch('/api/nutri/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ticket_id: ticketId,
          message: messageInput.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao enviar mensagem')
      }

      const data = await response.json()
      if (data.success) {
        setMessageInput('')
        // Recarregar mensagens
        await loadMessages()
        await loadTicket()
      }
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err)
      setError(err.message || 'Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  const updateTicketStatus = async (newStatus: string) => {
    try {
      const response = await fetch('/api/nutri/support/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: ticketId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        await loadTicket()
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
    }
  }

  const acceptTicket = async () => {
    try {
      const response = await fetch('/api/nutri/support/agents/accept-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ticket_id: ticketId,
        }),
      })

      if (response.ok) {
        await loadTicket()
        setIsAgent(true)
      }
    } catch (err) {
      console.error('Erro ao aceitar ticket:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error && !ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error}</p>
            <Link
              href="/pt/nutri/suporte/tickets"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Voltar para lista de tickets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/images/logo/nutri-horizontal.png"
                  alt="Nutri by YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Ticket: {ticket.assunto || 'Sem assunto'}
                </h1>
                <p className="text-sm text-gray-600">
                  {ticket.user_name} • {formatDate(ticket.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/pt/nutri/suporte/tickets"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info do Ticket */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                ticket.status === 'aguardando' ? 'bg-yellow-100 text-yellow-800' :
                ticket.status === 'em_atendimento' ? 'bg-blue-100 text-blue-800' :
                ticket.status === 'resolvido' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {ticket.status === 'aguardando' ? 'Aguardando' :
                 ticket.status === 'em_atendimento' ? 'Em Atendimento' :
                 ticket.status === 'resolvido' ? 'Resolvido' : 'Fechado'}
              </span>
              <span className="text-sm text-gray-600">
                Prioridade: {ticket.prioridade}
              </span>
              {ticket.categoria && (
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {ticket.categoria}
                </span>
              )}
            </div>
            {isAgent && ticket.status === 'aguardando' && !ticket.agent_name && (
              <button
                onClick={acceptTicket}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✅ Aceitar Ticket
              </button>
            )}
            {isAgent && ticket.status !== 'resolvido' && ticket.status !== 'fechado' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTicketStatus('resolvido')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  ✅ Marcar como Resolvido
                </button>
                <button
                  onClick={() => updateTicketStatus('fechado')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  🔒 Fechar Ticket
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Chat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Conversa</h2>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender_type === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.sender_type === 'agent'
                      ? 'bg-green-600 text-white'
                      : msg.sender_type === 'bot'
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-xs font-medium mb-1 opacity-80">
                    {msg.sender_name}
                    {msg.sender_type === 'agent' && ' 👨‍💼'}
                    {msg.sender_type === 'bot' && ' 🤖'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.message}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {formatDate(msg.created_at)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={2}
                disabled={sending || ticket.status === 'fechado'}
              />
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim() || sending || ticket.status === 'fechado'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
            {ticket.status === 'fechado' && (
              <p className="text-sm text-gray-500 mt-2">
                Este ticket está fechado e não aceita novas mensagens.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

