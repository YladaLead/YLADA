'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, Copy, Share2, Eye, Link as LinkIcon } from 'lucide-react'
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
    customButtonText?: string
  }
}

export default function QuizSuccessPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)

  const quizUrl = `${window.location.origin}/quiz/${params.id}`

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setQuiz(data)

        // Buscar usuário logado
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser({ id: user.id })
        }
      } catch (error) {
        console.error('Erro ao buscar quiz:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [params.id])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const shareQuiz = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: quiz?.title || 'Meu Quiz',
          text: quiz?.description || 'Confira este quiz interessante!',
          url: quizUrl
        })
      } catch (error) {
        console.error('Erro ao compartilhar:', error)
      }
    } else {
      copyToClipboard()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h2>
          <p className="text-gray-600">Preparando seu quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz não encontrado</h2>
          <p className="text-gray-600 mb-4">Este quiz não existe ou foi removido.</p>
          <button
            onClick={() => window.location.href = '/user'}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Voltar ao Dashboard
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header de Sucesso */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: quiz.colors.primary + '20' }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: quiz.colors.primary }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: quiz.colors.text }}>
            Quiz Criado com Sucesso!
          </h1>
          <p className="text-gray-600 mb-4">
            Seu quiz <strong>&quot;{quiz.title}&quot;</strong> está pronto para ser compartilhado.
          </p>
        </div>

        {/* Informações do Quiz */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: quiz.colors.text }}>
            📋 Detalhes do Quiz
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Título:</span>
              <p className="font-medium" style={{ color: quiz.colors.text }}>{quiz.title}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Descrição:</span>
              <p className="text-gray-700">{quiz.description}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Botão Final:</span>
              <p className="font-medium" style={{ color: quiz.colors.primary }}>
                {quiz.settings.customButtonText || 'Falar com Especialista'}
              </p>
            </div>
          </div>
        </div>

        {/* Link do Quiz */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" style={{ color: quiz.colors.primary }} />
            Link do Quiz
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={quizUrl}
              readOnly
              className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm font-mono"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Copy className="w-4 h-4 mr-1" />
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => window.open(quizUrl, '_blank')}
            className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye className="w-5 h-5 mr-2" />
            Visualizar Quiz
          </button>
          
          <button
            onClick={shareQuiz}
            className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar
          </button>
        </div>

        {/* Próximos Passos */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            🚀 Próximos Passos
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 mt-0.5">
                1
              </div>
              <p>Compartilhe o link do quiz com seus clientes via WhatsApp, email ou redes sociais</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 mt-0.5">
                2
              </div>
              <p>Monitore as respostas no seu dashboard para acompanhar o engajamento</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 mt-0.5">
                3
              </div>
              <p>Use os dados coletados para personalizar seu atendimento e aumentar conversões</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/quiz-builder'}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
          >
            Criar Novo Quiz
          </button>
          
          <button
            onClick={() => window.location.href = '/user'}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Voltar ao Dashboard
          </button>
        </div>

        {/* Dica */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Dica:</strong> Você pode criar quantos quizzes quiser e personalizar cada um com cores e textos únicos para diferentes campanhas ou públicos.
          </p>
        </div>
      </div>
    </div>
  )
}
