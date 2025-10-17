'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { Plus, Trash2, Save, Info, Copy, ChevronDown, ChevronRight, ArrowLeft, GripVertical } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { getProjectConfig } from '@/lib/project-config'
import { useRouter, useSearchParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Quiz {
  id?: string
  professional_id: string
  title: string
  description: string
  project_name: string // NOVO: Nome do projeto para URL personalizada
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
  is_active: boolean
  created_at?: string
}

interface Question {
  id?: string
  quiz_id?: string
  question_text: string
  question_type: 'multiple' | 'essay' | 'multiple_select'
  order: number
  options?: string[]
  correct_answer?: number | string | number[] // Suporta múltiplas respostas corretas
  points?: number
  button_text?: string
  allow_multiple?: boolean // Nova propriedade para permitir múltiplas escolhas
  min_options?: number // Número mínimo de alternativas
  max_options?: number // Número máximo de alternativas
}

// Componente principal do Quiz Builder
function QuizBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projectDomain] = useState('herbalead')
  const [projectConfig] = useState<ReturnType<typeof getProjectConfig>>(getProjectConfig('fitness'))
  
  // Detectar projeto pelo subdomínio
  useEffect(() => {
    console.log('🔍 Quiz Builder initialized with herbalead project')
    
    // Limpar cache do localStorage para evitar problemas
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz-builder-cache')
      localStorage.removeItem('quiz-draft')
    }
  }, [])

  // Cores padrão baseadas no projeto Herbalead
  const getDefaultColors = useCallback(() => {
    return {
      primary: '#10B981', // emerald-600 (Herbalead)
      secondary: '#059669', // emerald-700
      background: '#F0FDF4', // green-50
      text: '#1F2937' // gray-800
    }
  }, [])

  const [quiz, setQuiz] = useState<Quiz>({
    professional_id: '',
    title: 'Quiz de Bem-Estar',
    description: 'Descubra seu perfil de bem-estar e receba orientações personalizadas',
    project_name: '', // NOVO: Nome do projeto para URL personalizada
    colors: getDefaultColors(),
    settings: {
      showCorrectAnswers: true,
      randomizeQuestions: false,
      customButtonText: 'Próxima Questão',
      congratulationsMessage: 'Parabéns!',
      specialistButtonText: 'Consultar Profissional de Bem-Estar',
      specialistRedirectUrl: 'https://wa.me/5519981868000?text=Olá! Gostaria de mais informações.'
    },
    questions: [],
    is_active: true
  })

  const [previewQuestion, setPreviewQuestion] = useState(0)
  const [showColorInfo, setShowColorInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; phone?: string } | null>(null)
  const [showInfo, setShowInfo] = useState(true) // Sempre expandido por padrão
  const [showColors, setShowColors] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showFinalPage, setShowFinalPage] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [, setSavedQuizId] = useState<string | null>(null)

  // Atualizar cores quando projeto mudar
  useEffect(() => {
    setQuiz(prev => ({
      ...prev,
      colors: getDefaultColors()
    }))
  }, [getDefaultColors])

  // Função para carregar quiz existente
  const loadExistingQuiz = async (quizId: string) => {
    try {
      console.log('🔍 Carregando quiz existente:', quizId)
      
      // Carregar dados do quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()
      
      if (quizError) {
        console.error('❌ Erro ao carregar quiz:', quizError)
        return
      }
      
      console.log('📊 Quiz carregado:', quizData)
      
      // Carregar perguntas do quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_number', { ascending: true })
      
      if (questionsError) {
        console.error('❌ Erro ao carregar perguntas:', questionsError)
      } else {
        console.log('📝 Perguntas carregadas:', questionsData)
      }
      
      // Atualizar estado do quiz com os dados carregados
      setQuiz({
        id: quizData.id,
        professional_id: quizData.professional_id,
        title: quizData.title,
        description: quizData.description,
        project_name: quizData.project_name,
        colors: quizData.colors,
        settings: quizData.settings,
        questions: questionsData || [],
        is_active: quizData.is_active
      })
      
      console.log('✅ Quiz carregado com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro ao carregar quiz existente:', error)
    }
  }

  // Buscar usuário logado e perfil
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          setQuiz(prev => ({ ...prev, professional_id: user.id }))
          
          // Buscar perfil do usuário
          const { data: profile } = await supabase
            .from('professionals')
            .select('*')
            .eq('email', user.email)
            .single()
          
          if (profile) {
            console.log('👤 Perfil encontrado:', profile)
            setUserProfile(profile)
          } else {
            console.log('⚠️ Perfil não encontrado para email:', user.email)
            // Se não encontrar perfil, criar um temporário
            setUserProfile({ name: 'Usuário', email: user.email || 'usuario@exemplo.com' })
          }
          
          // Verificar se há ID na URL para carregar quiz existente
          const quizId = searchParams.get('id')
          if (quizId) {
            console.log('🔄 ID do quiz encontrado na URL:', quizId)
            await loadExistingQuiz(quizId)
          }
          
        } else {
          // Se não há usuário logado, usar um ID temporário para desenvolvimento
          const tempUser = { id: 'temp-user-' + Date.now() }
          setUser(tempUser)
          setQuiz(prev => ({ ...prev, professional_id: tempUser.id }))
          setUserProfile({ name: 'Usuário', email: 'usuario@exemplo.com' })
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        // Em caso de erro, usar um ID temporário para desenvolvimento
        const tempUser = { id: 'temp-user-' + Date.now() }
        setUser(tempUser)
        setQuiz(prev => ({ ...prev, professional_id: tempUser.id }))
        setUserProfile({ name: 'Usuário', email: 'usuario@exemplo.com' })
      }
    }
    getUser()
  }, [searchParams])

  // Atualizar WhatsApp automaticamente quando o perfil do usuário for carregado
  useEffect(() => {
    if (userProfile?.phone) {
      const cleanPhone = userProfile.phone.replace(/\D/g, '') // Remove caracteres não numéricos
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=Olá! Gostaria de mais informações.`
      
      console.log('📱 Atualizando WhatsApp automaticamente:', {
        telefoneOriginal: userProfile.phone,
        telefoneLimpo: cleanPhone,
        urlWhatsApp: whatsappUrl
      })
      
      setQuiz(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          specialistRedirectUrl: whatsappUrl
        }
      }))
    }
  }, [userProfile])

  // Função para reordenar perguntas
  const reorderQuestions = (draggedQuestionId: string, newOrder: number) => {
    console.log('🔄 Reordenando perguntas:', { draggedQuestionId, newOrder })
    
    const currentQuestions = [...quiz.questions]
    
    // Encontrar a pergunta pelo ID ou índice
    let draggedQuestion
    let draggedIndex = -1
    
    if (draggedQuestionId.match(/^\d+$/)) {
      // Se é um número, usar como índice
      draggedIndex = parseInt(draggedQuestionId)
      draggedQuestion = currentQuestions[draggedIndex]
    } else {
      // Se é um ID, encontrar pelo ID
      draggedIndex = currentQuestions.findIndex(q => q.id === draggedQuestionId)
      draggedQuestion = currentQuestions[draggedIndex]
    }
    
    if (!draggedQuestion || draggedIndex === -1) {
      console.warn('⚠️ Pergunta não encontrada para reordenação:', draggedQuestionId)
      return
    }
    
    // Remover a pergunta da posição atual
    const filteredQuestions = currentQuestions.filter((_, index) => index !== draggedIndex)
    
    // Inserir na nova posição
    const reorderedQuestions = [
      ...filteredQuestions.slice(0, newOrder),
      draggedQuestion,
      ...filteredQuestions.slice(newOrder)
    ]
    
    console.log('📋 Nova ordem das perguntas:', reorderedQuestions.map((q, i) => `${i + 1}. ${q.question_text.substring(0, 30)}...`))
    
    setQuiz(prev => ({
      ...prev,
      questions: reorderedQuestions
    }))
  }

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

  // Templates de quiz pré-definidos
  const quizTemplates = {
    'bem-estar': {
      title: 'Quiz de Bem-Estar Completo',
      description: 'Avalie seu estilo de vida e receba orientações personalizadas para melhorar seu bem-estar',
      questions: [
        {
          question_text: 'Como você avalia sua qualidade de sono?',
          question_type: 'multiple' as const,
          options: ['Durmo muito bem, 7-8 horas por noite', 'Durmo bem, mas às vezes acordo cansado', 'Tenho dificuldade para dormir', 'Durmo pouco, menos de 6 horas'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Qual é sua frequência de atividade física?',
          question_type: 'multiple' as const,
          options: ['Todos os dias', '3-4 vezes por semana', '1-2 vezes por semana', 'Raramente ou nunca'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Como você descreve sua alimentação?',
          question_type: 'multiple' as const,
          options: ['Muito saudável e balanceada', 'Razoavelmente saudável', 'Às vezes como besteiras', 'Não me preocupo muito com alimentação'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Como você gerencia o estresse no dia a dia?',
          question_type: 'multiple' as const,
          options: ['Tenho técnicas eficazes de relaxamento', 'Faço exercícios para aliviar', 'Às vezes me sinto sobrecarregado', 'Vivo constantemente estressado'],
          correct_answer: 0,
          button_text: 'Finalizar Quiz'
        }
      ]
    },
    'nutricao': {
      title: 'Quiz de Avaliação Nutricional',
      description: 'Descubra seus hábitos alimentares e receba dicas personalizadas de nutrição',
      questions: [
        {
          question_text: 'Quantas refeições você faz por dia?',
          question_type: 'multiple' as const,
          options: ['5-6 refeições pequenas', '3 refeições principais', '2 refeições grandes', 'Como quando tenho fome'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Qual é sua principal fonte de proteína?',
          question_type: 'multiple' as const,
          options: ['Carnes magras e peixes', 'Ovos e laticínios', 'Leguminosas e grãos', 'Suplementos proteicos'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Quantos copos de água você bebe por dia?',
          question_type: 'multiple' as const,
          options: ['8 ou mais copos', '6-7 copos', '4-5 copos', 'Menos de 4 copos'],
          correct_answer: 0,
          button_text: 'Finalizar Quiz'
        }
      ]
    },
    'fitness': {
      title: 'Quiz de Perfil Fitness',
      description: 'Identifique seu perfil de atividade física e objetivos de treino',
      questions: [
        {
          question_text: 'Qual é seu principal objetivo com a atividade física?',
          question_type: 'multiple' as const,
          options: ['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento', 'Manter saúde geral'],
          correct_answer: 3,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Qual tipo de exercício você prefere?',
          question_type: 'multiple' as const,
          options: ['Musculação', 'Cardio (corrida, bike)', 'Exercícios funcionais', 'Esportes coletivos'],
          correct_answer: 0,
          button_text: 'Próxima Questão'
        },
        {
          question_text: 'Quantas vezes por semana você pode se exercitar?',
          question_type: 'multiple' as const,
          options: ['Todos os dias', '4-5 vezes', '2-3 vezes', '1 vez ou menos'],
          correct_answer: 1,
          button_text: 'Finalizar Quiz'
        }
      ]
    }
  }

  const loadTemplate = (templateKey: string) => {
    const template = quizTemplates[templateKey as keyof typeof quizTemplates]
    if (template) {
      setQuiz(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        questions: template.questions.map((q, index) => ({
          ...q,
          order: index,
          points: 1
        }))
      }))
      setPreviewQuestion(0)
      setShowTemplates(false)
    }
  }

  const addQuestion = (type: 'multiple' | 'essay' | 'multiple_select') => {
    const isLastQuestion = quiz.questions.length === 0
    const newQuestion: Question = {
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID único
      question_text: '',
      question_type: type,
      order: quiz.questions.length,
      options: type === 'multiple' || type === 'multiple_select' ? ['', '', '', ''] : [],
      correct_answer: type === 'multiple' ? 0 : type === 'multiple_select' ? [] : '',
      points: 1,
      button_text: isLastQuestion ? 'Finalizar Quiz' : 'Próxima Questão',
      allow_multiple: type === 'multiple_select',
      min_options: type === 'multiple' || type === 'multiple_select' ? 2 : undefined,
      max_options: type === 'multiple' || type === 'multiple_select' ? 8 : undefined
    }
    setQuiz({...quiz, questions: [...quiz.questions, newQuestion]})
    setPreviewQuestion(quiz.questions.length)
  }

  const addOption = (questionIndex: number) => {
    const question = quiz.questions[questionIndex]
    if (question.options && question.options.length < (question.max_options || 8)) {
      const newOptions = [...question.options, '']
      updateQuestion(questionIndex, 'options', newOptions)
    }
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    console.log('🔍 removeOption chamada:', { questionIndex, optionIndex })
    const question = quiz.questions[questionIndex]
    console.log('📊 Questão atual:', { 
      questionType: question.question_type, 
      optionsLength: question.options?.length, 
      minOptions: question.min_options 
    })
    
    if (question.options && question.options.length > (question.min_options || 2)) {
      console.log('✅ Condição atendida, removendo opção')
      const newOptions = question.options.filter((_, index) => index !== optionIndex)
      updateQuestion(questionIndex, 'options', newOptions)
      
      // Ajustar resposta correta se necessário
      if (question.question_type === 'multiple') {
        const currentCorrect = question.correct_answer as number
        if (currentCorrect >= optionIndex) {
          const newCorrect = currentCorrect > optionIndex ? currentCorrect - 1 : 0
          updateQuestion(questionIndex, 'correct_answer', newCorrect)
        }
      } else if (question.question_type === 'multiple_select') {
        const currentCorrect = question.correct_answer as number[]
        const newCorrect = currentCorrect
          .filter(index => index !== optionIndex)
          .map(index => index > optionIndex ? index - 1 : index)
        updateQuestion(questionIndex, 'correct_answer', newCorrect)
      }
    } else {
      console.log('❌ Condição não atendida:', {
        hasOptions: !!question.options,
        optionsLength: question.options?.length,
        minOptions: question.min_options || 2,
        condition: question.options && question.options.length > (question.min_options || 2)
      })
    }
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = quiz.questions[questionIndex]
    if (question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionIndex, 'options', newOptions)
    }
  }

  const updateQuestion = (id: number, field: string, value: string | number | string[]) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, index) => 
        index === id ? {...q, [field]: value} : q
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
    console.log('🔍 Iniciando salvamento do quiz...')
    console.log('👤 Usuário:', user)
    
    if (!user) {
      console.error('❌ Usuário não encontrado')
      alert('Usuário não encontrado')
      return
    }

    console.log('📝 Dados do quiz:', {
      title: quiz.title,
      project_name: quiz.project_name,
      questions_count: quiz.questions.length,
      professional_id: quiz.professional_id
    })

    // Validar campos obrigatórios
    if (!quiz.title.trim()) {
      console.error('❌ Título vazio')
      alert('⚠️ O título do quiz é obrigatório!')
      return
    }

    if (!quiz.project_name.trim()) {
      console.error('❌ Nome do projeto vazio')
      alert('⚠️ O nome do projeto é obrigatório!\n\nEste nome será usado para criar a URL personalizada do seu quiz.')
      return
    }

    // Validar se o nome do projeto já existe para este usuário
    try {
      console.log('🔍 Verificando se nome do projeto já existe...', quiz.project_name.trim())
      
      const { data: existingQuiz, error: checkError } = await supabase
        .from('quizzes')
        .select('id, title')
        .eq('professional_id', user.id)
        .eq('project_name', quiz.project_name.trim())
        .neq('id', quiz.id || '') // Excluir o próprio quiz se estiver editando
        .single()

      console.log('📊 Resultado da verificação:', { existingQuiz, checkError })

      if (existingQuiz) {
        console.error('❌ Nome do projeto já existe:', existingQuiz)
        alert(`⚠️ Já existe um quiz com o nome de projeto "${quiz.project_name}"!\n\nTítulo do quiz existente: "${existingQuiz.title}"\n\nEscolha um nome diferente para evitar conflitos.`)
        return
      }
    } catch (error) {
      // Se não encontrar nenhum quiz com esse nome, continua normalmente
      console.log('✅ Nome do projeto disponível:', quiz.project_name, error)
    }

    // Validar se há pelo menos uma pergunta
    if (quiz.questions.length === 0) {
      alert('⚠️ Adicione pelo menos uma pergunta ao quiz!')
      return
    }

    // Validar se todas as perguntas têm texto
    const emptyQuestions = quiz.questions.some(q => !q.question_text.trim())
    if (emptyQuestions) {
      alert('⚠️ Todas as perguntas devem ter texto!')
      return
    }

    // Validar opções das perguntas de múltipla escolha
    const invalidQuestions = quiz.questions.some(q => {
      if (q.question_type === 'multiple' || q.question_type === 'multiple_select') {
        // Verificar se tem pelo menos 2 opções
        if (!q.options || q.options.length < 2) {
          return true
        }
        // Verificar se todas as opções têm texto
        if (q.options.some(option => !option.trim())) {
          return true
        }
        // Verificar se tem pelo menos uma resposta correta
        if (q.question_type === 'multiple' && (q.correct_answer === null || q.correct_answer === undefined)) {
          return true
        }
        if (q.question_type === 'multiple_select' && (!q.correct_answer || (q.correct_answer as number[]).length === 0)) {
          return true
        }
      }
      return false
    })

    if (invalidQuestions) {
      alert('⚠️ Todas as perguntas de múltipla escolha devem ter:\n\n• Pelo menos 2 opções\n• Todas as opções preenchidas\n• Pelo menos uma resposta correta selecionada')
      return
    }

    setLoading(true)
    try {
      console.log('💾 Salvando quiz no banco de dados...')
      
      // Salvar quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .upsert({
          id: quiz.id,
          professional_id: user.id,
          title: quiz.title,
          description: quiz.description,
          project_name: quiz.project_name,
          colors: quiz.colors,
          settings: quiz.settings,
          is_active: quiz.is_active
        })
        .select()
        .single()

      console.log('📊 Resultado do salvamento:', { quizData, quizError })

      if (quizError) {
        console.error('❌ Erro ao salvar quiz:', quizError)
        throw quizError
      }

      // Salvar perguntas
      if (quizData) {
        console.log('📝 Salvando perguntas...', quiz.questions.length, 'perguntas')
        
        // Deletar perguntas antigas
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .eq('quiz_id', quizData.id)
        
        if (deleteError) {
          console.error('❌ Erro ao deletar perguntas antigas:', deleteError)
        }

        // Inserir novas perguntas
        const questionsToInsert = quiz.questions.map((q, index) => ({
          quiz_id: quizData.id,
          question_text: q.question_text,
          question_type: q.question_type,
          order_number: index,
          options: q.options,
          correct_answer: q.correct_answer,
          points: q.points || 1,
          button_text: q.button_text
        }))

        console.log('📋 Perguntas para inserir:', questionsToInsert)

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert)

        if (questionsError) {
          console.error('❌ Erro ao salvar perguntas:', questionsError)
          throw questionsError
        }

        console.log('✅ Quiz salvo com sucesso!', quizData.id)
        setQuiz({...quiz, id: quizData.id})
        setSavedQuizId(quizData.id)
        setShowSuccessModal(true)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
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
    const [showFinalPage, setShowFinalPage] = useState(false)
    const [currentPreviewQuestion, setCurrentPreviewQuestion] = useState(0)
    const [previewAnswers, setPreviewAnswers] = useState<{[key: number]: number}>({})

    if (quiz.questions.length === 0) {
      return (
        <div className="p-6">
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
              <button
                className="px-6 py-3 rounded-lg text-white font-semibold text-lg transition-all hover:scale-105"
                style={{backgroundColor: quiz.colors.primary}}
              >
                Começar Quiz
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Adicione perguntas para ver a prévia completa
              </p>
            </div>
          </div>
          
          {/* Preview das Configurações */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-4">⚙️ Configurações Ativas</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${quiz.settings.showCorrectAnswers ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm text-gray-600">
                  {quiz.settings.showCorrectAnswers ? 'Mostrar respostas corretas' : 'Não mostrar respostas corretas'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${quiz.settings.randomizeQuestions ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm text-gray-600">
                  {quiz.settings.randomizeQuestions ? 'Perguntas randomizadas' : 'Perguntas em ordem'}
                </span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Botão Final:</strong> &quot;{quiz.settings.customButtonText || 'Falar com Especialista'}&quot;
                </p>
                {quiz.settings.specialistRedirectUrl && (
                  <p className="text-xs text-gray-500 mt-1">
                    Redireciona para: {quiz.settings.specialistRedirectUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Se mostrar página final
    if (showFinalPage) {
      return (
        <div className="p-6">
          <div 
            className="h-full flex items-center justify-center p-8 rounded-lg"
            style={{backgroundColor: quiz.colors.background}}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
              {/* Navegação */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
                {quiz.questions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setShowFinalPage(false)
                      setCurrentPreviewQuestion(index)
                    }}
                    className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: quiz.colors.primary + '20',
                      color: quiz.colors.primary
                    }}
                  >
                    Q{index + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: quiz.colors.primary,
                    color: 'white'
                  }}
                >
                  🎯 Final
                </button>
              </div>

              {/* Página Final */}
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{backgroundColor: quiz.colors.primary + '20'}}
              >
                <span className="text-2xl">🎉</span>
              </div>
              
              <h3 
                className="text-xl font-bold mb-4"
                style={{color: quiz.colors.text}}
              >
                {quiz.settings.congratulationsMessage || 'Parabéns!'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                Sua pontuação: <strong>8/10</strong>
              </p>
              
              <button
                className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-emerald-500"
              >
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {quiz.settings.specialistButtonText || 'Consultar Profissional de Bem-Estar'}
              </button>
              
              {quiz.settings.specialistRedirectUrl && (
                <p className="text-xs text-gray-400 mt-3">
                  → {quiz.settings.specialistRedirectUrl}
                </p>
              )}
            </div>
          </div>
        </div>
      )
    }

    const question = quiz.questions[currentPreviewQuestion]

    return (
      <div className="p-6">
        <div 
          className="h-full flex items-center justify-center p-8 rounded-lg"
          style={{backgroundColor: quiz.colors.background}}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
            {/* Navegação entre perguntas */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
              {quiz.questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPreviewQuestion(index)}
                  className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: currentPreviewQuestion === index 
                      ? quiz.colors.primary 
                      : quiz.colors.primary + '20',
                    color: currentPreviewQuestion === index ? 'white' : quiz.colors.primary
                  }}
                >
                  Q{index + 1}
                </button>
              ))}
              <button
                onClick={() => setShowFinalPage(true)}
                className="px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: quiz.colors.secondary + '20',
                  color: quiz.colors.secondary
                }}
              >
                🎯 Final
              </button>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span 
                  className="text-sm font-semibold"
                  style={{color: quiz.colors.secondary}}
                >
                  Questão {currentPreviewQuestion + 1} de {quiz.questions.length}
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
                    width: `${((currentPreviewQuestion + 1) / quiz.questions.length) * 100}%`,
                    backgroundColor: quiz.colors.primary
                  }}
                />
              </div>
            </div>

            {/* Pergunta */}
            <h3 
              className="text-xl font-bold mb-6 text-left"
              style={{color: quiz.colors.text}}
            >
              {question.question_text || 'Digite a pergunta...'}
            </h3>

            {/* Opções de Resposta */}
            {(question.question_type === 'multiple' || question.question_type === 'multiple_select') ? (
              <div className="space-y-3 mb-6">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (question.question_type === 'multiple') {
                        setPreviewAnswers(prev => ({
                          ...prev,
                          [currentPreviewQuestion]: index
                        }))
                      } else {
                        const currentAnswers = previewAnswers[currentPreviewQuestion] as number[] || []
                        const newAnswers = currentAnswers.includes(index)
                          ? currentAnswers.filter(i => i !== index)
                          : [...currentAnswers, index]
                        setPreviewAnswers(prev => ({
                          ...prev,
                          [currentPreviewQuestion]: newAnswers
                        }))
                      }
                    }}
                    className="w-full p-4 rounded-lg border-2 text-left transition-all hover:scale-105"
                    style={{
                      borderColor: question.question_type === 'multiple'
                        ? (previewAnswers[currentPreviewQuestion] === index ? quiz.colors.primary : '#e5e7eb')
                        : ((previewAnswers[currentPreviewQuestion] as number[])?.includes(index) ? quiz.colors.primary : '#e5e7eb'),
                      backgroundColor: question.question_type === 'multiple'
                        ? (previewAnswers[currentPreviewQuestion] === index ? quiz.colors.primary + '10' : 'white')
                        : ((previewAnswers[currentPreviewQuestion] as number[])?.includes(index) ? quiz.colors.primary + '10' : 'white'),
                      color: quiz.colors.text
                    }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center"
                        style={{
                          borderColor: question.question_type === 'multiple'
                            ? (previewAnswers[currentPreviewQuestion] === index ? quiz.colors.primary : '#d1d5db')
                            : ((previewAnswers[currentPreviewQuestion] as number[])?.includes(index) ? quiz.colors.primary : '#d1d5db')
                        }}
                      >
                        {question.question_type === 'multiple' 
                          ? (previewAnswers[currentPreviewQuestion] === index && (
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{backgroundColor: quiz.colors.primary}}
                              />
                            ))
                          : ((previewAnswers[currentPreviewQuestion] as number[])?.includes(index) && (
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{backgroundColor: quiz.colors.primary}}
                              />
                            ))
                        }
                      </div>
                      {option || `Opção ${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                <textarea
                  placeholder="Digite sua resposta aqui..."
                  className="w-full p-4 border-2 rounded-lg min-h-24 resize-none"
                  style={{
                    borderColor: quiz.colors.primary,
                    color: quiz.colors.text
                  }}
                />
              </div>
            )}

            {/* Botão de Navegação */}
            <div className="flex gap-3">
              {currentPreviewQuestion > 0 && (
                <button
                  onClick={() => setCurrentPreviewQuestion(currentPreviewQuestion - 1)}
                  className="flex-1 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: 'transparent',
                    color: quiz.colors.primary,
                    border: `2px solid ${quiz.colors.primary}`
                  }}
                >
                  Anterior
                </button>
              )}
              <button
                onClick={() => {
                  if (currentPreviewQuestion < quiz.questions.length - 1) {
                    setCurrentPreviewQuestion(currentPreviewQuestion + 1)
                  } else {
                    setShowFinalPage(true)
                  }
                }}
                className="flex-1 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105"
                style={{backgroundColor: quiz.colors.primary}}
              >
                {currentPreviewQuestion < quiz.questions.length - 1 
                  ? (question.button_text || 'Próxima Questão')
                  : 'Finalizar Quiz'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Removido bloqueio de renderização - permitir acesso sem autenticação para desenvolvimento

  console.log('🎯 Quiz Builder renderizando:', { 
    quiz: quiz.title, 
    user: user?.id, 
    projectConfig: projectConfig?.name,
    questionsCount: quiz.questions.length 
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {projectDomain === 'herbalead' ? '🏋️ Herbalead Quiz Builder' : 'Construtor de Quiz'}
            </h1>
            <p className="text-sm text-gray-600">
              {projectDomain === 'herbalead' 
                ? 'Crie quizzes personalizados para fitness e academia'
                : 'Crie quizzes personalizados para seus clientes'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600"
              onClick={() => router.push('/user')}
            >
              <ArrowLeft size={18} />
              Voltar ao Dashboard
            </button>
            {quiz.id && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const url = `${window.location.origin}/quiz/${quiz.id}`
                    navigator.clipboard.writeText(url)
                    alert('Link copiado para a área de transferência!')
                  }
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
        <div className="w-full lg:w-1/2 min-w-0 p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Templates de Quiz */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">🎯 Templates de Quiz</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Comece rápido</span>
                {showTemplates ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
            
            {showTemplates && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => loadTemplate('bem-estar')}
                    className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="text-emerald-600 font-bold mb-2">🏃‍♂️ Bem-Estar</div>
                    <div className="text-sm text-gray-600 mb-2">Avaliação completa de estilo de vida</div>
                    <div className="text-xs text-gray-500">4 perguntas</div>
                  </button>
                  
                  <button
                    onClick={() => loadTemplate('nutricao')}
                    className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="text-emerald-600 font-bold mb-2">🥗 Nutrição</div>
                    <div className="text-sm text-gray-600 mb-2">Hábitos alimentares e hidratação</div>
                    <div className="text-xs text-gray-500">3 perguntas</div>
                  </button>
                  
                  <button
                    onClick={() => loadTemplate('fitness')}
                    className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="text-emerald-600 font-bold mb-2">💪 Fitness</div>
                    <div className="text-sm text-gray-600 mb-2">Perfil de atividade física</div>
                    <div className="text-xs text-gray-500">3 perguntas</div>
                  </button>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    💡 <strong>Dica:</strong> Escolha um template para começar rapidamente. Você pode personalizar tudo depois!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Informações do Quiz */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">📋 Informações do Quiz</h2>
              {showInfo ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {showInfo && (
              <div className="px-6 pb-6">
                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    !quiz.title.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Quiz de Conhecimentos Gerais"
                  required
                />
                {!quiz.title.trim() && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Este campo é obrigatório
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do Projeto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quiz.project_name}
                  onChange={(e) => setQuiz({...quiz, project_name: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    !quiz.project_name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: quiz-bem-estar"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  🔗 Usado para criar URL personalizada: /{userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/{quiz.project_name || 'projeto'}
                </p>
                {!quiz.project_name.trim() && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Este campo é obrigatório para criar a URL do quiz
                  </p>
                )}
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
            )}
          </div>

          {/* Personalização de Cores */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowColors(!showColors)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">🎨 Cores do Quiz</h2>
              {showColors ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {showColors && (
              <div className="px-6 pb-6">
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
            )}
          </div>

          {/* Perguntas */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">❓ Perguntas</h2>
              <div className="flex items-center gap-2">
                {quiz.questions.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {quiz.questions.length} pergunta{quiz.questions.length !== 1 ? 's' : ''}
                  </span>
                )}
                {showQuestions ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
            
            {showQuestions && (
              <div className="px-6 pb-6">
                <div className="flex justify-end mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addQuestion('multiple')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 text-sm"
                    >
                      <Plus size={16} />
                      Escolha Única
                    </button>
                    <button
                      onClick={() => addQuestion('multiple_select')}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 hover:bg-purple-600 text-sm"
                    >
                      <Plus size={16} />
                      Múltiplas Escolhas
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
                  key={question.id || qIndex} 
                  className={`border-2 rounded-lg p-4 transition-all cursor-pointer group hover:shadow-md ${
                    previewQuestion === qIndex 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', question.id || qIndex.toString())
                    e.dataTransfer.effectAllowed = 'move'
                    console.log('🔄 Iniciando drag da pergunta:', qIndex + 1)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const draggedQuestionId = e.dataTransfer.getData('text/plain')
                    if (draggedQuestionId !== (question.id || qIndex.toString())) {
                      reorderQuestions(draggedQuestionId, qIndex)
                    }
                  }}
                  onClick={() => setPreviewQuestion(qIndex)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      {/* Handle de arrastar */}
                      <div className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <span className="text-sm font-semibold text-gray-600">
                        Questão {qIndex + 1} - {
                          question.question_type === 'multiple' ? '✓ Escolha Única' : 
                          question.question_type === 'multiple_select' ? '☑️ Múltiplas Escolhas' : 
                          '✍️ Dissertativa'
                        }
                      </span>
                    </div>
                    
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

                  {(question.question_type === 'multiple' || question.question_type === 'multiple_select') && (
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-medium text-gray-500">
                          {question.question_type === 'multiple' ? 'Opções (selecione a correta):' : 'Opções (selecione as corretas):'}
                        </p>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              addOption(qIndex)
                            }}
                            disabled={question.options && question.options.length >= (question.max_options || 8)}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            + Adicionar
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              updateQuestion(qIndex, 'question_type', question.question_type === 'multiple' ? 'multiple_select' : 'multiple')
                            }}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            {question.question_type === 'multiple' ? 'Única' : 'Múltiplas'}
                          </button>
                        </div>
                      </div>
                      {question.options?.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2 items-center">
                          <input
                            type={question.question_type === 'multiple' ? 'radio' : 'checkbox'}
                            name={`correct-${qIndex}`}
                            checked={question.question_type === 'multiple' 
                              ? question.correct_answer === oIndex
                              : (question.correct_answer as number[])?.includes(oIndex)
                            }
                            onChange={() => {
                              if (question.question_type === 'multiple') {
                                updateQuestion(qIndex, 'correct_answer', oIndex)
                              } else {
                                const currentCorrect = question.correct_answer as number[] || []
                                const newCorrect = currentCorrect.includes(oIndex)
                                  ? currentCorrect.filter(i => i !== oIndex)
                                  : [...currentCorrect, oIndex]
                                updateQuestion(qIndex, 'correct_answer', newCorrect)
                              }
                            }}
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
                          {question.options && question.options.length > (question.min_options || 2) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('🔴 Botão X clicado:', { qIndex, oIndex, questionType: question.question_type })
                                removeOption(qIndex, oIndex)
                              }}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

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
            )}
          </div>

          {/* Página Final */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowFinalPage(!showFinalPage)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">🏁 Página Final</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Última página</span>
                {showFinalPage ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
            
            {showFinalPage && (
              <div className="px-6 pb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Configure como será a última página que aparece após o usuário finalizar o quiz
                </p>

                <div className="space-y-4">
                  {/* Mensagem de Parabéns */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Mensagem de Parabéns</label>
                    <textarea
                      value={quiz.settings.congratulationsMessage || 'Parabéns!'}
                      onChange={(e) => setQuiz({
                        ...quiz, 
                        settings: {...quiz.settings, congratulationsMessage: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: Parabéns!"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      💬 Mensagem que aparece quando o usuário finaliza o quiz
                    </p>
                  </div>

                  {/* Botão do Especialista */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Texto do Botão WhatsApp</label>
                    <input
                      type="text"
                      value={quiz.settings.specialistButtonText || 'Consultar Profissional de Bem-Estar'}
                      onChange={(e) => setQuiz({
                        ...quiz, 
                        settings: {...quiz.settings, specialistButtonText: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: Consultar Profissional de Bem-Estar"
                    />
                    <p className="text-xs text-gray-500">
                      📱 Texto do botão que abre o WhatsApp
                    </p>
                  </div>

                  {/* URL de Redirecionamento */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Link do WhatsApp</label>
                    <input
                      type="url"
                      value={quiz.settings.specialistRedirectUrl || ''}
                      onChange={(e) => setQuiz({
                        ...quiz, 
                        settings: {...quiz.settings, specialistRedirectUrl: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: https://wa.me/5519981868000?text=Olá! Gostaria de consultar..."
                    />
                    <p className="text-xs text-gray-500">
                      🔗 Link completo do WhatsApp com mensagem pré-definida
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configurações */}
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">⚙️ Configurações do Quiz</h2>
              {showSettings ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {showSettings && (
              <div className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Configurações de Comportamento */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">🎯 Comportamento do Quiz</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-800">Mostrar respostas corretas</label>
                          <p className="text-xs text-gray-600 mt-1">
                            Após finalizar o quiz, o usuário vê quais respostas estavam certas ou erradas
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Útil para quizzes educativos e de conhecimento
                          </p>
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
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-800">Randomizar perguntas</label>
                          <p className="text-xs text-gray-600 mt-1">
                            As perguntas aparecem em ordem diferente para cada pessoa
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Evita que pessoas &quot;coloquem&quot; umas das outras
                          </p>
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
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>

        {/* Preview ao Vivo - Direita */}
        <div className="w-full lg:w-1/2 min-w-0 bg-gray-100 border-t lg:border-t-0 lg:border-l flex flex-col">
          <div className="sticky top-0 bg-white border-b px-6 py-3 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-700">👁️ Preview ao Vivo</h2>
            <p className="text-xs text-gray-500">Veja como seu quiz aparece em tempo real</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LivePreview />
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
            {/* Botão X para fechar */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Criado com Sucesso!</h2>
              <p className="text-gray-600 mb-6">
                Seu quiz &apos;{quiz.title}&apos; está pronto para ser compartilhado.
              </p>

              {/* Detalhes do Quiz */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  </svg>
                  Detalhes do Quiz
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Título:</strong> {quiz.title}</p>
                  <p><strong>Projeto:</strong> {quiz.project_name || 'Não definido'}</p>
                  <p><strong>Botão Final:</strong> {quiz.settings.specialistButtonText}</p>
                </div>
              </div>

              {/* Link do Quiz */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Link do Quiz
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/${userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/${quiz.project_name || 'projeto'}`}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded text-sm bg-gray-100"
                  />
                  <button
                    onClick={async () => {
                      const url = `${window.location.origin}/${userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/${quiz.project_name || 'projeto'}`
                      await navigator.clipboard.writeText(url)
                      alert('Link copiado!')
                    }}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/${userProfile?.name?.toLowerCase().replace(/\s+/g, '-') || 'usuario'}/quiz/${quiz.project_name || 'projeto'}`
                    window.open(url, '_blank')
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualizar Quiz
                </button>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Continuar Editando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de loading para Suspense
function QuizBuilderLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando Quiz Builder...</p>
      </div>
    </div>
  )
}

// Export default com Suspense boundary
export default function QuizBuilder() {
  return (
    <Suspense fallback={<QuizBuilderLoading />}>
      <QuizBuilderContent />
    </Suspense>
  )
}