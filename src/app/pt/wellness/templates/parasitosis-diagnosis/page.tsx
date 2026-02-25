'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { diagnosticoParasitoseDiagnosticos } from '@/lib/diagnostics'

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

export default function DiagnosticoParasitose({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente sintomas como dor abdominal, náusea, diarreia ou desconforto digestivo?',
      tipo: 'multipla',
      opcoes: [
        'Sim, tenho esses sintomas frequentemente',
        'Sim, acontece várias vezes por semana',
        'Às vezes, mas não é constante',
        'Raramente ou nunca tenho esses sintomas'
      ]
    },
    {
      id: 2,
      pergunta: 'Você já teve contato com água ou alimentos que podem estar contaminados?',
      tipo: 'multipla',
      opcoes: [
        'Sim, frequentemente tenho esse tipo de exposição',
        'Sim, às vezes posso ter tido contato',
        'Talvez, mas não tenho certeza',
        'Não, sempre tomo cuidado com isso'
      ]
    },
    {
      id: 3,
      pergunta: 'Você sente que precisa de ajuda para identificar e tratar possíveis parasitoses?',
      tipo: 'multipla',
      opcoes: [
        'Sim, preciso muito de orientação profissional',
        'Sim, seria muito útil ter um diagnóstico',
        'Talvez, se for algo prático e eficaz',
        'Não, consigo resolver sozinho(a)'
      ]
    },
    {
      id: 4,
      pergunta: 'Você valoriza um protocolo direcionado para tratar parasitoses de forma segura?',
      tipo: 'multipla',
      opcoes: [
        'Muito, é essencial para minha saúde',
        'Bastante, procuro opções adequadas',
        'Moderadamente, se for algo eficaz',
        'Pouco, não me preocupo muito'
      ]
    },
    {
      id: 5,
      pergunta: 'Você está aberto(a) para ter um acompanhamento especializado em diagnóstico de parasitose?',
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
    [3, 2, 1, 0], // Pergunta 2: mais exposição = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais necessidade = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais valorização = mais pontos
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
    let perfil = 'Parasitose Avançada'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'parasitoseAvancada'

    if (pontuacaoTotal >= 12) {
      perfil = 'Parasitose Avançada'
      descricao = 'Os sinais sugerem parasitose avançada ou recorrente. É indispensável acompanhamento especializado multidisciplinar para identificar e tratar adequadamente.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional urgente para parasitose avançada',
        'Criar um protocolo direcionado e seguro',
        'Utilizar produtos específicos para tratamento',
        'Ter acompanhamento multidisciplinar',
        'Aprender estratégias para prevenir recorrências'
      ]
      diagnosticoId = 'parasitoseAvancada'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Parasitose Moderada'
      descricao = 'Há sinais consistentes de parasitose moderada. O ideal é iniciar um protocolo direcionado para evitar agravamento e restabelecer o equilíbrio intestinal.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em diagnóstico específico de parasitose',
        'Ter um protocolo direcionado e eficaz',
        'Utilizar produtos que tratam parasitoses específicas',
        'Acompanhar progresso com suporte profissional',
        'Aprender a prevenir e tratar adequadamente'
      ]
      diagnosticoId = 'parasitoseModerada'
    } else {
      perfil = 'Parasitose Básica'
      descricao = 'Seus sinais indicam possível parasitose inicial. Um acompanhamento de bem-estar especializado é essencial para confirmar o quadro e iniciar um protocolo seguro.'
      cor = 'green'
      recomendacoes = [
        'Confirmar diagnóstico com avaliação profissional',
        'Iniciar protocolo básico e seguro',
        'Utilizar produtos adequados para parasitose inicial',
        'Ter acompanhamento preventivo',
        'Aprender estratégias para manter saúde digestiva'
      ]
      diagnosticoId = 'parasitoseBasica'
    }

    const diagnostico = diagnosticoParasitoseDiagnosticos.wellness[diagnosticoId as keyof typeof diagnosticoParasitoseDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <WellnessHeader
        defaultTitle="Diagnóstico de Parasitose"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('template-diagnostico-parasitose')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🦠"
              defaultTitle="Diagnóstico de Parasitose"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Identifique e trate parasitoses de forma segura
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para diagnosticar e criar protocolos direcionados
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="🦠 Começar Diagnóstico de Parasitose - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all transform hover:scale-[1.02]"
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
                <div className="text-5xl mb-4">🦠</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Diagnóstico de Parasitose</h2>
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

              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-red-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
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
                        <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 border-l-4 border-red-500">
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

