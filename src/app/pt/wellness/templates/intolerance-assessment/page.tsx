'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { intoleranciaDiagnosticos } from '@/lib/diagnostics'

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
  diagnostico?: any // Diagnóstico completo do arquivo de diagnósticos
}

export default function AvaliacaoIntolerancia({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente desconforto digestivo após consumir certos alimentos?',
      tipo: 'multipla',
      opcoes: [
        'Sempre, me sinto muito mal',
        'Frequentemente, tenho vários desconfortos',
        'Às vezes, depende do alimento',
        'Raramente ou nunca sinto desconforto'
      ]
    },
    {
      id: 2,
      pergunta: 'Você já percebeu que alguns alimentos causam inchaço, gases ou dores abdominais?',
      tipo: 'multipla',
      opcoes: [
        'Sim, tenho esses sintomas regularmente',
        'Sim, acontece com alguns alimentos específicos',
        'Às vezes, mas não sei identificar o que causa',
        'Não, não tenho esses sintomas'
      ]
    },
    {
      id: 3,
      pergunta: 'Você sente que precisa de ajuda para identificar alimentos que te fazem mal?',
      tipo: 'multipla',
      opcoes: [
        'Sim, preciso muito de orientação profissional',
        'Sim, seria útil ter um acompanhamento',
        'Talvez, se for algo prático e personalizado',
        'Não, consigo identificar sozinho(a)'
      ]
    },
    {
      id: 4,
      pergunta: 'Você valoriza produtos alimentares que sejam seguros e adequados para seu organismo?',
      tipo: 'multipla',
      opcoes: [
        'Muito, é essencial para minha saúde',
        'Bastante, procuro opções adequadas',
        'Moderadamente, mas não priorizo',
        'Pouco, não me preocupo muito'
      ]
    },
    {
      id: 5,
      pergunta: 'Você sente que ter um plano alimentar personalizado faria diferença na sua qualidade de vida?',
      tipo: 'multipla',
      opcoes: [
        'Sim, faria toda diferença e melhoraria muito',
        'Sim, acredito que seria muito útil',
        'Talvez, se for algo prático e eficaz',
        'Não, não vejo necessidade'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais sintomas = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais sintomas = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais necessidade = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais valorização = mais pontos
    [3, 2, 1, 0]  // Pergunta 5: mais valorização = mais pontos
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
    let perfil = 'NecessitaAvaliacao'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'necessitaAvaliacaoIntolerancia'

    if (pontuacaoTotal >= 12) {
      perfil = 'Alta Suspeita de Intolerância'
      descricao = 'Seus sintomas indicam que você pode ter intolerâncias ou sensibilidades alimentares. Um acompanhamento especializado pode ajudar a identificar os alimentos problemáticos e criar um plano personalizado.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional para identificar intolerâncias',
        'Criar um plano alimentar personalizado e seguro',
        'Utilizar produtos adequados para seu perfil',
        'Ter acompanhamento para monitorar melhorias',
        'Aprender estratégias para viver melhor sem restrições'
      ]
      diagnosticoId = 'altaSuspeitaIntolerancia'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Possível Intolerância Moderada'
      descricao = 'Você apresenta alguns sinais que podem indicar sensibilidade alimentar. Um acompanhamento pode ajudar a identificar padrões e criar estratégias personalizadas para seu bem-estar.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em uma avaliação personalizada',
        'Ter um plano alimentar adaptado às suas necessidades',
        'Utilizar produtos seguros e adequados',
        'Acompanhar seu progresso com suporte profissional',
        'Aprender a otimizar sua alimentação'
      ]
      diagnosticoId = 'intoleranciaModerada'
    } else {
      perfil = 'Baixa Probabilidade'
      descricao = 'Você parece ter boa tolerância alimentar. Mesmo assim, um acompanhamento pode ajudar a otimizar sua alimentação e prevenir futuras sensibilidades.'
      cor = 'green'
      recomendacoes = [
        'Manter bons hábitos alimentares',
        'Considerar otimização preventiva',
        'Ter acesso a produtos de qualidade',
        'Manter acompanhamento preventivo',
        'Aprender estratégias de bem-estar contínuo'
      ]
      diagnosticoId = 'baixaProbabilidadeIntolerancia'
    }

    const diagnostico = intoleranciaDiagnosticos.wellness[diagnosticoId as keyof typeof intoleranciaDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Avaliação de Intolerância Alimentar"
        defaultDescription="Identifique possíveis intolerâncias e sensibilidades alimentares"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('avaliacao-intolerancia')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🔍"
              defaultTitle="Avaliação de Intolerância Alimentar"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra se você tem intolerâncias ou sensibilidades alimentares
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para identificar alimentos que podem estar afetando seu bem-estar
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="🔍 Começar Avaliação de Intolerância - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all transform hover:scale-[1.02]"
                  >
                    <span className="text-gray-900 font-medium">{opcao}</span>
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
              resultado.cor === 'red' ? 'border-red-300' : 
              resultado.cor === 'yellow' ? 'border-yellow-300' : 
              'border-green-300'
            }`}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Perfil de Intolerância</h2>
                <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                  resultado.cor === 'red' ? 'bg-red-100 text-red-800' : 
                  resultado.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {resultado.perfil}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {resultado.descricao}
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-orange-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
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
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 border-l-4 border-orange-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA WhatsApp com resultado */}
            {config && (
              <WellnessCTAButton
                config={config}
                resultadoTexto={`Perfil: ${resultado.perfil} (${resultado.score}/15 pontos)`}
              />
            )}

            <WellnessActionButtons
          onRecalcular={() => {
          setPerguntaAtual(0)
          setRespostas([])
          setResultado(null)
          setEtapa('quiz')
          }}
          onVoltarInicio={() => {
          setPerguntaAtual(0)
          setRespostas([])
          setResultado(null)
          setEtapa('landing')
          }}
          textoRecalcular="↺ Refazer Avaliação"
          />
          </div>
        )}
      </main>
    </div>
  )
}

