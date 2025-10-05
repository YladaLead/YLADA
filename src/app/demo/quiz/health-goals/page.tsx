'use client'

import { useState } from 'react'
import { ArrowLeft, Target, CheckCircle, ArrowRight, Trophy, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HealthGoalsQuizDemoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<{
    goal: string
    timeframe: string
    intensity: string
    plan: {
      title: string
      description: string
      activities: string[]
    }
    strategies: string[]
    schedule: string[]
    successMetrics: string[]
    motivation: string
  } | null>(null)

  const questions = [
    {
      id: 1,
      question: "Qual é seu principal objetivo de saúde?",
      options: [
        { value: "weight-loss", label: "Perder peso" },
        { value: "muscle-gain", label: "Ganhar massa muscular" },
        { value: "fitness", label: "Melhorar condicionamento físico" },
        { value: "energy", label: "Aumentar energia e vitalidade" }
      ]
    },
    {
      id: 2,
      question: "Em quanto tempo você gostaria de alcançar seu objetivo?",
      options: [
        { value: "1-month", label: "1 mês" },
        { value: "3-months", label: "3 meses" },
        { value: "6-months", label: "6 meses" },
        { value: "1-year", label: "1 ano ou mais" }
      ]
    },
    {
      id: 3,
      question: "Qual é sua motivação principal?",
      options: [
        { value: "health", label: "Melhorar a saúde geral" },
        { value: "appearance", label: "Melhorar a aparência" },
        { value: "confidence", label: "Aumentar a autoconfiança" },
        { value: "performance", label: "Melhorar performance física" }
      ]
    },
    {
      id: 4,
      question: "Quantas horas por semana você pode dedicar aos exercícios?",
      options: [
        { value: "1-2", label: "1-2 horas" },
        { value: "3-4", label: "3-4 horas" },
        { value: "5-6", label: "5-6 horas" },
        { value: "7+", label: "7+ horas" }
      ]
    },
    {
      id: 5,
      question: "Qual é seu maior desafio atual?",
      options: [
        { value: "time", label: "Falta de tempo" },
        { value: "motivation", label: "Falta de motivação" },
        { value: "knowledge", label: "Falta de conhecimento" },
        { value: "support", label: "Falta de apoio" }
      ]
    },
    {
      id: 6,
      question: "Como você prefere ser acompanhado?",
      options: [
        { value: "self-guided", label: "Autodirigido" },
        { value: "group", label: "Em grupo" },
        { value: "personal", label: "Acompanhamento personalizado" },
        { value: "online", label: "Online/remoto" }
      ]
    },
    {
      id: 7,
      question: "Qual é sua experiência anterior com exercícios?",
      options: [
        { value: "beginner", label: "Iniciante" },
        { value: "some-experience", label: "Alguma experiência" },
        { value: "intermediate", label: "Intermediário" },
        { value: "advanced", label: "Avançado" }
      ]
    },
    {
      id: 8,
      question: "Qual área você gostaria de focar primeiro?",
      options: [
        { value: "cardio", label: "Exercícios cardiovasculares" },
        { value: "strength", label: "Treinamento de força" },
        { value: "flexibility", label: "Flexibilidade e mobilidade" },
        { value: "nutrition", label: "Alimentação e nutrição" }
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
    const goal = answers[0]
    const timeframe = answers[1]
    const motivation = answers[2]
    const timeAvailable = answers[3]
    const challenge = answers[4]
    const experience = answers[6]
    
    let intensity = 'moderate'
    if (timeAvailable === '7+' && experience === 'advanced') {
      intensity = 'high'
    } else if (timeAvailable === '1-2' || experience === 'beginner') {
      intensity = 'low'
    }
    
    const plan = generatePersonalizedPlan(goal)
    const strategies = generateStrategies(challenge)
    const schedule = generateSchedule(timeAvailable)
    const successMetrics = generateSuccessMetrics(goal)

    setResult({
      goal,
      timeframe,
      intensity,
      plan,
      strategies,
      schedule,
      successMetrics,
      motivation
    })
    setShowResult(true)
  }

  const generatePersonalizedPlan = (goal: string) => {
    const plans = {
      'weight-loss': {
        title: 'Plano de Perda de Peso',
        description: 'Foco em déficit calórico e exercícios cardiovasculares',
        activities: [
          'Cardio 3-4x por semana (30-45 min)',
          'Treino de força 2-3x por semana',
          'Controle calórico diário',
          'Caminhadas diárias'
        ]
      },
      'muscle-gain': {
        title: 'Plano de Ganho de Massa',
        description: 'Foco em treinamento de força e superávit calórico',
        activities: [
          'Treino de força 4-5x por semana',
          'Cardio moderado 2-3x por semana',
          'Superávit calórico controlado',
          'Descanso adequado entre treinos'
        ]
      },
      'fitness': {
        title: 'Plano de Condicionamento',
        description: 'Melhoria geral da capacidade física',
        activities: [
          'Treino HIIT 2-3x por semana',
          'Treino de força 2-3x por semana',
          'Atividades recreativas',
          'Flexibilidade e mobilidade'
        ]
      },
      'energy': {
        title: 'Plano de Energia e Vitalidade',
        description: 'Foco em sono, alimentação e exercícios moderados',
        activities: [
          'Exercícios moderados diários',
          'Rotina de sono consistente',
          'Alimentação equilibrada',
          'Técnicas de relaxamento'
        ]
      }
    }
    
    return plans[goal as keyof typeof plans] || plans['fitness']
  }

  const generateStrategies = (challenge: string) => {
    const strategies = {
      'time': [
        'Treinos de alta intensidade (HIIT)',
        'Exercícios em casa',
        'Micro-treinos durante o dia',
        'Planejamento semanal detalhado'
      ],
      'motivation': [
        'Definir metas pequenas e alcançáveis',
        'Sistema de recompensas',
        'Acompanhamento de progresso',
        'Parceria de treino'
      ],
      'knowledge': [
        'Educação nutricional básica',
        'Técnicas de exercício corretas',
        'Planejamento de refeições',
        'Consultoria profissional'
      ],
      'support': [
        'Grupos de apoio online',
        'Treinador pessoal',
        'Família e amigos',
        'Comunidade fitness'
      ]
    }
    
    return strategies[challenge as keyof typeof strategies] || strategies['motivation']
  }

  const generateSchedule = (timeAvailable: string) => {
    const schedules = {
      '1-2': [
        'Segunda: Treino HIIT (30 min)',
        'Quarta: Treino de força (30 min)',
        'Sexta: Cardio moderado (30 min)',
        'Fim de semana: Atividade recreativa'
      ],
      '3-4': [
        'Segunda: Treino de força (45 min)',
        'Terça: Cardio (30 min)',
        'Quinta: Treino de força (45 min)',
        'Sábado: Cardio longo (45 min)'
      ],
      '5-6': [
        'Segunda: Treino de força (60 min)',
        'Terça: Cardio (45 min)',
        'Quarta: Treino de força (60 min)',
        'Quinta: Cardio (45 min)',
        'Sábado: Treino completo (90 min)'
      ],
      '7+': [
        'Segunda: Treino de força (60 min)',
        'Terça: Cardio + flexibilidade (75 min)',
        'Quarta: Treino de força (60 min)',
        'Quinta: Cardio (45 min)',
        'Sexta: Treino de força (60 min)',
        'Sábado: Cardio longo (90 min)',
        'Domingo: Atividade recreativa'
      ]
    }
    
    return schedules[timeAvailable as keyof typeof schedules] || schedules['3-4']
  }

  const generateSuccessMetrics = (goal: string) => {
    const metrics = {
      'weight-loss': [
        'Peso corporal (semanal)',
        'Medidas corporais (mensal)',
        'Percentual de gordura',
        'Nível de energia'
      ],
      'muscle-gain': [
        'Peso corporal (semanal)',
        'Medidas musculares',
        'Força nos exercícios',
        'Composição corporal'
      ],
      'fitness': [
        'Tempo em exercícios cardiovasculares',
        'Resistência muscular',
        'Flexibilidade',
        'Recuperação pós-treino'
      ],
      'energy': [
        'Nível de energia diário',
        'Qualidade do sono',
        'Humor e disposição',
        'Produtividade'
      ]
    }
    
    return metrics[goal as keyof typeof metrics] || metrics['fitness']
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz de Objetivos de Saúde - Demo</h1>
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
                  <Trophy className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Plano Personalizado Criado!
                </h2>
                <p className="text-gray-600">
                  Baseado nas suas respostas, criamos um plano específico para você
                </p>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-6 h-6 text-purple-500 mr-2" />
                  {result.plan.title}
                </h3>
                <p className="text-gray-600 mb-4">{result.plan.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                      Atividades Principais:
                    </h4>
                    <ul className="space-y-2">
                      {result.plan.activities.map((activity: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                          <span className="text-gray-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                      Cronograma Semanal:
                    </h4>
                    <ul className="space-y-2">
                      {result.schedule.map((day: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                          <span className="text-gray-700">{day}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Estratégias para Superar Desafios:
                </h3>
                <ul className="space-y-2">
                  {result.strategies.map((strategy: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Métricas de Sucesso:
                </h3>
                <ul className="space-y-2">
                  {result.successMetrics.map((metric: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{metric}</span>
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