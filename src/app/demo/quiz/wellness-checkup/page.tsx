'use client'

import { useState } from 'react'
import { ArrowLeft, Shield, CheckCircle, ArrowRight, Heart, Brain, Zap, Activity } from 'lucide-react'
import Link from 'next/link'

export default function WellnessCheckupQuizDemoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<any>(null)

  const questions = [
    {
      id: 1,
      question: "Como você avalia sua qualidade de sono?",
      options: [
        { value: "excellent", label: "Excelente - durmo profundamente" },
        { value: "good", label: "Boa - durmo bem na maioria das vezes" },
        { value: "fair", label: "Regular - às vezes tenho dificuldades" },
        { value: "poor", label: "Ruim - frequentemente não durmo bem" }
      ]
    },
    {
      id: 2,
      question: "Qual é seu nível de energia durante o dia?",
      options: [
        { value: "high", label: "Alto - me sinto energizado o dia todo" },
        { value: "moderate", label: "Moderado - energia constante" },
        { value: "fluctuating", label: "Flutuante - altos e baixos" },
        { value: "low", label: "Baixo - frequentemente cansado" }
      ]
    },
    {
      id: 3,
      question: "Como você gerencia o estresse?",
      options: [
        { value: "very-well", label: "Muito bem - tenho técnicas eficazes" },
        { value: "well", label: "Bem - consigo lidar na maioria das vezes" },
        { value: "moderately", label: "Moderadamente - às vezes é difícil" },
        { value: "poorly", label: "Mal - frequentemente me sinto sobrecarregado" }
      ]
    },
    {
      id: 4,
      question: "Qual é sua relação com a alimentação?",
      options: [
        { value: "excellent", label: "Excelente - como de forma equilibrada" },
        { value: "good", label: "Boa - geralmente faço boas escolhas" },
        { value: "fair", label: "Regular - às vezes como mal" },
        { value: "poor", label: "Ruim - frequentemente faço escolhas ruins" }
      ]
    },
    {
      id: 5,
      question: "Como você se sente emocionalmente?",
      options: [
        { value: "very-positive", label: "Muito positivo - geralmente feliz" },
        { value: "positive", label: "Positivo - mais feliz que triste" },
        { value: "neutral", label: "Neutro - altos e baixos" },
        { value: "negative", label: "Negativo - frequentemente triste/ansioso" }
      ]
    },
    {
      id: 6,
      question: "Qual é sua capacidade de concentração?",
      options: [
        { value: "excellent", label: "Excelente - foco facilmente" },
        { value: "good", label: "Boa - consigo me concentrar bem" },
        { value: "fair", label: "Regular - às vezes me distraio" },
        { value: "poor", label: "Ruim - dificuldade para focar" }
      ]
    },
    {
      id: 7,
      question: "Como você se sente fisicamente?",
      options: [
        { value: "excellent", label: "Excelente - forte e saudável" },
        { value: "good", label: "Bom - geralmente me sinto bem" },
        { value: "fair", label: "Regular - às vezes me sinto fraco" },
        { value: "poor", label: "Ruim - frequentemente me sinto mal" }
      ]
    },
    {
      id: 8,
      question: "Qual é sua satisfação geral com a vida?",
      options: [
        { value: "very-satisfied", label: "Muito satisfeito" },
        { value: "satisfied", label: "Satisfeito" },
        { value: "neutral", label: "Neutro" },
        { value: "dissatisfied", label: "Insatisfeito" }
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
    let totalScore = 0
    const maxScore = questions.length * 4
    
    Object.values(answers).forEach(answer => {
      switch(answer) {
        case 'excellent':
        case 'high':
        case 'very-well':
        case 'very-positive':
        case 'very-satisfied':
          totalScore += 4
          break
        case 'good':
        case 'moderate':
        case 'well':
        case 'positive':
        case 'satisfied':
          totalScore += 3
          break
        case 'fair':
        case 'fluctuating':
        case 'moderately':
        case 'neutral':
          totalScore += 2
          break
        default:
          totalScore += 1
      }
    })
    
    const percentage = (totalScore / maxScore) * 100
    
    let wellnessLevel = ''
    let color = ''
    let description = ''
    let recommendations = []
    let priorityAreas = []
    
    if (percentage >= 85) {
      wellnessLevel = 'Excelente Bem-estar'
      color = 'text-green-600'
      description = 'Você tem um nível excepcional de bem-estar! Continue mantendo seus hábitos saudáveis.'
      recommendations = [
        'Continue com sua rotina atual',
        'Compartilhe suas práticas com outros',
        'Monitore regularmente para manter o equilíbrio',
        'Considere novos desafios saudáveis'
      ]
      priorityAreas = [
        'Manter consistência',
        'Explorar novas atividades',
        'Mentorar outros'
      ]
    } else if (percentage >= 70) {
      wellnessLevel = 'Bom Bem-estar'
      color = 'text-blue-600'
      description = 'Você tem uma base sólida de bem-estar com algumas áreas para otimização.'
      recommendations = [
        'Identifique áreas específicas para melhorar',
        'Implemente pequenas mudanças graduais',
        'Mantenha os hábitos que estão funcionando',
        'Considere buscar apoio profissional em áreas específicas'
      ]
      priorityAreas = [
        'Otimizar áreas fracas',
        'Manter consistência',
        'Buscar melhorias graduais'
      ]
    } else if (percentage >= 50) {
      wellnessLevel = 'Bem-estar Regular'
      color = 'text-yellow-600'
      description = 'Há espaço significativo para melhorias em várias áreas do seu bem-estar.'
      recommendations = [
        'Foque em uma área por vez',
        'Implemente mudanças pequenas e sustentáveis',
        'Considere buscar apoio profissional',
        'Estabeleça metas realistas e alcançáveis'
      ]
      priorityAreas = [
        'Sono e energia',
        'Gestão de estresse',
        'Alimentação equilibrada'
      ]
    } else {
      wellnessLevel = 'Bem-estar Precisa Atenção'
      color = 'text-red-600'
      description = 'Seu bem-estar precisa de atenção urgente. Mudanças significativas são necessárias.'
      recommendations = [
        'Consulte profissionais de saúde',
        'Implemente mudanças graduais mas consistentes',
        'Priorize sono, alimentação e exercícios',
        'Considere terapia para saúde mental',
        'Busque apoio de amigos e família'
      ]
      priorityAreas = [
        'Saúde mental',
        'Sono de qualidade',
        'Alimentação nutritiva',
        'Atividade física regular'
      ]
    }

    setResult({
      score: totalScore,
      maxScore,
      percentage: percentage.toFixed(0),
      wellnessLevel,
      color,
      description,
      recommendations,
      priorityAreas
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz de Check-up de Bem-estar - Demo</h1>
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
                  <Shield className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Check-up Concluído!
                </h2>
                <p className="text-gray-600">
                  Aqui está sua avaliação de bem-estar
                </p>
              </div>

              <div className="mb-8">
                <div className={`text-4xl font-bold ${result.color} mb-2`}>
                  {result.percentage}%
                </div>
                <div className={`text-xl font-semibold ${result.color}`}>
                  {result.wellnessLevel}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Pontuação: {result.score}/{result.maxScore}
                </div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  {result.description}
                </p>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-6 h-6 text-red-500 mr-2" />
                  Áreas Prioritárias:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.priorityAreas.map((area: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-6 h-6 text-blue-500 mr-2" />
                  Recomendações Personalizadas:
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="w-5 h-5 text-emerald-500 mr-2" />
                  Próximos Passos:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Activity className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">1. Identifique</p>
                    <p className="text-gray-600">Suas áreas de foco</p>
                  </div>
                  <div className="text-center">
                    <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">2. Planeje</p>
                    <p className="text-gray-600">Mudanças pequenas</p>
                  </div>
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">3. Execute</p>
                    <p className="text-gray-600">Com consistência</p>
                  </div>
                </div>
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
                </a>
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
            </a>
            <a
              href="/"
              className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Ver Outras Ferramentas
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}