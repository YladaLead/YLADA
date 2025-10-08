'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, Info, Copy } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Quiz {
  id?: string
  professional_id: string
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
  }
  questions: Question[]
  is_active: boolean
  created_at?: string
}

interface Question {
  id?: string
  quiz_id?: string
  question_text: string
  question_type: 'multiple' | 'essay'
  order: number
  options?: string[]
  correct_answer?: number | string
  points?: number
  button_text?: string
}

export default function QuizBuilder() {
  const [quiz, setQuiz] = useState<Quiz>({
    professional_id: '',
    title: 'Meu Quiz',
    description: 'Descrição do quiz',
    colors: {
      primary: '#10B981', // emerald-500 (nossa cor padrão)
      secondary: '#8B5CF6', // violet-500
      background: '#F0FDF4', // green-50
      text: '#1F2937' // gray-800
    },
    settings: {
      showCorrectAnswers: true,
      randomizeQuestions: false,
      customButtonText: 'Falar com Especialista'
    },
    questions: [],
    is_active: true
  })

  const [previewQuestion, setPreviewQuestion] = useState(0)
  const [showColorInfo, setShowColorInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)

  // Buscar usuário logado
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setQuiz(prev => ({ ...prev, professional_id: user.id }))
      }
    }
    getUser()
  }, [])

  const colorExplanations = {
    primary: {
      title: 'Cor Primária',
      description: 'Usada em botões principais, barras de progresso e destaques importantes. É a cor de ação do seu quiz.',
      example: 'Botão "Próxima", barra de progresso'
    },
    secondary: {
      title: 'Cor Secundária',
      description: 'Usada para elementos de apoio, badges e detalhes decorativos. Complementa a cor primária.',
      example: 'Tag "Múltipla Escolha", pontuação final'
    },
    background: {
      title: 'Cor de Fundo',
      description: 'A cor de fundo principal da tela onde o quiz aparece. Define a atmosfera geral.',
      example: 'Fundo atrás do card do quiz'
    },
    text: {
      title: 'Cor do Texto',
      description: 'Cor principal do texto, perguntas e respostas. Deve ter bom contraste com o fundo branco.',
      example: 'Perguntas, opções de resposta'
    }
  }

  const addQuestion = (type: 'multiple' | 'essay') => {
    const isLastQuestion = quiz.questions.length === 0
    const newQuestion: Question = {
      question_text: '',
      question_type: type,
      order: quiz.questions.length,
      options: type === 'multiple' ? ['', '', '', ''] : [],
      correct_answer: type === 'multiple' ? 0 : '',
      points: 1,
      button_text: isLastQuestion ? 'Finalizar Quiz' : 'Próxima Questão'
    }
    setQuiz({...quiz, questions: [...quiz.questions, newQuestion]})
    setPreviewQuestion(quiz.questions.length)
  }

  const updateQuestion = (id: number, field: string, value: string | number | string[]) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, index) => 
        index === id ? {...q, [field]: value} : q
      )
    })
  }

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, index) => 
        index === questionId 
          ? {...q, options: q.options?.map((opt, i) => i === optionIndex ? value : opt)}
          : q
      )
    })
  }

  const deleteQuestion = (id: number) => {
    const newQuestions = quiz.questions.filter((_, index) => index !== id)
    setQuiz({
      ...quiz,
      questions: newQuestions
    })
    if (previewQuestion >= newQuestions.length) {
      setPreviewQuestion(Math.max(0, newQuestions.length - 1))
    }
  }

  const updateColor = (colorKey: string, value: string) => {
    setQuiz({
      ...quiz,
      colors: {...quiz.colors, [colorKey]: value}
    })
  }

  const saveQuiz = async () => {
    if (!user) {
      alert('Usuário não encontrado')
      return
    }

    setLoading(true)
    try {
      // Salvar quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .upsert({
          id: quiz.id,
          professional_id: user.id,
          title: quiz.title,
          description: quiz.description,
          colors: quiz.colors,
          settings: quiz.settings,
          is_active: quiz.is_active
        })
        .select()
        .single()

      if (quizError) throw quizError

      // Salvar perguntas
      if (quizData) {
        // Deletar perguntas antigas
        await supabase
          .from('quiz_questions')
          .delete()
          .eq('quiz_id', quizData.id)

        // Inserir novas perguntas
        const questionsToInsert = quiz.questions.map((q, index) => ({
          quiz_id: quizData.id,
          question_text: q.question_text,
          question_type: q.question_type,
          order: index,
          options: q.options,
          correct_answer: q.correct_answer,
          points: q.points || 1,
          button_text: q.button_text
        }))

        const { error: questionsError } = await supabase
          .from('quiz_questions')
          .insert(questionsToInsert)

        if (questionsError) throw questionsError

        setQuiz({...quiz, id: quizData.id})
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        
        // Redirecionar para página de sucesso após 2 segundos
        setTimeout(() => {
          window.location.href = `/quiz-success/${quizData.id}`
        }, 2000)
      }
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
      alert('Erro ao salvar quiz. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Componente de Preview ao Vivo
  const LivePreview = () => {
    if (quiz.questions.length === 0) {
      return (
        <div 
          className="h-full flex items-center justify-center p-8 rounded-lg"
          style={{backgroundColor: quiz.colors.background}}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{backgroundColor: quiz.colors.primary + '20'}}
            >
              <Plus size={32} style={{color: quiz.colors.primary}} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{color: quiz.colors.text}}>
              {quiz.title}
            </h3>
            <p className="text-gray-500 mb-4">{quiz.description}</p>
            <p className="text-sm text-gray-400">
              Adicione perguntas para ver a prévia
            </p>
          </div>
        </div>
      )
    }

    const question = quiz.questions[previewQuestion]

    return (
      <div 
        className="h-full flex items-center justify-center p-4 lg:p-8 rounded-lg"
        style={{backgroundColor: quiz.colors.background}}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-w-2xl w-full">
          {/* Navegação entre perguntas */}
          {quiz.questions.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {quiz.questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setPreviewQuestion(index)}
                  className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: previewQuestion === index 
                      ? quiz.colors.primary 
                      : quiz.colors.primary + '20',
                    color: previewQuestion === index ? 'white' : quiz.colors.primary
                  }}
                >
                  Q{index + 1}
                </button>
              ))}
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span 
                className="text-sm font-semibold"
                style={{color: quiz.colors.secondary}}
              >
                Questão {previewQuestion + 1} de {quiz.questions.length}
              </span>
              <span 
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: quiz.colors.secondary + '20',
                  color: quiz.colors.secondary
                }}
              >
                {question.question_type === 'multiple' ? 'Múltipla Escolha' : 'Dissertativa'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((previewQuestion + 1) / quiz.questions.length) * 100}%`,
                  backgroundColor: quiz.colors.primary
                }}
              />
            </div>
          </div>

          <h3 
            className="text-2xl font-bold mb-6"
            style={{color: quiz.colors.text}}
          >
            {question.question_text || 'Digite a pergunta...'}
          </h3>

          {question.question_type === 'multiple' ? (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-4 rounded-lg border-2 text-left transition-all hover:scale-102"
                  style={{
                    borderColor: '#e5e7eb',
                    backgroundColor: 'white',
                    color: quiz.colors.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = quiz.colors.primary
                    e.currentTarget.style.backgroundColor = quiz.colors.primary + '10'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  {option || `Opção ${index + 1}`}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              placeholder="Digite sua resposta aqui..."
              className="w-full p-4 border-2 rounded-lg min-h-32"
              style={{
                borderColor: quiz.colors.primary,
                color: quiz.colors.text
              }}
            />
          )}

          <button
            className="w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
            style={{backgroundColor: quiz.colors.primary}}
          >
            {question.button_text || (previewQuestion < quiz.questions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz')}
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h2>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Construtor de Quiz</h1>
            <p className="text-sm text-gray-600">Crie quizzes personalizados para seus clientes</p>
          </div>
          <div className="flex gap-3">
            {quiz.id && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
                onClick={() => {
                  const url = `${window.location.origin}/quiz/${quiz.id}`
                  navigator.clipboard.writeText(url)
                  alert('Link copiado para a área de transferência!')
                }}
              >
                <Copy size={18} />
                Copiar Link
              </button>
            )}
            <button
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
              onClick={saveQuiz}
              disabled={loading || quiz.questions.length === 0}
            >
              <Save size={18} />
              {loading ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Quiz'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Painel Editor - Esquerda */}
        <div className="w-full lg:w-1/2 min-w-0 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Informações do Quiz */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📋 Informações do Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ex: Quiz de Conhecimentos Gerais"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={quiz.description}
                  onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                  placeholder="Breve descrição do seu quiz"
                />
              </div>
            </div>
          </div>

          {/* Personalização de Cores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">🎨 Cores do Quiz</h2>
            <div className="space-y-4">
              {Object.entries(colorExplanations).map(([key, info]) => (
                <div key={key} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">{info.title}</label>
                    <button
                      onMouseEnter={() => setShowColorInfo(key)}
                      onMouseLeave={() => setShowColorInfo(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  
                  {showColorInfo === key && (
                    <div className="absolute right-0 top-0 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10">
                      <p className="font-semibold mb-1">{info.description}</p>
                      <p className="text-gray-300">Exemplo: {info.example}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={quiz.colors[key as keyof typeof quiz.colors]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="w-14 h-11 rounded cursor-pointer border"
                    />
                    <input
                      type="text"
                      value={quiz.colors[key as keyof typeof quiz.colors]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configurações */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">⚙️ Configurações</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Mostrar respostas corretas</label>
                  <p className="text-xs text-gray-500">Exibir respostas corretas após o quiz</p>
                </div>
                <button
                  onClick={() => setQuiz({
                    ...quiz, 
                    settings: {...quiz.settings, showCorrectAnswers: !quiz.settings.showCorrectAnswers}
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    quiz.settings.showCorrectAnswers ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    quiz.settings.showCorrectAnswers ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Randomizar perguntas</label>
                  <p className="text-xs text-gray-500">Ordem aleatória das perguntas</p>
                </div>
                <button
                  onClick={() => setQuiz({
                    ...quiz, 
                    settings: {...quiz.settings, randomizeQuestions: !quiz.settings.randomizeQuestions}
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    quiz.settings.randomizeQuestions ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    quiz.settings.randomizeQuestions ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Texto do Botão Final</label>
                <input
                  type="text"
                  value={quiz.settings.customButtonText || 'Falar com Especialista'}
                  onChange={(e) => setQuiz({
                    ...quiz, 
                    settings: {...quiz.settings, customButtonText: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ex: Agendar Consulta, Falar com Especialista, Saiba Mais"
                />
                <p className="text-xs text-gray-500 mt-1">Texto que aparece no botão após finalizar o quiz</p>
              </div>
            </div>
          </div>

          {/* Perguntas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">❓ Perguntas</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => addQuestion('multiple')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 text-sm"
                >
                  <Plus size={16} />
                  Múltipla Escolha
                </button>
                <button
                  onClick={() => addQuestion('essay')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 text-sm"
                >
                  <Plus size={16} />
                  Dissertativa
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((question, qIndex) => (
                <div 
                  key={qIndex} 
                  className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                    previewQuestion === qIndex 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPreviewQuestion(qIndex)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-600">
                      Questão {qIndex + 1} - {
                        question.question_type === 'multiple' ? '✓ Múltipla Escolha' : '✍️ Dissertativa'
                      }
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteQuestion(qIndex)
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                    placeholder="Digite a pergunta..."
                    className="w-full px-3 py-2 border rounded mb-3 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Campo de texto do botão */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Texto do Botão:
                    </label>
                    <input
                      type="text"
                      value={question.button_text || (qIndex === quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão')}
                      onChange={(e) => updateQuestion(qIndex, 'button_text', e.target.value)}
                      placeholder={qIndex === quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão'}
                      className="w-full px-3 py-2 border rounded text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {question.question_type === 'multiple' && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Opções (selecione a correta):
                      </p>
                      {question.options?.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2 items-center">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correct_answer === oIndex}
                            onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                            className="w-4 h-4"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Opção ${oIndex + 1}`}
                            className="flex-1 px-3 py-2 border rounded text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {quiz.questions.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Plus size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Adicione sua primeira pergunta</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview ao Vivo - Direita */}
        <div className="w-full lg:w-1/2 min-w-0 bg-gray-100 border-t lg:border-t-0 lg:border-l">
          <div className="sticky top-0 bg-white border-b px-6 py-3">
            <h2 className="text-lg font-bold text-gray-700">👁️ Preview ao Vivo</h2>
            <p className="text-xs text-gray-500">Veja como seu quiz aparece em tempo real</p>
          </div>
          <LivePreview />
        </div>
      </div>
    </div>
  )
}