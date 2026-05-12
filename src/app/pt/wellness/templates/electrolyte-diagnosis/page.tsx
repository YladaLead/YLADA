'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { eletrolitosDiagnosticos } from '@/lib/diagnostics'

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

export default function DiagnosticoEletrolitos({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente cãibras musculares, fadiga ou desequilíbrio com frequência?',
      tipo: 'multipla',
      opcoes: [
        'Sim, tenho esses sintomas frequentemente',
        'Sim, às vezes sinto esses problemas',
        'Raramente, mas já aconteceu',
        'Não, não tenho esses sintomas'
      ]
    },
    {
      id: 2,
      pergunta: 'Treino, calor ou dia de muito suor — você sente cãibra, tontura ou “bater” do coração depois?',
      tipo: 'multipla',
      opcoes: [
        'Com frequência, mesmo tentando hidratar',
        'Às vezes, em dias mais intensos',
        'Raro; quando acontece percebo falta de água ou sal',
        'Quase nunca'
      ]
    },
    {
      id: 3,
      pergunta: 'Água ao longo do dia (e reposição em treinos longos) — na prática:',
      tipo: 'multipla',
      opcoes: [
        'Pouco: esqueço ou só bebo quando a sede aperta forte',
        'Irregular: dias muito secos e dias ok',
        'Razoável na maior parte do tempo',
        'Distribuo bem e ajusto em calor ou suor'
      ]
    },
    {
      id: 4,
      pergunta: 'Café em excesso ou pouca comida antes de suar — isso pesa em você?',
      tipo: 'multipla',
      opcoes: [
        'Sim, combina com sintomas (cabeça leve, formigamento, irritação)',
        'Às vezes, quando a agenda aperta',
        'Raro; já percebo o padrão',
        'Não costuma ser meu caso'
      ]
    },
    {
      id: 5,
      pergunta: 'Próximo passo que faria mais sentido para organizar hidratação e minerais?',
      tipo: 'multipla',
      opcoes: [
        'Conversa para entender se é hábito, calor ou outra causa',
        'Plano simples de copos/horários por algumas semanas',
        'Testar com checklist por conta própria',
        'Só informação por agora'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais sintomas = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais sintomas pós-esforço = mais pontos
    [3, 2, 1, 0], // Pergunta 3: pior hidratação = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais descompasso cafeína/comida = mais pontos
    [3, 2, 1, 0], // Pergunta 5: mais busca de apoio estruturado = mais pontos
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
    let perfil = 'DesequilibrioEletrolitico'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'desequilibrioEletrolitico'

    if (pontuacaoTotal >= 12) {
      perfil = 'Desequilíbrio Eletrolítico - Necessita Atenção'
      descricao = 'Seus sintomas indicam possível desequilíbrio eletrolítico. Um acompanhamento especializado pode ajudar a identificar e corrigir esse desequilíbrio, melhorando significativamente seu bem-estar.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional para desequilíbrio eletrolítico',
        'Criar um plano personalizado de hidratação e eletrólitos',
        'Utilizar produtos específicos para equilíbrio eletrolítico',
        'Ter acompanhamento para monitorar melhorias',
        'Aprender estratégias para manter equilíbrio constante'
      ]
      diagnosticoId = 'desequilibrioEletrolitico'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Possível Desequilíbrio Moderado'
      descricao = 'Você apresenta alguns sinais que podem indicar desequilíbrio eletrolítico moderado. Um acompanhamento pode ajudar a otimizar seu equilíbrio e prevenir problemas futuros.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em avaliação personalizada',
        'Ter um plano de hidratação otimizado',
        'Utilizar produtos que mantêm equilíbrio eletrolítico',
        'Acompanhar progresso com suporte profissional',
        'Aprender a otimizar sua hidratação'
      ]
      diagnosticoId = 'desequilibrioModerado'
    } else {
      perfil = 'Equilíbrio Eletrolítico Adequado'
      descricao = 'Você parece ter um bom equilíbrio eletrolítico! Mesmo assim, um acompanhamento preventivo pode ajudar a manter esse equilíbrio e otimizar ainda mais seu bem-estar.'
      cor = 'green'
      recomendacoes = [
        'Manter bom equilíbrio com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm equilíbrio',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de hidratação'
      ]
      diagnosticoId = 'equilibrioAdequado'
    }

    const diagnostico = eletrolitosDiagnosticos.wellness[diagnosticoId as keyof typeof eletrolitosDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Diagnóstico de Eletrólitos"
        defaultDescription="Descubra seu equilíbrio eletrolítico e como otimizá-lo"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('diagnostico-eletrolitos')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="⚡"
              defaultTitle="Diagnóstico de Eletrólitos"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu equilíbrio eletrolítico e como otimizá-lo
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para identificar desequilíbrios e criar estratégias eficazes
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="⚡ Começar Diagnóstico de Eletrólitos - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-cyan-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all transform hover:scale-[1.02]"
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
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Diagnóstico Eletrolítico</h2>
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

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200">
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
                        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4 border-l-4 border-cyan-500">
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
                resultadoTexto={`Perfil: ${resultado.perfil}`}
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
          textoRecalcular="↺ Refazer Diagnóstico"
          />
          </div>
        )}
      </main>
    </div>
  )
}

