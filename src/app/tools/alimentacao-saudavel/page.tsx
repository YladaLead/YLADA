'use client'
import { useState } from 'react'
import { ArrowRight, Heart, Apple, Salad } from 'lucide-react'

export default function AlimentacaoSaudavelPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: "Quantas refeições você faz por dia?",
      options: [
        "3 refeições principais",
        "5-6 refeições pequenas",
        "2 refeições grandes",
        "Como quando lembro"
      ]
    },
    {
      question: "Qual é sua principal fonte de proteína?",
      options: [
        "Carnes magras e peixes",
        "Ovos e laticínios",
        "Legumes e grãos",
        "Não me preocupo com proteína"
      ]
    },
    {
      question: "Como você consome frutas e verduras?",
      options: [
        "Todos os dias, várias porções",
        "Alguns dias da semana",
        "Raramente",
        "Quase nunca"
      ]
    },
    {
      question: "Qual é sua relação com água?",
      options: [
        "Bebo 2-3L por dia",
        "Bebo quando sinto sede",
        "Bebo pouco, prefiro outros líquidos",
        "Não bebo água regularmente"
      ]
    },
    {
      question: "Como você lida com a fome entre refeições?",
      options: [
        "Como frutas ou castanhas",
        "Bebo água ou chá",
        "Como lanches industrializados",
        "Aguento até a próxima refeição"
      ]
    }
  ]

  const getScore = () => {
    return answers.reduce((sum, answer) => sum + answer, 0)
  }

  const getResult = () => {
    const score = getScore()
    
    if (score <= 5) {
      return {
        title: "Alimentação Básica",
        description: "Você tem uma base, mas pode melhorar muito!",
        icon: <Apple className="w-8 h-8 text-orange-500" />,
        color: "bg-orange-50 border-orange-200",
        recommendations: [
          "Programa de nutrição básica",
          "Shakes para refeições equilibradas",
          "Suplementos vitamínicos"
        ]
      }
    } else if (score <= 10) {
      return {
        title: "Alimentação Boa",
        description: "Você já tem bons hábitos, vamos otimizar!",
        icon: <Salad className="w-8 h-8 text-green-500" />,
        color: "bg-green-50 border-green-200",
        recommendations: [
          "Programa de nutrição avançada",
          "Suplementos para performance",
          "Plano personalizado de refeições"
        ]
      }
    } else {
      return {
        title: "Alimentação Excelente",
        description: "Parabéns! Você está no caminho certo!",
        icon: <Heart className="w-8 h-8 text-emerald-500" />,
        color: "bg-emerald-50 border-emerald-200",
        recommendations: [
          "Produtos premium para manutenção",
          "Suplementos para longevidade",
          "Programa de otimização nutricional"
        ]
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
                Recomendações para você:
              </h3>
              <ul className="text-left space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
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
                <span>Falar com Especialista em Nutrição</span>
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
              Você realmente se alimenta bem?
            </h1>
            <p className="text-gray-600">
              Descubra como está sua alimentação e receba dicas personalizadas
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
