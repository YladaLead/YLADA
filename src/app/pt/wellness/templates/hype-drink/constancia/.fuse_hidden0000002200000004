'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import HypeDrinkCTA from '@/components/wellness/HypeDrinkCTA'
import { quizConstanciaDiagnosticos } from '@/lib/diagnostics'

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
  resultadoId: string
  diagnostico?: any
}

const defaultConfig: TemplateBaseProps['config'] = {
  id: 'quiz-constancia',
  name: 'Quiz: Constância & Rotina',
  description: 'Identifique como manter uma rotina saudável todos os dias',
  slug: 'quiz-constancia',
  profession: 'wellness'
}

export default function QuizConstancia({ config = defaultConfig }: { config?: TemplateBaseProps['config'] }) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente dificuldade em manter uma rotina saudável todos os dias?',
      tipo: 'multipla',
      opcoes: [
        'Sempre',
        'Às vezes',
        'Raramente',
        'Nunca'
      ]
    },
    {
      id: 2,
      pergunta: 'O que mais te atrapalha na rotina?',
      tipo: 'multipla',
      opcoes: [
        'Falta de energia',
        'Falta de foco',
        'Falta de tempo',
        'Falta de motivação'
      ]
    },
    {
      id: 3,
      pergunta: 'Você já iniciou alguma rotina saudável?',
      tipo: 'multipla',
      opcoes: [
        'Sim, e mantive',
        'Sim, mas parei',
        'Não, nunca tentei'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 1], // Pergunta 1
    [3, 3, 2, 2], // Pergunta 2
    [1, 2, 3]     // Pergunta 3
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

  const calcularResultado = (respostas: number[]) => {
    let score = 0
    respostas.forEach((resposta, index) => {
      score += pontosPorOpcao[index][resposta]
    })

    let resultado: Resultado

    if (score <= 5) {
      const diagnostico = quizConstanciaDiagnosticos.wellness?.rotinaEstabelecida
      resultado = {
        score,
        perfil: 'Rotina Estabelecida',
        descricao: 'Ótimo! Você já tem uma rotina estabelecida.',
        cor: 'green',
        recomendacoes: [
          'O Hype Drink pode ajudar a manter essa constância nos dias mais puxados.',
          'Ele pode ser útil para manter energia e foco constantes.'
        ],
        resultadoId: 'rotinaEstabelecida',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Você já tem uma rotina estabelecida',
          causaRaiz: '🔍 CAUSA RAIZ: Parabéns! Você já consegue manter uma rotina saudável. O Hype Drink pode ajudar a manter essa constância, especialmente nos dias mais puxados.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: Continue mantendo sua rotina. O Hype Drink pode ser um aliado nos momentos de maior demanda.',
          plano7Dias: '📅 PLANO 7 DIAS: Use o Hype Drink nos dias mais intensos para manter energia e foco constantes.',
          suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink pode complementar sua rotina já estabelecida, especialmente em momentos de maior demanda.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha sua alimentação equilibrada. O Hype Drink pode ajudar a manter energia e hidratação nos dias mais puxados.',
          proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns pela constância! O Hype Drink pode ajudar a manter isso. Quer experimentar?'
        }
      }
    } else {
      const diagnostico = quizConstanciaDiagnosticos.wellness?.dificuldadeConstancia
      resultado = {
        score,
        perfil: 'Dificuldade de Constância',
        descricao: 'Sem energia e foco, a rotina não se sustenta.',
        cor: 'orange',
        recomendacoes: [
          'O Hype Drink entra como um facilitador de constância, ajudando nos dias mais puxados.',
          'Ele combina energia, foco e hidratação em uma solução prática para o dia a dia.'
        ],
        resultadoId: 'dificuldadeConstancia',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Você tem dificuldade em manter constância na rotina',
          causaRaiz: '🔍 CAUSA RAIZ: Sem energia e foco, a rotina não se sustenta. O Hype Drink pode ajudar a facilitar a constância, especialmente nos dias mais puxados.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: O Hype Drink pode ser um facilitador de constância. Ele ajuda a manter energia e foco, especialmente nos dias mais difíceis.',
          plano7Dias: '📅 PLANO 7 DIAS: Use o Hype Drink pela manhã para começar o dia com mais energia e foco. Ele pode ajudar a manter a rotina todos os dias.',
          suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink combina cafeína natural, vitaminas e hidratação em uma solução prática que pode facilitar a constância diária.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. O Hype Drink pode complementar sua rotina, especialmente para manter energia e foco constantes.',
          proximoPasso: '🎯 PRÓXIMO PASSO: O Hype Drink pode ajudar a facilitar a constância na sua rotina. Quer experimentar?'
        }
      }
    }

    setResultado(resultado)
    setEtapa('resultado')
  }

  const voltar = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
      setRespostas(respostas.slice(0, -1))
    } else {
      setEtapa('landing')
    }
  }

  const recomecar = () => {
    setEtapa('landing')
    setPerguntaAtual(0)
    setRespostas([])
    setResultado(null)
  }

  if (etapa === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <WellnessHeader showLogoOnly={true} />
        <WellnessLanding
          title="🎯 Por Que Você Não Consegue Manter a Rotina?"
          description="Descubra em 2 minutos o que está impedindo você de manter uma rotina constante e como resolver isso de forma simples"
          benefits={[
            'Identifique os obstáculos que quebram sua rotina',
            'Descubra como facilitar hábitos diários',
            'Receba um plano prático para manter constância',
            'Conheça uma solução que facilita sua rotina diária'
          ]}
          onStart={iniciarQuiz}
          ctaText="▶️ Descobrir Como Manter Rotina - Grátis!"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <WellnessHeader showLogoOnly={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Seu Resultado</h2>
            <div className={`p-4 rounded-lg mb-6 bg-${resultado.cor}-50 border-2 border-${resultado.cor}-200`}>
              <h3 className="text-xl font-semibold mb-2">{resultado.perfil}</h3>
              <p className="text-gray-700 mb-4">{resultado.descricao}</p>
              <ul className="list-disc list-inside space-y-2">
                {resultado.recomendacoes.map((rec, index) => (
                  <li key={index} className="text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>

            {resultado.diagnostico && (
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.diagnostico}</h4>
                  <p className="text-gray-600">{resultado.diagnostico.causaRaiz}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.acaoImediata}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.plano7Dias}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.suplementacao}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.alimentacao}</h4>
                </div>
                {resultado.diagnostico.proximoPasso && (
                  <div>
                    <h4 className="font-semibold mb-2">{resultado.diagnostico.proximoPasso}</h4>
                  </div>
                )}
              </div>
            )}

            {/* CTA Forte - Foco em Conversão */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                🚀 Quer Experimentar o Hype Drink?
              </h3>
              <p className="text-gray-700 text-center mb-4">
                O Hype Drink pode ajudar a facilitar a constância na sua rotina, especialmente nos dias mais difíceis!
              </p>
              <HypeDrinkCTA
                config={config}
                resultado={resultado.perfil}
                mensagemPersonalizada={`Olá! Completei o Quiz de Constância e meu resultado foi: ${resultado.perfil}. Gostaria de saber mais sobre o Hype Drink!`}
              />
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <WellnessHeader config={config} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Pergunta {perguntaAtual + 1} de {perguntas.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">
            {perguntas[perguntaAtual].pergunta}
          </h2>

          <div className="space-y-3">
            {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
              <button
                key={index}
                onClick={() => responder(index)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-900 font-medium"
              >
                {opcao}
              </button>
            ))}
          </div>

          {perguntaAtual > 0 && (
            <button
              onClick={voltar}
              className="mt-6 text-blue-600 hover:text-blue-800"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

