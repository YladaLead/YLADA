'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { nutridoVsAlimentadoDiagnosticos } from '@/lib/diagnostics'

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

export default function VoceNutridoOuApenasAlimentado({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente que está apenas alimentado ou realmente nutrido?',
      tipo: 'multipla',
      opcoes: [
        'Apenas alimentado, não sinto que estou nutrido adequadamente',
        'Parcialmente nutrido, mas preciso melhorar',
        'Bastante nutrido, mas posso otimizar',
        'Sim, me sinto muito bem nutrido'
      ]
    },
    {
      id: 2,
      pergunta: 'Proteína, legumes e fruta — na sua semana real, como entram?',
      tipo: 'multipla',
      opcoes: [
        'Pouco: quase só calorias “vazias” ou repetitivas',
        'Irregular: alguns dias bem, outros só o básico',
        'Razoável na maior parte do tempo',
        'Consigo variedade e cor no prato com frequência'
      ]
    },
    {
      id: 3,
      pergunta: 'Depois de refeições, como costuma ser sua energia e digestão?',
      tipo: 'multipla',
      opcoes: [
        'Pesado(a), com sonolência ou desconforto frequente',
        'Oscila: algumas refeições “seguram”, outras não',
        'Na maior parte do tempo digestão ok',
        'Sinto leveza e energia estável na maior parte dos dias'
      ]
    },
    {
      id: 4,
      pergunta: 'Ultraprocessados e doces — frequência sem julgar, só observando:',
      tipo: 'multipla',
      opcoes: [
        'Muito altos na semana',
        'Frequentes em dias corridos',
        'Pontuais',
        'Baixos: base é comida minimamente preparada'
      ]
    },
    {
      id: 5,
      pergunta: 'Próximo passo que faria mais sentido para nutrir melhor no seu ritmo?',
      tipo: 'multipla',
      opcoes: [
        'Conversa para montar prioridades com quem entende rotina real',
        'Lista simples de pratos e compras por 2 semanas',
        'Testar um hábito (ex.: proteína no almoço) sozinho(a)',
        'Só informação por agora'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: menos nutrido = mais pontos
    [3, 2, 1, 0], // Pergunta 2: menos qualidade no prato = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais desconforto pós-refeição = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais ultraprocessados = mais pontos
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
    let perfil = 'ApenasAlimentado'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'apenasAlimentado'

    if (pontuacaoTotal >= 12) {
      perfil = 'Apenas Alimentado - Necessita Nutrição Adequada'
      descricao = 'Seu perfil indica que você está apenas se alimentando, mas não nutrido adequadamente. Um acompanhamento especializado é essencial para garantir que você receba todos os nutrientes necessários e transforme sua alimentação em nutrição real.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional urgente para nutrição adequada',
        'Criar um plano personalizado para garantir nutrição',
        'Utilizar produtos específicos para nutrição completa',
        'Ter acompanhamento constante para monitorar nutrição',
        'Aprender estratégias para transformar alimentação em nutrição'
      ]
      diagnosticoId = 'apenasAlimentado'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Parcialmente Nutrido - Otimização Necessária'
      descricao = 'Você está parcialmente nutrido, mas pode ser otimizado. Um acompanhamento pode ajudar a garantir que você receba todos os nutrientes necessários e transforme sua alimentação em nutrição completa.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em avaliação personalizada para nutrição completa',
        'Ter um plano de otimização nutricional',
        'Utilizar produtos que garantem nutrição adequada',
        'Acompanhar progresso com suporte profissional',
        'Aprender estratégias para maximizar nutrição'
      ]
      diagnosticoId = 'parcialmenteNutrido'
    } else {
      perfil = 'Bem Nutrido - Manutenção e Otimização'
      descricao = 'Você já está bem nutrido! Mesmo assim, um acompanhamento preventivo pode ajudar a manter essa nutrição adequada e otimizar ainda mais sua saúde nutricional.'
      cor = 'green'
      recomendacoes = [
        'Manter boa nutrição com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm nutrição adequada',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de nutrição'
      ]
      diagnosticoId = 'bemNutrido'
    }

    const diagnostico = nutridoVsAlimentadoDiagnosticos.wellness[diagnosticoId as keyof typeof nutridoVsAlimentadoDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Você está Nutrido ou Apenas Alimentado?"
        defaultDescription="Descubra se você está realmente nutrido"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('nutrido-vs-alimentado')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🍎"
              defaultTitle="Você está Nutrido ou Apenas Alimentado?"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra se você está realmente nutrido
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para entender nutrição adequada
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="🍎 Começar Avaliação - É Grátis"
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
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all" 
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
                <div className="text-5xl mb-4">🍎</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Nível de Nutrição</h2>
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

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-6">
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
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
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
                        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4 border-l-4 border-orange-500">
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
          textoRecalcular="↺ Refazer Avaliação"
          />
          </div>
        )}
      </main>
    </div>
  )
}

