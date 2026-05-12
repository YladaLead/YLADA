'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { conheceSeuCorpoDiagnosticos } from '@/lib/diagnostics'

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

export default function VoceConheceSeuCorpo({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente que conhece bem seu corpo e como ele funciona?',
      tipo: 'multipla',
      opcoes: [
        'Não, preciso muito entender melhor meu corpo',
        'Parcialmente, mas quero conhecer mais',
        'Bastante, mas sempre há o que aprender',
        'Sim, conheço muito bem meu corpo'
      ]
    },
    {
      id: 2,
      pergunta: 'Você costuma perceber fome, sono ou dor antes de virar crise?',
      tipo: 'multipla',
      opcoes: [
        'Quase nunca — só noto quando já “estourou”',
        'Às vezes percebo tarde demais',
        'Na maior parte do tempo percebo com antecedência',
        'Escuto esses sinais cedo e ajusto o dia com frequência'
      ]
    },
    {
      id: 3,
      pergunta: 'Quão claros são os sintomas que você sente no corpo (energia, digestão, humor)?',
      tipo: 'multipla',
      opcoes: [
        'Bem confusos: misturo cansaço com fome, estresse ou doença',
        'Um pouco confusos em alguns dias',
        'Razoavelmente claros na maior parte do tempo',
        'Consigo nomear o que muda com sono, comida ou ciclo'
      ]
    },
    {
      id: 4,
      pergunta: 'Com que frequência você para para observar o corpo (respiração, tensão, postura) no dia?',
      tipo: 'multipla',
      opcoes: [
        'Quase nunca — vivo no automático',
        'Só quando algo dói ou incomoda forte',
        'Algumas pausas curtas em dias mais tranquilos',
        'Tenho pequenos rituais que me reconectam com o corpo'
      ]
    },
    {
      id: 5,
      pergunta: 'O que mais descreve o seu próximo passo em relação a esse autoconhecimento?',
      tipo: 'multipla',
      opcoes: [
        'Preciso de alguém que me ajude a juntar as peças — sozinho(a) não estou conseguindo',
        'Quero conversa para validar hipóteses e montar próximos passos com método',
        'Quero testar um ajuste pequeno e ver como o corpo reage',
        'Por agora só quero observar e anotar por conta própria'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: menos conhecimento percebido = mais pontos
    [3, 2, 1, 0], // Pergunta 2: menos escuta aos sinais = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais confusão sobre sintomas = mais pontos
    [3, 2, 1, 0], // Pergunta 4: menos observação corporal = mais pontos
    [3, 2, 1, 0], // Pergunta 5: mais necessidade de estrutura/apoio = mais pontos
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
    let perfil = 'ConhecimentoBaixo'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'conhecimentoBaixo'

    if (pontuacaoTotal >= 12) {
      perfil = 'Conhecimento Baixo - Necessita Orientação'
      descricao = 'Seu perfil indica que você precisa conhecer melhor seu corpo. Um acompanhamento especializado pode ajudar a entender seus sinais, identificar necessidades e criar estratégias personalizadas para melhorar seu bem-estar e autoconhecimento corporal.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional para autoconhecimento',
        'Criar um plano personalizado para conhecer seu corpo',
        'Utilizar produtos e estratégias de observação',
        'Ter acompanhamento constante para monitorar sinais',
        'Aprender estratégias para entender melhor seu corpo'
      ]
      diagnosticoId = 'conhecimentoBaixo'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Conhecimento Moderado - Aprofundamento Necessário'
      descricao = 'Você tem uma base de conhecimento sobre seu corpo, mas pode ser aprofundado. Um acompanhamento pode ajudar a entender melhor seus sinais e criar estratégias mais personalizadas para seu bem-estar.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em avaliação personalizada para aprofundar conhecimento',
        'Ter um plano de autoconhecimento corporal',
        'Utilizar produtos que ajudam na observação',
        'Acompanhar progresso com suporte profissional',
        'Aprender estratégias avançadas de autoconhecimento'
      ]
      diagnosticoId = 'conhecimentoModerado'
    } else {
      perfil = 'Bom Conhecimento - Otimização e Manutenção'
      descricao = 'Você já conhece bem seu corpo! Mesmo assim, um acompanhamento preventivo pode ajudar a manter esse conhecimento atualizado e otimizar ainda mais seu autoconhecimento corporal.'
      cor = 'green'
      recomendacoes = [
        'Manter conhecimento com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm autoconhecimento',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de observação corporal'
      ]
      diagnosticoId = 'conhecimentoAlto'
    }

    const diagnostico = conheceSeuCorpoDiagnosticos.wellness[diagnosticoId as keyof typeof conheceSeuCorpoDiagnosticos.wellness]

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
        defaultTitle="Você Conhece o Seu Corpo?"
        defaultDescription="Descubra seu nível de autoconhecimento corporal"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('conhece-seu-corpo')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🧠"
              defaultTitle="Você Conhece o Seu Corpo?"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu nível de autoconhecimento corporal
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para entender seu autoconhecimento
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="🧠 Começar Avaliação - É Grátis"
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
                <div className="text-5xl mb-4">🧠</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Conhecimento Corporal</h2>
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

