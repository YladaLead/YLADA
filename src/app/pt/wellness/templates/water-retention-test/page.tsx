'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { retencaoLiquidosDiagnosticos } from '@/lib/diagnostics'

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

export default function TesteRetencaoLiquidos({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente que retém líquidos ou tem inchaço frequente?',
      tipo: 'multipla',
      opcoes: [
        'Sim, sinto muito inchaço e desconforto',
        'Sim, às vezes sinto retenção leve',
        'Às vezes, mas não sei se é retenção',
        'Não, não tenho esse problema'
      ]
    },
    {
      id: 2,
      pergunta: 'Quando incha, isso costuma coincidir com quê?',
      tipo: 'multipla',
      opcoes: [
        'Com quase tudo: sal, final do dia, hormônios ou viagem — difícil prever',
        'Com refeições mais pesadas ou pouca água no dia',
        'Só em alguns contextos que já identifiquei',
        'É raro ou tenho padrão bem claro e controlável'
      ]
    },
    {
      id: 3,
      pergunta: 'Movimento e pernas no fim do dia — o que mais combina?',
      tipo: 'multipla',
      opcoes: [
        'Muitas horas parado(a) e pernas/pés pesados quase sempre',
        'Pouco movimento e final do dia costuma piorar',
        'Depende do dia; quando me movimento melhora',
        'Movimento e hidratação já ajudam bastante a evitar o pior'
      ]
    },
    {
      id: 4,
      pergunta: 'Sal em excesso, álcool ou noites muito curtas — isso pesa no inchaço para você?',
      tipo: 'multipla',
      opcoes: [
        'Muito: semanas em que um ou mais disso aparece forte',
        'Frequentemente em dias corridos',
        'Às vezes, já noto o padrão',
        'Pouco ou consigo compensar com hábito'
      ]
    },
    {
      id: 5,
      pergunta: 'Próximo passo que faria mais sentido para entender essa retenção?',
      tipo: 'multipla',
      opcoes: [
        'Conversa para juntar sintomas e rotina com método',
        'Diário simples (água, sal, sono, inchaço) por 10 dias',
        'Testar ajuste de passos ou horário de refeição sozinho(a)',
        'Só informação por agora'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais retenção = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais padrão difuso / difícil = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais sedentarismo / peso nas pernas = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais gatilhos externos = mais pontos
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
    let perfil = 'RetencaoAlta'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'retencaoAlta'

    if (pontuacaoTotal >= 12) {
      perfil = 'Retenção Alta - Necessita Atenção Urgente'
      descricao = 'Seu perfil indica retenção alta de líquidos. Um acompanhamento especializado é essencial para identificar causas e criar estratégias personalizadas para reduzir o inchaço e melhorar seu bem-estar.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional urgente para retenção',
        'Criar um plano personalizado para reduzir líquidos',
        'Utilizar produtos específicos para retenção',
        'Ter acompanhamento constante para monitorar progresso',
        'Aprender estratégias para prevenir retenção'
      ]
      diagnosticoId = 'retencaoAlta'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Retenção Moderada - Prevenção Necessária'
      descricao = 'Você apresenta retenção moderada. Um acompanhamento preventivo pode ajudar a reduzir a retenção e manter seu corpo em equilíbrio hidroeletrolítico.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em avaliação preventiva personalizada',
        'Ter um plano de redução de retenção',
        'Utilizar produtos que ajudam a reduzir líquidos',
        'Acompanhar progresso com suporte profissional',
        'Aprender estratégias preventivas eficazes'
      ]
      diagnosticoId = 'retencaoModerada'
    } else {
      perfil = 'Retenção Baixa - Manutenção Preventiva'
      descricao = 'Você tem baixa retenção! Mesmo assim, um acompanhamento preventivo pode ajudar a manter esse equilíbrio e otimizar ainda mais sua saúde hidroeletrolítica.'
      cor = 'green'
      recomendacoes = [
        'Manter baixa retenção com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm equilíbrio hidroeletrolítico',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de prevenção'
      ]
      diagnosticoId = 'retencaoBaixa'
    }

    const diagnostico = retencaoLiquidosDiagnosticos.wellness[diagnosticoId as keyof typeof retencaoLiquidosDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Teste de Retenção de Líquidos"
        defaultDescription="Descubra seu nível de retenção e como reduzir"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('retencao-liquidos')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💧"
              defaultTitle="Teste de Retenção de Líquidos"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu nível de retenção e como reduzir
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para identificar retenção de líquidos
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="💧 Começar Teste - É Grátis"
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
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all" 
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
                <div className="text-5xl mb-4">💧</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Nível de Retenção</h2>
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

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
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
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
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
                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 border-l-4 border-blue-500">
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
          textoRecalcular="↺ Refazer Teste"
          />
          </div>
        )}
      </main>
    </div>
  )
}

