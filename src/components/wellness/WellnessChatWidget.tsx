'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import OrientacaoTecnica from './OrientacaoTecnica'
import { getChatbotConfig, getAllChatbots, type ChatbotConfig } from '@/lib/wellness-chatbots'
import type { OrientacaoResposta } from '@/types/orientation'

interface Mensagem {
  id: string
  texto: string
  tipo: 'usuario' | 'sistema' | 'orientacao'
  timestamp: Date
  orientacao?: OrientacaoResposta
}

interface WellnessChatWidgetProps {
  chatbotId?: string // 'noel' | 'mentor'
  defaultOpen?: boolean
}

export default function WellnessChatWidget({ chatbotId, defaultOpen = false }: WellnessChatWidgetProps = {} as WellnessChatWidgetProps) {
  const [aberto, setAberto] = useState(defaultOpen)
  const [chatbotSelecionado, setChatbotSelecionado] = useState<string>(chatbotId || '')
  const [mostrarSelecaoInicial, setMostrarSelecaoInicial] = useState(!chatbotId) // Mostrar seleção se não tiver chatbot pré-definido
  const chatbotConfig = chatbotSelecionado ? getChatbotConfig(chatbotSelecionado) : null
  const [mostrarSelecaoChatbot, setMostrarSelecaoChatbot] = useState(false)
  
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mostrarOrientacao, setMostrarOrientacao] = useState<OrientacaoResposta | null>(null)
  const authenticatedFetch = useAuthenticatedFetch()
  const mensagensEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (aberto) {
      scrollToBottom()
    }
  }, [mensagens, aberto])

  // Inicializar mensagem quando selecionar chatbot
  useEffect(() => {
    if (chatbotSelecionado && chatbotConfig && mensagens.length === 0 && !mostrarSelecaoInicial) {
      setMensagens([{
        id: '1',
        texto: chatbotConfig.mensagemInicial,
        tipo: 'sistema',
        timestamp: new Date()
      }])
    }
  }, [chatbotSelecionado, mostrarSelecaoInicial])

  const selecionarTipoAjuda = (tipo: 'mentor' | 'noel') => {
    setChatbotSelecionado(tipo)
    setMostrarSelecaoInicial(false)
    const config = getChatbotConfig(tipo)
    setMensagens([{
      id: '1',
      texto: config.mensagemInicial,
      tipo: 'sistema',
      timestamp: new Date()
    }])
  }

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
      // Buscar orientação técnica
      const response = await authenticatedFetch(
        `/api/wellness/orientation?pergunta=${encodeURIComponent(pergunta)}`
      )

      if (!response.ok) {
        throw new Error('Erro ao buscar orientação')
      }

      const data: OrientacaoResposta = await response.json()

      if (data.tipo === 'tecnica' && data.item) {
        // Encontrou orientação técnica - seguir passo a passo do Wellness System
        const mensagemSistema: Mensagem = {
          id: (Date.now() + 1).toString(),
          texto: `Perfeito! Encontrei uma orientação seguindo o Wellness System. Vou te guiar passo a passo! 🎯\n\n**Seguindo o sistema:**`,
          tipo: 'sistema',
          timestamp: new Date(),
          orientacao: data
        }
        setMensagens(prev => [...prev, mensagemSistema])
        setMostrarOrientacao(data)
      } else {
        // Não encontrou orientação técnica
        const mensagemSistema: Mensagem = {
          id: (Date.now() + 1).toString(),
          texto: `Não encontrei uma orientação específica no Wellness System para "${pergunta}".\n\n💡 **Dica:** Tente perguntar sobre:\n- Como usar scripts\n- Como criar ferramentas\n- Como usar fluxos\n- Como acessar treinamentos\n\nOu entre em contato pelo WhatsApp para ajuda personalizada. 💬`,
          tipo: 'sistema',
          timestamp: new Date()
        }
        setMensagens(prev => [...prev, mensagemSistema])
      }
    } catch (error: any) {
      const mensagemErro: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: 'Desculpe, ocorreu um erro. Tente novamente ou entre em contato pelo WhatsApp. 💬',
        tipo: 'sistema',
        timestamp: new Date()
      }
      setMensagens(prev => [...prev, mensagemErro])
    } finally {
      setEnviando(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensagem()
    }
  }

  const getSugestoesRapidas = () => {
    if (chatbotSelecionado === 'noel') {
      return [
        'como criar ferramenta',
        'onde estão os templates',
        'como criar portal',
        'como criar quiz',
        'editar perfil'
      ]
    } else if (chatbotSelecionado === 'mentor') {
      return [
        'como recrutar pessoas',
        'onde estão os scripts',
        'como usar fluxos de recrutamento',
        'scripts de vendas',
        'treinamento do consultor'
      ]
    }
    return [
      'onde estão os scripts',
      'como criar quiz',
      'editar perfil',
      'ver templates',
      'criar portal'
    ]
  }

  const trocarChatbot = (novoChatbotId: string) => {
    setChatbotSelecionado(novoChatbotId)
    setMostrarSelecaoChatbot(false)
    // Resetar conversa com novo chatbot
    const novoConfig = getChatbotConfig(novoChatbotId)
    setMensagens([{
      id: '1',
      texto: novoConfig.mensagemInicial,
      tipo: 'sistema',
      timestamp: new Date()
    }])
  }

  return (
    <>
      {/* Botão Flutuante */}
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105"
          style={{ width: '56px', height: '56px', padding: '12px' }}
          title="Abrir chat de suporte"
        >
          <span className="text-2xl block">💬</span>
        </button>
      )}

      {/* Chat Widget */}
      {aberto && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
          style={{ height: '600px', maxHeight: 'calc(100vh - 6rem)' }}>
          {/* Header */}
          <div 
            className="text-white p-4 rounded-t-xl flex items-center justify-between"
            style={{ 
              background: chatbotConfig 
                ? `linear-gradient(135deg, ${chatbotConfig.corHex} 0%, ${chatbotConfig.corHex}dd 100%)`
                : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              {chatbotConfig && (
                <>
                  <button
                    onClick={() => {
                      setMostrarSelecaoInicial(true)
                      setChatbotSelecionado('')
                      setMensagens([])
                    }}
                    className="text-white hover:text-gray-200 transition-colors"
                    title="Trocar tipo de ajuda"
                  >
                    <span className="text-2xl">{chatbotConfig.emoji}</span>
                  </button>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{chatbotConfig.nome}</h3>
                    <p className="text-xs opacity-90">{chatbotConfig.descricao}</p>
                  </div>
                </>
              )}
              {!chatbotConfig && (
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Como posso ajudar?</h3>
                  <p className="text-xs opacity-90">Escolha o tipo de assistência</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setAberto(false)
                setMostrarOrientacao(null)
                setMostrarSelecaoInicial(true)
                setChatbotSelecionado('')
                setMensagens([])
              }}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Seleção de Chatbot */}
          {mostrarSelecaoChatbot && (
            <div className="bg-white border-b border-gray-200 p-3">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Escolha seu assistente:</p>
              <div className="flex gap-2">
                {getAllChatbots().map((chatbot) => (
                  <button
                    key={chatbot.id}
                    onClick={() => trocarChatbot(chatbot.id)}
                    className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                      chatbotSelecionado === chatbot.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{chatbot.emoji}</div>
                    <div className="text-xs font-semibold text-gray-700">{chatbot.nome}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Tela de Seleção Inicial */}
            {mostrarSelecaoInicial && !chatbotSelecionado && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Como posso te ajudar?</h3>
                  <p className="text-sm text-gray-600">Escolha o tipo de assistência que você precisa:</p>
                </div>
                
                <button
                  onClick={() => selecionarTipoAjuda('mentor')}
                  className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎯</span>
                      <div className="text-left">
                        <h4 className="font-bold text-lg">Mentor</h4>
                        <p className="text-sm opacity-90">Sobre o sistema de negócio</p>
                        <p className="text-xs opacity-75 mt-1">Recrutamento, vendas, scripts e estratégias</p>
                      </div>
                    </div>
                    <span className="text-2xl">→</span>
                  </div>
                </button>

                <button
                  onClick={() => selecionarTipoAjuda('noel')}
                  className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">💬</span>
                      <div className="text-left">
                        <h4 className="font-bold text-lg">Suporte</h4>
                        <p className="text-sm opacity-90">Sobre a ferramenta</p>
                        <p className="text-xs opacity-75 mt-1">Como usar templates, quizzes, portals e configurações</p>
                      </div>
                    </div>
                    <span className="text-2xl">→</span>
                  </div>
                </button>
              </div>
            )}

            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.tipo === 'usuario'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.texto}</p>
                  {msg.orientacao && msg.orientacao.item && (
                    <div className="mt-3">
                      <OrientacaoTecnica
                        item={msg.orientacao.item}
                        mentor={msg.orientacao.mentor}
                        sugestaoMentor={msg.orientacao.sugestaoMentor}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Sugestões Rápidas (apenas na primeira mensagem) */}
            {mensagens.length === 1 && chatbotConfig && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">💡 Perguntas frequentes ({chatbotConfig.nome}):</p>
                {getSugestoesRapidas().map((sugestao) => (
                  <button
                    key={sugestao}
                    onClick={() => {
                      setPerguntaAtual(sugestao)
                      setTimeout(() => enviarMensagem(), 100)
                    }}
                    className="block w-full text-left px-3 py-2 text-xs bg-white hover:bg-green-50 border border-gray-200 rounded-lg transition-colors"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            )}

            {enviando && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
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
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={perguntaAtual}
                onChange={(e) => setPerguntaAtual(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={chatbotConfig ? "Digite sua dúvida..." : "Selecione um tipo de ajuda acima"}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                disabled={enviando || !chatbotConfig}
              />
              <button
                onClick={enviarMensagem}
                disabled={!perguntaAtual.trim() || enviando || !chatbotConfig}
                className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: chatbotConfig?.corHex || '#6B7280' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                ➤
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Ou entre em contato: <a href="https://wa.me/5519996049800" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">WhatsApp</a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}

