'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Quiz {
  id: string
  professional_id: string
  title: string
  description: string
  project_name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  settings: {
    showCorrectAnswers: boolean
    randomizeQuestions: boolean
    customButtonText?: string
    congratulationsMessage?: string
    specialistButtonText?: string
    specialistRedirectUrl?: string
  }
  is_active: boolean
}

interface Question {
  id: string
  quiz_id: string
  question_text: string
  question_type: 'multiple' | 'essay'
  order_number: number
  options: string[]
  correct_answer: number | string
  points: number
  button_text: string
}

interface Professional {
  id: string
  name: string
  email: string
  phone?: string
  specialty?: string
  company?: string
}

export default function QuizPage({ params }: { params: Promise<{ usuario: string; projeto: string }> }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const resolvedParams = await params
        console.log('🔍 Carregando quiz:', { usuario: resolvedParams.usuario, projeto: resolvedParams.projeto })
        
        // Buscar profissional pelo slug do usuário
        const { data: professionals } = await supabase
          .from('professionals')
          .select('*')
        
        console.log('👥 Profissionais encontrados:', professionals)
        
        const professional = professionals?.find(p => 
          p.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === resolvedParams.usuario
        )
        
        if (!professional) {
          console.log('❌ Profissional não encontrado para slug:', resolvedParams.usuario)
          setError('Usuário não encontrado')
          return
        }
        
        console.log('✅ Profissional encontrado:', professional)
        setProfessional(professional)
        
        // Buscar quiz pelo project_name
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('professional_id', professional.id)
          .eq('project_name', resolvedParams.projeto)
          .eq('is_active', true)
          .single()
        
        if (quizError || !quizData) {
          console.log('❌ Quiz não encontrado:', quizError)
          setError('Quiz não encontrado')
          return
        }
        
        console.log('✅ Quiz encontrado:', quizData)
        setQuiz(quizData)
        
        // Buscar perguntas do quiz
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quizData.id)
          .order('order_number')
        
        if (questionsError) {
          console.log('❌ Erro ao buscar perguntas:', questionsError)
          setError('Erro ao carregar perguntas')
          return
        }
        
        console.log('✅ Perguntas encontradas:', questionsData)
        setQuestions(questionsData || [])
        
        // Incrementar contador de cliques
        await supabase
          .from('quizzes')
          .update({ 
            // Assumindo que existe uma coluna clicks, se não existir, podemos adicionar
            updated_at: new Date().toISOString()
          })
          .eq('id', quizData.id)
        
      } catch (error) {
        console.error('❌ Erro ao carregar quiz:', error)
        setError('Erro interno do servidor')
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [params])

  const handleAnswer = (questionIndex: number, answer: number | string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  // Função de pontuação desabilitada por enquanto
  // const calculateScore = () => {
  //   let correctAnswers = 0
  //   questions.forEach((question, index) => {
  //     if (answers[index] === question.correct_answer) {
  //       correctAnswers++
  //     }
  //   })
  //   return Math.round((correctAnswers / questions.length) * 100)
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Link não encontrado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  if (!quiz || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz não disponível</h2>
          <p className="text-gray-600 mb-6">Este quiz não possui perguntas ou não está ativo.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: quiz.colors.background }}>
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-2" style={{ color: quiz.colors.text }}>
              {quiz.settings.congratulationsMessage || 'Parabéns! Você concluiu o quiz com sucesso! 🎉'}
            </h1>
            
            <button 
              onClick={() => {
                if (quiz.settings.specialistRedirectUrl) {
                  window.open(quiz.settings.specialistRedirectUrl, '_blank')
                }
              }}
              className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-emerald-500"
            >
              <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              {quiz.settings.specialistButtonText || 'Consultar Profissional de Bem-Estar'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: quiz.colors.background }}>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: quiz.colors.text }}>
            {quiz.title}
          </h1>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                backgroundColor: quiz.colors.primary 
              }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">
            Pergunta {currentQuestion + 1} de {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: quiz.colors.text }}>
            {currentQ.question_text}
          </h2>
          
          {/* Multiple Choice Questions */}
          {currentQ.question_type === 'multiple' && (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestion] === index
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: answers[currentQuestion] === index ? quiz.colors.background : 'white',
                    borderColor: answers[currentQuestion] === index ? quiz.colors.primary : undefined
                  }}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Essay Questions */}
          {currentQ.question_type === 'essay' && (
            <div className="space-y-3">
              <textarea
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-emerald-500 focus:outline-none transition-colors"
                rows={4}
                style={{
                  borderColor: answers[currentQuestion] ? quiz.colors.primary : undefined
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={
              answers[currentQuestion] === undefined || 
              (currentQ.question_type === 'essay' && !answers[currentQuestion])
            }
            className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: quiz.colors.primary }}
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
          </button>
        </div>
      </div>
    </div>
  )
}
