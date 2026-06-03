'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import HypeDrinkCTA from '@/components/wellness/HypeDrinkCTA'
import { quizRotinaProdutivaDiagnosticos } from '@/lib/diagnostics'

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
  id: 'quiz-rotina-produtiva',
  name: 'Quiz: Rotina Produtiva',
  description: 'Descubra como melhorar sua produtividade e constância',
  slug: 'quiz-rotina-produtiva',
  profession: 'wellness'
}

export default function QuizRotinaProdutiva({ config = defaultConfig }: { config?: TemplateBaseProps['config'] }) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Seu dia começa organizado?',
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
      pergunta: 'Você sente queda de produtividade antes das 15h?',
      tipo: 'multipla',
      opcoes: [
        'Sempre',
        'Às vezes',
        'Raramente',
        'Nunca'
      ]
    },
    {
      id: 3,
      pergunta: 'Você costuma pular refeições ou esquecer de beber água?',
      tipo: 'multipla',
      opcoes: [
        'Sempre',
        'Às vezes',
        'Raramente',
        'Nunca'
      ]
    },
    {
      id: 4,
      pergunta: 'Sua rotina é:',
      tipo: 'multipla',
      opcoes: [
        'Previsível',
        'Corrida',
        'Caótica'
      ]
    },
    {
      id: 5,
      pergunta: 'Você busca mais:',
      tipo: 'multipla',
      opcoes: [
        'Energia',
        'Foco',
        'Organização',
        'Tudo'
      ]
    }
  ]

  const pontosPorOpcao = [
    [1, 2, 3, 3], // Pergunta 1
    [3, 2, 1, 1], // Pergunta 2
    [3, 2, 1, 1], // Pergunta 3
    [1, 2, 3],    // Pergunta 4
    [2, 3, 2, 3]  // Pergunta 5
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

    if (score <= 7) {
      const diagnostico = quizRotinaProdutivaDiagnosticos.wellness?.rotinaOrganizada
      resultado = {
        score,
        perfil: 'Rotina Organizada',
        descricao: 'Sua rotina está bem organizada!',
        cor: 'green',
        recomendacoes: [
          'A bebida funcional pode ajudar a manter essa constância.',
          'Ele pode ser útil nos dias mais puxados.'
        ],
        resultadoId: 'rotinaOrganizada',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Sua rotina está bem organizada!',
          causaRaiz: '🔍 CAUSA RAIZ: Você já tem uma boa estrutura de rotina. A bebida funcional pode ajudar a manter essa constância, especialmente nos dias mais puxados.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: Continue mantendo sua rotina organizada. A bebida funcional pode ser um aliado nos momentos de maior demanda.',
          plano7Dias: '📅 PLANO 7 DIAS: Use a bebida funcional nos dias mais intensos para manter energia e foco constantes.',
          suplementacao: '💊 SUPLEMENTAÇÃO: A bebida funcional pode complementar sua rotina já organizada, especialmente em momentos de maior demanda.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha sua alimentação equilibrada. A bebida funcional pode ajudar a manter energia e hidratação nos dias mais puxados.',
          proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns pela organização! A bebida funcional pode ajudar a manter essa constância. Quer experimentar?'
        }
      }
    } else if (score <= 11) {
      const diagnostico = quizRotinaProdutivaDiagnosticos.wellness?.rotinaCorrida
      resultado = {
        score,
        perfil: 'Rotina Corrida',
        descricao: 'Sua rotina é intensa e exige muita energia e foco.',
        cor: 'yellow',
        recomendacoes: [
          'A bebida funcional pode ajudar a manter produtividade constante.',
          'Ele combina energia, foco e hidratação em uma solução prática.'
        ],
        resultadoId: 'rotinaCorrida',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Sua rotina é intensa e exige muita energia e foco',
          causaRaiz: '🔍 CAUSA RAIZ: Rotinas corridas precisam de suporte constante para manter produtividade. A bebida funcional pode ajudar a manter energia e foco ao longo do dia.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: Para rotinas intensas, soluções práticas que apoiem energia e foco ajudam na constância diária. A bebida funcional é ideal para isso.',
          plano7Dias: '📅 PLANO 7 DIAS: Use a bebida funcional pela manhã ou nos momentos de maior demanda. Ele pode ajudar a manter produtividade constante.',
          suplementacao: '💊 SUPLEMENTAÇÃO: A bebida funcional combina cafeína natural, vitaminas e hidratação em uma solução prática para rotinas corridas.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. A bebida funcional pode complementar sua rotina, especialmente nos momentos de maior demanda.',
          proximoPasso: '🎯 PRÓXIMO PASSO: Para rotinas intensas como a sua, a bebida funcional pode ajudar. Quer experimentar?'
        }
      }
    } else {
      const diagnostico = quizRotinaProdutivaDiagnosticos.wellness?.altaDemandaMental
      resultado = {
        score,
        perfil: 'Alta Demanda Mental',
        descricao: 'Para rotinas intensas, soluções simples que apoiem energia e foco ajudam na constância diária.',
        cor: 'red',
        recomendacoes: [
          'A bebida funcional é ideal para quem precisa de performance mental constante.',
          'Muitas pessoas usam o Hype pela manhã para começar o dia com mais disposição.'
        ],
        resultadoId: 'altaDemandaMental',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Sua rotina exige performance mental constante',
          causaRaiz: '🔍 CAUSA RAIZ: Rotinas muito intensas precisam de suporte constante para energia e foco. A bebida funcional pode ajudar a manter performance mental ao longo do dia.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: Para rotinas intensas, a bebida funcional pode ajudar a manter energia e foco constantes. Ele é ideal para quem precisa de performance mental.',
          plano7Dias: '📅 PLANO 7 DIAS: Use a bebida funcional pela manhã para começar o dia com mais disposição e foco. Ele pode ajudar a manter produtividade constante.',
          suplementacao: '💊 SUPLEMENTAÇÃO: A bebida funcional é uma bebida funcional desenvolvida para apoiar energia, foco e hidratação. Ele é ideal para rotinas intensas.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. A bebida funcional pode complementar sua rotina, especialmente para manter energia e foco constantes.',
          proximoPasso: '🎯 PRÓXIMO PASSO: Para rotinas intensas como a sua, a bebida funcional pode ajudar a manter energia e foco. Quer experimentar?'
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
        <WellnessHeader showLogoOnly={true} />
        <WellnessLanding
          title="📈 Como Ter Uma Rotina Mais Produtiva?"
          description="Em 2 minutos, descubra o que está sabotando sua produtividade e como criar uma rotina que realmente funciona"
          benefits={[
            'Identifique os pontos que atrapalham sua produtividade',
            'Descubra como manter energia constante o dia todo',
            'Receba estratégias práticas para sua rotina',
            'Conheça uma solução natural para mais foco e energia'
          ]}
          onStart={iniciarQuiz}
          ctaText="▶️ Melhorar Minha Produtividade Agora - Grátis!"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
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
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 border-2 border-green-300 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                🚀 Quer Experimentar a bebida funcional?
              </h3>
              <p className="text-gray-700 text-center mb-4">
                Para rotinas intensas como a sua, a bebida funcional pode ajudar a manter produtividade constante!
              </p>
              <HypeDrinkCTA
                config={config}
                resultado={resultado.perfil}
                mensagemPersonalizada={`Olá! Completei o Quiz de Rotina Produtiva e meu resultado foi: ${resultado.perfil}. Gostaria de saber mais sobre a bebida funcional!`}
              />
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
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
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-gray-900 font-medium"
              >
                {opcao}
              </button>
            ))}
          </div>

          {perguntaAtual > 0 && (
            <button
              onClick={voltar}
              className="mt-6 text-green-600 hover:text-green-800"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

