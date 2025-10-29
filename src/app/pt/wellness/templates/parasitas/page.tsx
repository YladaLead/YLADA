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

export default function QuizParasitas({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você tem problemas digestivos frequentes?',
      tipo: 'multipla',
      opcoes: [
        'Não',
        'Raramente',
        'Às vezes',
        'Frequentemente ou constantemente'
      ]
    },
    {
      id: 2,
      pergunta: 'Como você se sente em relação à energia?',
      tipo: 'multipla',
      opcoes: [
        'Com muita energia',
        'Energia moderada',
        'Sinto cansaço regular',
        'Sinto muito cansaço, desânimo'
      ]
    },
    {
      id: 3,
      pergunta: 'Você tem algum desses sintomas? (Selecione a que mais se identifica)',
      tipo: 'multipla',
      opcoes: [
        'Nenhum dos sintomas abaixo',
        'Inchaço abdominal frequentemente',
        'Desejo excessivo por doces/água',
        'Diarreia ou constipação recorrente'
      ]
    },
    {
      id: 4,
      pergunta: 'Como está sua imunidade?',
      tipo: 'multipla',
      opcoes: [
        'Excelente, raramente adoeço',
        'Boa, adoeço poucas vezes',
        'Moderada, adoeço regularmente',
        'Baixa, adoeço constantemente'
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
      perfil = 'Atenção: Sintomas Significativos'
      descricao = 'Você apresenta vários sintomas que podem indicar necessidade de limpeza intestinal e vermífugo.'
      cor = 'red'
      recomendacoes = [
        'Consultar especialista em saúde integral',
        'Considerar protocolo de limpeza intestinal',
        'Avaliar necessidade de tratamento vermífugo',
        'Melhorar higiene alimentar e digestiva'
      ]
    } else if (score >= 6) {
      perfil = 'Avaliação Recomendada'
      descricao = 'Você apresenta alguns sintomas que sugerem necessidade de avaliação do sistema digestivo e imunológico.'
      cor = 'orange'
      recomendacoes = [
        'Buscar avaliação com especialista',
        'Considerar limpeza intestinal preventiva',
        'Melhorar hábitos alimentares',
        'Fortalecer sistema imunológico'
      ]
    } else if (score >= 3) {
      perfil = 'Observação Preventiva'
      descricao = 'Alguns sintomas leves que podem melhorar com cuidado preventivo.'
      cor = 'blue'
      recomendacoes = [
        'Melhorar alimentação e digestão',
        'Beber mais água',
        'Incluir probióticos na dieta',
        'Monitorar sintomas regularmente'
      ]
    } else {
      perfil = 'Sistema Digestivo Saudável'
      descricao = 'Parabéns! Seu sistema digestivo parece funcionar bem. Continue mantendo bons hábitos.'
      cor = 'green'
      recomendacoes = [
        'Manter alimentação balanceada',
        'Continuar hidratação adequada',
        'Incluir probióticos preventivos',
        'Rotina de check-up anual'
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Quiz: Diagnóstico de Parasitas"
        defaultDescription="Seu bem-estar está comprometido?"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="🧬"
            defaultTitle="Diagnóstico de Parasitas"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Descubra se você tem parasitas afetando sua saúde
                </p>
                <p className="text-gray-600">
                  Avalie sintomas comuns relacionados a saúde intestinal e digestiva
                </p>
              </>
            }
            benefits={[
              'Identifique sinais de problemas digestivos e intestinais',
              'Entenda como podem estar afetando sua energia',
              'Saiba quando buscar tratamento especializado',
              'Receba orientações de prevenção e cuidados'
            ]}
            onStart={iniciarQuiz}
            buttonText="▶️ Iniciar Quiz - É Grátis"
          />
        )}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-rose-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-rose-600 h-2 rounded-full transition-all"
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
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all"
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
                  Recomendações de Cuidados
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-rose-600 mr-2">✓</span>
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
                className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
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

