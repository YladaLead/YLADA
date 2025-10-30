'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '../../components/YLADALogo'

export default function QuizInterativo() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [result, setResult] = useState<any>(null)

  const questions = [
    {
      id: 'energia-manha',
      question: 'Como você se sente pela manhã?',
      options: [
        { value: 'energico', label: 'Muito energizado e pronto para o dia', points: 3 },
        { value: 'normal', label: 'Normal, preciso de um café para despertar', points: 2 },
        { value: 'cansado', label: 'Cansado, preciso de tempo para despertar', points: 1 }
      ]
    },
    {
      id: 'apetite-manha',
      question: 'Como está seu apetite pela manhã?',
      options: [
        { value: 'forte', label: 'Muito forte, preciso comer logo', points: 3 },
        { value: 'moderado', label: 'Moderado, posso esperar um pouco', points: 2 },
        { value: 'fraco', label: 'Fraco, quase não sinto fome', points: 1 }
      ]
    },
    {
      id: 'preferencia-horario',
      question: 'Em que horário você prefere fazer exercícios?',
      options: [
        { value: 'manha', label: 'Manhã (6h-10h)', points: 3 },
        { value: 'tarde', label: 'Tarde (14h-18h)', points: 2 },
        { value: 'noite', label: 'Noite (18h-22h)', points: 1 }
      ]
    },
    {
      id: 'digestao',
      question: 'Como você descreve sua digestão?',
      options: [
        { value: 'rapida', label: 'Rápida, sinto fome em 2-3 horas', points: 3 },
        { value: 'normal', label: 'Normal, sinto fome em 4-5 horas', points: 2 },
        { value: 'lenta', label: 'Lenta, fico satisfeito por 6+ horas', points: 1 }
      ]
    },
    {
      id: 'temperatura',
      question: 'Como você se sente com relação à temperatura?',
      options: [
        { value: 'calor', label: 'Sempre com calor, suor facilmente', points: 3 },
        { value: 'normal', label: 'Temperatura normal', points: 2 },
        { value: 'frio', label: 'Sempre com frio, mãos e pés gelados', points: 1 }
      ]
    }
  ]

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const calculateResult = () => {
    let totalPoints = 0
    let answeredQuestions = 0

    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer) {
        const option = question.options.find(opt => opt.value === answer)
        if (option) {
          totalPoints += option.points
          answeredQuestions++
        }
      }
    })

    if (answeredQuestions < questions.length) {
      alert('Por favor, responda todas as perguntas antes de continuar.')
      return
    }

    let metabolismo = ''
    let recomendacoes = []

    if (totalPoints >= 12) {
      metabolismo = 'Metabolismo Rápido'
      recomendacoes = [
        '📋 Avaliação metabólica completa para controle',
        '🥗 Plano alimentar para sustentação energética',
        '💊 Suplementos para equilíbrio metabólico',
        '📅 Acompanhamento nutricional especializado'
      ]
    } else if (totalPoints >= 8) {
      metabolismo = 'Metabolismo Normal'
      recomendacoes = [
        '📋 Manutenção do metabolismo equilibrado',
        '🥗 Otimização nutricional para performance',
        '💊 Suplementos de apoio metabólico',
        '📅 Consultas de manutenção mensais'
      ]
    } else {
      metabolismo = 'Metabolismo Lento'
      recomendacoes = [
        '📋 Avaliação metabólica completa',
        '🥗 Plano alimentar para acelerar metabolismo',
        '💊 Suplementos termogênicos naturais',
        '📅 Acompanhamento metabólico semanal'
      ]
    }

    setResult({
      metabolismo,
      pontos: totalPoints,
      recomendacoes
    })
    setStep(3)
  }

  const resetQuiz = () => {
    setStep(1)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/pt/nutri/ferramentas/templates">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <div className="text-sm text-gray-600">
            Quiz Interativo - Metabolismo
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progresso: {step}/3
              </span>
              <span className="text-sm text-gray-500">
                {step === 1 ? 'Perguntas' : step === 2 ? 'Confirmação' : 'Resultado'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Questions */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎯</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Quiz Interativo - Descubra seu Metabolismo
                </h1>
                <p className="text-gray-600">
                  Responda as perguntas abaixo para descobrir seu tipo metabólico
                </p>
              </div>

              <div className="space-y-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-100 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            answers[question.id] === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={answers[question.id] === option.value}
                            onChange={() => handleAnswer(question.id, option.value)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            answers[question.id] === option.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[question.id] === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Continuar para Confirmação →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">📋</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Confirme suas Respostas
                </h1>
                <p className="text-gray-600">
                  Revise suas respostas antes de ver o resultado
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {index + 1}. {question.question}
                    </h3>
                    <p className="text-gray-600">
                      {question.options.find(opt => opt.value === answers[question.id])?.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  ← Voltar
                </button>
                <button
                  onClick={calculateResult}
                  className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  Ver Resultado →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && result && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎉</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Seu Resultado
                </h1>
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-2">
                    {result.metabolismo}
                  </h2>
                  <p className="text-blue-700">
                    Pontuação: {result.pontos} pontos
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recomendações Específicas:
                </h3>
                <div className="space-y-3">
                  {result.recomendacoes.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg mr-3">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  Fazer Novamente
                </button>
                <Link
                  href="/pt/nutri/ferramentas/templates"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 inline-block"
                >
                  Voltar ao Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Quiz Interativo YLADA
            </p>
            <p className="text-gray-500 text-xs">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
