'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id?: string
  sender_type: 'user' | 'lya' | 'system'
  message: string
  created_at?: string
}

interface LyaChatWidgetProps {
  defaultOpen?: boolean
  embedded?: boolean
  className?: string
}

export default function LyaChatWidget({ defaultOpen = false, embedded = false, className }: LyaChatWidgetProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState<boolean>(embedded || defaultOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize do textarea conforme o texto
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px' // Reset altura
      const scrollHeight = textareaRef.current.scrollHeight
      const newHeight = Math.min(Math.max(scrollHeight, 48), 120) // Mínimo 48px, máximo 120px
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [inputMessage])
  
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
        message: 'Olá! Sou o Noel, seu mentor empresarial. Estou aqui para te ajudar com organização, posicionamento e crescimento do seu negócio.\n\nComo posso te ajudar hoje?',
        created_at: new Date().toISOString()
      }])
    }
  }, [isOpen])

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim()
    if (!message) return

    setLoading(true)
    setInputMessage('')
    // Resetar altura do textarea após limpar
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px'
    }

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
          throw new Error('O Noel ainda não está configurado. Entre em contato com o suporte para ativar.')
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
  const formatarMensagemLYA = (texto: string, isUserMessage: boolean = false) => {
    const linhas = texto.split('\n')
    
    // Função auxiliar para processar links markdown [texto](url)
    const processarLinks = (textoLinha: string, textColor: string) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      const partes: Array<string | JSX.Element> = []
      let ultimoIndex = 0
      let match
      
      while ((match = linkRegex.exec(textoLinha)) !== null) {
        // Adicionar texto antes do link
        if (match.index > ultimoIndex) {
          const textoAntes = textoLinha.substring(ultimoIndex, match.index)
          if (textoAntes) {
            partes.push(textoAntes)
          }
        }
        
        // Adicionar o link
        const linkTexto = match[1]
        const linkUrl = match[2]
        const isAbsoluteUrl = linkUrl.startsWith('http')
        
        partes.push(
          <a
            key={`link-${match.index}`}
            href={linkUrl}
            target={isAbsoluteUrl ? '_blank' : undefined}
            rel={isAbsoluteUrl ? 'noopener noreferrer' : undefined}
            className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
            onClick={(e) => {
              // Se for link relativo, prevenir navegação padrão e usar Next.js router
              if (!isAbsoluteUrl) {
                e.preventDefault()
                window.location.href = linkUrl
              }
            }}
          >
            {linkTexto}
          </a>
        )
        
        ultimoIndex = match.index + match[0].length
      }
      
      // Adicionar texto restante
      if (ultimoIndex < textoLinha.length) {
        partes.push(textoLinha.substring(ultimoIndex))
      }
      
      return partes.length > 0 ? partes : [textoLinha]
    }
    
    return linhas.map((linha, index) => {
      // Se linha está vazia, retornar espaço
      if (linha.trim() === '') {
        return <br key={index} />
      }
      
      const textColor = isUserMessage ? 'text-white' : 'text-gray-900'
      
      // Detectar listas numeradas (ex: "1. **Texto**" ou "1. Texto")
      const matchLista = linha.match(/^(\d+)\.\s+(.+)$/)
      if (matchLista) {
        const numero = matchLista[1]
        const conteudo = matchLista[2]
        
        // Processar links primeiro
        const conteudoComLinks = processarLinks(conteudo, textColor)
        
        // Verificar se tem negrito no conteúdo
        if (conteudo.includes('**')) {
          return (
            <p key={index} className="mb-2 break-words">
              <span className={`font-bold ${textColor}`} style={{ fontWeight: 700 }}>{numero}.</span>{' '}
              {conteudoComLinks.map((parte, i) => {
                if (typeof parte === 'string') {
                  // Processar negrito dentro do texto
                  const partesNegrito = parte.split(/(\*\*[^*]+\*\*)/g)
                  return (
                    <span key={i}>
                      {partesNegrito.map((p, j) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return (
                            <span key={j} className={`font-bold ${textColor}`} style={{ fontWeight: 700 }}>
                              {p.replace(/\*\*/g, '')}
                            </span>
                          )
                        }
                        return <span key={j} className={textColor}>{p}</span>
                      })}
                    </span>
                  )
                }
                return parte
              })}
            </p>
          )
        }
        
        // Lista numerada sem negrito
        return (
          <p key={index} className="mb-2 break-words">
            <span className={`font-bold ${textColor}`} style={{ fontWeight: 700 }}>{numero}.</span>{' '}
            {conteudoComLinks.map((parte, i) => {
              if (typeof parte === 'string') {
                return <span key={i} className={textColor}>{parte}</span>
              }
              return parte
            })}
          </p>
        )
      }
      
      // Detectar links markdown na linha
      if (linha.includes('[') && linha.includes('](')) {
        const partesComLinks = processarLinks(linha, textColor)
        
        // Verificar se tem negrito
        if (linha.includes('**')) {
          return (
            <p key={index} className="mb-2 break-words">
              {partesComLinks.map((parte, i) => {
                if (typeof parte === 'string') {
                  const partesNegrito = parte.split(/(\*\*[^*]+\*\*)/g)
                  return (
                    <span key={i}>
                      {partesNegrito.map((p, j) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return (
                            <span key={j} className={`font-bold ${textColor}`} style={{ fontWeight: 700 }}>
                              {p.replace(/\*\*/g, '')}
                            </span>
                          )
                        }
                        return <span key={j} className={textColor}>{p}</span>
                      })}
                    </span>
                  )
                }
                return parte
              })}
            </p>
          )
        }
        
        return (
          <p key={index} className={`mb-2 break-words ${textColor}`}>
            {partesComLinks.map((parte, i) => {
              if (typeof parte === 'string') {
                return <span key={i}>{parte}</span>
              }
              return parte
            })}
          </p>
        )
      }
      
      // Detectar texto em negrito simples
      if (linha.includes('**')) {
        const partes = linha.split(/(\*\*[^*]+\*\*)/g)
        return (
          <p key={index} className="mb-2 break-words">
            {partes.map((parte, i) => {
              if (parte.startsWith('**') && parte.endsWith('**')) {
                return (
                  <span key={i} className={`font-bold ${textColor}`} style={{ fontWeight: 700 }}>
                    {parte.replace(/\*\*/g, '')}
                  </span>
                )
              }
              return <span key={i} className={textColor}>{parte}</span>
            })}
          </p>
        )
      }
      
      // Linha normal
      return (
        <p key={index} className={`mb-2 break-words ${textColor}`}>
          {linha}
        </p>
      )
    })
  }

  if (!isOpen && !embedded) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 transition-all group flex items-center gap-2 px-4 py-3"
        aria-label="Abrir chat com o Noel"
        title="Falar com o Noel"
        data-lya-widget="true"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="hidden sm:block font-semibold text-sm whitespace-nowrap">Noel</span>
      </button>
    )
  }

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    // Em modo embutido, não "fecha" (no máximo minimiza)
    if (embedded) {
      setIsMinimized(true)
      return
    }
    // Fechar de forma síncrona - garantir que todos os estados são atualizados
    setIsMinimized(false)
    setMessages([])
    setThreadId(null)
    setIsOpen(false)
  }

  const handleMinimize = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsMinimized(prev => !prev)
  }

  return (
    <div 
      className={
        embedded
          ? `w-full bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col transition-all ${isMinimized ? 'h-16' : 'h-full'} ${className || ''}`
          : `fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all ${isMinimized ? 'h-16' : 'h-[600px]'} ${className || ''}`
      }
      style={embedded ? { pointerEvents: 'auto' } : { pointerEvents: 'auto', zIndex: 9999 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className={`bg-blue-600 text-white p-4 flex items-center justify-between ${embedded ? 'rounded-t-2xl' : 'rounded-t-lg'}`} style={{ pointerEvents: 'auto' }}>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="font-semibold">Noel - Mentor Empresarial</span>
        </div>
        <div className="flex items-center space-x-2" style={{ pointerEvents: 'auto' }}>
          <button
            onClick={handleMinimize}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="hover:bg-blue-700 rounded p-1 transition-colors"
            aria-label={isMinimized ? 'Expandir' : 'Minimizar'}
            type="button"
            style={{ pointerEvents: 'auto', cursor: 'pointer', zIndex: 1000 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
          {!embedded && (
            <button
              onClick={handleClose}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="hover:bg-blue-700 rounded p-1 transition-colors"
              aria-label="Fechar"
              type="button"
              style={{ pointerEvents: 'auto', cursor: 'pointer', zIndex: 1000 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
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
                      ? 'bg-blue-500 text-white'
                      : msg.sender_type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 text-sm'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  <div className={`whitespace-pre-wrap text-sm leading-relaxed ${
                    msg.sender_type === 'user' ? 'text-white' : 'text-gray-900'
                  }`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {formatarMensagemLYA(msg.message, msg.sender_type === 'user')}
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

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2 items-end">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden min-h-[48px] max-h-[120px]"
                disabled={loading}
                rows={1}
                style={{ height: '48px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 O Noel é mentor de negócios. Análises clínicas são sua responsabilidade.
            </div>
          </div>
        </>
      )}
    </div>
  )
}
