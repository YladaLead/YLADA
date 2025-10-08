'use client'

import { useState } from 'react'
import { Activity, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function LifestyleQuizPage() {
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
    lifestyleTips: string[]
  } | null>(null)

  const questions = [
    {
      question: "Quantas horas você dorme por noite?",
      options: [
        "Menos de 6 horas",
        "6-7 horas",
        "7-8 horas",
        "Mais de 8 horas"
      ]
    },
    {
      question: "Com que frequência você pratica exercícios físicos?",
      options: [
        "Nunca",
        "1-2 vezes por semana",
        "3-4 vezes por semana",
        "5+ vezes por semana"
      ]
    },
    {
      question: "Como você descreveria seu nível de estresse?",
      options: [
        "Muito alto",
        "Alto",
        "Moderado",
        "Baixo"
      ]
    },
    {
      question: "Quantas porções de frutas e vegetais você consome por dia?",
      options: [
        "Menos de 2 porções",
        "2-3 porções",
        "4-5 porções",
        "Mais de 5 porções"
      ]
    },
    {
      question: "Com que frequência você consome alimentos processados?",
      options: [
        "Diariamente",
        "3-4 vezes por semana",
        "1-2 vezes por semana",
        "Raramente"
      ]
    },
    {
      question: "Quantos copos de água você bebe por dia?",
      options: [
        "Menos de 4 copos",
        "4-6 copos",
        "7-8 copos",
        "Mais de 8 copos"
      ]
    },
    {
      question: "Como você gerencia o estresse no dia a dia?",
      options: [
        "Não tenho estratégias",
        "Ocasionalmente uso técnicas",
        "Uso técnicas regularmente",
        "Tenho uma rotina estruturada"
      ]
    },
    {
      question: "Qual é sua relação com o tempo de tela?",
      options: [
        "Mais de 8 horas por dia",
        "6-8 horas por dia",
        "4-6 horas por dia",
        "Menos de 4 horas por dia"
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
    let lifestyleTips: string[] = []
    
    if (percentage >= 80) {
      category = 'Estilo de Vida Excelente'
      color = 'text-green-600'
      description = 'Você mantém hábitos muito saudáveis e equilibrados'
      recommendations = [
        'Continue mantendo seus excelentes hábitos',
        'Considere compartilhar suas estratégias com outros',
        'Mantenha a consistência na sua rotina',
        'Explore novos desafios saudáveis'
      ]
      priorityAreas = ['Manutenção', 'Inspiração', 'Novos Desafios']
      lifestyleTips = [
        'Mantenha sua rotina de sono consistente',
        'Continue diversificando suas atividades físicas',
        'Preserve suas técnicas de gerenciamento de estresse'
      ]
    } else if (percentage >= 60) {
      category = 'Estilo de Vida Bom'
      color = 'text-blue-600'
      description = 'Você tem uma base sólida de hábitos saudáveis'
      recommendations = [
        'Melhore gradualmente as áreas mais fracas',
        'Foque na consistência dos bons hábitos',
        'Implemente pequenas melhorias diárias',
        'Considere orientação profissional para otimização'
      ]
      priorityAreas = ['Consistência', 'Melhorias Graduais', 'Otimização']
      lifestyleTips = [
        'Estabeleça horários fixos para dormir',
        'Aumente gradualmente a atividade física',
        'Pratique técnicas de relaxamento diariamente'
      ]
    } else if (percentage >= 40) {
      category = 'Estilo de Vida Regular'
      color = 'text-yellow-600'
      description = 'Há espaço significativo para melhorias no seu estilo de vida'
      recommendations = [
        'Implemente mudanças graduais e sustentáveis',
        'Foque em uma área por vez',
        'Busque orientação profissional',
        'Estabeleça metas realistas e mensuráveis'
      ]
      priorityAreas = ['Mudanças Graduais', 'Orientação Profissional', 'Metas Realistas']
      lifestyleTips = [
        'Comece com 15 minutos de exercício por dia',
        'Aumente gradualmente a ingestão de água',
        'Reduza o tempo de tela em 30 minutos por dia'
      ]
    } else {
      category = 'Estilo de Vida Precisa de Atenção'
      color = 'text-red-600'
      description = 'Seu estilo de vida precisa de mudanças significativas'
      recommendations = [
        'Procure orientação médica e profissional urgente',
        'Comece com mudanças básicas e pequenas',
        'Foque em hábitos fundamentais primeiro',
        'Considere acompanhamento especializado'
      ]
      priorityAreas = ['Orientação Médica', 'Mudanças Básicas', 'Acompanhamento']
      lifestyleTips = [
        'Estabeleça um horário fixo para dormir',
        'Caminhe 10 minutos por dia',
        'Beba um copo de água a cada hora'
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
      lifestyleTips
    })
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
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
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Avaliação de Estilo de Vida</h1>
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
              Questionário de Estilo de Vida
            </h2>
            <p className="text-lg text-gray-600">
              Avalie seus hábitos e receba recomendações para um estilo de vida mais saudável
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
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
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
                      className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
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
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Seu Resultado
                </h3>
                <div className="text-4xl font-bold text-teal-600 mb-2">
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
                <div className="bg-teal-50 rounded-lg p-6">
                  <h4 className="font-semibold text-teal-800 mb-4 text-lg">
                    Recomendações:
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-teal-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-cyan-50 rounded-lg p-6">
                  <h4 className="font-semibold text-cyan-800 mb-4 text-lg">
                    Áreas Prioritárias:
                  </h4>
                  <ul className="space-y-2">
                    {result.priorityAreas.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-cyan-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-blue-800 mb-4 text-lg">
                  Dicas de Estilo de Vida:
                </h4>
                <ul className="space-y-2">
                  {result.lifestyleTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">{tip}</span>
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
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold inline-block"
                >
                  Voltar às Ferramentas
                </Link>
              </div>
            </div>
          )}
        </div>
                    {/* Botão personalizado do especialista */}

                    <SpecialistCTA toolName="lifestyle-quiz" />
</main>
    </div>
  )
}
