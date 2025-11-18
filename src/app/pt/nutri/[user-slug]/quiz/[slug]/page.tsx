'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Pergunta {
  id: string
  tipo: 'multipla' | 'dissertativa'
  titulo: string
  opcoes?: string[]
  obrigatoria: boolean
  ordem: number
}

interface Quiz {
  id: string
  titulo: string
  descricao: string
  emoji: string
  cores: {
    primaria: string
    secundaria: string
    texto: string
    fundo: string
  }
  configuracoes?: {
    tempoLimite?: number
    mostrarProgresso: boolean
    permitirVoltar: boolean
  }
  entrega: {
    tipoEntrega: 'pagina' | 'whatsapp' | 'url'
    ctaPersonalizado: string
    urlRedirecionamento: string
    mensagemWhatsapp?: string
    customizacao: {
      tamanhoFonte: 'pequeno' | 'medio' | 'grande'
      corFundo: string
      corTexto: string
      corBotao: string
      espacamento: 'compacto' | 'normal' | 'amplo'
    }
    blocosConteudo: Array<{
      id: string
      tipo: 'titulo' | 'subtitulo' | 'texto' | 'paragrafo' | 'destaque'
      conteudo: string
      tamanho: 'pequeno' | 'medio' | 'grande'
    }>
  }
  perguntas: Pergunta[]
  whatsappDoPerfil?: string // WhatsApp do perfil do criador do quiz
}

export default function QuizPublicNutriPage() {
  const params = useParams()
  const userSlug = params?.['user-slug'] as string
  const slug = params?.slug as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [etapaAtual, setEtapaAtual] = useState<'landing' | 'perguntas' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<number, string>>({})
  const [respostasSalvas, setRespostasSalvas] = useState<Set<string>>(new Set()) // IDs das perguntas já salvas
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!slug) return

    const carregarQuiz = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/quiz?action=bySlug&slug=${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Quiz não encontrado')
          } else {
            setError('Erro ao carregar quiz')
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        setQuiz(data)
      } catch (err) {
        console.error('Erro ao carregar quiz Nutri:', err)
        setError('Erro ao carregar quiz')
      } finally {
        setLoading(false)
      }
    }

    carregarQuiz()
  }, [slug])

  const iniciarQuiz = () => {
    setEtapaAtual('perguntas')
    setPerguntaAtual(0)
  }

  // Função para salvar resposta no banco de dados
  const salvarResposta = async (perguntaIndex: number) => {
    if (!quiz || !respostas[perguntaIndex]) return

    const pergunta = quiz.perguntas[perguntaIndex]
    const respostaTexto = respostas[perguntaIndex]

    // Se já foi salva, não salvar novamente
    if (respostasSalvas.has(pergunta.id)) return

    try {
      setSalvando(true)
      const response = await fetch('/api/quiz/resposta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz.id,
          perguntaId: pergunta.id,
          resposta: {
            resposta_texto: respostaTexto,
          },
        }),
      })

      if (response.ok) {
        setRespostasSalvas(new Set([...respostasSalvas, pergunta.id]))
      } else {
        console.error('Erro ao salvar resposta:', await response.text())
      }
    } catch (error) {
      console.error('Erro ao salvar resposta:', error)
    } finally {
      setSalvando(false)
    }
  }

  const proximaPergunta = async () => {
    if (!quiz) return
    
    const pergunta = quiz.perguntas[perguntaAtual]
    if (pergunta.obrigatoria && !respostas[perguntaAtual]) {
      alert('Por favor, responda esta pergunta antes de continuar.')
      return
    }

    // Salvar resposta atual antes de avançar
    if (respostas[perguntaAtual]) {
      await salvarResposta(perguntaAtual)
    }

    if (perguntaAtual < quiz.perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      // Salvar todas as respostas restantes antes de mostrar resultado
      for (let i = 0; i < quiz.perguntas.length; i++) {
        if (respostas[i] && !respostasSalvas.has(quiz.perguntas[i].id)) {
          await salvarResposta(i)
        }
      }
      setEtapaAtual('resultado')
    }
  }

  const perguntaAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
    }
  }

  const handleRedirecionamento = () => {
    if (!quiz) return

    const { tipoEntrega, urlRedirecionamento, mensagemWhatsapp } = quiz.entrega

    if (tipoEntrega === 'whatsapp') {
      // Construir URL do WhatsApp com mensagem
      const mensagem = mensagemWhatsapp || 'Olá! Completei o quiz e gostaria de saber mais.'
      const mensagemEncoded = encodeURIComponent(mensagem)
      
      // Se não tiver urlRedirecionamento, usar WhatsApp do perfil
      let whatsappUrl = urlRedirecionamento
      if (!whatsappUrl && quiz.whatsappDoPerfil) {
        const numeroLimpo = quiz.whatsappDoPerfil.replace(/\D/g, '')
        whatsappUrl = `https://wa.me/${numeroLimpo}?text=${mensagemEncoded}`
      } else if (!whatsappUrl) {
        // Fallback apenas se não tiver nenhum WhatsApp disponível
        console.warn('⚠️ WhatsApp não encontrado no perfil nem na URL de redirecionamento')
        whatsappUrl = `https://wa.me/5511999999999?text=${mensagemEncoded}`
      } else {
        // Se já tiver URL, adicionar mensagem se não tiver
        if (!whatsappUrl.includes('?text=')) {
          whatsappUrl = `${whatsappUrl}?text=${mensagemEncoded}`
        }
      }
      
      window.open(whatsappUrl, '_blank')
    } else if (tipoEntrega === 'url' && urlRedirecionamento) {
      window.location.href = urlRedirecionamento
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz não encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'O quiz que você está procurando não existe ou foi removido.'}</p>
          <Link
            href="/pt/nutri"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para Nutri
          </Link>
        </div>
      </div>
    )
  }

  const pergunta = quiz.perguntas[perguntaAtual]
  const progresso = ((perguntaAtual + 1) / quiz.perguntas.length) * 100

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: quiz.entrega.customizacao.corFundo,
        color: quiz.entrega.customizacao.corTexto
      }}
    >
      {/* Landing Page */}
      {etapaAtual === 'landing' && (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          {quiz.emoji && (
            <div className="text-6xl mb-6">{quiz.emoji}</div>
          )}
          <h1 className="text-4xl font-bold mb-4">{quiz.titulo}</h1>
          <p className="text-xl text-gray-600 mb-8">{quiz.descricao}</p>
          <button
            onClick={iniciarQuiz}
            className="px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: quiz.cores.primaria }}
          >
            Começar Quiz
          </button>
        </div>
      )}

      {/* Perguntas */}
      {etapaAtual === 'perguntas' && pergunta && (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Barra de Progresso - só aparece se mostrarProgresso estiver habilitado */}
            {quiz.configuracoes?.mostrarProgresso !== false && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Pergunta {perguntaAtual + 1} de {quiz.perguntas.length}</span>
                  <span>{Math.round(progresso)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progresso}%`,
                      backgroundColor: quiz.cores.primaria
                    }}
                  ></div>
                </div>
              </div>
            )}

          {/* Pergunta */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">{pergunta.titulo}</h2>

            {/* Múltipla Escolha */}
            {pergunta.tipo === 'multipla' && pergunta.opcoes && (
              <div className="space-y-3">
                {pergunta.opcoes.map((opcao, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor: respostas[perguntaAtual] === opcao ? quiz.cores.primaria : '#e5e7eb'
                    }}
                  >
                    <input
                      type="radio"
                      name={`pergunta-${perguntaAtual}`}
                      value={opcao}
                      checked={respostas[perguntaAtual] === opcao}
                      onChange={(e) => setRespostas({ ...respostas, [perguntaAtual]: e.target.value })}
                      className="mr-3"
                    />
                    <span>{opcao}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Dissertativa */}
            {pergunta.tipo === 'dissertativa' && (
              <textarea
                value={respostas[perguntaAtual] || ''}
                onChange={(e) => setRespostas({ ...respostas, [perguntaAtual]: e.target.value })}
                placeholder="Digite sua resposta aqui..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
              />
            )}

          </div>

          {/* Navegação */}
          <div className="flex justify-between items-center">
            {/* Botão Voltar - só aparece se permitirVoltar estiver habilitado */}
            {quiz.configuracoes?.permitirVoltar !== false ? (
              <button
                onClick={perguntaAnterior}
                disabled={perguntaAtual === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
            ) : (
              <div></div> // Espaçador quando botão voltar está oculto
            )}
            <div className="flex items-center gap-3">
              {salvando && (
                <span className="text-sm text-gray-500">Salvando...</span>
              )}
              <button
                onClick={proximaPergunta}
                disabled={salvando}
                className="px-6 py-3 rounded-lg text-white font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: quiz.cores.primaria }}
              >
                {salvando ? 'Salvando...' : perguntaAtual === quiz.perguntas.length - 1 ? 'Ver Resultado' : 'Próxima →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Página de Resultado */}
      {etapaAtual === 'resultado' && (
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div 
            className="bg-white rounded-lg shadow-lg p-8"
            style={{
              fontSize: quiz.entrega.customizacao.tamanhoFonte === 'pequeno' ? '14px' : 
                       quiz.entrega.customizacao.tamanhoFonte === 'grande' ? '18px' : '16px',
              padding: quiz.entrega.customizacao.espacamento === 'compacto' ? '16px' :
                      quiz.entrega.customizacao.espacamento === 'amplo' ? '32px' : '24px'
            }}
          >
            {/* Blocos de Conteúdo */}
            {quiz.entrega.blocosConteudo.map((bloco) => {
              const tamanhoClasse = bloco.tamanho === 'pequeno' ? 'text-sm' :
                                   bloco.tamanho === 'grande' ? 'text-xl' : 'text-base'
              
              if (bloco.tipo === 'titulo') {
                return (
                  <h1 key={bloco.id} className={`${tamanhoClasse} font-bold mb-4 text-center`}>
                    {bloco.conteudo}
                  </h1>
                )
              } else if (bloco.tipo === 'subtitulo') {
                return (
                  <h2 key={bloco.id} className={`${tamanhoClasse} font-semibold mb-3 text-center`}>
                    {bloco.conteudo}
                  </h2>
                )
              } else if (bloco.tipo === 'destaque') {
                return (
                  <div key={bloco.id} className={`${tamanhoClasse} font-semibold bg-yellow-100 p-3 rounded-lg mb-3 text-center`}>
                    {bloco.conteudo}
                  </div>
                )
              } else {
                return (
                  <p key={bloco.id} className={`${tamanhoClasse} mb-3 text-center`}>
                    {bloco.conteudo}
                  </p>
                )
              }
            })}

            {/* Botão de Ação */}
            <div className="text-center mt-8">
              <button
                onClick={handleRedirecionamento}
                className="px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: quiz.entrega.customizacao.corBotao }}
              >
                {quiz.entrega.ctaPersonalizado || 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



