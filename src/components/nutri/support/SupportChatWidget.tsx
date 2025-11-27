'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import SupportMenu from './SupportMenu'
import FAQResponse from './FAQResponse'

interface Message {
  id?: string
  sender_type: 'user' | 'bot' | 'agent' | 'system'
  message: string
  created_at?: string
  faq_id?: string
  video_url?: string
  pdf_url?: string
  thumbnail_url?: string
}

interface BotResponse {
  faq_id?: string
  resposta: string
  resposta_resumida?: string
  video_url?: string
  pdf_url?: string
  thumbnail_url?: string
  relevancia?: number
}

export default function SupportChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [menuOptions, setMenuOptions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mensagem inicial quando abre
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        sender_type: 'bot',
        message: 'Olá! Sou o assistente virtual da plataforma YLADA. Como posso ajudar você hoje?',
        created_at: new Date().toISOString()
      }])
      setShowMenu(true)
    }
  }, [isOpen])

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim()
    if (!message) return

    setLoading(true)
    setInputMessage('')

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      sender_type: 'user',
      message,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setShowMenu(false)

    try {
      const response = await fetch('/api/nutri/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message,
          ticket_id: ticketId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem')
      }

      if (data.bot_response) {
        // Bot encontrou resposta
        const botMessage: Message = {
          sender_type: 'bot',
          message: data.bot_response.resposta,
          faq_id: data.bot_response.faq_id,
          video_url: data.bot_response.video_url,
          pdf_url: data.bot_response.pdf_url,
          thumbnail_url: data.bot_response.thumbnail_url,
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, botMessage])
        setMenuOptions(data.menu_options || [])
      } else if (data.ticket_created) {
        // Ticket criado
        setTicketId(data.ticket_id)
        const botMessage: Message = {
          sender_type: 'bot',
          message: data.message || 'Não encontrei uma resposta específica. Um atendente entrará em contato em breve.',
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, botMessage])
        setMenuOptions(data.menu_options || [])
      } else {
        // Resposta simples
        const botMessage: Message = {
          sender_type: 'bot',
          message: data.message || 'Mensagem recebida.',
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: Message = {
        sender_type: 'system',
        message: 'Erro ao enviar mensagem. Tente novamente.',
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleMenuSelect = (option: string) => {
    if (option.includes('Falar com atendente')) {
      createTicket('Preciso falar com um atendente humano')
    } else if (option.includes('resolvido')) {
      // Marcar como resolvido
      setMenuOptions([])
      setMessages(prev => [...prev, {
        sender_type: 'bot',
        message: 'Ótimo! Fico feliz em ter ajudado. Se precisar de mais alguma coisa, estou aqui! 😊',
        created_at: new Date().toISOString()
      }])
    } else if (option.includes('não resolveu')) {
      createTicket('A resposta do bot não resolveu minha dúvida')
    } else {
      sendMessage(option)
    }
  }

  const createTicket = async (assunto: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/nutri/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          assunto,
          categoria: 'outras',
          primeira_mensagem: assunto
        })
      })

      const data = await response.json()
      if (data.success && data.ticket) {
        setTicketId(data.ticket.id)
        setMessages(prev => [...prev, {
          sender_type: 'system',
          message: 'Ticket criado! Um atendente entrará em contato em breve.',
          created_at: new Date().toISOString()
        }])
      }
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg z-50 transition-all"
        aria-label="Abrir chat de suporte"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="font-semibold">Suporte YLADA</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-purple-700 rounded p-1"
            aria-label={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
          <button
            onClick={() => {
              setIsOpen(false)
              setIsMinimized(false)
              setShowMenu(false)
            }}
            className="hover:bg-purple-700 rounded p-1"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {showMenu && (
              <SupportMenu onSelect={handleMenuSelect} />
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender_type === 'user'
                      ? 'bg-purple-600 text-white'
                      : msg.sender_type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 text-sm'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {msg.sender_type === 'bot' && msg.faq_id ? (
                    <FAQResponse
                      resposta={msg.message}
                      video_url={msg.video_url}
                      pdf_url={msg.pdf_url}
                      thumbnail_url={msg.thumbnail_url}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  )}
                  {msg.created_at && (
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Menu Options */}
          {menuOptions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2">
                {menuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuSelect(option)}
                    className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

