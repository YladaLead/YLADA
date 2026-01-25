'use client'

import { useState, useEffect, useRef } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface TestMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TestContext {
  tags: string[]
  workshopSessions: Array<{ id?: string; title: string; starts_at: string; zoom_link: string }>
  leadName?: string
  hasScheduled?: boolean
  scheduledDate?: string
  participated?: boolean
  isFirstMessage?: boolean
}

function CarolTestPage() {
  return (
    <AdminProtectedRoute>
      <CarolTestContent />
    </AdminProtectedRoute>
  )
}

function CarolTestContent() {
  const [messages, setMessages] = useState<TestMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<TestContext>({
    tags: [],
    workshopSessions: [],
    isFirstMessage: true
  })
  const [showContextPanel, setShowContextPanel] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Carregar sessões do workshop para contexto
  useEffect(() => {
    loadWorkshopSessions()
  }, [])

  const loadWorkshopSessions = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/workshop-sessions?limit=2')
      const data = await res.json()
      if (data.success && data.sessions) {
        const sessions = data.sessions
          .filter((s: any) => s.is_active && new Date(s.starts_at) > new Date())
          .slice(0, 2)
          .map((s: any) => ({
            id: s.id,
            title: s.title || 'Aula Prática ao Vivo',
            starts_at: s.starts_at,
            zoom_link: s.zoom_link
          }))
        setContext(prev => ({ ...prev, workshopSessions: sessions }))
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage: TestMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    // Marcar que não é mais primeira mensagem após primeira interação
    if (context.isFirstMessage) {
      setContext(prev => ({ ...prev, isFirstMessage: false }))
    }

    try {
      const res = await fetch('/api/admin/whatsapp/carol/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          context: {
            tags: context.tags,
            workshopSessions: context.workshopSessions,
            leadName: context.leadName || 'Teste',
            hasScheduled: context.hasScheduled,
            scheduledDate: context.scheduledDate,
            participated: context.participated,
            isFirstMessage: context.isFirstMessage
          }
        })
      })

      const data = await res.json()

      if (data.success && data.response) {
        const carolMessage: TestMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, carolMessage])
      } else {
        const errorMessage: TestMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ Erro: ${data.error || 'Erro ao gerar resposta'}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error: any) {
      const errorMessage: TestMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erro: ${error.message || 'Erro ao processar mensagem'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([])
    setContext({
      tags: [],
      workshopSessions: context.workshopSessions, // Manter sessões
      isFirstMessage: true
    })
  }

  const toggleTag = (tag: string) => {
    setContext(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const commonTags = [
    'veio_aula_pratica',
    'agendou_aula',
    'participou_aula',
    'nao_participou_aula',
    'recebeu_link_workshop',
    'primeiro_contato'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🧪 Teste da Carol - Ambiente Simulado</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Simule conversas com a Carol sem afetar o sistema real. Nada é salvo no banco de dados.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowContextPanel(!showContextPanel)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {showContextPanel ? '👁️ Ocultar' : '⚙️ Mostrar'} Contexto
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  🔄 Resetar Conversa
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[calc(100vh-200px)]">
            {/* Painel de Contexto (Lateral) */}
            {showContextPanel && (
              <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-4">⚙️ Configurar Contexto</h3>

                {/* Nome do Lead */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Lead</label>
                  <input
                    type="text"
                    value={context.leadName || ''}
                    onChange={(e) => setContext(prev => ({ ...prev, leadName: e.target.value }))}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="space-y-1">
                    {commonTags.map(tag => (
                      <label key={tag} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={context.tags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={context.hasScheduled || false}
                        onChange={(e) => setContext(prev => ({ ...prev, hasScheduled: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Agendou aula</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={context.participated || false}
                        onChange={(e) => setContext(prev => ({ ...prev, participated: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Participou da aula</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={context.isFirstMessage || false}
                        onChange={(e) => setContext(prev => ({ ...prev, isFirstMessage: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Primeira mensagem</span>
                    </label>
                  </div>
                </div>

                {/* Data Agendada */}
                {context.hasScheduled && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Agendada</label>
                    <input
                      type="datetime-local"
                      value={context.scheduledDate || ''}
                      onChange={(e) => setContext(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                )}

                {/* Sessões Disponíveis */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sessões ({context.workshopSessions.length})
                  </label>
                  {context.workshopSessions.length > 0 ? (
                    <div className="text-xs text-gray-600 space-y-1">
                      {context.workshopSessions.map((s, i) => (
                        <div key={i} className="p-2 bg-white rounded border border-gray-200">
                          <div className="font-medium">{new Date(s.starts_at).toLocaleDateString('pt-BR')}</div>
                          <div className="text-gray-500">{new Date(s.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Nenhuma sessão disponível</p>
                  )}
                </div>

                {/* Info de Debug */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 mb-1">ℹ️ Debug Info</p>
                  <pre className="text-xs text-blue-800 overflow-auto">
                    {JSON.stringify(context, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Área de Chat */}
            <div className="flex-1 flex flex-col">
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <p className="text-lg mb-2">💬 Comece uma conversa de teste</p>
                    <p className="text-sm">Digite uma mensagem abaixo para simular uma conversa com a Carol</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
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
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Digite sua mensagem de teste..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !inputMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarolTestPage
