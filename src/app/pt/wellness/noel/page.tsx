'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
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
  const [threadId, setThreadId] = useState<string | null>(null) // Thread ID do Assistants API
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
          threadId: threadId, // Enviar threadId se existir (para manter conversa)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        throw new Error(errorData.error || 'Erro ao processar mensagem')
      }

      const data = await response.json()

      // Guardar threadId se retornado (para manter conversa no Assistants API)
      if (data.threadId) {
        setThreadId(data.threadId)
        console.log('🧵 Thread ID salvo:', data.threadId)
      }

      // Atualizar módulo ativo
      setModuloAtivo(data.module)

      // Log de functions executadas (para debug)
      if (data.functionCalls && data.functionCalls.length > 0) {
        console.log('🔧 Functions executadas:', data.functionCalls.map((f: any) => f.name).join(', '))
      }

      // Limpar resposta removendo estrutura numerada
      const respostaLimpa = limparRespostaNumerada(data.response)

      // Adicionar resposta do NOEL
      const mensagemNoel: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: respostaLimpa,
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
    setThreadId(null) // Limpar thread ao limpar conversa (cria novo thread na próxima mensagem)
  }

  // Função para limpar respostas: remover títulos numerados e títulos de seção
  const limparRespostaNumerada = (texto: string): string => {
    if (!texto) return texto
    
    // Dividir por linhas
    const linhas = texto.split('\n')
    const linhasLimpas: string[] = []
    
    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i].trim()
      
      // Verificar se é um título numerado (ex: "1) Mensagem principal curta")
      const matchTituloNumerado = linha.match(/^\d+\)\s+.+$/)
      if (matchTituloNumerado) {
        continue // Pular título numerado
      }
      
      // Verificar se é um título de seção (ex: "Mensagem principal:", "Ação prática imediata:", etc.)
      // Manter apenas "Script sugerido:" - remover os outros
      const titulosParaRemover = [
        /^Mensagem principal:?\s*$/i,
        /^Ação prática imediata:?\s*$/i,
        /^Frase de reforço emocional:?\s*$/i,
        /^Oferta de ajuda adicional:?\s*$/i,
        /^Posso te ajudar:?\s*$/i
      ]
      
      const deveRemover = titulosParaRemover.some(pattern => pattern.test(linha))
      if (deveRemover) {
        continue // Pular título de seção
      }
      
      // Se for "Script sugerido:", manter o título mas sem os dois pontos
      if (/^Script sugerido:?\s*$/i.test(linha)) {
        linhasLimpas.push('**Script sugerido:**')
        continue
      }
      
      // Adicionar linha normal
      linhasLimpas.push(linhas[i]) // Usar linha original (com espaços preservados)
    }
    
    // Juntar e limpar linhas vazias excessivas (máximo 2 linhas vazias seguidas)
    let resultado = linhasLimpas.join('\n')
    resultado = resultado.replace(/\n{3,}/g, '\n\n') // Substituir 3+ quebras por 2
    
    // Remover linhas vazias no início e fim
    resultado = resultado.replace(/^\n+|\n+$/g, '')
    
    return resultado
  }

  const getModuloInfo = (modulo: 'mentor' | 'suporte' | 'tecnico') => {
    // NOEL sempre se apresenta apenas como NOEL
    return { nome: 'NOEL', emoji: '👤', cor: 'from-purple-600 to-purple-700', desc: 'Seu amigo e mentor - estratégias, técnicas e suporte' }
  }

  const getSourceInfo = (source?: string) => {
    const sources = {
      knowledge_base: { nome: 'Base de Conhecimento', emoji: '📖', cor: 'bg-green-100 text-green-800' },
      ia_generated: { nome: 'IA Gerada', emoji: '👤', cor: 'bg-blue-100 text-blue-800' },
      hybrid: { nome: 'Híbrido', emoji: '🔀', cor: 'bg-purple-100 text-purple-800' },
      assistant_api: { nome: 'Assistants API', emoji: '👤', cor: 'bg-indigo-100 text-indigo-800' },
    }
    return sources[source as keyof typeof sources] || { nome: 'Desconhecido', emoji: '❓', cor: 'bg-gray-100 text-gray-800' }
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-3xl">👤</span>
                  NOEL Mentor Wellness
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Seu amigo e mentor - estratégias, técnicas e suporte
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

        {/* Indicador de Módulo Ativo - Sempre mostra MENTOR */}
        {moduloAtivo && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className={`bg-gradient-to-r ${getModuloInfo('mentor').cor} text-white rounded-lg px-4 py-2 flex items-center gap-3 shadow-md`}>
              <span className="text-2xl">{getModuloInfo('mentor').emoji}</span>
              <div>
                <div className="font-bold">{getModuloInfo('mentor').nome}</div>
                <div className="text-xs opacity-90">{getModuloInfo('mentor').desc}</div>
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

                      {/* Metadata removido - deixar limpo conforme solicitado */}
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
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}

