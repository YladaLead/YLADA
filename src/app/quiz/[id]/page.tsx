'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle, Clock, Trophy, MessageSquare } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Quiz {
  id: string
  title: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  settings: {
    showCorrectAnswers: boolean
    randomizeQuestions: boolean
    timeLimit?: number
    attempts?: number
    customButtonText?: string
  }
  questions: Question[]
}

interface Question {
  id: string
  question_text: string
  question_type: 'multiple' | 'essay'
  order: number
  options?: string[]
  correct_answer?: number | string
  points: number
  button_text?: string
}

interface QuizResponse {
  questionId: string
  answer: string | number
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuizResponse[]>([])
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [showUserForm, setShowUserForm] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Buscar dados do quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', params.id)
          .eq('is_active', true)
          .single()

        if (quizError) throw quizError

        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', params.id)
          .order('order')

        if (questionsError) throw questionsError

        setQuiz({
          ...quizData,
          questions: questionsData
        })

        // Calcular pontos totais
        const total = questionsData.reduce((sum, q) => sum + (q.points || 1), 0)
        setTotalPoints(total)

        // Configurar timer se houver limite de tempo
        if (quizData.settings?.timeLimit) {
          setTimeLeft(quizData.settings.timeLimit * 60) // Converter minutos para segundos
        }

      } catch (error) {
        console.error('Erro ao buscar quiz:', error)
        setError('Quiz não encontrado ou inativo')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [params.id])


  const handleAnswer = (questionId: string, answer: string | number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId)
      if (existing) {
        return prev.map(r => r.questionId === questionId ? { ...r, answer } : r)
      } else {
        return [...prev, { questionId, answer }]
      }
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz || !userInfo.name || !userInfo.email) return

    try {
      // Calcular pontuação
      let calculatedScore = 0
      quiz.questions.forEach(question => {
        const userResponse = responses.find(r => r.questionId === question.id)
        if (userResponse) {
          if (question.question_type === 'multiple') {
            if (userResponse.answer === question.correct_answer) {
              calculatedScore += question.points || 1
            }
          } else {
            // Para dissertativa, dar pontos se respondeu
            if (userResponse.answer && userResponse.answer !== '') {
              calculatedScore += question.points || 1
            }
          }
        }
      })

      setScore(calculatedScore)

      // Salvar resposta no banco
      const { error } = await supabase
        .from('quiz_responses')
        .insert({
          quiz_id: quiz.id,
          user_name: userInfo.name,
          user_email: userInfo.email,
          responses: responses.reduce((acc, r) => {
            acc[r.questionId] = r.answer
            return acc
          }, {} as Record<string, string | number>),
          score: calculatedScore,
          total_points: totalPoints,
          time_spent: quiz.settings?.timeLimit ? (quiz.settings.timeLimit * 60) - (timeLeft || 0) : null
        })

      if (error) throw error

      setQuizCompleted(true)
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
      alert('Erro ao salvar suas respostas. Tente novamente.')
    }
  }, [quiz, userInfo, responses, totalPoints, timeLeft])

  // Timer countdown
  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }
  }, [timeLeft, handleSubmitQuiz])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: '#F0FDF4' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Carregando Quiz...</h2>
          <p className="text-gray-600">Preparando suas perguntas</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: '#F0FDF4' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quiz não encontrado</h2>
          <p className="text-gray-600 mb-4">{error || 'Este quiz não existe ou foi desativado.'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  // Formulário de informações do usuário
  if (showUserForm) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: quiz.colors.background }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: quiz.colors.primary + '20' }}
            >
              <Trophy className="w-8 h-8" style={{ color: quiz.colors.primary }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: quiz.colors.text }}>
              {quiz.title}
            </h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome Completo *</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: quiz.colors.primary + '30'
                }}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: quiz.colors.primary + '30'
                }}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <button
            onClick={() => setShowUserForm(false)}
            disabled={!userInfo.name || !userInfo.email}
            className="w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: quiz.colors.primary }}
          >
            Iniciar Quiz
          </button>
        </div>
      </div>
    )
  }

  // Quiz completado - mostrar resultado
  if (quizCompleted) {
    const percentage = Math.round((score / totalPoints) * 100)
    
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: quiz.colors.background }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: quiz.colors.primary + '20' }}
            >
              <Trophy className="w-10 h-10" style={{ color: quiz.colors.primary }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: quiz.colors.text }}>
              Quiz Concluído!
            </h1>
            <p className="text-gray-600 mb-4">Parabéns, {userInfo.name}!</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" style={{ color: quiz.colors.primary }}>
                  {score}
                </div>
                <div className="text-sm text-gray-600">Pontos Obtidos</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: quiz.colors.secondary }}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">Desempenho</div>
              </div>
            </div>
          </div>

          {quiz.settings.showCorrectAnswers && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: quiz.colors.text }}>
                Respostas Corretas:
              </h3>
              <div className="space-y-3">
                {quiz.questions.map((question) => {
                  const userResponse = responses.find(r => r.questionId === question.id)
                  const isCorrect = question.question_type === 'multiple' 
                    ? userResponse?.answer === question.correct_answer
                    : userResponse?.answer && userResponse.answer !== ''

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.question_text}</p>
                          {question.question_type === 'multiple' && (
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Sua resposta:</strong> {question.options?.[userResponse?.answer as number] || 'Não respondida'}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Resposta correta:</strong> {question.options?.[question.correct_answer as number]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Botão personalizado do especialista */}
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
            <button
              onClick={() => window.location.href = '/fitlead'}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {quiz.settings.customButtonText || 'Falar com Especialista'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz em andamento
  const question = quiz.questions[currentQuestion]
  const userResponse = responses.find(r => r.questionId === question.id)

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: quiz.colors.background }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header com progresso e timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span 
              className="text-sm font-semibold"
              style={{ color: quiz.colors.secondary }}
            >
              Questão {currentQuestion + 1} de {quiz.questions.length}
            </span>
            {timeLeft && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: quiz.colors.secondary }} />
                <span 
                  className="text-sm font-semibold"
                  style={{ color: quiz.colors.secondary }}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                backgroundColor: quiz.colors.primary
              }}
            />
          </div>
        </div>

        {/* Pergunta */}
        <h3 
          className="text-2xl font-bold mb-6"
          style={{ color: quiz.colors.text }}
        >
          {question.question_text}
        </h3>

        {/* Opções de resposta */}
        {question.question_type === 'multiple' ? (
          <div className="space-y-3 mb-6">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  userResponse?.answer === index 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  color: quiz.colors.text,
                  borderColor: userResponse?.answer === index ? quiz.colors.primary : undefined,
                  backgroundColor: userResponse?.answer === index ? quiz.colors.primary + '10' : undefined
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={userResponse?.answer as string || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="w-full p-4 border-2 rounded-lg min-h-32 mb-6"
            style={{
              borderColor: quiz.colors.primary,
              color: quiz.colors.text
            }}
          />
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <button
            onClick={nextQuestion}
            className="px-6 py-2 text-white font-semibold rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: quiz.colors.primary }}
          >
            {question.button_text || (currentQuestion < quiz.questions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz')}
          </button>
        </div>
      </div>
    </div>
  )
}
