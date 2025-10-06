'use client'

import { useState } from 'react'
import { Brain, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HealthQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<{
    score: string
    category: string
    recommendations: string[]
  } | null>(null)

  const questions = [
    {
      question: "Qual é seu principal objetivo de saúde?",
      options: [
        "Perder peso",
        "Ganhar massa muscular",
        "Melhorar resistência",
        "Manter saúde geral"
      ]
    },
    {
      question: "Quantas vezes por semana você pratica exercícios?",
      options: [
        "Nunca",
        "1-2 vezes",
        "3-4 vezes",
        "5+ vezes"
      ]
    },
    {
      question: "Como você descreveria sua alimentação atual?",
      options: [
        "Muito irregular",
        "Regular, mas não saudável",
        "Boa, com algumas melhorias",
        "Excelente e equilibrada"
      ]
    },
    {
      question: "Qual é sua maior dificuldade com alimentação?",
      options: [
        "Controle de porções",
        "Escolha de alimentos saudáveis",
        "Frequência das refeições",
        "Não tenho dificuldades"
      ]
    },
    {
      question: "Quanto tempo você dorme por noite?",
      options: [
        "Menos de 6 horas",
        "6-7 horas",
        "7-8 horas",
        "Mais de 8 horas"
      ]
    }
  ]

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer }
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  const calculateResult = (allAnswers: Record<number, string>) => {
    let score = 0
    const maxScore = questions.length * 4
    
    // Simple scoring system
    Object.values(allAnswers).forEach((answer, index) => {
      const questionIndex = Object.keys(allAnswers).indexOf(index.toString())
      const answerIndex = questions[questionIndex].options.indexOf(answer)
      score += answerIndex + 1 // 1-4 points per question
    })
    
    const percentage = Math.round((score / maxScore) * 100)
    
    let category = ''
    let recommendations: string[] = []
    
    if (percentage >= 80) {
      category = 'Excelente Perfil de Saúde'
      recommendations = [
        'Continue mantendo seus hábitos saudáveis',
        'Considere desafios mais avançados',
        'Compartilhe seus conhecimentos com outros',
        'Mantenha a consistência'
      ]
    } else if (percentage >= 60) {
      category = 'Bom Perfil de Saúde'
      recommendations = [
        'Continue melhorando gradualmente',
        'Foque nas áreas que precisam de atenção',
        'Mantenha a motivação',
        'Considere acompanhamento profissional'
      ]
    } else if (percentage >= 40) {
      category = 'Perfil de Saúde Regular'
      recommendations = [
        'Implemente mudanças graduais',
        'Foque em uma área por vez',
        'Busque orientação profissional',
        'Estabeleça metas realistas'
      ]
    } else {
      category = 'Perfil de Saúde Precisa de Atenção'
      recommendations = [
        'Procure orientação médica e nutricional',
        'Comece com mudanças pequenas',
        'Foque em hábitos básicos primeiro',
        'Considere acompanhamento especializado'
      ]
    }
    
    setResult({
      score: `${percentage}%`,
      category,
      recommendations
    })
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Link href="/fitlead" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Questionário de Saúde</h1>
                <p className="text-xs text-gray-600">Powered by YLADA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questionário de Saúde e Bem-estar
            </h2>
            <p className="text-lg text-gray-600">
              Responda algumas perguntas para receber recomendações personalizadas
            </p>
          </div>

          {!result ? (
            <div className="max-w-2xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Seu Resultado
                </h3>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {result.score}
                </div>
                <p className="text-xl font-semibold text-gray-700">
                  {result.category}
                </p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-indigo-800 mb-4 text-lg">
                  Recomendações Personalizadas:
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-indigo-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold mr-4"
                >
                  Refazer Questionário
                </button>
                <Link
                  href="/fitlead"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold inline-block"
                >
                  Voltar às Ferramentas
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
