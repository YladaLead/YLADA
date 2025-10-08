'use client'

import { useState } from 'react'
import { Brain, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function GoalsQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<{
    score: string
    percentage: string
    category: string
    color: string
    description: string
    recommendations: string[]
    priorityAreas: string[]
    actionPlan: string[]
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
      question: "Em quanto tempo você gostaria de alcançar seu objetivo?",
      options: [
        "1-3 meses",
        "3-6 meses",
        "6-12 meses",
        "Mais de 1 ano"
      ]
    },
    {
      question: "Qual é sua motivação principal?",
      options: [
        "Aparência física",
        "Saúde e bem-estar",
        "Performance esportiva",
        "Qualidade de vida"
      ]
    },
    {
      question: "Como você prefere receber orientação?",
      options: [
        "Autodidata",
        "Comunidade online",
        "Profissional presencial",
        "Aplicativo/tecnologia"
      ]
    },
    {
      question: "Qual é seu maior desafio atual?",
      options: [
        "Falta de tempo",
        "Falta de motivação",
        "Falta de conhecimento",
        "Falta de recursos"
      ]
    },
    {
      question: "Como você se sente sobre mudanças na alimentação?",
      options: [
        "Muito resistente",
        "Alguma resistência",
        "Disposto a mudar",
        "Muito aberto"
      ]
    },
    {
      question: "Qual é sua experiência com exercícios?",
      options: [
        "Iniciante completo",
        "Alguma experiência",
        "Experiente",
        "Muito experiente"
      ]
    },
    {
      question: "Qual é sua preferência para acompanhamento?",
      options: [
        "Solo, sem acompanhamento",
        "Acompanhamento ocasional",
        "Acompanhamento regular",
        "Acompanhamento intensivo"
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
    
    // Sistema de pontuação baseado nas respostas
    Object.values(allAnswers).forEach((answer, index) => {
      const questionIndex = Object.keys(allAnswers).indexOf(index.toString())
      const answerIndex = questions[questionIndex].options.indexOf(answer)
      score += answerIndex + 1 // 1-4 pontos por pergunta
    })
    
    const percentage = Math.round((score / maxScore) * 100)
    
    let category = ''
    let color = ''
    let description = ''
    let recommendations: string[] = []
    let priorityAreas: string[] = []
    let actionPlan: string[] = []
    
    if (percentage >= 80) {
      category = 'Perfil de Alto Potencial'
      color = 'text-green-600'
      description = 'Você tem todas as características para alcançar seus objetivos'
      recommendations = [
        'Mantenha sua motivação e foco',
        'Estabeleça metas desafiadoras mas realistas',
        'Considere orientação especializada para otimização',
        'Compartilhe sua jornada para inspirar outros'
      ]
      priorityAreas = ['Otimização', 'Mentoria', 'Inspiração']
      actionPlan = [
        'Defina metas SMART específicas',
        'Crie um cronograma detalhado',
        'Estabeleça marcos de progresso',
        'Monitore resultados regularmente'
      ]
    } else if (percentage >= 60) {
      category = 'Perfil Motivado'
      color = 'text-blue-600'
      description = 'Você tem boa base e motivação para alcançar seus objetivos'
      recommendations = [
        'Foque na consistência dos hábitos',
        'Busque orientação profissional',
        'Estabeleça metas intermediárias',
        'Mantenha-se motivado com pequenas vitórias'
      ]
      priorityAreas = ['Consistência', 'Orientação', 'Motivação']
      actionPlan = [
        'Comece com mudanças pequenas e graduais',
        'Estabeleça uma rotina diária',
        'Busque apoio profissional',
        'Celebre pequenas conquistas'
      ]
    } else if (percentage >= 40) {
      category = 'Perfil em Desenvolvimento'
      color = 'text-yellow-600'
      description = 'Você tem potencial, mas precisa de mais estrutura e orientação'
      recommendations = [
        'Procure orientação profissional especializada',
        'Comece com objetivos menores e mais simples',
        'Foque em construir hábitos básicos primeiro',
        'Considere acompanhamento regular'
      ]
      priorityAreas = ['Orientação Profissional', 'Hábitos Básicos', 'Acompanhamento']
      actionPlan = [
        'Identifique seus maiores obstáculos',
        'Comece com um hábito por vez',
        'Busque orientação profissional',
        'Estabeleça um sistema de apoio'
      ]
    } else {
      category = 'Perfil Precisa de Suporte'
      color = 'text-red-600'
      description = 'Você precisa de suporte significativo para alcançar seus objetivos'
      recommendations = [
        'Procure orientação médica e profissional urgente',
        'Comece com mudanças muito pequenas',
        'Foque em motivação e educação primeiro',
        'Considere acompanhamento intensivo'
      ]
      priorityAreas = ['Orientação Médica', 'Educação', 'Acompanhamento Intensivo']
      actionPlan = [
        'Consulte um profissional de saúde',
        'Eduque-se sobre saúde e bem-estar',
        'Comece com mudanças mínimas',
        'Busque apoio emocional e motivacional'
      ]
    }
    
    setResult({
      score: score.toString(),
      percentage: percentage.toString(),
      category,
      color,
      description,
      recommendations,
      priorityAreas,
      actionPlan
    })
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
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
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Questionário de Objetivos</h1>
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
              Questionário de Objetivos de Saúde
            </h2>
            <p className="text-lg text-gray-600">
              Defina seus objetivos e receba um plano personalizado para alcançá-los
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
                    className="bg-pink-600 h-2 rounded-full transition-all duration-300"
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
                      className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
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
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Seu Perfil de Objetivos
                </h3>
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  {result.percentage}%
                </div>
                <p className={`text-xl font-semibold ${result.color}`}>
                  {result.category}
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  {result.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-pink-50 rounded-lg p-6">
                  <h4 className="font-semibold text-pink-800 mb-4 text-lg">
                    Recomendações:
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-pink-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-pink-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-rose-50 rounded-lg p-6">
                  <h4 className="font-semibold text-rose-800 mb-4 text-lg">
                    Áreas Prioritárias:
                  </h4>
                  <ul className="space-y-2">
                    {result.priorityAreas.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-rose-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-rose-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-purple-800 mb-4 text-lg">
                  Plano de Ação:
                </h4>
                <ul className="space-y-2">
                  {result.actionPlan.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-purple-700">{action}</span>
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
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold inline-block"
                >
                  Voltar às Ferramentas
                </Link>
              </div>
            </div>
          )}
        </div>
                    {/* Botão personalizado do especialista */}

                    <SpecialistCTA toolName="goals-quiz" />
</main>
    </div>
  )
}
