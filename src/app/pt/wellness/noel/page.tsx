'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useAuth } from '@/contexts/AuthContext'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
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

// Chaves do localStorage
const STORAGE_KEYS = {
  MENSAGENS: 'noel_conversas',
  THREAD_ID: 'noel_threadId',
  MODULO_ATIVO: 'noel_moduloAtivo',
}

// Interface para serialização das mensagens
interface MensagemSerializada {
  id: string
  texto: string
  tipo: 'usuario' | 'noel'
  timestamp: string // ISO string
  metadata?: {
    module?: 'mentor' | 'suporte' | 'tecnico'
    source?: 'knowledge_base' | 'ia_generated' | 'hybrid'
    similarityScore?: number
    tokensUsed?: number
    modelUsed?: string
  }
}

export default function NoelChatPage() {
  const { user } = useAuth()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [moduloAtivo, setModuloAtivo] = useState<'mentor' | 'suporte' | 'tecnico' | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null) // Thread ID do Assistants API
  const [copiadoId, setCopiadoId] = useState<string | null>(null) // ID da mensagem copiada (para feedback visual)
  const authenticatedFetch = useAuthenticatedFetch()
  const mensagensEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const carregadoRef = useRef(false) // Flag para evitar carregar múltiplas vezes

  // Obter nome do usuário
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Consultor'
  const primeiroNome = userName.split(' ')[0]

  // Funções para gerenciar localStorage
  const salvarMensagens = (msgs: Mensagem[]) => {
    if (typeof window === 'undefined') return
    
    try {
      const serializadas: MensagemSerializada[] = msgs.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))
      localStorage.setItem(STORAGE_KEYS.MENSAGENS, JSON.stringify(serializadas))
    } catch (error) {
      console.error('❌ Erro ao salvar mensagens no localStorage:', error)
    }
  }

  const carregarMensagens = (): Mensagem[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const salvas = localStorage.getItem(STORAGE_KEYS.MENSAGENS)
      if (!salvas) return []
      
      const serializadas: MensagemSerializada[] = JSON.parse(salvas)
      return serializadas.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    } catch (error) {
      console.error('❌ Erro ao carregar mensagens do localStorage:', error)
      return []
    }
  }

  const salvarThreadId = (id: string | null) => {
    if (typeof window === 'undefined') return
    
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.THREAD_ID, id)
      } else {
        localStorage.removeItem(STORAGE_KEYS.THREAD_ID)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar threadId no localStorage:', error)
    }
  }

  const carregarThreadId = (): string | null => {
    if (typeof window === 'undefined') return null
    
    try {
      return localStorage.getItem(STORAGE_KEYS.THREAD_ID)
    } catch (error) {
      console.error('❌ Erro ao carregar threadId do localStorage:', error)
      return null
    }
  }

  const salvarModuloAtivo = (modulo: 'mentor' | 'suporte' | 'tecnico' | null) => {
    if (typeof window === 'undefined') return
    
    try {
      if (modulo) {
        localStorage.setItem(STORAGE_KEYS.MODULO_ATIVO, modulo)
      } else {
        localStorage.removeItem(STORAGE_KEYS.MODULO_ATIVO)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar módulo ativo no localStorage:', error)
    }
  }

  const carregarModuloAtivo = (): 'mentor' | 'suporte' | 'tecnico' | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const modulo = localStorage.getItem(STORAGE_KEYS.MODULO_ATIVO)
      if (modulo === 'mentor' || modulo === 'suporte' || modulo === 'tecnico') {
        return modulo
      }
      return null
    } catch (error) {
      console.error('❌ Erro ao carregar módulo ativo do localStorage:', error)
      return null
    }
  }

  // Carregar histórico ao montar o componente
  useEffect(() => {
    if (carregadoRef.current) return
    carregadoRef.current = true

    const mensagensSalvas = carregarMensagens()
    const threadIdSalvo = carregarThreadId()
    const moduloSalvo = carregarModuloAtivo()

    if (mensagensSalvas.length > 0) {
      setMensagens(mensagensSalvas)
      console.log('✅ Histórico carregado:', mensagensSalvas.length, 'mensagens')
    } else {
      // Mensagem inicial de boas-vindas apenas se não houver histórico
      setMensagens([{
        id: '1',
        texto: `${primeiroNome}, como posso te ajudar hoje?`,
        tipo: 'noel',
        timestamp: new Date()
      }])
    }

    if (threadIdSalvo) {
      setThreadId(threadIdSalvo)
      console.log('✅ Thread ID carregado:', threadIdSalvo)
    }

    if (moduloSalvo) {
      setModuloAtivo(moduloSalvo)
    }
  }, [])

  // Salvar mensagens sempre que mudarem
  useEffect(() => {
    if (carregadoRef.current && mensagens.length > 0) {
      salvarMensagens(mensagens)
    }
  }, [mensagens])

  // Salvar threadId sempre que mudar
  useEffect(() => {
    if (carregadoRef.current) {
      salvarThreadId(threadId)
    }
  }, [threadId])

  // Salvar módulo ativo sempre que mudar
  useEffect(() => {
    if (carregadoRef.current) {
      salvarModuloAtivo(moduloAtivo)
    }
  }, [moduloAtivo])

  // Scroll automático para última mensagem
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  // Focar no input quando carregar
  useEffect(() => {
    inputRef.current?.focus()
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

      // Chamar API NOEL com timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos
      
      let response
      try {
        response = await authenticatedFetch('/api/wellness/noel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: pergunta,
            conversationHistory: historico,
            threadId: threadId, // Enviar threadId se existir (para manter conversa)
          }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Timeout: A requisição demorou muito. Tente novamente.')
        }
        throw fetchError
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        throw new Error(errorData.error || 'Erro ao processar mensagem')
      }

      const data = await response.json()

      // Guardar threadId se retornado (para manter conversa no Assistants API)
      if (data.threadId) {
        setThreadId(data.threadId)
        salvarThreadId(data.threadId)
        console.log('🧵 Thread ID salvo:', data.threadId)
      }

      // Atualizar módulo ativo
      setModuloAtivo(data.module)
      salvarModuloAtivo(data.module)

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
      console.error('❌ Erro ao enviar mensagem:', error)
      
      // Mensagem de erro mais amigável
      let mensagemErroTexto = '❌ Erro ao processar sua mensagem.'
      
      if (error.message?.includes('Load failed') || error.message?.includes('fetch')) {
        mensagemErroTexto = '❌ Erro de conexão. Verifique sua internet e tente novamente.'
      } else if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
        mensagemErroTexto = '⏱️ A requisição demorou muito. Tente novamente.'
      } else if (error.message?.includes('500') || error.message?.includes('Erro ao processar')) {
        mensagemErroTexto = '⚠️ Erro no servidor. Tente novamente em alguns instantes.'
      } else if (error.message) {
        mensagemErroTexto = `❌ ${error.message}`
      }
      
      mensagemErroTexto += '\n\n💡 Dica: Se o problema persistir, tente recarregar a página.'
      
      const mensagemErro: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: mensagemErroTexto,
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
    const mensagemInicial: Mensagem = {
      id: '1',
      texto: `${primeiroNome}, como posso te ajudar hoje?`,
      tipo: 'noel',
      timestamp: new Date()
    }
    
    setMensagens([mensagemInicial])
    setModuloAtivo(null)
    setThreadId(null)
    
    // Limpar localStorage
    salvarMensagens([mensagemInicial])
    salvarThreadId(null)
    salvarModuloAtivo(null)
  }

  // Função para copiar mensagem individual
  const copiarMensagem = async (mensagem: Mensagem) => {
    try {
      await navigator.clipboard.writeText(mensagem.texto)
      setCopiadoId(mensagem.id)
      setTimeout(() => setCopiadoId(null), 2000) // Reset após 2 segundos
    } catch (error) {
      console.error('❌ Erro ao copiar mensagem:', error)
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea')
      textArea.value = mensagem.texto
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiadoId(mensagem.id)
      setTimeout(() => setCopiadoId(null), 2000)
    }
  }

  // Função para copiar toda a conversa
  const copiarTodaConversa = async () => {
    try {
      const conversaCompleta = mensagens
        .map(msg => {
          const autor = msg.tipo === 'usuario' ? 'Você' : 'NOEL'
          const data = msg.timestamp.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          return `[${data}] ${autor}:\n${msg.texto}`
        })
        .join('\n\n---\n\n')
      
      await navigator.clipboard.writeText(conversaCompleta)
      setCopiadoId('toda-conversa')
      setTimeout(() => setCopiadoId(null), 2000)
    } catch (error) {
      console.error('❌ Erro ao copiar conversa:', error)
      // Fallback
      const textArea = document.createElement('textarea')
      const conversaCompleta = mensagens
        .map(msg => {
          const autor = msg.tipo === 'usuario' ? 'Você' : 'NOEL'
          const data = msg.timestamp.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          return `[${data}] ${autor}:\n${msg.texto}`
        })
        .join('\n\n---\n\n')
      textArea.value = conversaCompleta
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiadoId('toda-conversa')
      setTimeout(() => setCopiadoId(null), 2000)
    }
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

  // Layout server-side já valida autenticação, perfil e assinatura
  return (
    <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 border-b border-green-700 shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Mentor NOEL</h1>
                <p className="text-sm font-semibold text-white mt-2 italic">"A disciplina é a ponte entre metas e realizações" - Jim Rohn</p>
              </div>
              <div className="flex items-center gap-2">
                {mensagens.length > 1 && (
                  <button
                    onClick={copiarTodaConversa}
                    className="px-4 py-2 text-sm font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                    title="Copiar toda a conversa"
                  >
                    {copiadoId === 'toda-conversa' ? '✅ Copiado!' : '📋 Copiar Conversa'}
                  </button>
                )}
                <button
                  onClick={limparConversa}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
                >
                  🔄 Limpar Conversa
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Chat Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50" style={{ minHeight: 0 }}>
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.tipo === 'noel' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-md text-2xl">
                      🏆
                    </div>
                  )}
                  <div className={`max-w-3xl w-full ${msg.tipo === 'usuario' ? 'flex flex-col items-end' : ''}`}>
                    <div className="relative group">
                      <div
                        className={`rounded-xl p-4 ${
                          msg.tipo === 'usuario'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                            : 'bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800 border border-blue-200 shadow-sm'
                        }`}
                      >
                        {msg.tipo === 'noel' ? (
                          <FormatarMensagem texto={msg.texto} />
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.texto}</p>
                        )}

                        {/* Metadata removido - deixar limpo conforme solicitado */}
                      </div>
                      {/* Botão de copiar - aparece no hover */}
                      <button
                        onClick={() => copiarMensagem(msg)}
                        className={`absolute top-2 right-2 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 ${
                          msg.tipo === 'usuario'
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        title="Copiar mensagem"
                      >
                        {copiadoId === msg.id ? (
                          <span className="text-xs">✅</span>
                        ) : (
                          <span className="text-xs">📋</span>
                        )}
                      </button>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${msg.tipo === 'usuario' ? 'text-right' : 'text-left'}`}>
                      <span>{msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}

              {enviando && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={mensagensEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={perguntaAtual}
                  onChange={(e) => setPerguntaAtual(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm bg-white shadow-sm"
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
  )
}

