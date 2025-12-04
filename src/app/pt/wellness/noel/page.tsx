'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import FormatarMensagem from '@/components/wellness/FormatarMensagem'

interface Mensagem {
  id: string
  texto: string
  tipo: 'usuario' | 'noel'
  timestamp: Date
  metadata?: {
    module?: 'mentor' | 'suporte' | 'tecnico'
    source?: 'knowledge_base' | 'ia_generated' | 'hybrid'
    similarityScore?: number
    tokensUsed?: number
    modelUsed?: string
  }
}

export default function NoelChatPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [moduloAtivo, setModuloAtivo] = useState<'mentor' | 'suporte' | 'tecnico' | null>(null)
  const authenticatedFetch = useAuthenticatedFetch()
  const mensagensEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll automático para última mensagem
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  // Focar no input quando carregar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Mensagem inicial de boas-vindas
  useEffect(() => {
    if (mensagens.length === 0) {
      setMensagens([{
        id: '1',
        texto: `Olá! Bem-vindo! 👋\n\nEu sou o **NOEL**, seu assistente da área Wellness.\n\n**Como posso te ajudar hoje?**\n\n💡 Posso ajudar com:\n- Estratégias e metas\n- Uso do sistema\n- Bebidas e produtos\n- Scripts e campanhas\n\nEstou à sua disposição! 🚀`,
        tipo: 'noel',
        timestamp: new Date()
      }])
    }
  }, [])

  const enviarMensagem = async () => {
    if (!perguntaAtual.trim() || enviando) return

    const pergunta = perguntaAtual.trim()
    setPerguntaAtual('')
    setEnviando(true)

    // Adicionar mensagem do usuário
    const mensagemUsuario: Mensagem = {
      id: Date.now().toString(),
      texto: pergunta,
      tipo: 'usuario',
      timestamp: new Date()
    }
    setMensagens(prev => [...prev, mensagemUsuario])

    try {
      // Construir histórico de conversa
      const historico = mensagens
        .slice(-10) // últimos 10
        .map(m => ({
          role: m.tipo === 'usuario' ? 'user' as const : 'assistant' as const,
          content: m.texto
        }))

      // Chamar API NOEL
      const response = await authenticatedFetch('/api/wellness/noel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: pergunta,
          conversationHistory: historico,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        throw new Error(errorData.error || 'Erro ao processar mensagem')
      }

      const data = await response.json()

      // Atualizar módulo ativo
      setModuloAtivo(data.module)

      // Adicionar resposta do NOEL
      const mensagemNoel: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: data.response,
        tipo: 'noel',
        timestamp: new Date(),
        metadata: {
          module: data.module,
          source: data.source,
          similarityScore: data.similarityScore,
          tokensUsed: data.tokensUsed,
          modelUsed: data.modelUsed,
        }
      }
      setMensagens(prev => [...prev, mensagemNoel])
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      const mensagemErro: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: `❌ Erro ao processar sua mensagem: ${error.message || 'Erro desconhecido'}\n\nTente novamente ou entre em contato pelo WhatsApp. 💬`,
        tipo: 'noel',
        timestamp: new Date()
      }
      setMensagens(prev => [...prev, mensagemErro])
    } finally {
      setEnviando(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensagem()
    }
  }

  const limparConversa = () => {
    setMensagens([{
      id: '1',
      texto: `Olá! Bem-vindo! 👋\n\nEu sou o **NOEL**, seu assistente da área Wellness.\n\n**Como posso te ajudar hoje?**\n\n💡 Posso ajudar com:\n- Estratégias e metas\n- Uso do sistema\n- Bebidas e produtos\n- Scripts e campanhas\n\nEstou à sua disposição! 🚀`,
      tipo: 'noel',
      timestamp: new Date()
    }])
    setModuloAtivo(null)
  }

  const getModuloInfo = (modulo: 'mentor' | 'suporte' | 'tecnico') => {
    const modulos = {
      mentor: { nome: 'NOEL MENTOR', emoji: '🎯', cor: 'from-purple-600 to-purple-700', desc: 'Estratégias e planejamento' },
      suporte: { nome: 'NOEL SUPORTE', emoji: '💬', cor: 'from-blue-600 to-blue-700', desc: 'Ajuda técnica do sistema' },
      tecnico: { nome: 'NOEL TÉCNICO', emoji: '📚', cor: 'from-green-600 to-green-700', desc: 'Conteúdo e operações' },
    }
    return modulos[modulo]
  }

  const getSourceInfo = (source?: string) => {
    const sources = {
      knowledge_base: { nome: 'Base de Conhecimento', emoji: '📖', cor: 'bg-green-100 text-green-800' },
      ia_generated: { nome: 'IA Gerada', emoji: '🤖', cor: 'bg-blue-100 text-blue-800' },
      hybrid: { nome: 'Híbrido', emoji: '🔀', cor: 'bg-purple-100 text-purple-800' },
    }
    return sources[source as keyof typeof sources] || { nome: 'Desconhecido', emoji: '❓', cor: 'bg-gray-100 text-gray-800' }
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-3xl">🎯</span>
                  NOEL - Chat Wellness
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Assistente inteligente da área Wellness
                </p>
              </div>
              <button
                onClick={limparConversa}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔄 Limpar Conversa
              </button>
            </div>
          </div>
        </div>

        {/* Indicador de Módulo Ativo */}
        {moduloAtivo && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className={`bg-gradient-to-r ${getModuloInfo(moduloAtivo).cor} text-white rounded-lg px-4 py-2 flex items-center gap-3 shadow-md`}>
              <span className="text-2xl">{getModuloInfo(moduloAtivo).emoji}</span>
              <div>
                <div className="font-bold">{getModuloInfo(moduloAtivo).nome}</div>
                <div className="text-xs opacity-90">{getModuloInfo(moduloAtivo).desc}</div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-3xl w-full">
                    <div
                      className={`rounded-lg p-4 ${
                        msg.tipo === 'usuario'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md ml-auto'
                          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                      }`}
                    >
                      {msg.tipo === 'noel' ? (
                        <FormatarMensagem texto={msg.texto} />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.texto}</p>
                      )}

                      {/* Metadata (apenas para mensagens do NOEL) */}
                      {msg.metadata && msg.tipo === 'noel' && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                          <div className="flex flex-wrap gap-2 items-center text-xs">
                            <span className={`px-2 py-1 rounded ${getSourceInfo(msg.metadata.source).cor} font-medium`}>
                              {getSourceInfo(msg.metadata.source).emoji} {getSourceInfo(msg.metadata.source).nome}
                            </span>
                            {msg.metadata.similarityScore !== undefined && (
                              <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                                📊 Similaridade: {Math.round(msg.metadata.similarityScore * 100)}%
                              </span>
                            )}
                            {msg.metadata.tokensUsed && (
                              <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                                💰 Tokens: {msg.metadata.tokensUsed}
                              </span>
                            )}
                            {msg.metadata.modelUsed && (
                              <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                                🤖 {msg.metadata.modelUsed}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${msg.tipo === 'usuario' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {enviando && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={mensagensEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={perguntaAtual}
                  onChange={(e) => setPerguntaAtual(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta... (Ex: Como definir metas de PV? Como preparar shake? Como criar quiz?)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  disabled={enviando}
                />
                <button
                  onClick={enviarMensagem}
                  disabled={!perguntaAtual.trim() || enviando}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 shadow-md font-medium"
                >
                  {enviando ? '⏳' : '➤'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

