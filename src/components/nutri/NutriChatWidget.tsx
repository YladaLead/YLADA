'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import OrientacaoTecnica from '@/components/wellness/OrientacaoTecnica'
import FormatarMensagem from '@/components/wellness/FormatarMensagem'
import { getChatbotConfig, getAllChatbots } from '@/lib/nutri-chatbots'
import type { OrientacaoResposta } from '@/types/orientation'

interface Mensagem {
  id: string
  texto: string
  tipo: 'usuario' | 'sistema' | 'orientacao'
  timestamp: Date
  orientacao?: OrientacaoResposta
}

interface NutriChatWidgetProps {
  chatbotId?: string // 'formacao' | 'gsal'
  defaultOpen?: boolean
}

export default function NutriChatWidget({ chatbotId, defaultOpen = false }: NutriChatWidgetProps = {} as NutriChatWidgetProps) {
  const [aberto, setAberto] = useState(defaultOpen)
  const [chatbotSelecionado, setChatbotSelecionado] = useState<string>(chatbotId || '')
  const [mostrarSelecaoInicial, setMostrarSelecaoInicial] = useState(!chatbotId)
  const chatbotConfig = chatbotSelecionado ? getChatbotConfig(chatbotSelecionado) : null
  
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState('')
  const [enviando, setEnviando] = useState(false)
  const authenticatedFetch = useAuthenticatedFetch()
  const mensagensEndRef = useRef<HTMLDivElement>(null)

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
  }, [chatbotSelecionado, mostrarSelecaoInicial, chatbotConfig, mensagens.length])

  const selecionarTipoAjuda = (tipo: 'formacao' | 'gsal') => {
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
    if (!perguntaAtual.trim() || enviando || !chatbotSelecionado) return

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
        `/api/nutri/orientation?pergunta=${encodeURIComponent(pergunta)}`
      )

      if (!response.ok) {
        throw new Error('Erro ao buscar orientação')
      }

      const data: OrientacaoResposta = await response.json()

      if (data.tipo === 'tecnica' && data.item) {
        // Encontrou orientação técnica
        const mensagemSistema: Mensagem = {
          id: (Date.now() + 1).toString(),
          texto: `Perfeito! Encontrei exatamente o que você precisa! 🎯\n\nVou te mostrar um passo a passo bem detalhado para você conseguir fazer isso facilmente. 👇`,
          tipo: 'sistema',
          timestamp: new Date(),
          orientacao: data
        }
        setMensagens(prev => [...prev, mensagemSistema])
      } else {
        // Não encontrou orientação técnica
        const mensagemSistema: Mensagem = {
          id: (Date.now() + 1).toString(),
          texto: `Hmm, não encontrei uma orientação específica para "${pergunta}". 😔\n\n**Mas não se preocupe!** Posso te ajudar de outras formas:\n\n💡 **Dicas:**\n• Tente reformular sua pergunta com outras palavras\n• Use termos mais específicos (ex: "kanban" em vez de "organizar")\n• Me pergunte sobre funcionalidades específicas\n\n💬 **Precisa de ajuda personalizada?**\nEntre em contato pelo WhatsApp e nossa equipe vai te ajudar rapidinho!\n\nO que mais você gostaria de saber? 😊`,
          tipo: 'sistema',
          timestamp: new Date()
        }
        setMensagens(prev => [...prev, mensagemSistema])
      }
    } catch (error: any) {
      const mensagemErro: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: `Ops! Algo deu errado aqui. 😅\n\n**Não se preocupe!** Você pode:\n\n🔄 **Tentar novamente** — Às vezes é só um problema momentâneo\n💬 **Falar com nossa equipe** — Entre em contato pelo WhatsApp que vamos resolver rapidinho!\n\nDesculpe pelo inconveniente! 😊`,
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
    if (chatbotSelecionado === 'formacao') {
      return [
        'como acessar jornada 30 dias',
        'onde estão os pilares do método',
        'como usar a biblioteca',
        'como criar anotação',
        'ver certificados'
      ]
    } else if (chatbotSelecionado === 'gsal') {
      return [
        'como gerenciar leads',
        'como usar kanban',
        'como criar ferramenta',
        'como ver relatórios',
        'como cadastrar cliente'
      ]
    }
    return []
  }

  const trocarChatbot = (novoChatbotId: string) => {
    setChatbotSelecionado(novoChatbotId)
    setMostrarSelecaoInicial(false)
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
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105"
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
                : 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
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
                  <h3 className="font-bold text-lg">Suporte Nutri</h3>
                  <p className="text-xs opacity-90">Escolha o tipo de assistência</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setAberto(false)
                setMostrarSelecaoInicial(true)
                setChatbotSelecionado('')
                setMensagens([])
              }}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Seleção de Chatbot (quando já tem um selecionado) */}
          {chatbotSelecionado && !mostrarSelecaoInicial && (
            <div className="bg-white border-b border-gray-200 p-3">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Escolha seu assistente:</p>
              <div className="flex gap-2">
                {getAllChatbots().map((chatbot) => (
                  <button
                    key={chatbot.id}
                    onClick={() => trocarChatbot(chatbot.id)}
                    className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                      chatbotSelecionado === chatbot.id
                        ? 'border-blue-600 bg-blue-50'
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
            {mostrarSelecaoInicial && !chatbotSelecionado ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">👋 Olá! Bem-vinda ao Suporte Nutri</h3>
                  <p className="text-sm text-gray-600 mb-1">Estou aqui para te ajudar no que precisar!</p>
                  <p className="text-sm text-gray-500">Escolha o tipo de assistência que você precisa:</p>
                </div>
                
                <button
                  onClick={() => selecionarTipoAjuda('formacao')}
                  className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎓</span>
                      <div className="text-left">
                        <h4 className="font-bold text-lg">Assistente de Formação</h4>
                        <p className="text-sm opacity-90">Sobre Formação Empresarial</p>
                        <p className="text-xs opacity-75 mt-1">Jornada 30 Dias, Pilares, Biblioteca e Anotações</p>
                      </div>
                    </div>
                    <span className="text-2xl">→</span>
                  </div>
                </button>

                <button
                  onClick={() => selecionarTipoAjuda('gsal')}
                  className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📊</span>
                      <div className="text-left">
                        <h4 className="font-bold text-lg">Suporte GSAL</h4>
                        <p className="text-sm opacity-90">Sobre Gestão e Ferramentas</p>
                        <p className="text-xs opacity-75 mt-1">Leads, Clientes, Kanban, Ferramentas e Relatórios</p>
                      </div>
                    </div>
                    <span className="text-2xl">→</span>
                  </div>
                </button>
              </div>
            ) : (
              mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-4 ${
                      msg.tipo === 'usuario'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                    }`}
                  >
                    {msg.tipo === 'usuario' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.texto}</p>
                    ) : (
                      <FormatarMensagem texto={msg.texto} />
                    )}
                    {msg.orientacao && msg.orientacao.item && (
                      <div className="mt-3 -mx-3 -mb-3">
                        <OrientacaoTecnica
                          item={msg.orientacao.item}
                          mentor={msg.orientacao.mentor}
                          sugestaoMentor={msg.orientacao.sugestaoMentor}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Sugestões Rápidas (apenas na primeira mensagem) */}
            {mensagens.length === 1 && chatbotConfig && (
              <div className="space-y-2 mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-3">💡 Perguntas frequentes:</p>
                <div className="grid grid-cols-1 gap-2">
                  {getSugestoesRapidas().map((sugestao) => (
                    <button
                      key={sugestao}
                      onClick={() => {
                        setPerguntaAtual(sugestao)
                        setTimeout(() => enviarMensagem(), 100)
                      }}
                      className="text-left px-4 py-3 text-sm bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition-all hover:shadow-md font-medium text-gray-700 hover:text-blue-700"
                    >
                      {sugestao}
                    </button>
                  ))}
                </div>
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
                placeholder="Digite sua dúvida..."
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={enviando || !chatbotSelecionado}
              />
              <button
                onClick={enviarMensagem}
                disabled={!perguntaAtual.trim() || enviando || !chatbotSelecionado}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-sm"
              >
                ➤
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Ou entre em contato: <a href="https://wa.me/5519996049800" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">WhatsApp</a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}

