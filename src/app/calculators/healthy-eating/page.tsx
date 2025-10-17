'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  ClipboardList,
  CheckCircle,
  Target,
  Star,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { useUserData } from '@/lib/useUserData'


interface QuizResults {
  score: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
}

export default function HealthyEatingCalculatorPage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<QuizResults | null>(null)

  const questions = [
    {
      question: "Com que frequência você consome frutas e vegetais?",
      options: [
        "Todos os dias, em todas as refeições",
        "Maioria dos dias, em algumas refeições",
        "Alguns dias da semana",
        "Raramente ou nunca"
      ]
    },
    {
      question: "Como você descreve sua ingestão de água?",
      options: [
        "Bebo 3L+ de água por dia",
        "Bebo 2-3L de água por dia",
        "Bebo 1-2L de água por dia",
        "Bebo menos de 1L por dia"
      ]
    },
    {
      question: "Qual é sua relação com alimentos processados?",
      options: [
        "Evito completamente",
        "Consumo raramente",
        "Consumo ocasionalmente",
        "Consumo frequentemente"
      ]
    },
    {
      question: "Como você organiza suas refeições?",
      options: [
        "Planejo todas as refeições com antecedência",
        "Planejo a maioria das refeições",
        "Planejo algumas refeições",
        "Não planejo, como quando tenho fome"
      ]
    },
    {
      question: "Qual é sua relação com o açúcar?",
      options: [
        "Evito açúcares adicionados",
        "Consumo ocasionalmente",
        "Consumo regularmente",
        "Consumo em excesso"
      ]
    },
    {
      question: "Como você consome proteínas?",
      options: [
        "Proteínas magras em todas as refeições",
        "Proteínas na maioria das refeições",
        "Proteínas em algumas refeições",
        "Poucas proteínas na dieta"
      ]
    },
    {
      question: "Qual é sua relação com gorduras saudáveis?",
      options: [
        "Consumo gorduras saudáveis regularmente",
        "Consumo ocasionalmente",
        "Consumo raramente",
        "Evito gorduras"
      ]
    },
    {
      question: "Como você lida com a fome entre refeições?",
      options: [
        "Como lanches saudáveis",
        "Bebo água ou chá",
        "Como o que estiver disponível",
        "Não como nada até a próxima refeição"
      ]
    }
  ]

  const calculateResults = () => {
    const totalScore = answers.reduce((sum, answer) => sum + (answer + 1), 0)
    const maxScore = questions.length * 4
    const percentage = (totalScore / maxScore) * 100

    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []

    if (percentage >= 80) {
      category = 'Excelente Alimentação'
      color = 'text-green-600'
      recommendations = [
        'Continue mantendo seus hábitos alimentares saudáveis',
        'Monitore regularmente sua composição corporal',
        'Considere otimizações específicas para seus objetivos',
        'Mantenha a consistência na hidratação'
      ]
      improvements = [
        'Manter excelente qualidade nutricional',
        'Otimizar ainda mais sua alimentação',
        'Prevenir possíveis desequilíbrios futuros'
      ]
    } else if (percentage >= 60) {
      category = 'Boa Alimentação'
      color = 'text-blue-600'
      recommendations = [
        'Melhore gradualmente a qualidade da sua alimentação',
        'Aumente o consumo de frutas e vegetais',
        'Mantenha hidratação adequada',
        'Considere suplementação específica se necessário'
      ]
      improvements = [
        'Melhorar qualidade alimentar',
        'Otimizar hidratação',
        'Aumentar consumo de alimentos integrais'
      ]
    } else if (percentage >= 40) {
      category = 'Alimentação Regular'
      color = 'text-yellow-600'
      recommendations = [
        'Foque em melhorar a qualidade da alimentação',
        'Estabeleça uma rotina regular de refeições',
        'Aumente a ingestão de água',
        'Considere buscar orientação nutricional profissional'
      ]
      improvements = [
        'Melhorar qualidade alimentar',
        'Estabelecer rotina alimentar',
        'Otimizar hidratação'
      ]
    } else {
      category = 'Alimentação Precisa Atenção'
      color = 'text-red-600'
      recommendations = [
        'Busque orientação nutricional profissional urgente',
        'Implemente mudanças graduais na alimentação',
        'Priorize hidratação adequada',
        'Considere avaliação médica completa',
        'Foque em alimentos integrais e nutritivos'
      ]
      improvements = [
        'Melhorar saúde nutricional',
        'Reduzir riscos à saúde',
        'Estabelecer hábitos alimentares saudáveis'
      ]
    }

    return {
      score: totalScore.toString(),
      category,
      color,
      recommendations,
      improvements
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const quizResults = calculateResults()
      setResults(quizResults)
      setShowResults(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setResults(null)
  }

  const currentQ = questions[currentQuestion]

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Quiz: Alimentação Saudável</h1>
                  <p className="text-sm text-gray-600">Resultados</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Concluído!
            </h2>
            <p className="text-gray-600 text-lg">
              Aqui estão seus resultados e recomendações personalizadas
            </p>
          </div>

          {/* Score and Category */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-green-600 mb-4">
                {results.score}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${results.color}`}>
                {results.category}
              </h3>
              <p className="text-gray-600">
                Baseado nas suas respostas sobre hábitos alimentares
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 text-green-600 mr-2" />
              Recomendações Personalizadas
            </h3>
            <div className="space-y-4">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 text-green-600 mr-2" />
              O que você pode melhorar
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.improvements.map((improvement, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-gray-900">{improvement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 text-center shadow-lg border border-green-200">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              🎯 {getPageTitle()}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {getCustomMessage()}
            </p>
            <button 
              onClick={() => {
                const whatsappUrl = getWhatsAppUrl()
                console.log('📱 Abrindo WhatsApp:', whatsappUrl)
                console.log('👤 Dados do usuário:', userData)
                window.open(whatsappUrl, '_blank')
              }}
              className="px-12 py-6 bg-green-600 text-white rounded-xl font-bold text-xl hover:bg-green-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-green-500"
            >
              <MessageCircle className="w-8 h-8 mr-3" />
              {getButtonText()}
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refazer Quiz
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-yellow-50 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
                <p className="text-yellow-700 text-sm">
                  Este quiz é uma ferramenta de orientação e não substitui uma avaliação nutricional profissional completa. 
                  Consulte sempre um especialista para uma análise detalhada da sua alimentação.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz: Alimentação Saudável</h1>
                <p className="text-sm text-gray-600">Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz: Alimentação Saudável</h2>
            <p className="text-gray-600 mb-6">
              Responda às perguntas para descobrir como está sua alimentação
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestion] === index
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[currentQuestion] === index
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Este quiz é uma ferramenta de orientação e não substitui uma avaliação nutricional profissional completa. 
                Consulte sempre um especialista para uma análise detalhada da sua alimentação.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
