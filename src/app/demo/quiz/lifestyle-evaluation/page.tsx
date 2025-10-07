'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, CheckCircle, ArrowRight, Clock, Activity } from 'lucide-react'
import Link from 'next/link'

export default function LifestyleQuizDemoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<{
    score: number
    maxScore: number
    percentage: string
    category: string
    color: string
    description: string
    recommendations: string[]
    priorityAreas: string[]
    lifestyleTips: string[]
  } | null>(null)

  const questions = [
    {
      id: 1,
      question: "Quantas horas você dorme por noite?",
      options: [
        { value: "less-6", label: "Menos de 6 horas" },
        { value: "6-7", label: "6-7 horas" },
        { value: "7-8", label: "7-8 horas" },
        { value: "more-8", label: "Mais de 8 horas" }
      ]
    },
    {
      id: 2,
      question: "Com que frequência você pratica exercícios físicos?",
      options: [
        { value: "never", label: "Nunca" },
        { value: "weekly", label: "1-2 vezes por semana" },
        { value: "regular", label: "3-4 vezes por semana" },
        { value: "daily", label: "Quase todos os dias" }
      ]
    },
    {
      id: 3,
      question: "Como você descreve seu nível de estresse?",
      options: [
        { value: "low", label: "Baixo - me sinto relaxado" },
        { value: "moderate", label: "Moderado - às vezes me sinto estressado" },
        { value: "high", label: "Alto - frequentemente estressado" },
        { value: "very-high", label: "Muito alto - constantemente estressado" }
      ]
    },
    {
      id: 4,
      question: "Quantas horas por dia você passa em frente a telas?",
      options: [
        { value: "less-2", label: "Menos de 2 horas" },
        { value: "2-4", label: "2-4 horas" },
        { value: "4-8", label: "4-8 horas" },
        { value: "more-8", label: "Mais de 8 horas" }
      ]
    },
    {
      id: 5,
      question: "Como você gerencia seu tempo livre?",
      options: [
        { value: "passive", label: "Assistindo TV ou navegando na internet" },
        { value: "social", label: "Passando tempo com amigos e família" },
        { value: "active", label: "Praticando hobbies ou atividades criativas" },
        { value: "outdoor", label: "Ao ar livre ou em contato com a natureza" }
      ]
    },
    {
      id: 6,
      question: "Qual é sua principal fonte de energia durante o dia?",
      options: [
        { value: "caffeine", label: "Cafeína (café, chá, energéticos)" },
        { value: "sugar", label: "Açúcar e doces" },
        { value: "balanced", label: "Alimentação equilibrada" },
        { value: "natural", label: "Energia natural (sem estimulantes)" }
      ]
    }
  ]

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult()
    }
  }

  const calculateResult = () => {
    let score = 0
    const maxScore = questions.length * 4
    
    Object.values(answers).forEach(answer => {
      switch(answer) {
        case 'more-8':
        case 'daily':
        case 'low':
        case 'less-2':
        case 'outdoor':
        case 'natural':
          score += 4
          break
        case '7-8':
        case 'regular':
        case 'moderate':
        case '2-4':
        case 'active':
        case 'balanced':
          score += 3
          break
        case '6-7':
        case 'weekly':
        case 'high':
        case '4-8':
        case 'social':
        case 'sugar':
          score += 2
          break
        default:
          score += 1
      }
    })
    
    const percentage = (score / maxScore) * 100
    
    let category = ''
    let color = ''
    let recommendations = []
    let lifestyleTips = []
    let description = ''
    let priorityAreas = []
    
    if (percentage >= 80) {
      category = 'Estilo de Vida Excelente'
      color = 'text-green-600'
      description = 'Você demonstra excelentes hábitos de vida saudável'
      recommendations = [
        'Continue mantendo seus hábitos saudáveis',
        'Considere compartilhar suas práticas com outros',
        'Monitore regularmente para manter o equilíbrio'
      ]
      priorityAreas = ['Manutenção', 'Compartilhamento', 'Monitoramento']
      lifestyleTips = [
        'Você tem um estilo de vida muito equilibrado',
        'Suas escolhas promovem bem-estar geral',
        'Continue com essa rotina saudável'
      ]
    } else if (percentage >= 60) {
      category = 'Estilo de Vida Bom'
      color = 'text-blue-600'
      description = 'Você tem uma base sólida de hábitos saudáveis'
      recommendations = [
        'Melhore gradualmente seus hábitos de sono',
        'Aumente a atividade física regular',
        'Reduza o tempo em frente a telas'
      ]
      priorityAreas = ['Sono', 'Exercício', 'Tempo de Tela']
      lifestyleTips = [
        'Você tem uma base sólida de hábitos saudáveis',
        'Alguns ajustes podem melhorar ainda mais',
        'Foque em pequenas mudanças sustentáveis'
      ]
    } else if (percentage >= 40) {
      category = 'Estilo de Vida Regular'
      color = 'text-yellow-600'
      description = 'Há espaço significativo para melhorias no seu estilo de vida'
      recommendations = [
        'Foque em uma área por vez para melhorar',
        'Considere buscar apoio profissional',
        'Implemente mudanças pequenas e sustentáveis'
      ]
      priorityAreas = ['Foco', 'Apoio Profissional', 'Mudanças Graduais']
      lifestyleTips = [
        'Há espaço significativo para melhorias',
        'Foque em uma área por vez',
        'Considere buscar apoio profissional'
      ]
    } else {
      category = 'Estilo de Vida Precisa Melhorar'
      color = 'text-red-600'
      description = 'Seu estilo de vida precisa de atenção urgente'
      recommendations = [
        'Consulte profissionais de saúde',
        'Implemente mudanças graduais',
        'Priorize sono, alimentação e exercícios',
        'Considere terapia para saúde mental'
      ]
      priorityAreas = ['Saúde', 'Mudanças Graduais', 'Prioridades Básicas', 'Saúde Mental']
      lifestyleTips = [
        'Seu estilo de vida precisa de atenção urgente',
        'Mudanças significativas são necessárias',
        'Busque apoio profissional para orientação'
      ]
    }

    setResult({
      score,
      maxScore,
      percentage: percentage.toFixed(0),
      category,
      color,
      description,
      recommendations,
      priorityAreas,
      lifestyleTips
    })
    setShowResult(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz de Estilo de Vida - Demo</h1>
                <p className="text-sm text-gray-600">Demonstração da ferramenta profissional</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Esta é uma demonstração
              </h3>
              <p className="text-blue-700">
                Esta é uma versão de demonstração do quiz. Na versão completa, 
                você receberá os dados dos seus clientes automaticamente e poderá 
                personalizar com sua marca.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!showResult ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Pergunta {currentQuestion + 1} de {questions.length}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{option.label}</span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Quiz Concluído!
                </h2>
                <p className="text-gray-600">
                  Aqui está sua avaliação de estilo de vida
                </p>
              </div>

              <div className="mb-8">
                <div className={`text-4xl font-bold ${result?.color} mb-2`}>
                  {result?.percentage}%
                </div>
                <div className={`text-xl font-semibold ${result?.color}`}>
                  {result?.category}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Pontuação: {result?.score}/{result?.maxScore}
                </div>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-6 h-6 text-blue-500 mr-2" />
                  Análise do Seu Estilo de Vida:
                </h3>
                <ul className="space-y-3">
                  {result?.lifestyleTips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 text-emerald-500 mr-2" />
                  Recomendações para Melhorar:
                </h3>
                <ul className="space-y-3">
                  {result?.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Refazer Quiz
                </button>
                <a
                  href="/auth/register"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Começar Gratuitamente
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Gostou da demonstração?
          </h3>
          <p className="text-emerald-100 mb-6">
            Com a versão completa, você receberá os dados dos seus clientes automaticamente 
            e poderá personalizar com sua marca.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Gratuitamente
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Ver Outras Ferramentas
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}