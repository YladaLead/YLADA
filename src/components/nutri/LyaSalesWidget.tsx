'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/**
 * Formata mensagem com markdown simples e links
 */
function formatarMensagem(texto: string) {
  const partes: (string | JSX.Element)[] = []
  let keyCounter = 0

  // Processar markdown links [texto](url)
  const markdownLinks: Array<{ text: string; url: string }> = []
  let processedText = texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const placeholder = `__MD_LINK_${markdownLinks.length}__`
    markdownLinks.push({ text, url })
    return placeholder
  })

  // Processar URLs diretas (http:// ou https://)
  const urlLinks: Array<{ text: string; url: string }> = []
  processedText = processedText.replace(/(https?:\/\/[^\s]+)/g, (match, url) => {
    const placeholder = `__URL_LINK_${urlLinks.length}__`
    urlLinks.push({ text: url, url })
    return placeholder
  })

  // Dividir por placeholders e processar negrito
  const segments = processedText.split(/(__MD_LINK_\d+__|__URL_LINK_\d+__)/)

  segments.forEach((segment) => {
    if (segment.startsWith('__MD_LINK_')) {
      const index = parseInt(segment.match(/\d+/)![0])
      const link = markdownLinks[index]
      const isAbsoluteUrl = link.url.startsWith('http')
      const isCheckout = link.url.includes('/checkout')
      
      partes.push(
        <Link
          key={`link-md-${keyCounter++}`}
          href={link.url}
          className="text-blue-600 hover:text-blue-800 underline font-semibold"
          target={isAbsoluteUrl ? '_blank' : undefined}
          rel={isAbsoluteUrl ? 'noopener noreferrer' : undefined}
        >
          {link.text}
        </Link>
      )
    } else if (segment.startsWith('__URL_LINK_')) {
      const index = parseInt(segment.match(/\d+/)![0])
      const link = urlLinks[index]
      partes.push(
        <a
          key={`link-url-${keyCounter++}`}
          href={link.url}
          className="text-blue-600 hover:text-blue-800 underline font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.text}
        </a>
      )
    } else if (segment) {
      // Processar negrito **texto**
      const boldParts = segment.split(/(\*\*[^*]+\*\*)/g)
      boldParts.forEach((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          partes.push(
            <strong key={`bold-${keyCounter++}`} className="font-bold">
              {part.replace(/\*\*/g, '')}
            </strong>
          )
        } else if (part) {
          partes.push(part)
        }
      })
    }
  })

  return partes.length > 0 ? partes : texto
}

interface Message {
  id?: string
  sender_type: 'user' | 'lya' | 'system'
  message: string
  created_at?: string
}

interface LyaSalesWidgetProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideButton?: boolean
}

export default function LyaSalesWidget({ 
  isOpen: externalIsOpen, 
  onOpenChange,
  hideButton = false 
}: LyaSalesWidgetProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = (value: boolean) => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(value)
    } else {
      onOpenChange?.(value)
    }
  }
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

  // Mensagem inicial quando abre (foco em vendas)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        sender_type: 'lya',
        message: 'Olá! Sou a **LYA**, mentora empresarial da YLADA Nutri. 😊\n\nMuitas nutricionistas me procuram porque enfrentam:\n\n• **Agenda vazia** - Dependem só de indicação e não conseguem gerar clientes de forma previsível\n• **Rotina desorganizada** - Atendem bem, mas vivem apagando incêndio e não conseguem planejar\n• **Falta de visão empreendedora** - Insegurança para cobrar, dificuldade para se posicionar como empresária\n\n**Hoje, o que mais pesa pra você na sua rotina como nutricionista?**\n\nIsso vai me ajudar a mostrar como a plataforma resolve exatamente essa dificuldade. 💪',
        created_at: new Date().toISOString()
      }])
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

    try {
      const response = await fetch('/api/nutri/lya/sales', {
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
        // Verificar se é erro de configuração
        if (data.error?.includes('não configurado') || data.message?.includes('não configurado')) {
          const errorMessage: Message = {
            sender_type: 'system',
            message: 'Desculpe, o chat ainda está sendo configurado. Por favor, entre em contato conosco via WhatsApp usando o botão abaixo. 😊',
            created_at: new Date().toISOString()
          }
          setMessages(prev => [...prev, errorMessage])
          return
        }
        throw new Error(data.error || 'Erro ao enviar mensagem')
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
        message: 'Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp usando o botão abaixo.',
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

  // Botões de ação rápida (para vendas)
  const quickActions = [
    'Falta de pacientes / agenda vazia',
    'Falta de organização e rotina',
    'Quanto custa?',
    'Tenho dúvidas sobre a Formação'
  ]

  if (!isOpen) {
    if (hideButton) {
      return null
    }
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[#0B57FF] to-[#2572FF] hover:from-[#2572FF] hover:to-[#0B57FF] text-white rounded-full p-4 shadow-2xl z-50 transition-all animate-pulse"
        aria-label="Falar com LYA sobre a plataforma"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">●</span>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all ${isMinimized ? 'h-16' : 'h-[600px]'}`} style={{ zIndex: 50, pointerEvents: 'auto' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B57FF] to-[#2572FF] text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold">LYA - Tire suas dúvidas</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-800 rounded p-1"
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
            className="hover:bg-blue-800 rounded p-1"
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
            {messages.length === 1 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-600 font-semibold">Perguntas frequentes:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action)}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender_type === 'user'
                      ? 'bg-gradient-to-r from-[#0B57FF] to-[#2572FF] text-white'
                      : msg.sender_type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 text-sm'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                  }`}
                >
                  {msg.sender_type === 'lya' ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {formatarMensagem(msg.message)}
                    </div>
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
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua dúvida sobre a plataforma..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B57FF] focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="bg-gradient-to-r from-[#0B57FF] to-[#2572FF] text-white px-4 py-2 rounded-lg hover:from-[#2572FF] hover:to-[#0B57FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Botão WhatsApp de Suporte */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <a
                href="https://wa.me/5519997230912?text=Olá!%20Estou%20na%20página%20de%20vendas%20da%20YLADA%20Nutri%20e%20gostaria%20de%20falar%20com%20um%20atendente."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg text-sm font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Falar com Suporte no WhatsApp</span>
              </a>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              💬 Tire todas suas dúvidas sobre a YLADA Nutri
            </p>
          </div>
        </>
      )}
    </div>
  )
}
