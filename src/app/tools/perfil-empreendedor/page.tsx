'use client'
import { useState } from 'react'
import { ArrowRight, Heart, Briefcase, DollarSign, Target } from 'lucide-react'

export default function PerfilEmpreendedorPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: "Como você se sente trabalhando por conta própria?",
      options: [
        "Adoro a liberdade e autonomia",
        "Gosto, mas preciso de estrutura",
        "Prefiro ter um chefe",
        "Não gosto de responsabilidades"
      ]
    },
    {
      question: "Qual é sua relação com metas financeiras?",
      options: [
        "Defino metas altas e trabalho para alcançá-las",
        "Defino metas realistas",
        "Prefiro não pensar em dinheiro",
        "Não tenho metas financeiras"
      ]
    },
    {
      question: "Como você lida com desafios?",
      options: [
        "Vejo como oportunidades de crescimento",
        "Enfrento com determinação",
        "Prefiro evitar",
        "Me desanimo facilmente"
      ]
    },
    {
      question: "Qual é sua visão sobre networking?",
      options: [
        "Fundamental para o sucesso",
        "Importante, mas não é prioridade",
        "Útil ocasionalmente",
        "Não gosto de conhecer pessoas"
      ]
    }
  ]

  const getScore = () => {
    return answers.reduce((sum, answer) => sum + answer, 0)
  }

  const getResult = () => {
    const score = getScore()
    
    if (score <= 3) {
      return {
        title: "Você tem potencial empreendedor!",
        description: "Vamos desenvolver suas habilidades de negócio!",
        icon: <Target className="w-8 h-8 text-orange-500" />,
        color: "bg-orange-50 border-orange-200",
        recommendations: [
          "Programa de desenvolvimento empreendedor",
          "Mentoria para novos distribuidores",
          "Treinamentos de vendas e marketing",
          "Oportunidades de crescimento no negócio"
        ],
        cta: "Desenvolver meu potencial"
      }
    } else if (score <= 7) {
      return {
        title: "Você tem perfil empreendedor!",
        description: "Vamos acelerar seu crescimento no negócio!",
        icon: <Briefcase className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-50 border-blue-200",
        recommendations: [
          "Programa avançado de negócios",
          "Formação de equipe própria",
          "Treinamentos de liderança",
          "Oportunidades de crescimento acelerado"
        ],
        cta: "Acelerar meu negócio"
      }
    } else {
      return {
        title: "Você é um empreendedor nato!",
        description: "Você tem o perfil perfeito para o negócio!",
        icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
        color: "bg-emerald-50 border-emerald-200",
        recommendations: [
          "Programa VIP de negócios",
          "Formação de equipe de elite",
          "Mentoria de outros empreendedores",
          "Oportunidades de crescimento exponencial"
        ],
        cta: "Construir meu império"
      }
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
  }

  if (showResult) {
    const result = getResult()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              {result.icon}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {result.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              {result.description}
            </p>
            
            <div className={`p-6 rounded-xl border-2 ${result.color} mb-8`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Oportunidades para você:
              </h3>
              <ul className="text-left space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <ArrowRight className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.open('https://wa.me/55119818680', '_blank')}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className="w-5 h-5" />
                <span>{result.cta}</span>
              </button>
              
              <button
                onClick={resetQuiz}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Refazer Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Você tem perfil para o negócio Herbalife?
            </h1>
            <p className="text-gray-600">
              Descubra se você tem o perfil empreendedor ideal
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Progresso</span>
              <span>{currentQuestion + 1} de {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200"
                >
                  <span className="text-gray-700">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
