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
}

export default function QuizProposito() {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você tem clareza sobre seu propósito?',
      tipo: 'multipla',
      opcoes: [
        'Não, estou perdido',
        'Parcialmente, ainda descobrindo',
        'Sim, tenho direção clara',
        'Sim, vivo meu propósito diariamente'
      ]
    },
    {
      id: 2,
      pergunta: 'Como você equilibra trabalho e vida pessoal?',
      tipo: 'multipla',
      opcoes: [
        'Vida pessoal está prejudicada',
        'Dificilmente consigo equilibrar',
        'Consegue manter um equilíbrio razoável',
        'Tenho um equilíbrio saudável e sustentável'
      ]
    },
    {
      id: 3,
      pergunta: 'Você se sente alinhado com seus valores?',
      tipo: 'multipla',
      opcoes: [
        'Não, me sinto desconectado',
        'Às vezes, depende do dia',
        'Geralmente, sim',
        'Totalmente alinhado com meus valores'
      ]
    },
    {
      id: 4,
      pergunta: 'Você sente que está construindo o futuro que deseja?',
      tipo: 'multipla',
      opcoes: [
        'Não, sinto que estou perdendo tempo',
        'Parcialmente, mas posso melhorar',
        'Sim, estou no caminho certo',
        'Sim, vivo os resultados que desejei'
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
      perfil = 'Alinhamento Total'
      descricao = 'Você vive com propósito e equilíbrio! Seu dia a dia está alinhado com seus sonhos.'
      cor = 'green'
      recomendacoes = [
        'Manter práticas de alinhamento diário',
        'Compartilhar sua sabedoria com outros',
        'Continuar evoluindo estrategicamente',
        'Aproveitar cada momento conscientemente'
      ]
    } else if (score >= 6) {
      perfil = 'Bem Alinhado'
      descricao = 'Você está no caminho certo! Com ajustes estratégicos, pode alcançar alinhamento total.'
      cor = 'blue'
      recomendacoes = [
        'Definir propósito de forma mais clara',
        'Criar rotina de equilibro semanal',
        'Revisar valores e realinhar ações',
        'Praticar mindfulness e gratidão'
      ]
    } else if (score >= 3) {
      perfil = 'Necessita Realinhamento'
      descricao = 'Seu dia a dia não está totalmente alinhado com seu propósito. É hora de realinhar!'
      cor = 'orange'
      recomendacoes = [
        'Urgente: Refletir sobre propósito de vida',
        'Definir valores pessoais',
        'Criar plano de realinhamento',
        'Buscar mentoria para equilíbrio'
      ]
    } else {
      perfil = 'Desalinhamento Crítico'
      descricao = 'Você está perdido e seu dia a dia não reflete seus sonhos. É hora de mudança urgente!'
      cor = 'red'
      recomendacoes = [
        'URGENTE: Descobrir seu propósito',
        'Definir valores fundamentais',
        'Criar plano de vida completo',
        'Buscar mentoria para realinhamento total'
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50">
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
              <h1 className="text-xl font-bold text-gray-900">Quiz: Propósito e Equilíbrio</h1>
              <p className="text-sm text-gray-600">Seu dia a dia está alinhado com seus sonhos?</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-violet-200">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⭐</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Propósito e Equilíbrio</h2>
              <p className="text-xl text-gray-600 mb-2">
                Descubra se seu dia a dia está alinhado com seus sonhos
              </p>
              <p className="text-gray-600 mb-6">
                Avalie o equilíbrio entre sua vida profissional, pessoal e propósito
              </p>
            </div>

            <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl p-6 mb-8 border-2 border-violet-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 O que você vai descobrir?</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-violet-600 mr-2">✓</span>
                  <span>Se vive com propósito ou apenas sobrevive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-2">✓</span>
                  <span>O equilíbrio entre trabalho, vida pessoal e sonhos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-2">✓</span>
                  <span>Como realinhar seu dia a dia com seus valores</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-2">✓</span>
                  <span>Estratégias para viver com propósito e equilíbrio</span>
                </li>
              </ul>
            </div>

            <button
              onClick={iniciarQuiz}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-violet-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              ▶️ Iniciar Quiz - É Grátis
            </button>
          </div>
        )}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-violet-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-violet-600 h-2 rounded-full transition-all"
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
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-violet-500 hover:bg-violet-50 transition-all"
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
                  Caminho para o Alinhamento
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-violet-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-center">
              <p className="text-white text-lg font-semibold mb-4">
                Quer criar um plano para viver com propósito e equilíbrio?
              </p>
              <a
                href="https://wa.me/5511999999999?text=Olá! Completei o Quiz de Propósito e Equilíbrio através do YLADA e gostaria de conversar sobre alinhamento de vida. Pode me ajudar?"
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
                ↺ Fazer Quiz Novamente
              </button>
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setEtapa('landing')
                }}
                className="flex-1 bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors"
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

