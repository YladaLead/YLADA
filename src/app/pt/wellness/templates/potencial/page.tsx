'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'

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

export default function QuizPotencial({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Como você avalia seu desempenho atual?',
      tipo: 'multipla',
      opcoes: [
        'Abaixo do meu potencial',
        'Utilizando parte do meu potencial',
        'Bom uso do potencial',
        'Extraindo o máximo do meu potencial'
      ]
    },
    {
      id: 2,
      pergunta: 'Com que frequência você revisa suas metas?',
      tipo: 'multipla',
      opcoes: [
        'Raramente ou nunca',
        'Anualmente',
        'Semestralmente',
        'Mensalmente ou mais'
      ]
    },
    {
      id: 3,
      pergunta: 'Você investe em seu desenvolvimento pessoal?',
      tipo: 'multipla',
      opcoes: [
        'Não, não tenho tempo/dinheiro',
        'Às vezes, esporadicamente',
        'Regularmente, sempre que possível',
        'Constantemente, é prioridade'
      ]
    },
    {
      id: 4,
      pergunta: 'Como você lida com desafios e oportunidades?',
      tipo: 'multipla',
      opcoes: [
        'Evito, prefiro a zona de conforto',
        'Enfrento apenas quando necessário',
        'Busco ativamente novos desafios',
        'Crio desafios e oportunidades para crescer'
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
      perfil = 'Potencial Extraído'
      descricao = 'Você está extraindo o máximo do seu potencial! Continue investindo em seu crescimento.'
      cor = 'green'
      recomendacoes = [
        'Manter investimento em desenvolvimento',
        'Compartilhar conhecimento com outros',
        'Expandir impacto e influência',
        'Mentorear e multiplicar conhecimento'
      ]
    } else if (score >= 6) {
      perfil = 'Potencial em Crescimento'
      descricao = 'Você está no caminho certo! Com mais foco, pode acelerar seu desenvolvimento.'
      cor = 'blue'
      recomendacoes = [
        'Aumentar frequência de revisão de metas',
        'Definir rotina de desenvolvimento diária',
        'Buscar mentoria de alto nível',
        'Criar plano de crescimento trimestral'
      ]
    } else if (score >= 3) {
      perfil = 'Potencial Subutilizado'
      descricao = 'Você tem muito potencial, mas está usando apenas uma parte dele. Hora de acelerar!'
      cor = 'orange'
      recomendacoes = [
        'Urgente: Começar investir em desenvolvimento',
        'Definir metas claras e mensuráveis',
        'Buscar mentoria profissional',
        'Criar disciplina de crescimento diário'
      ]
    } else {
      perfil = 'Potencial Adormecido'
      descricao = 'Você tem potencial incrível, mas está dormindo! É hora de despertar e crescer.'
      cor = 'red'
      recomendacoes = [
        'URGENTE: Despertar seu potencial',
        'Definir metas ambiciosas imediatamente',
        'Investir em educação e treinamento',
        'Buscar mentoria para guiar seu crescimento'
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Quiz: Potencial e Crescimento"
        defaultDescription="Seu potencial está sendo bem aproveitado?"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="📈"
            defaultTitle="Potencial e Crescimento"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Descubra se seu potencial está sendo bem aproveitado
                </p>
                <p className="text-gray-600">
                  Avalie seu nível atual de desenvolvimento e oportunidades de crescimento
                </p>
              </>
            }
            benefits={[
              'Se está aproveitando todo seu potencial',
              'Oportunidades de crescimento que está perdendo',
              'Como acelerar seu desenvolvimento',
              'Estratégias para alcançar seu potencial máximo'
            ]}
            onStart={iniciarQuiz}
            buttonText="▶️ Iniciar Quiz - É Grátis"
          />
        )}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
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
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
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
                  Estratégias de Desenvolvimento
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-indigo-600 mr-2">✓</span>
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
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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

