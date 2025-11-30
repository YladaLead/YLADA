'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
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

export default function AvaliacaoPerfilMetabolico({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Como você descreveria seu metabolismo?',
      tipo: 'multipla',
      opcoes: [
        'Muito lento, ganho peso facilmente',
        'Lento, tenho dificuldade para perder peso',
        'Moderado, equilibrado',
        'Rápido, queimo calorias facilmente'
      ]
    },
    {
      id: 2,
      pergunta: 'Você sente que precisa de ajuda para otimizar seu metabolismo?',
      tipo: 'multipla',
      opcoes: [
        'Sim, preciso muito de orientação profissional',
        'Sim, seria útil ter um acompanhamento',
        'Talvez, se for algo prático e personalizado',
        'Não, consigo otimizar sozinho(a)'
      ]
    },
    {
      id: 3,
      pergunta: 'Você valoriza ter um plano personalizado baseado no seu perfil metabólico?',
      tipo: 'multipla',
      opcoes: [
        'Muito, é essencial para resultados eficazes',
        'Bastante, acredito que faria diferença',
        'Moderadamente, se for algo prático',
        'Pouco, prefiro seguir padrões gerais'
      ]
    },
    {
      id: 4,
      pergunta: 'Você sente que produtos específicos para seu metabolismo ajudariam seus resultados?',
      tipo: 'multipla',
      opcoes: [
        'Sim, faria toda diferença e aceleraria resultados',
        'Sim, acredito que seria muito útil',
        'Talvez, se for algo comprovado e eficaz',
        'Não, não vejo necessidade'
      ]
    },
    {
      id: 5,
      pergunta: 'Você acredita que um acompanhamento especializado pode transformar seu metabolismo?',
      tipo: 'multipla',
      opcoes: [
        'Sim, absolutamente! Estou pronto(a) para mudanças',
        'Sim, acredito que pode fazer diferença',
        'Talvez, se for algo estruturado e eficaz',
        'Não, acho que não é necessário'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais lento = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais necessidade = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais valorização = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais valorização = mais pontos
    [3, 2, 1, 0]  // Pergunta 5: mais crença = mais pontos
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
    let perfil = 'MetabolismoLento'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'metabolismoLento'

    if (pontuacaoTotal >= 12) {
      perfil = 'Metabolismo Lento - Necessita Otimização'
      descricao = 'Seu perfil indica que seu metabolismo está lento e precisa de otimização urgente. Um acompanhamento especializado pode acelerar seu metabolismo e transformar seus resultados.'
      cor = 'red'
      recomendacoes = [
        'Buscar acompanhamento profissional para acelerar metabolismo',
        'Criar um plano personalizado baseado no seu perfil',
        'Utilizar produtos específicos para otimização metabólica',
        'Ter suporte constante para manter resultados',
        'Aprender estratégias para manter metabolismo acelerado'
      ]
      diagnosticoId = 'metabolismoLento'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Metabolismo Moderado - Otimização Necessária'
      descricao = 'Seu metabolismo está moderado mas pode ser otimizado. Um plano personalizado pode acelerar seus resultados e melhorar sua eficiência metabólica.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em otimização metabólica personalizada',
        'Ter um plano alimentar adaptado ao seu perfil',
        'Utilizar produtos que aceleram o metabolismo',
        'Acompanhar progresso com suporte profissional',
        'Aprender estratégias para potencializar metabolismo'
      ]
      diagnosticoId = 'metabolismoModerado'
    } else {
      perfil = 'Metabolismo Rápido - Manutenção Preventiva'
      descricao = 'Você tem um metabolismo rápido! Mesmo assim, um acompanhamento preventivo pode ajudar a manter sua eficiência metabólica e otimizar ainda mais seus resultados.'
      cor = 'green'
      recomendacoes = [
        'Manter metabolismo acelerado com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm metabolismo ativo',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de otimização'
      ]
      diagnosticoId = 'metabolismoRapido'
    }

    const diagnostico = getDiagnostico('avaliacao-perfil-metabolico', 'wellness', diagnosticoId)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Avaliação do Perfil Metabólico"
        defaultDescription="Descubra seu perfil metabólico e como otimizá-lo"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('avaliacao-perfil-metabolico')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="⚡"
              defaultTitle="Avaliação do Perfil Metabólico"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu perfil metabólico e como otimizá-lo
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para entender seu metabolismo e criar estratégias eficazes
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="⚡ Começar Avaliação Metabólica - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all transform hover:scale-[1.02]"
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
              resultado.cor === 'red' ? 'border-red-300' : 
              resultado.cor === 'yellow' ? 'border-yellow-300' : 
              'border-green-300'
            }`}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Perfil Metabólico</h2>
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

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
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
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border-l-4 border-blue-500">
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

