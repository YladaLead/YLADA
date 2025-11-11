'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
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
}

export default function QuizPerfilBemestar({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Como você avalia seu nível de energia?',
      tipo: 'multipla',
      opcoes: [
        'Baixo, sinto cansaço constante',
        'Médio, tenho altos e baixos',
        'Alto, me sinto energizado',
        'Muito alto, super produtivo'
      ]
    },
    {
      id: 2,
      pergunta: 'Frequência de atividades físicas?',
      tipo: 'multipla',
      opcoes: [
        'Nunca ou raramente',
        '1x por semana',
        '2-3x por semana',
        '4x ou mais por semana'
      ]
    },
    {
      id: 3,
      pergunta: 'Como você lida com o estresse?',
      tipo: 'multipla',
      opcoes: [
        'Mal, estresse me afeta muito',
        'Moderadamente, tenho dificuldades',
        'Bem, consigo lidar na maioria das vezes',
        'Excelente, gerencio muito bem'
      ]
    },
    {
      id: 4,
      pergunta: 'Como você avalia sua qualidade de sono?',
      tipo: 'multipla',
      opcoes: [
        'Ruim, não durmo bem',
        'Moderada, às vezes acordado cansado',
        'Boa, durmo bem',
        'Excelente, descanso profundamente'
      ]
    }
  ]

  const pontosPorOpcao = [
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3]
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
    let score = 0

    resps.forEach((resp, index) => {
      score += pontosPorOpcao[index][resp]
    })

    let perfil = ''
    let descricao = ''
    let cor = ''
    let recomendacoes: string[] = []

    if (score >= 9) {
      perfil = 'Equilibrado'
      descricao = 'Parabéns! Você tem excelente equilíbrio e bem-estar. Continue mantendo os bons hábitos!'
      cor = 'green'
      recomendacoes = [
        'Manter rotina de exercícios',
        'Continuar hábitos de qualidade de vida',
        'Compartilhar sabedoria com outros',
        'Monitorar e otimizar continuamente'
      ]
    } else if (score >= 6) {
      perfil = 'Moderado'
      descricao = 'Você está no caminho certo! Com otimizações estratégicas, pode alcançar equilíbrio total.'
      cor = 'blue'
      recomendacoes = [
        'Aumentar frequência de atividades físicas',
        'Melhorar qualidade do sono',
        'Desenvolver estratégias anti-stress',
        'Criar rotina de autocuidado'
      ]
    } else if (score >= 3) {
      perfil = 'Precisa de Desenvolvimento'
      descricao = 'Você tem potencial, mas precisa priorizar sua saúde e bem-estar agora.'
      cor = 'orange'
      recomendacoes = [
        'Iniciar rotina de exercícios regularmente',
        'Melhorar hábitos de sono',
        'Desenvolver técnicas de gerenciamento de stress',
        'Buscar orientação para planejar bem-estar'
      ]
    } else {
      perfil = 'Priorizar Saúde'
      descricao = 'Você precisa urgentemente investir em seu bem-estar. É hora de mudar!'
      cor = 'red'
      recomendacoes = [
        'URGENTE: Começar prática regular de exercícios',
        'Priorizar qualidade do sono',
        'Desenvolver estratégias anti-stress diárias',
        'Buscar mentoria para criar plano de bem-estar'
      ]
    }

    setResultado({ score, perfil, descricao, cor, recomendacoes })
    setEtapa('resultado')
  }

  const cores = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  }

  const bordas = {
    green: 'border-green-300',
    blue: 'border-blue-300',
    orange: 'border-orange-300',
    red: 'border-red-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Quiz: Perfil de Bem-Estar"
        defaultDescription="Avaliação completa do seu bem-estar"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          const templateBenefits = getTemplateBenefits('wellness-profile')
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💚"
              defaultTitle="Perfil de Bem-Estar"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu perfil completo de bem-estar
                  </p>
                  <p className="text-gray-600">
                    Avaliação de saúde física, mental, emocional e social
                  </p>
                </>
              }
              discover={templateBenefits.discover}
              benefits={templateBenefits.whyUse}
              onStart={iniciarQuiz}
              buttonText="▶️ Iniciar Quiz - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {perguntas[perguntaAtual].pergunta}
            </h2>

            <div className="space-y-4">
              {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => responder(index)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-8 py-4 rounded-full text-white font-bold text-2xl mb-4 ${cores[resultado.cor]}`}>
                  {resultado.perfil}
                </div>
                <p className="text-gray-800 text-xl">{resultado.descricao}</p>
                <p className="text-sm text-gray-600 mt-2">Score: {resultado.score}/12</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Estratégias para Bem-Estar
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`${resultado.perfil} (Score: ${resultado.score}/12) - ${resultado.descricao}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setEtapa('quiz')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Fazer Quiz Novamente
              </button>
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setEtapa('landing')
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🏠 Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

