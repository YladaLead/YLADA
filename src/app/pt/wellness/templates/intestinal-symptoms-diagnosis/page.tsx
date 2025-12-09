'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { sintomasIntestinaisDiagnosticos } from '@/lib/diagnostics'

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

export default function DiagnosticoSintomasIntestinais({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente desconforto digestivo, gases, inchaço ou problemas intestinais frequentemente?',
      tipo: 'multipla',
      opcoes: [
        'Sim, tenho esses sintomas quase diariamente',
        'Sim, acontece várias vezes por semana',
        'Às vezes, mas não é constante',
        'Raramente ou nunca tenho esses problemas'
      ]
    },
    {
      id: 2,
      pergunta: 'Você sente que precisa de ajuda para melhorar sua saúde intestinal?',
      tipo: 'multipla',
      opcoes: [
        'Sim, preciso muito de orientação profissional',
        'Sim, seria muito útil ter um acompanhamento',
        'Talvez, se for algo prático e eficaz',
        'Não, consigo resolver sozinho(a)'
      ]
    },
    {
      id: 3,
      pergunta: 'Você valoriza produtos que ajudam a melhorar a saúde digestiva e intestinal?',
      tipo: 'multipla',
      opcoes: [
        'Muito, é essencial para meu bem-estar',
        'Bastante, procuro opções adequadas',
        'Moderadamente, se for algo eficaz',
        'Pouco, não me preocupo muito'
      ]
    },
    {
      id: 4,
      pergunta: 'Você acredita que um plano personalizado pode transformar sua saúde intestinal?',
      tipo: 'multipla',
      opcoes: [
        'Sim, faria toda diferença e melhoraria muito',
        'Sim, acredito que seria muito útil',
        'Talvez, se for algo comprovado e eficaz',
        'Não, não vejo necessidade'
      ]
    },
    {
      id: 5,
      pergunta: 'Você está aberto(a) para ter um acompanhamento especializado em saúde digestiva?',
      tipo: 'multipla',
      opcoes: [
        'Sim, é exatamente o que preciso!',
        'Sim, seria muito útil ter um acompanhamento',
        'Talvez, se for alguém experiente e confiável',
        'Não, prefiro fazer sozinho(a)'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais sintomas = mais pontos
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
    let perfil = 'ProblemasIntestinais'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'problemasIntestinais'

    if (pontuacaoTotal >= 12) {
      perfil = 'Problemas Intestinais - Necessita Atenção'
      descricao = 'Seus sintomas indicam problemas intestinais que precisam de atenção. Um acompanhamento especializado pode ajudar a identificar causas e criar estratégias eficazes para melhorar sua saúde intestinal.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional para problemas intestinais',
        'Criar um plano personalizado de saúde digestiva',
        'Utilizar produtos específicos para saúde intestinal',
        'Ter acompanhamento para monitorar melhorias',
        'Aprender estratégias para manter intestino saudável'
      ]
      diagnosticoId = 'problemasIntestinais'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Possíveis Problemas Moderados'
      descricao = 'Você apresenta alguns sinais que podem indicar problemas intestinais moderados. Um acompanhamento pode ajudar a otimizar sua saúde digestiva e prevenir problemas futuros.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em avaliação personalizada',
        'Ter um plano de otimização digestiva',
        'Utilizar produtos que melhoram saúde intestinal',
        'Acompanhar progresso com suporte profissional',
        'Aprender a otimizar sua digestão'
      ]
      diagnosticoId = 'problemasModerados'
    } else {
      perfil = 'Saúde Intestinal Adequada'
      descricao = 'Você parece ter uma boa saúde intestinal! Mesmo assim, um acompanhamento preventivo pode ajudar a manter esse equilíbrio e otimizar ainda mais seu bem-estar digestivo.'
      cor = 'green'
      recomendacoes = [
        'Manter boa saúde intestinal com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm saúde digestiva',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de saúde intestinal'
      ]
      diagnosticoId = 'saudeIntestinalAdequada'
    }

    const diagnostico = sintomasIntestinaisDiagnosticos.wellness[diagnosticoId as keyof typeof sintomasIntestinaisDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Diagnóstico de Sintomas Intestinais"
        defaultDescription="Descubra sua saúde intestinal e como otimizá-la"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('diagnostico-sintomas-intestinais')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🌿"
              defaultTitle="Diagnóstico de Sintomas Intestinais"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra sua saúde intestinal e como otimizá-la
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para identificar problemas e criar estratégias eficazes
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="🌿 Começar Diagnóstico Intestinal - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-teal-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all transform hover:scale-[1.02]"
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
                <div className="text-5xl mb-4">🌿</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Diagnóstico Intestinal</h2>
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

              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-teal-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 border-2 border-teal-200">
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
                        <div className="bg-gradient-to-r from-teal-100 to-green-100 rounded-lg p-4 border-l-4 border-teal-500">
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
              textoRecalcular="↺ Refazer Diagnóstico"
            />
          </div>
        )}
      </main>
    </div>
  )
}

