'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'
import { getTemplateBenefits } from '@/lib/template-benefits'

interface Pergunta {
  id: number
  pergunta: string
  tipo: 'multipla'
  opcoes: string[]
}

interface Resultado {
  score: number
  perfil: string
  descricao: string
  cor: string
  recomendacoes: string[]
  diagnostico: DiagnosticoCompleto | null
}

export default function ProntoEmagrecer({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você está pronto(a) para começar uma jornada de emagrecimento saudável?',
      tipo: 'multipla',
      opcoes: [
        'Sim, estou muito motivado(a) e pronto(a) para começar',
        'Sim, mas preciso de orientação para começar',
        'Talvez, se tiver um acompanhamento adequado',
        'Ainda não, preciso de mais informações'
      ]
    },
    {
      id: 2,
      pergunta: 'Você sente que precisa de ajuda profissional para emagrecer com saúde?',
      tipo: 'multipla',
      opcoes: [
        'Sim, preciso muito de orientação especializada',
        'Sim, seria muito útil ter um acompanhamento',
        'Talvez, se for algo prático e personalizado',
        'Não, consigo fazer sozinho(a)'
      ]
    },
    {
      id: 3,
      pergunta: 'Você valoriza ter um plano personalizado para emagrecimento saudável?',
      tipo: 'multipla',
      opcoes: [
        'Muito, é essencial para ter resultados duradouros',
        'Bastante, acredito que faria diferença',
        'Moderadamente, se for algo eficaz',
        'Pouco, prefiro seguir padrões gerais'
      ]
    },
    {
      id: 4,
      pergunta: 'Você acredita que produtos de qualidade e acompanhamento podem acelerar seu emagrecimento?',
      tipo: 'multipla',
      opcoes: [
        'Sim, absolutamente! É o que estou procurando',
        'Sim, acredito que pode fazer diferença',
        'Talvez, se for algo comprovado e eficaz',
        'Não, não vejo necessidade'
      ]
    },
    {
      id: 5,
      pergunta: 'Você está aberto(a) para ter um mentor que te guie em sua jornada de emagrecimento?',
      tipo: 'multipla',
      opcoes: [
        'Sim, é exatamente o que preciso!',
        'Sim, seria muito útil ter um mentor',
        'Talvez, se for alguém experiente e confiável',
        'Não, prefiro seguir sozinho(a)'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais motivação = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais necessidade = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais valorização = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais crença = mais pontos
    [3, 2, 1, 0]  // Pergunta 5: mais abertura = mais pontos
  ]

  const iniciarQuiz = () => {
    setEtapa('quiz')
    setPerguntaAtual(0)
    setRespostas([])
  }

  const responder = (opcaoIndex: number) => {
    const novasRespostas = [...respostas, opcaoIndex]
    setRespostas(novasRespostas)

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      calcularResultado(novasRespostas)
    }
  }

  const calcularResultado = (resps: number[]) => {
    let pontuacaoTotal = 0
    
    resps.forEach((resposta, index) => {
      pontuacaoTotal += pontosPorOpcao[index][resposta] || 0
    })

    // Determinar perfil baseado na pontuação (0-15 pontos)
    let perfil = 'ProntoParaEmagrecer'
    let descricao = ''
    let cor = 'green'
    let recomendacoes: string[] = []
    let diagnosticoId = 'prontoParaEmagrecer'

    if (pontuacaoTotal >= 12) {
      perfil = 'Alto Potencial - Pronto para Emagrecer'
      descricao = 'Excelente! Você está muito motivado(a) e pronto(a) para emagrecer com saúde. Um acompanhamento especializado pode potencializar seus resultados e acelerar sua jornada de transformação.'
      cor = 'green'
      recomendacoes = [
        'Acessar programa VIP personalizado para emagrecimento',
        'Ter acompanhamento intensivo especializado',
        'Utilizar produtos premium de alta qualidade',
        'Ter mentoria especializada para resultados excepcionais',
        'Tornar-se referência e inspirar outros'
      ]
      diagnosticoId = 'altoPotencialEmagrecer'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Pronto para Emagrecer'
      descricao = 'Você está pronto(a) para começar sua jornada de emagrecimento! Um acompanhamento personalizado pode acelerar seus resultados e te guiar em cada etapa.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em acompanhamento personalizado',
        'Ter um plano adaptado ao seu perfil',
        'Acessar produtos adequados aos seus objetivos',
        'Ter suporte constante para manter motivação',
        'Aprender estratégias eficazes de emagrecimento'
      ]
      diagnosticoId = 'prontoParaEmagrecer'
    } else {
      perfil = 'Precisa de Mais Informações'
      descricao = 'Você está no início da sua jornada. Um acompanhamento pode te ajudar a entender melhor suas necessidades e criar um plano adequado para você começar com segurança.'
      cor = 'blue'
      recomendacoes = [
        'Buscar orientação para entender suas necessidades',
        'Receber informações sobre opções disponíveis',
        'Ter uma conversa inicial sem compromisso',
        'Aprender sobre produtos e estratégias',
        'Descobrir como podemos te ajudar'
      ]
      diagnosticoId = 'precisaMaisInformacoesEmagrecer'
    }

    const diagnostico = getDiagnostico('pronto-emagrecer', 'wellness', diagnosticoId)

    setResultado({
      score: pontuacaoTotal,
      perfil,
      descricao,
      cor,
      recomendacoes,
      diagnostico
    })
    setEtapa('resultado')
  }

  const voltar = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
      setRespostas(respostas.slice(0, -1))
    } else {
      setEtapa('landing')
      setPerguntaAtual(0)
      setRespostas([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Pronto para Emagrecer com Saúde"
        defaultDescription="Descubra se você está pronto para começar sua jornada de emagrecimento"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('pronto-emagrecer')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🎯"
              defaultTitle="Pronto para Emagrecer com Saúde"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra se você está pronto para começar sua jornada de emagrecimento
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação rápida para entender seu perfil e criar um plano personalizado
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="🎯 Começar Avaliação - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" 
                  style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {perguntas[perguntaAtual].pergunta}
              </h2>

              <div className="space-y-3">
                {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => responder(index)}
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all transform hover:scale-[1.02]"
                  >
                    <span className="text-gray-700">{opcao}</span>
                  </button>
                ))}
              </div>

              {perguntaAtual > 0 && (
                <button
                  onClick={voltar}
                  className="mt-4 text-gray-600 hover:text-gray-800 flex items-center"
                >
                  ← Voltar
                </button>
              )}
            </div>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${
              resultado.cor === 'green' ? 'border-green-300' : 
              resultado.cor === 'yellow' ? 'border-yellow-300' : 
              'border-blue-300'
            }`}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Perfil de Emagrecimento</h2>
                <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                  resultado.cor === 'green' ? 'bg-green-100 text-green-800' : 
                  resultado.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {resultado.perfil}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {resultado.descricao}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-2">📋</span>
                      Diagnóstico Completo
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.diagnostico}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.causaRaiz}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.acaoImediata}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.plano7Dias}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.suplementacao}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.alimentacao}</p>
                      </div>
                      {resultado.diagnostico.proximoPasso && (
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-l-4 border-purple-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Perfil: ${resultado.perfil} | Pontuação: ${resultado.score}/15`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setResultado(null)
                  setEtapa('quiz')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Refazer Avaliação
              </button>
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setResultado(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                🏠 Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

