'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id?: string
  sender_type: 'user' | 'lya' | 'system'
  message: string
  created_at?: string
}

export default function LyaChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Listener para evento customizado de abrir chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }
    
    window.addEventListener('open-lya-chat', handleOpenChat)
    return () => {
      window.removeEventListener('open-lya-chat', handleOpenChat)
    }
  }, [])

  // Mensagem inicial quando abre
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        sender_type: 'lya',
        message: 'Olá! Sou a LYA, sua mentora empresarial. Estou aqui para te ajudar com organização, posicionamento e crescimento do seu negócio nutricional.\n\nComo posso te ajudar hoje?',
        created_at: new Date().toISOString()
      }])
    }
  }, [isOpen])

  // Sugestões rápidas
  const sugestoesRapidas = [
    { emoji: '💡', texto: 'Preciso de orientação', comando: 'Preciso de orientação sobre como organizar meu negócio' },
    { emoji: '🆘', texto: 'Falar com suporte', comando: 'Preciso falar com suporte técnico' },
    { emoji: '📚', texto: 'Ver minha jornada', comando: 'Onde estou na minha jornada? O que preciso fazer hoje?' },
  ]

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

    try {
      const response = await fetch('/api/nutri/lya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message,
          threadId: threadId || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Se for erro de configuração, mostrar mensagem mais amigável
        if (data.error?.includes('não configurado') || data.error?.includes('não está configurado')) {
          throw new Error('A LYA ainda não está configurada. Entre em contato com o suporte para ativar.')
        }
        throw new Error(data.error || data.message || data.details || 'Erro ao enviar mensagem')
      }

      // Atualizar threadId se retornado
      if (data.threadId) {
        setThreadId(data.threadId)
      }

      // Adicionar resposta da LYA
      const lyaMessage: Message = {
        sender_type: 'lya',
        message: data.response || 'Desculpe, não consegui processar sua mensagem.',
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, lyaMessage])
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: Message = {
        sender_type: 'system',
        message: error.message || 'Erro ao enviar mensagem. Tente novamente.',
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
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

  // Formatar mensagem com markdown para deixar números e títulos mais escuros
  const formatarMensagemLYA = (texto: string) => {
    const linhas = texto.split('\n')
    
    return linhas.map((linha, index) => {
      // Se linha está vazia, retornar espaço
      if (linha.trim() === '') {
        return <br key={index} />
      }
      
      // Detectar listas numeradas (ex: "1. **Texto**" ou "1. Texto")
      const matchLista = linha.match(/^(\d+)\.\s+(.+)$/)
      if (matchLista) {
        const numero = matchLista[1]
        const conteudo = matchLista[2]
        
        // Verificar se tem negrito no conteúdo
        if (conteudo.includes('**')) {
          const partes = conteudo.split(/(\*\*[^*]+\*\*)/g)
          return (
            <p key={index} className="mb-2">
              <span className="font-bold text-gray-900" style={{ fontWeight: 700 }}>{numero}.</span>{' '}
              {partes.map((parte, i) => {
                if (parte.startsWith('**') && parte.endsWith('**')) {
                  return (
                    <span key={i} className="font-bold text-gray-900" style={{ fontWeight: 700 }}>
                      {parte.replace(/\*\*/g, '')}
                    </span>
                  )
                }
                return <span key={i}>{parte}</span>
              })}
            </p>
          )
        }
        
        // Lista numerada sem negrito
        return (
          <p key={index} className="mb-2">
            <span className="font-bold text-gray-900" style={{ fontWeight: 700 }}>{numero}.</span>{' '}
            <span className="text-gray-900">{conteudo}</span>
          </p>
        )
      }
      
      // Detectar texto em negrito simples
      if (linha.includes('**')) {
        const partes = linha.split(/(\*\*[^*]+\*\*)/g)
        return (
          <p key={index} className="mb-2">
            {partes.map((parte, i) => {
              if (parte.startsWith('**') && parte.endsWith('**')) {
                return (
                  <span key={i} className="font-bold text-gray-900" style={{ fontWeight: 700 }}>
                    {parte.replace(/\*\*/g, '')}
                  </span>
                )
              }
              return <span key={i} className="text-gray-900">{parte}</span>
            })}
          </p>
        )
      }
      
      // Linha normal
      return (
        <p key={index} className="mb-2 text-gray-900">
          {linha}
        </p>
      )
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 transition-all group flex items-center gap-2 px-4 py-3"
        aria-label="Abrir chat com Mentora LYA"
        title="Falar com a Mentora LYA"
        data-lya-widget="true"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="hidden sm:block font-semibold text-sm whitespace-nowrap">Mentora LYA</span>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="font-semibold">LYA - Mentora Empresarial</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-700 rounded p-1"
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
              setMessages([])
              setThreadId(null)
            }}
            className="hover:bg-blue-700 rounded p-1"
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
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender_type === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.sender_type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 text-sm'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
                    {formatarMensagemLYA(msg.message)}
                  </div>
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

          {/* Sugestões Rápidas */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2 font-medium">💡 Sugestões rápidas:</p>
              <div className="space-y-2">
                {sugestoesRapidas.map((sugestao, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(sugestao.comando)}
                    disabled={loading}
                    className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="mr-2">{sugestao.emoji}</span>
                    <span className="text-gray-700">{sugestao.texto}</span>
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 LYA é mentora de negócios. Análises clínicas são sua responsabilidade.
            </div>
          </div>
        </>
      )}
    </div>
  )
}
