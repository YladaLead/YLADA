'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import HypeDrinkCTA from '@/components/wellness/HypeDrinkCTA'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { quizEnergiaFocoDiagnosticos } from '@/lib/diagnostics'

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

// Mock config para quando não vier do sistema
const defaultConfig: TemplateBaseProps['config'] = {
  id: 'quiz-energia-foco',
  name: 'Quiz: Energia & Foco',
  description: 'Descubra como melhorar sua energia e foco',
  slug: 'quiz-energia-foco',
  profession: 'wellness'
}

export default function QuizEnergiaFoco({ config = defaultConfig }: { config?: TemplateBaseProps['config'] }) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Em qual período do dia sua energia mais cai?',
      tipo: 'multipla',
      opcoes: [
        'Manhã',
        'Meio da tarde',
        'Noite',
        'Varia o dia todo'
      ]
    },
    {
      id: 2,
      pergunta: 'Como você costuma lidar com a queda de energia?',
      tipo: 'multipla',
      opcoes: [
        'Café',
        'Energético',
        'Aguento até acabar o dia',
        'Não tenho estratégia'
      ]
    },
    {
      id: 3,
      pergunta: 'Quantas xícaras de café você consome por dia?',
      tipo: 'multipla',
      opcoes: [
        'Nenhuma',
        '1-2',
        '3-4',
        '5 ou mais'
      ]
    },
    {
      id: 4,
      pergunta: 'Como está seu foco mental ao longo do dia?',
      tipo: 'multipla',
      opcoes: [
        'Bom',
        'Oscila',
        'Cai rápido',
        'Muito difícil manter'
      ]
    },
    {
      id: 5,
      pergunta: 'Você pratica atividade física?',
      tipo: 'multipla',
      opcoes: [
        'Não',
        '1-2x/semana',
        '3-4x/semana',
        '5x ou mais'
      ]
    }
  ]

  const pontosPorOpcao = [
    [2, 3, 1, 3], // Pergunta 1
    [2, 3, 3, 2], // Pergunta 2
    [1, 1, 2, 3], // Pergunta 3
    [1, 2, 3, 3], // Pergunta 4
    [1, 1, 2, 2]  // Pergunta 5
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

    if (score <= 6) {
      const diagnostico = quizEnergiaFocoDiagnosticos.wellness?.energiaBaixa
      resultado = {
        score,
        perfil: 'Energia Baixa',
        descricao: 'Seu perfil indica necessidade de apoio em energia e foco.',
        cor: 'orange',
        recomendacoes: [
          'Bebidas funcionais como a bebida funcional podem ajudar na sua rotina.',
          'A bebida funcional combina cafeína natural, vitaminas do complexo B e hidratação.'
        ],
        resultadoId: 'energiaBaixa',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Sua energia está baixa e precisa de apoio para se manter estável ao longo do dia',
          causaRaiz: '🔍 CAUSA RAIZ: Queda de energia constante pode estar relacionada a desequilíbrios nutricionais, falta de hidratação adequada ou necessidade de suporte energético funcional. Muitas pessoas recorrem a excesso de café ou estimulantes fortes, mas isso gera ansiedade e queda brusca depois.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma bebida funcional com cafeína natural, vitaminas do complexo B e hidratação para apoiar sua energia de forma mais estável. A bebida funcional combina esses elementos em uma solução prática para o dia a dia.',
          plano7Dias: '📅 PLANO 7 DIAS: Inclua a bebida funcional na sua rotina matinal ou no período de maior queda de energia. Ele pode ajudar a manter energia e foco sem os picos e quedas bruscas do café excessivo.',
          suplementacao: '💊 SUPLEMENTAÇÃO: A bebida funcional é uma bebida funcional que combina cafeína natural (chá verde e preto), vitaminas do complexo B, taurina e hidratação. Ele não substitui refeições, mas pode apoiar energia e foco dentro de um estilo de vida saudável.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada com carboidratos complexos, proteínas e hidratação adequada. A bebida funcional pode complementar sua rotina, especialmente nos momentos de maior demanda energética.',
          proximoPasso: '🎯 PRÓXIMO PASSO: Seu perfil indica necessidade de apoio em energia e foco. A bebida funcional pode ajudar na sua rotina. Quer experimentar?'
        }
      }
    } else if (score <= 10) {
      const diagnostico = quizEnergiaFocoDiagnosticos.wellness?.energiaInstavel
      resultado = {
        score,
        perfil: 'Energia Instável',
        descricao: 'Você tem altos e baixos de energia ao longo do dia.',
        cor: 'yellow',
        recomendacoes: [
          'A bebida funcional pode ajudar a manter energia mais estável.',
          'Com cafeína natural e vitaminas, ele apoia foco e disposição.'
        ],
        resultadoId: 'energiaInstavel',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Você tem altos e baixos de energia ao longo do dia que podem ser equilibrados',
          causaRaiz: '🔍 CAUSA RAIZ: Energia instável geralmente está relacionada a consumo excessivo de cafeína, falta de hidratação ou necessidade de suporte energético mais equilibrado. Alternativas com cafeína natural e dosagem controlada podem ajudar a manter energia mais estável.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma alternativa ao café excessivo. A bebida funcional pode ajudar a manter energia mais estável, com cafeína natural e vitaminas do complexo B, sem os picos e quedas bruscas.',
          plano7Dias: '📅 PLANO 7 DIAS: Substitua parte do seu consumo de café pela bebida funcional nos momentos de maior necessidade. Ele pode ajudar a manter energia e foco de forma mais equilibrada.',
          suplementacao: '💊 SUPLEMENTAÇÃO: A bebida funcional combina cafeína natural (chá verde e preto), vitaminas do complexo B e hidratação. Ele pode ser uma alternativa mais equilibrada ao café excessivo.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada e hidratação adequada. A bebida funcional pode complementar sua rotina, especialmente para manter energia mais estável.',
          proximoPasso: '🎯 PRÓXIMO PASSO: Seu perfil indica necessidade de energia mais estável. A bebida funcional pode ajudar. Quer experimentar?'
        }
      }
    } else {
      const diagnostico = quizEnergiaFocoDiagnosticos.wellness?.altaDemanda
      resultado = {
        score,
        perfil: 'Alta Demanda Física/Mental',
        descricao: 'Sua rotina exige muita energia e foco.',
        cor: 'red',
        recomendacoes: [
          'A bebida funcional é ideal para quem precisa de performance constante.',
          'Ele combina energia, foco e hidratação em uma bebida funcional.'
        ],
        resultadoId: 'altaDemanda',
        diagnostico: diagnostico || {
          diagnostico: '📋 DIAGNÓSTICO: Sua rotina exige muita energia e foco, e você precisa de suporte funcional',
          causaRaiz: '🔍 CAUSA RAIZ: Rotinas intensas exigem suporte energético constante e foco mental. Bebidas funcionais com cafeína natural, vitaminas e hidratação podem ajudar a manter performance ao longo do dia, especialmente em momentos de alta demanda.',
          acaoImediata: '⚡ AÇÃO IMEDIATA: Para rotinas intensas, soluções práticas que apoiem energia e foco ajudam na constância diária. A bebida funcional é ideal para quem precisa de performance constante.',
          plano7Dias: '📅 PLANO 7 DIAS: Use a bebida funcional pela manhã ou nos momentos de maior demanda. Ele combina energia, foco e hidratação em uma solução prática para rotinas intensas.',
          suplementacao: '💊 SUPLEMENTAÇÃO: A bebida funcional é uma bebida funcional desenvolvida para apoiar energia, foco e hidratação. Ele combina cafeína natural, vitaminas do complexo B e hidratação em uma solução prática.',
          alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada e hidratação adequada. A bebida funcional pode complementar sua rotina, especialmente em momentos de alta demanda física ou mental.',
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <WellnessHeader showLogoOnly={true} />
        <WellnessLanding
          title="⚡ Descubra Como Ter Mais Energia o Dia Todo!"
          description="Em apenas 2 minutos, descubra o que está roubando sua energia e como recuperá-la de forma natural e sustentável"
          benefits={[
            'Identifique exatamente quando sua energia mais cai',
            'Descubra alternativas ao café excessivo que causam ansiedade',
            'Receba um plano personalizado para sua rotina',
            'Conheça uma solução prática e natural para mais energia'
          ]}
          onStart={iniciarQuiz}
          ctaText="▶️ Descobrir Minha Energia Agora - É Grátis!"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
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
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                🚀 Quer Experimentar a bebida funcional?
              </h3>
              <p className="text-gray-700 text-center mb-4">
                Baseado no seu resultado, a bebida funcional pode ajudar você a ter mais energia e foco no dia a dia!
              </p>
              <HypeDrinkCTA
                config={config}
                resultado={resultado.perfil}
                mensagemPersonalizada={`Olá! Completei o Quiz de Energia & Foco e meu resultado foi: ${resultado.perfil}. Gostaria de saber mais sobre a bebida funcional!`}
              />
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
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
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
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
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-gray-900 font-medium"
              >
                {opcao}
              </button>
            ))}
          </div>

          {perguntaAtual > 0 && (
            <button
              onClick={voltar}
              className="mt-6 text-yellow-600 hover:text-yellow-800"
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

