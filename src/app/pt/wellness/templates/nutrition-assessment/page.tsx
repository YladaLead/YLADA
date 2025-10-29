'use client'

import { useState } from 'react'
import Image from 'next/image'

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
  deficiencias: string[]
}

export default function AvaliacaoNutricional() {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Como você se sente após as refeições?',
      tipo: 'multipla',
      opcoes: [
        'Pesado e lento',
        'Razoável, mas poderia ser melhor',
        'Bem, me sinto satisfeito',
        'Energizado e bem'
      ]
    },
    {
      id: 2,
      pergunta: 'Você sente fome entre as refeições?',
      tipo: 'multipla',
      opcoes: [
        'Sempre',
        'Frequentemente',
        'Às vezes',
        'Raramente'
      ]
    },
    {
      id: 3,
      pergunta: 'Você consome alimentos industrializados?',
      tipo: 'multipla',
      opcoes: [
        'Diariamente',
        'Frequentemente (mais de 3x semana)',
        'Às vezes (1-2x por semana)',
        'Raramente ou nunca'
      ]
    },
    {
      id: 4,
      pergunta: 'Como está sua ingestão de proteínas?',
      tipo: 'multipla',
      opcoes: [
        'Não sei, não monitoro',
        'Baixa, raramente como',
        'Moderada, às vezes incluo',
        'Alta, incluo em todas refeições'
      ]
    },
    {
      id: 5,
      pergunta: 'Você consome gorduras saudáveis?',
      tipo: 'multipla',
      opcoes: [
        'Não, evito gordura',
        'Pouco, raramente',
        'Moderadamente',
        'Sim, incluo regularmente'
      ]
    }
  ]

  const pontosPorOpcao = [
    [0, 1, 2, 3],
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
    let deficiencias: string[] = []

    if (score >= 13) {
      perfil = 'Nutrição Excelente'
      descricao = 'Parabéns! Sua nutrição está excelente. Continue mantendo!'
      cor = 'green'
      recomendacoes = [
        'Manter diversidade alimentar',
        'Continuar monitorando ingestão',
        'Compartilhar hábitos com outros',
        'Otimização contínua'
      ]
      deficiencias = ['Nenhuma identificada']
    } else if (score >= 9) {
      perfil = 'Nutrição Boa'
      descricao = 'Sua nutrição está boa, mas há oportunidades de otimização.'
      cor = 'blue'
      recomendacoes = [
        'Aumentar proteína em todas refeições',
        'Incluir mais gorduras saudáveis',
        'Reduzir alimentos industrializados',
        'Melhorar timing de refeições'
      ]
      deficiencias = ['Proteína', 'Gorduras saudáveis']
    } else if (score >= 5) {
      perfil = 'Necessita Ajustes Nutricionais'
      descricao = 'Sua alimentação precisa de ajustes significativos para otimizar saúde.'
      cor = 'orange'
      recomendacoes = [
        'Urgente: Estruturar plano alimentar',
        'Aumentar proteína diariamente',
        'Incluir gorduras saudáveis regularmente',
        'Buscar orientação nutricional'
      ]
      deficiencias = ['Proteína', 'Gorduras saudáveis', 'Timing de refeições']
    } else {
      perfil = 'Atenção Nutricional Urgente'
      descricao = 'Sua nutrição precisa de atenção urgente. Busque orientação imediata.'
      cor = 'red'
      recomendacoes = [
        'URGENTE: Consultar nutricionista',
        'Criar plano alimentar estruturado',
        'Priorizar proteína em todas refeições',
        'Reduzir alimentos processados drasticamente'
      ]
      deficiencias = ['Proteína', 'Gorduras saudáveis', 'Fibras', 'Vitaminas', 'Minerais']
    }

    setResultado({ score, perfil, descricao, cor, recomendacoes, deficiencias })
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Image
              src="/logos/ylada-logo-horizontal-vazado.png"
              alt="YLADA"
              width={160}
              height={50}
              className="h-10"
            />
            <div className="h-10 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Avaliação Nutricional Completa</h1>
              <p className="text-sm text-gray-600">Hábitos alimentares e necessidades nutricionais</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-200">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔬</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Avaliação Nutricional Completa</h2>
              <p className="text-xl text-gray-600 mb-2">
                Questionário completo de hábitos alimentares
              </p>
              <p className="text-gray-600 mb-6">
                Avalie deficiências nutricionais e necessidades específicas
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-indigo-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 O que você vai descobrir?</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Deficiências nutricionais que podem estar afetando sua saúde</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Oportunidades de otimização na alimentação</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Necessidades específicas de macronutrientes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Recomendações personalizadas para melhorar sua nutrição</span>
                </li>
              </ul>
            </div>

            <button
              onClick={iniciarQuiz}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              ▶️ Iniciar Avaliação - É Grátis
            </button>
          </div>
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
                <p className="text-sm text-gray-600 mt-2">Score: {resultado.score}/15</p>
              </div>

              {resultado.deficiencias.length > 0 && resultado.deficiencias[0] !== 'Nenhuma identificada' && (
                <div className="bg-red-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-red-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">⚠️</span>
                    Deficiências Identificadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.deficiencias.map((def, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {def}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações Nutricionais
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

            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-center">
              <p className="text-white text-lg font-semibold mb-4">
                Quer receber um plano nutricional personalizado baseado nesta avaliação?
              </p>
              <a
                href="https://wa.me/5511999999999?text=Olá! Completei minha Avaliação Nutricional através do YLADA e gostaria de saber mais sobre os resultados. Pode me ajudar?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
              >
                💬 Conversar com Especialista
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setEtapa('quiz')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Fazer Avaliação Novamente
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

