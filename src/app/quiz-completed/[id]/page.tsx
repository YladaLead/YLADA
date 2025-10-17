'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowLeft, MessageSquare } from 'lucide-react'
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
    congratulationsMessage?: string
    specialistButtonText?: string
    specialistRedirectUrl?: string
  }
}

export default function QuizCompletedPage({ params }: { params: Promise<{ id: string }> }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const resolvedParams = await params
        
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select(`
            id,
            title,
            description,
            colors,
            settings
          `)
          .eq('id', resolvedParams.id)
          .single()

        if (quizError || !quizData) {
          setError('Quiz não encontrado')
          return
        }

        setQuiz(quizData)
      } catch (err) {
        console.error('Erro ao carregar quiz:', err)
        setError('Erro ao carregar quiz')
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [params])

  const handleContactSpecialist = () => {
    if (quiz?.settings.specialistRedirectUrl) {
      window.open(quiz.settings.specialistRedirectUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
          <p className="text-gray-600 mb-4">{error || 'Quiz não encontrado'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: quiz.colors.background }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Ícone de sucesso */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Quiz Concluído!
        </h1>

        {/* Mensagem de parabéns */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg mb-2">
            {quiz.settings.congratulationsMessage || 'Parabéns! Você concluiu o quiz com sucesso! 🎉'}
          </p>
        </div>

        {/* Botão do especialista */}
        {quiz.settings.specialistRedirectUrl && (
          <div className="mb-6">
            <button
              onClick={handleContactSpecialist}
              className="w-full px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ backgroundColor: quiz.colors.primary }}
            >
              <MessageSquare size={20} />
              {quiz.settings.specialistButtonText || 'Falar com Especialista'}
            </button>
          </div>
        )}

        {/* Botão voltar */}
        <button
          onClick={() => router.push('/')}
          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          Voltar ao Início
        </button>

        {/* Informações adicionais */}
        <div className="mt-6 text-xs text-gray-500">
          <p>O especialista entrará em contato em breve.</p>
        </div>
      </div>
    </div>
  )
}
