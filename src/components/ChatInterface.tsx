'use client'

import React, { useState, useRef, useEffect } from 'react'
import { yladaAssistant, UserProfile, AssistantResponse } from '@/lib/openai-assistant'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  feedback?: 'positive' | 'negative' | 'neutral'
}

interface ChatInterfaceProps {
  onComplete: (profile: UserProfile) => void
}

export default function ChatInterface({ onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá 👋 Sou a YLADA, sua assistente para criar ferramentas inteligentes de geração de leads em menos de 60 segundos. Me conte rapidinho: qual é a sua profissão ou área de atuação?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Inicializar thread da OpenAI Assistant
  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        const response = await fetch('/api/ylada-assistant')
        if (response.ok) {
          const data = await response.json()
          setThreadId(data.threadId)
        }
        setIsInitialized(true)
      } catch (error) {
        console.error('Erro ao inicializar assistant:', error)
        setIsInitialized(true) // Continua mesmo com erro
      }
    }

    if (!isInitialized) {
      initializeAssistant()
    }
  }, [isInitialized])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isInitialized) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Enviar mensagem para OpenAI Assistant via API
      const response = await fetch('/api/ylada-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userProfile,
          threadId
        })
      })

      if (!response.ok) {
        throw new Error('Erro na API')
      }

      const assistantResponse: AssistantResponse = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Atualizar threadId se fornecido
      if (assistantResponse.threadId) {
        setThreadId(assistantResponse.threadId)
      }
      
      // Atualizar perfil do usuário
      if (assistantResponse.profile) {
        setUserProfile(prev => ({ ...prev, ...assistantResponse.profile }))
      }
      
      // Atualizar passo atual
      if (assistantResponse.nextStep) {
        setCurrentStep(assistantResponse.nextStep)
      }
      
      // Finalizar se completo
      if (assistantResponse.complete) {
        setTimeout(() => {
          onComplete(userProfile)
        }, 1000)
      }

      // Salvar dados de aprendizado
      try {
        await fetch('/api/ylada-learning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userInput: inputValue,
            userProfile,
            assistantResponse,
            userFeedback: 'neutral'
          })
        })
      } catch (error) {
        console.error('Erro ao salvar dados de aprendizado:', error)
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      // Resposta de fallback
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, estou com uma pequena dificuldade técnica. Vamos continuar nossa conversa! Me conte mais sobre sua profissão.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Função para gerar sugestões usando a OpenAI Assistant
  const generateToolSuggestions = (profile: UserProfile): string => {
    return yladaAssistant.generateToolSuggestions(profile)
  }

  // Função para enviar feedback
  const sendFeedback = async (messageId: string, feedback: 'positive' | 'negative') => {
    try {
      await fetch('/api/ylada-learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: 'feedback',
          userProfile,
          assistantResponse: { messageId },
          userFeedback: feedback
        })
      })

      // Atualizar mensagem com feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback }
          : msg
      ))

      console.log(`📚 Feedback ${feedback} enviado para mensagem ${messageId}`)
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">Y</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">YLADA Assistant</h3>
          <p className="text-sm text-gray-500">Criando sua ferramenta de leads...</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {message.type === 'assistant' && !message.feedback && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => sendFeedback(message.id, 'positive')}
                      className="text-xs text-green-600 hover:text-green-800 transition-colors"
                      title="Feedback positivo"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => sendFeedback(message.id, 'negative')}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors"
                      title="Feedback negativo"
                    >
                      👎
                    </button>
                  </div>
                )}
                {message.feedback && (
                  <span className="text-xs text-gray-500">
                    {message.feedback === 'positive' ? '👍' : '👎'} Obrigado!
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua resposta..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || !isInitialized}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {!isInitialized ? 'Inicializando...' : isTyping ? 'Pensando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
