'use client'

import { useState } from 'react'
import SpecialistCTA from '@/components/SpecialistCTA'
import { ArrowRight, Heart, Zap, Moon } from 'lucide-react'

export default function PerfilBemEstarPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: "Como você se sente ao acordar pela manhã?",
      options: [
        "Energizado e pronto para o dia",
        "Cansado, mas consegue levantar",
        "Muito cansado, difícil de levantar",
        "Exausto, preciso de mais horas de sono"
      ]
    },
    {
      question: "Qual é sua principal fonte de energia durante o dia?",
      options: [
        "Exercícios físicos regulares",
        "Café e estimulantes",
        "Alimentação equilibrada",
        "Não tenho energia constante"
      ]
    },
    {
      question: "Como você lida com o estresse?",
      options: [
        "Pratico meditação ou respiração",
        "Faço exercícios físicos",
        "Como ou bebo algo",
        "Não sei lidar bem com estresse"
      ]
    },
    {
      question: "Qual é sua relação com a alimentação?",
      options: [
        "Como de forma equilibrada e consciente",
        "Tento comer bem, mas às vezes falho",
        "Como quando lembro ou tenho tempo",
        "Não me preocupo muito com alimentação"
      ]
    }
  ]

  const profiles = {
    acelerado: {
      title: "Perfil Acelerado",
      description: "Você tem alta energia e busca resultados rápidos!",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      color: "bg-yellow-50 border-yellow-200",
      recommendations: [
        "Produtos energéticos para manter o ritmo",
        "Shakes para refeições rápidas e nutritivas",
        "Suplementos para performance"
      ]
    },
    cansado: {
      title: "Perfil Cansado",
      description: "Você precisa de mais energia e vitalidade!",
      icon: <Moon className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
      recommendations: [
        "Produtos para aumentar energia naturalmente",
        "Programa de desintoxicação",
        "Suplementos para sono e recuperação"
      ]
    },
    equilibrado: {
      title: "Perfil Equilibrado",
      description: "Você já tem bons hábitos, vamos otimizar!",
      icon: <Heart className="w-8 h-8 text-green-500" />,
      color: "bg-green-50 border-green-200",
      recommendations: [
        "Produtos para manutenção da saúde",
        "Programa de nutrição avançada",
        "Suplementos para longevidade"
      ]
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

  const getProfile = () => {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0)
    
    if (totalScore <= 4) return 'acelerado'
    if (totalScore <= 8) return 'equilibrado'
    return 'cansado'
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
  }

  if (showResult) {
    const profile = getProfile()
    const profileData = profiles[profile as keyof typeof profiles]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              {profileData.icon}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {profileData.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              {profileData.description}
            </p>
            
            <div className={`p-6 rounded-xl border-2 ${profileData.color} mb-8`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recomendações para você:
              </h3>
              <ul className="text-left space-y-2">
                {profileData.recommendations.map((rec, index) => (
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
                <span>Falar com Especialista</span>
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
              Qual o seu perfil de bem-estar?
            </h1>
            <p className="text-gray-600">
              Descubra qual estratégia de saúde combina mais com você
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
