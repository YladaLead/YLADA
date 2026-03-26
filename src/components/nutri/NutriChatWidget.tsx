'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import OrientacaoTecnica from '@/components/wellness/OrientacaoTecnica'
import FormatarMensagem from '@/components/wellness/FormatarMensagem'
import { getChatbotConfig, NOEL_MENU_PRIMEIRA_MSG } from '@/lib/nutri-chatbots'
import type { OrientacaoResposta } from '@/types/orientation'
import {
  fetchNutriMatrixNoel,
  matrixNoelLimitMessageFromResponse,
  type NoelConversationTurn,
} from '@/lib/nutri-matrix-noel-client'

function noelHistoryFromMensagens(mensagens: Mensagem[]): NoelConversationTurn[] {
  return mensagens
    .filter((m) => m.tipo !== 'sistema' || !m.orientacao)
    .map((m) => ({
      role: m.tipo === 'usuario' ? ('user' as const) : ('assistant' as const),
      content: m.texto,
    }))
}

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
  // Noel (matriz, segmento nutri) — assistente de formação / GSAL conforme chatbotId
  const chatbotSelecionado = chatbotId || 'formacao'
  const chatbotConfig = getChatbotConfig(chatbotSelecionado)
  
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState('')
  const [enviando, setEnviando] = useState(false)
  const authenticatedFetch = useAuthenticatedFetch()
  const mensagensEndRef = useRef<HTMLDivElement>(null)
  const statsPrimeiraMsgRef = useRef(false)

  // Inicializar mensagem quando abrir o chat: menu 1–4 e, se tiver stats, "Você está X/Y"
  useEffect(() => {
    if (!aberto) {
      statsPrimeiraMsgRef.current = false
      return
    }
    if (mensagens.length === 0) {
      setMensagens([{
        id: '1',
        texto: chatbotConfig.mensagemInicial,
        tipo: 'sistema',
        timestamp: new Date()
      }])
    }
  }, [aberto, chatbotConfig.mensagemInicial, mensagens.length])

  // Carregar meta semanal e conversas esta semana para enriquecer a primeira mensagem (uma vez por abertura)
  useEffect(() => {
    if (!aberto || mensagens.length !== 1 || mensagens[0]?.tipo !== 'sistema' || statsPrimeiraMsgRef.current) return
    statsPrimeiraMsgRef.current = true
    let cancelled = false
    authenticatedFetch('/api/nutri/painel/stats', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (cancelled || !json?.data) return
        const { conversasEstaSemana, metaSemanal } = json.data
        if (typeof conversasEstaSemana !== 'number' || typeof metaSemanal !== 'number') return
        if (conversasEstaSemana >= metaSemanal) return
        setMensagens(prev => {
          if (prev.length !== 1 || prev[0].id !== '1') return prev
          const linha = `Você está **${conversasEstaSemana}/${metaSemanal}** esta semana. Vamos ativar a primeira?\n\n`
          return [{ ...prev[0], texto: linha + NOEL_MENU_PRIMEIRA_MSG + '\n\nDigite o número, o nome da opção ou me conte em uma frase.' }]
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [aberto, mensagens.length, mensagens[0]?.tipo, authenticatedFetch])


  // Detectar se a pergunta é sobre jornada/formacao (conceitual) ou funcionalidades técnicas
  const isPerguntaJornada = (pergunta: string): boolean => {
    const perguntaLower = pergunta.toLowerCase().trim()
    
    // Padrões específicos sobre jornada (prioridade alta) - mais abrangentes
    const padroesJornada = [
      /(em que|qual) semana/i,
      /(em que|qual) dia/i,
      /semana (estou|atual|estamos)/i,
      /dia (estou|atual|estamos)/i,
      /o que (fazer|preciso fazer|devo fazer|tenho que fazer|você acha)/i,
      /o que fazer (hoje|agora)/i,
      /(jornada|formacao|formação|formacao empresarial)/i,
      /(reflexão|reflexoes|refletir|reflexões|minhas reflexões)/i,
      /(anotação|anotacoes|anotar|anotações)/i,
      /(pilares|biblioteca|certificado|certificados)/i,
      /(aprendizado|aprendi|entendi|não entendi|não entendo)/i,
      /(confusa|confuso|atrasada|atrasado|perdida|perdido)/i,
      /(progresso|evolução|evolucao|evoluir)/i,
      /(o que você achou|o que acha|sua opinião)/i,
      /(minhas anotações|minhas reflexões|meu progresso)/i
    ]
    
    // Verificar padrões primeiro
    const matchPadrao = padroesJornada.some(padrao => padrao.test(perguntaLower))
    if (matchPadrao) {
      console.log('✅ [Noel] Detectado como pergunta sobre jornada:', pergunta)
      return true
    }
    
    // Palavras-chave simples (mais abrangentes)
    const palavrasJornada = [
      'semana', 'dia', 'jornada', 'reflexão', 'reflexoes', 'reflexões',
      'anotação', 'anotacoes', 'anotações', 'pilares', 'biblioteca', 
      'certificado', 'certificados', 'formação', 'formacao', 'aprendizado',
      'progresso', 'evolução', 'evolucao', 'achou', 'acha', 'opinião'
    ]
    
    const temPalavraChave = palavrasJornada.some(palavra => perguntaLower.includes(palavra))
    if (temPalavraChave) {
      console.log('✅ [Noel] Detectado como pergunta sobre jornada (palavra-chave):', pergunta)
      return true
    }
    
    console.log('❌ [Noel] NÃO detectado como pergunta sobre jornada:', pergunta)
    return false
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
      // Se for pergunta sobre jornada/formacao, usar API da LYA
      if (isPerguntaJornada(pergunta)) {
        try {
          const history = noelHistoryFromMensagens(mensagens)
          const { response, data } = await fetchNutriMatrixNoel(authenticatedFetch, pergunta, history)

          if (!response.ok) {
            const lim = matrixNoelLimitMessageFromResponse(response, data)
            if (lim) throw new Error(lim)
            const errorMessage =
              (data.details as string) ||
              (data.message as string) ||
              (data.error as string) ||
              'Erro ao buscar resposta do Noel'
            throw new Error(errorMessage)
          }

          if (data.error) {
            throw new Error(
              (data.details as string) || (data.message as string) || String(data.error)
            )
          }

          const respostaLya = (data.response as string) || (data.message as string)

          if (!respostaLya || String(respostaLya).trim() === '') {
            throw new Error('O Noel não retornou uma resposta válida')
          }

          const mensagemSistema: Mensagem = {
            id: (Date.now() + 1).toString(),
            texto: respostaLya,
            tipo: 'sistema',
            timestamp: new Date()
          }
          setMensagens(prev => [...prev, mensagemSistema])
          return
        } catch (error: any) {
          console.error('❌ [Noel Nutri] Erro na trilha/jornada:', error)
          const mensagemErro: Mensagem = {
            id: (Date.now() + 1).toString(),
            texto: `Ops! Tive um problema ao processar sua pergunta sobre a trilha. 😅\n\n**Erro:** ${error.message || 'Erro desconhecido'}\n\n**Mas não se preocupe!** Você pode:\n\n🔄 **Tentar novamente** — Às vezes é só um problema momentâneo\n📘 **Acessar diretamente** — Vá em "Trilha Empresarial" no menu para ver seu progresso\n💬 **Falar com nossa equipe** — Entre em contato pelo WhatsApp se precisar de ajuda\n\nDesculpe pelo inconveniente! 😊`,
            tipo: 'sistema',
            timestamp: new Date()
          }
          setMensagens(prev => [...prev, mensagemErro])
          return
        }
      }

      // Se for pergunta técnica, buscar orientação técnica primeiro
      const response = await authenticatedFetch(
        `/api/nutri/orientation?pergunta=${encodeURIComponent(pergunta)}`
      )

      if (!response.ok) {
        const history = noelHistoryFromMensagens(mensagens)
        const { response: rNoel, data: dNoel } = await fetchNutriMatrixNoel(
          authenticatedFetch,
          pergunta,
          history
        )
        if (!rNoel.ok) {
          const lim = matrixNoelLimitMessageFromResponse(rNoel, dNoel)
          if (lim) throw new Error(lim)
        }
        if (rNoel.ok && !dNoel.error && (dNoel.response || dNoel.message)) {
          const respostaLya = (dNoel.response as string) || (dNoel.message as string)
          const mensagemSistema: Mensagem = {
            id: (Date.now() + 1).toString(),
            texto: respostaLya,
            tipo: 'sistema',
            timestamp: new Date(),
          }
          setMensagens((prev) => [...prev, mensagemSistema])
          return
        }
        throw new Error('Erro ao buscar orientação')
      }

      const data: OrientacaoResposta = await response.json()

      if (data.tipo === 'tecnica' && data.item) {
        // Encontrou orientação técnica - verificar se realmente é técnica ou se deveria ser LYA
        // Se a pergunta contém palavras sobre jornada mas encontrou orientação técnica, pode ser falso positivo
        const palavrasJornadaNaPergunta = ['reflexão', 'reflexoes', 'reflexões', 'anotação', 'anotações', 'semana', 'dia', 'jornada']
        const temPalavraJornada = palavrasJornadaNaPergunta.some(p => pergunta.toLowerCase().includes(p))
        
        if (temPalavraJornada) {
          const history = noelHistoryFromMensagens(mensagens)
          const { response: rNoel, data: dNoel } = await fetchNutriMatrixNoel(
            authenticatedFetch,
            pergunta,
            history
          )
          if (!rNoel.ok) {
            const lim = matrixNoelLimitMessageFromResponse(rNoel, dNoel)
            if (lim) throw new Error(lim)
          }
          if (rNoel.ok && !dNoel.error && (dNoel.response || dNoel.message)) {
            const respostaLya = (dNoel.response as string) || (dNoel.message as string)
            const mensagemSistema: Mensagem = {
              id: (Date.now() + 1).toString(),
              texto: respostaLya,
              tipo: 'sistema',
              timestamp: new Date(),
            }
            setMensagens((prev) => [...prev, mensagemSistema])
            return
          }
        }
        
        // É realmente técnica, mostrar orientação técnica
        const mensagemSistema: Mensagem = {
          id: (Date.now() + 1).toString(),
          texto: `Perfeito! Encontrei exatamente o que você precisa! 🎯\n\nVou te mostrar um passo a passo bem detalhado para você conseguir fazer isso facilmente. 👇`,
          tipo: 'sistema',
          timestamp: new Date(),
          orientacao: data
        }
        setMensagens(prev => [...prev, mensagemSistema])
      } else {
        const history = noelHistoryFromMensagens(mensagens)
        const { response: rNoel, data: dNoel } = await fetchNutriMatrixNoel(
          authenticatedFetch,
          pergunta,
          history
        )
        if (!rNoel.ok) {
          const lim = matrixNoelLimitMessageFromResponse(rNoel, dNoel)
          if (lim) throw new Error(lim)
        }
        if (rNoel.ok && !dNoel.error && (dNoel.response || dNoel.message)) {
          const respostaLya = (dNoel.response as string) || (dNoel.message as string)
          const mensagemSistema: Mensagem = {
            id: (Date.now() + 1).toString(),
            texto: respostaLya,
            tipo: 'sistema',
            timestamp: new Date(),
          }
          setMensagens((prev) => [...prev, mensagemSistema])
          return
        }
        
        // Fallback final
        const mensagemSistema: Mensagem = {
          id: (Date.now() + 1).toString(),
          texto: `Hmm, não encontrei uma orientação específica para "${pergunta}". 😔\n\n**Mas não se preocupe!** Posso te ajudar de outras formas:\n\n💡 **Dicas:**\n• Tente reformular sua pergunta com outras palavras\n• Use termos mais específicos (ex: "kanban" em vez de "organizar")\n• Me pergunte sobre funcionalidades específicas\n\nO que mais você gostaria de saber? 😊`,
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
          {/* Header Simplificado */}
          <div 
            className="text-white p-4 rounded-t-xl flex items-center justify-between"
            style={{ 
              background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">🎓</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Noel</h3>
                <p className="text-xs opacity-90">Assistente de Formação</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAberto(false)
                setMensagens([])
              }}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {mensagens.map((msg) => (
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
              ))}

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
                placeholder="Pergunte qualquer coisa..."
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={enviando}
              />
              <button
                onClick={enviarMensagem}
                disabled={!perguntaAtual.trim() || enviando}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-sm"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

