'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Converte texto com links em elementos React com links clicáveis
 * Detecta: markdown [texto](url) e menções a "plano anual/mensal"
 */
function renderMessageWithLinks(content: string) {
  const parts: (string | JSX.Element)[] = []
  let keyCounter = 0

  // Processar texto em partes, substituindo links
  let processedText = content

  // 1. Substituir markdown links [texto](url) por placeholder
  const markdownLinks: Array<{ text: string; url: string }> = []
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const placeholder = `__MD_LINK_${markdownLinks.length}__`
    markdownLinks.push({ text, url })
    return placeholder
  })

  // 2. Substituir menções a "plano anual" ou "plano mensal" por placeholder
  const planLinks: Array<{ text: string; url: string }> = []
  processedText = processedText.replace(/\b(plano anual|plano mensal)\b/gi, (match) => {
    const isAnnual = match.toLowerCase().includes('anual')
    const url = isAnnual ? '/pt/wellness/checkout?plan=annual' : '/pt/wellness/checkout?plan=monthly'
    const placeholder = `__PLAN_LINK_${planLinks.length}__`
    planLinks.push({ text: match, url })
    return placeholder
  })

  // 3. Dividir texto por placeholders e criar elementos
  const segments = processedText.split(/(__MD_LINK_\d+__|__PLAN_LINK_\d+__)/)

  segments.forEach((segment) => {
    if (segment.startsWith('__MD_LINK_')) {
      const index = parseInt(segment.match(/\d+/)![0])
      const link = markdownLinks[index]
      const isAbsoluteUrl = link.url.startsWith('http')
      parts.push(
        <Link
          key={`link-md-${keyCounter++}`}
          href={link.url}
          className="text-blue-600 hover:text-blue-800 underline font-medium"
          target={isAbsoluteUrl ? '_blank' : undefined}
          rel={isAbsoluteUrl ? 'noopener noreferrer' : undefined}
        >
          {link.text}
        </Link>
      )
    } else if (segment.startsWith('__PLAN_LINK_')) {
      const index = parseInt(segment.match(/\d+/)![0])
      const link = planLinks[index]
      parts.push(
        <Link
          key={`link-plan-${keyCounter++}`}
          href={link.url}
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {link.text}
        </Link>
      )
    } else if (segment) {
      parts.push(segment)
    }
  })

  return parts.length > 0 ? parts : content
}

export default function SalesSupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o NOEL, assistente de suporte. Como posso ajudar você hoje? Posso esclarecer dúvidas sobre planos, pagamento ou acesso ao sistema.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [showSupportButton, setShowSupportButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/wellness/noel/sales-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          userEmail: userEmail.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (data.success && data.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])

        // Se NOEL não soube responder, mostrar botão de contato
        if (data.unanswered && data.supportContact) {
          setShowSupportButton(true)
        }
      } else {
        throw new Error(data.error || 'Erro ao obter resposta')
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente em alguns instantes.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 flex items-center gap-2"
          aria-label="Abrir chat de suporte"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="hidden sm:inline font-semibold">Precisa de ajuda?</span>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col h-[600px] max-h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🙋🏻‍♂️</span>
              </div>
              <div>
                <h3 className="font-semibold">NOEL Suporte</h3>
                <p className="text-xs text-green-100">Assistente de ajuda</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-100 transition-colors"
              aria-label="Fechar chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.role === 'assistant' 
                      ? renderMessageWithLinks(message.content)
                      : message.content
                    }
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Botão de Contato com Suporte (quando NOEL não soube responder) */}
          {showSupportButton && (
            <div className="px-4 pt-4 border-t border-gray-200 bg-yellow-50">
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  💬 Precisa de mais ajuda?
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  Entre em contato diretamente com nosso suporte:
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:ylada.app@gmail.com?subject=Suporte Wellness System&body=Olá, preciso de ajuda com:`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    📧 Enviar Email
                  </a>
                  <a
                    href="https://wa.me/5519996049800?text=Olá,%20preciso%20de%20ajuda%20com%20o%20Wellness%20System"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Campo de Email (opcional) */}
          {!userEmail && messages.length === 1 && (
            <div className="px-4 pt-2 border-t border-gray-200 bg-gray-50">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Seu email (opcional, para melhor atendimento)"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Suporte técnico e vendas • Não é mentoria
            </p>
          </div>
        </div>
      )}
    </>
  )
}
