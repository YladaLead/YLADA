'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { prontoEmagrecerDiagnosticos } from '@/lib/diagnostics'

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
      pergunta: 'Sobre tentativas de mudar peso ou hábito — o que mais descreve você?',
      tipo: 'multipla',
      opcoes: [
        'Histórico de ir e voltar ou frustração forte com balança/espelho',
        'Algumas tentativas sem manter consistência',
        'Retomada agora com mais consciência do que antes',
        'Início recente ou primeira vez encarando com método'
      ]
    },
    {
      id: 3,
      pergunta: 'Rotina de refeições (horários e regularidade) — como está hoje?',
      tipo: 'multipla',
      opcoes: [
        'Muito irregular: improviso ou pular refeições é comum',
        'Falha em mais de um dia da semana',
        'Oscila, mas tem dias bem organizados',
        'Tenho base de horários na maior parte do tempo'
      ]
    },
    {
      id: 4,
      pergunta: 'Sono, estresse e comer “por nervoso” — o que mais combina?',
      tipo: 'multipla',
      opcoes: [
        'Quase sempre: noites ruins ou dias em que como fora de fome real',
        'Frequentemente em semanas mais carregadas',
        'Às vezes; já percebo alguns gatilhos',
        'Raramente: comida segue fome e descanso razoável'
      ]
    },
    {
      id: 5,
      pergunta: 'Que tipo de apoio faria mais sentido para você neste momento?',
      tipo: 'multipla',
      opcoes: [
        'Conversa para montar próximos passos realistas com quem entende o caso',
        'Clareza de etapas com acompanhamento em algumas semanas',
        'Material ou desafio para testar sozinho(a) com calma',
        'Só explorando informação, sem compromisso ainda'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais motivação declarada = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais fricção com tentativas passadas = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais desorganização alimentar = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais sono/estresse alimentar = mais pontos
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

    const diagnostico = prontoEmagrecerDiagnosticos.wellness[diagnosticoId as keyof typeof prontoEmagrecerDiagnosticos.wellness]

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

