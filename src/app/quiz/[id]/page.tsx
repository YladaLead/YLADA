'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react'

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
    timeLimit?: number
    attempts?: number
    showCorrectAnswers: boolean
    randomizeQuestions: boolean
    customButtonText?: string
    congratulationsMessage?: string
    specialistButtonText?: string
    specialistRedirectUrl?: string
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
  points?: number
  button_text?: string
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const resolvedParams = await params
        // Buscar quiz
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select(`
            id,
            title,
            description,
            colors,
            settings,
            questions (
              id,
              question_text,
              question_type,
              order_number,
              options,
              correct_answer,
              points,
              button_text
            )
          `)
          .eq('id', resolvedParams.id)
          .eq('is_active', true)
          .single()

        if (quizError || !quizData) {
          setError('Quiz não encontrado ou inativo')
          setLoading(false)
          return
        }

        // Ordenar perguntas e mapear campos
        const sortedQuestions = quizData.questions
          .sort((a: { order_number: number }, b: { order_number: number }) => a.order_number - b.order_number)
          .map((q: { id: string; question_text: string; question_type: 'multiple' | 'essay'; order_number: number; options: string[]; correct_answer: string | number; points: number; button_text: string }) => ({
            id: q.id,
            question_text: q.question_text,
            question_type: q.question_type,
            order: q.order_number, // Mapear order_number para order
            options: q.options,
            correct_answer: q.correct_answer,
            points: q.points,
            button_text: q.button_text
          }))
        
        setQuiz({
          ...quizData,
          questions: sortedQuestions
        })

        // Configurar timer se houver limite de tempo
        if (quizData.settings.timeLimit) {
          setTimeLeft(quizData.settings.timeLimit * 60) // Converter minutos para segundos
        }

        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar quiz:', err)
        setError('Erro ao carregar quiz')
        setLoading(false)
      }
    }

    loadQuiz()
  }, [params])

  const handleComplete = useCallback(async () => {
    if (!quiz) return

    setIsCompleted(true)
    
    // Calcular score
    let totalScore = 0
    let correctAnswers = 0

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (userAnswer !== undefined) {
        if (question.question_type === 'multiple') {
          if (userAnswer === question.correct_answer) {
            totalScore += question.points || 1
            correctAnswers++
          }
        } else {
          // Para perguntas dissertativas, dar pontos por responder
          totalScore += question.points || 1
        }
      }
    })

    setScore(totalScore)

    // Salvar sessão no banco (opcional)
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await supabase.from('quiz_sessions').insert({
        quiz_id: quiz.id,
        user_session_id: sessionId,
        total_questions: quiz.questions.length,
        correct_answers: correctAnswers,
        total_points: totalScore,
        completed: true,
        completed_at: new Date().toISOString()
      })
    } catch (err) {
      console.error('Erro ao salvar sessão:', err)
    }

    // Redirecionar para página de conclusão após completar
    setTimeout(() => {
      router.push(`/quiz-completed/${quiz.id}`)
    }, 2000)
  }, [quiz, answers, router])

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, handleComplete])

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz não encontrado</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: quiz.colors.background }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4" style={{ color: quiz.colors.text }}>
            Parabéns! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            {quiz.settings.congratulationsMessage || 'Você concluiu o quiz com sucesso!'}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Sua pontuação:</p>
            <p className="text-2xl font-bold" style={{ color: quiz.colors.primary }}>
              {score} pontos
            </p>
          </div>
          {quiz.settings.specialistRedirectUrl && (
            <button
              onClick={() => window.open(quiz.settings.specialistRedirectUrl, '_blank')}
              className="w-full px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: quiz.colors.primary }}
            >
              {quiz.settings.specialistButtonText || 'Falar com Especialista'}
            </button>
          )}
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen" style={{ backgroundColor: quiz.colors.background }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            {timeLeft !== null && (
              <div className="flex items-center text-red-600">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold" style={{ color: quiz.colors.text }}>
              {quiz.title}
            </h1>
            <p className="text-gray-600 mt-1">{quiz.description}</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pergunta {currentQuestion + 1} de {quiz.questions.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: quiz.colors.primary
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: quiz.colors.text }}>
            {question.question_text}
          </h2>

          {question.question_type === 'multiple' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[question.id] === index
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          )}

          {question.question_type === 'essay' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={4}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: quiz.colors.primary }}
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Finalizar' : 'Próxima'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}