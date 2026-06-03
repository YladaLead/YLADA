'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import HypeDrinkCTA from '@/components/wellness/HypeDrinkCTA'
import { quizPreTreinoDiagnosticos } from '@/lib/diagnostics'

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
  id: 'quiz-pre-treino',
  name: 'Quiz: Pré-Treino Ideal',
  description: 'Identifique o pré-treino ideal para você',
  slug: 'quiz-pre-treino',
  profession: 'wellness'
}

export default function QuizPreTreino({ config = defaultConfig }: { config?: TemplateBaseProps['config'] }) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente disposição antes de treinar?',
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
      pergunta: 'Já teve desconforto com pré-treinos fortes?',
      tipo: 'multipla',
      opcoes: [
        'Sim, taquicardia',
        'Sim, ansiedade',
        'Sim, desconforto',
        'Não'
      ]
    },
    {
      id: 3,
      pergunta: 'Seu treino é mais:',
      tipo: 'multipla',
      opcoes: [
        'Força',
        'Cardio',
        'Funcional',
        'Misto'
      ]
    },
    {
      id: 4,
      pergunta: 'Você treina em qual horário?',
      tipo: 'multipla',
      opcoes: [
        'Manhã',
        'Tarde',
        'Noite'
      ]
    },
    {
      id: 5,
      pergunta: 'Você prefere algo:',
      tipo: 'multipla',
      opcoes: [
        'Leve',
        'Moderado',
        'Forte'
      ]
    }
  ]

  const pontosPorOpcao = [
    [1, 2, 3, 3], // Pergunta 1
    [3, 3, 2, 1], // Pergunta 2
    [2, 2, 2, 2], // Pergunta 3
    [2, 2, 1],    // Pergunta 4
    [3, 2, 1]     // Pergunta 5
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

    const diagnostico = quizPreTreinoDiagnosticos.wellness?.preTreinoLeve
    const resultado: Resultado = {
      score,
      perfil: 'Pré-Treino Leve Recomendado',
      descricao: 'Para o seu perfil, uma bebida funcional com cafeína natural e hidratação pode ser mais adequada.',
      cor: 'orange',
      recomendacoes: [
        'Uma bebida funcional leve pode ser uma alternativa mais adequada aos pré-treinos agressivos.',
        'Combina cafeína natural, vitaminas e hidratação sem excessos.'
      ],
      resultadoId: 'preTreinoLeve',
      diagnostico: diagnostico || {
        diagnostico: '📋 DIAGNÓSTICO: Para o seu perfil, uma bebida funcional leve pode ser mais adequada do que pré-treinos agressivos',
        causaRaiz: '🔍 CAUSA RAIZ: Pré-treinos muito estimulantes podem causar taquicardia, ansiedade ou desconforto. Uma alternativa mais leve, com cafeína natural e hidratação, pode ser ideal para quem busca desempenho sem exageros.',
        acaoImediata: '⚡ AÇÃO IMEDIATA: Uma bebida funcional leve pode ser uma alternativa mais adequada aos pré-treinos agressivos. Combina cafeína natural, vitaminas e hidratação sem excessos.',
        plano7Dias: '📅 PLANO 7 DIAS: Experimente uma bebida funcional leve antes do treino. Pode ajudar a manter energia e hidratação durante o exercício, sem os efeitos colaterais de estimulantes muito fortes.',
        suplementacao: '💊 SUPLEMENTAÇÃO: Uma bebida funcional com cafeína natural (chá verde e preto), vitaminas do complexo B e hidratação pode ser uma alternativa mais leve aos pré-treinos tradicionais.',
        alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada antes do treino. Uma bebida funcional pode complementar sua rotina, especialmente para quem não se adapta bem a pré-treinos muito fortes.',
        proximoPasso: '🎯 PRÓXIMO PASSO: Para o seu perfil, uma bebida funcional leve pode ser a alternativa certa. Fale com quem te enviou este link para entender as opções disponíveis.'
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <WellnessHeader showLogoOnly={true} />
        <WellnessLanding
          title="🏋️ Qual o Pré-Treino Perfeito Para Você?"
          description="Descubra em 2 minutos se você precisa de energia leve ou forte para seus treinos e encontre a solução ideal"
          benefits={[
            'Identifique seu perfil de treino e necessidades',
            'Descubra se pré-treinos fortes causam ansiedade',
            'Conheça uma alternativa leve e natural',
            'Receba um plano personalizado para seus treinos'
          ]}
          onStart={iniciarQuiz}
          ctaText="▶️ Descobrir Meu Pré-Treino Ideal - Grátis!"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
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
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                🚀 Quer Experimentar a bebida funcional?
              </h3>
              <p className="text-gray-700 text-center mb-4">
                Para o seu perfil, a bebida funcional é uma alternativa mais leve e adequada aos pré-treinos agressivos!
              </p>
              <HypeDrinkCTA
                config={config}
                resultado={resultado.perfil}
                mensagemPersonalizada={`Olá! Completei o Quiz de Pré-Treino e meu resultado foi: ${resultado.perfil}. Gostaria de saber mais sobre a bebida funcional!`}
              />
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
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
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
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
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-gray-900 font-medium"
              >
                {opcao}
              </button>
            ))}
          </div>

          {perguntaAtual > 0 && (
            <button
              onClick={voltar}
              className="mt-6 text-orange-600 hover:text-orange-800"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

