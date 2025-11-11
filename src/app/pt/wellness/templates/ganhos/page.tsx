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

export default function QuizGanhos({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Como você vê sua situação financeira atual?',
      tipo: 'multipla',
      opcoes: [
        'Dificuldade para chegar ao final do mês',
        'Suficiente para sobreviver',
        'Confortável, mas sem sobrar',
        'Próspera, consigo investir'
      ]
    },
    {
      id: 2,
      pergunta: 'Você tem uma fonte de renda adicional?',
      tipo: 'multipla',
      opcoes: [
        'Não, apenas uma fonte',
        'Sim, tenho freelas esporádicos',
        'Sim, tenho um negócio próprio',
        'Sim, tenho investimentos gerando renda'
      ]
    },
    {
      id: 3,
      pergunta: 'Quanto tempo você dedica a atividades que geram renda?',
      tipo: 'multipla',
      opcoes: [
        'Apenas trabalho fixo (40h semanais)',
        'Algumas horas extras (45-50h/semana)',
        'Dedico bastante tempo (55-60h/semana)',
        'Múltiplas fontes ativas (60h+/semana)'
      ]
    },
    {
      id: 4,
      pergunta: 'Você está satisfeito com sua capacidade de gerar renda?',
      tipo: 'multipla',
      opcoes: [
        'Não, sinto que poderia ganhar muito mais',
        'Parcialmente, consigo mais se me dedicar',
        'Sim, estou no meu limite atual',
        'Sim, estou prosperando como desejado'
      ]
    }
  ]

  const pontosPorOpcao = [
    [0, 1, 2, 3], // Pergunta 1
    [0, 1, 2, 3], // Pergunta 2
    [0, 1, 2, 3], // Pergunta 3
    [0, 1, 2, 3]  // Pergunta 4
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
      perfil = 'Prosperidade Exponencial'
      descricao = 'Você tem múltiplas fontes de renda e está prosperando! Seu estilo de vida permite ganhar mais.'
      cor = 'green'
      recomendacoes = [
        'Continuar diversificando fontes de renda',
        'Investir parte da renda gerada',
        'Mentorear outros para crescer junto',
        'Expandir negócios existentes'
      ]
    } else if (score >= 6) {
      perfil = 'Crescimento Acelerado'
      descricao = 'Você está no caminho certo! Com dedicação e estratégia, pode ganhar muito mais.'
      cor = 'blue'
      recomendacoes = [
        'Desenvolver segunda fonte de renda',
        'Investir em conhecimento profissional',
        'Buscar mentoria de quem já prosperou',
        'Criar plano de ação mensal'
      ]
    } else if (score >= 3) {
      perfil = 'Potencial Não Aproveitado'
      descricao = 'Você tem potencial, mas seu estilo de vida atual está limitando seus ganhos.'
      cor = 'orange'
      recomendacoes = [
        'Criar fonte de renda adicional',
        'Desenvolver habilidades de alto valor',
        'Montar um negócio próprio',
        'Investir em educação financeira'
      ]
    } else {
      perfil = 'Oportunidade de Transformação'
      descricao = 'Você pode multiplicar sua renda! Mas precisa mudar hábitos e criar novas oportunidades.'
      cor = 'red'
      recomendacoes = [
        'Urgente: Criar fonte de renda extra',
        'Desenvolver mindset de prosperidade',
        'Investir em capacitação profissional',
        'Buscar mentoria urgente para prosperar'
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Quiz: Ganhos e Prosperidade"
        defaultDescription="Seu estilo de vida permite ganhar mais?"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('quiz-ganhos')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💰"
              defaultTitle="Ganhos e Prosperidade"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Avalie se seu estilo de vida permite ganhar mais
                  </p>
                  <p className="text-gray-600">
                    Descubra como seu estilo de vida impacta sua capacidade de gerar renda
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="▶️ Iniciar Quiz - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all"
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
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all"
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
                  Recomendações para Prosperar
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-yellow-600 mr-2">✓</span>
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
                className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
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

