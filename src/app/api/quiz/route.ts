import { NextRequest, NextResponse } from 'next/server'
import { quizDB } from '@/lib/quiz-db'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Buscar quizzes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const slug = searchParams.get('slug')
    const userId = searchParams.get('userId')

    if (action === 'bySlug' && slug) {
      // Buscar quiz por slug (público)
      const quiz = await quizDB.getQuizBySlug(slug)
      
      if (!quiz) {
        return NextResponse.json(
          { error: 'Quiz não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json(quiz)
    }

    if (action === 'userQuizzes' && userId) {
      // Buscar todos os quizzes de um usuário
      const quizzes = await quizDB.getUserQuizzes(userId)
      return NextResponse.json(quizzes)
    }

    return NextResponse.json(
      { error: 'Parâmetros inválidos' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro na API de quiz:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST: Criar novo quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quizData,
      perguntas,
    } = body

    if (!quizData || !perguntas) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Salvar quiz
    const quiz = await quizDB.saveQuiz(quizData, perguntas)

    return NextResponse.json({
      success: true,
      quiz,
    })
  } catch (error) {
    console.error('Erro ao criar quiz:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT: Atualizar quiz
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quizId,
      quizData,
      perguntas,
      action,
    } = body

    if (action === 'publish') {
      // Publicar quiz
      const quiz = await quizDB.publishQuiz(quizId)
      return NextResponse.json({ success: true, quiz })
    }

    // Atualizar dados do quiz
    if (!quizId || !quizData) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .update({
        ...quizData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quizId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar quiz:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar quiz' },
        { status: 500 }
      )
    }

    // Se houver perguntas, atualizá-las
    if (perguntas && perguntas.length > 0) {
      // Deletar perguntas antigas
      await supabaseAdmin
        .from('quiz_perguntas')
        .delete()
        .eq('quiz_id', quizId)

      // Inserir novas perguntas
      const perguntasData = perguntas.map((p: any, index: number) => ({
        quiz_id: quizId,
        tipo: p.tipo,
        titulo: p.titulo,
        opcoes: p.opcoes || null,
        obrigatoria: p.obrigatoria !== false,
        ordem: index + 1,
      }))

      const { error: perguntasError } = await supabaseAdmin
        .from('quiz_perguntas')
        .insert(perguntasData)

      if (perguntasError) {
        console.error('Erro ao atualizar perguntas:', perguntasError)
      }
    }

    return NextResponse.json({ success: true, quiz: data })
  } catch (error) {
    console.error('Erro ao atualizar quiz:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE: Deletar quiz
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID não fornecido' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('quizzes')
      .delete()
      .eq('id', quizId)

    if (error) {
      console.error('Erro ao deletar quiz:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar quiz' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar quiz:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

