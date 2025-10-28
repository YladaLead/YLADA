import { NextRequest, NextResponse } from 'next/server'
import { quizDB } from '@/lib/quiz-db'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateQuizSchema, UpdateQuizSchema } from '@/lib/validation'
import { withRateLimit } from '@/lib/rate-limit'

// GET: Buscar quizzes (público para slugs, privado para userQuizzes)
export async function GET(request: NextRequest) {
  return withRateLimit(request, 'quiz-get', async () => {
    try {
      const { searchParams } = new URL(request.url)
      const action = searchParams.get('action')
      const slug = searchParams.get('slug')

      // Buscar quiz por slug (público)
      if (action === 'bySlug' && slug) {
        // Validar slug
        if (!/^[a-z0-9-]+$/.test(slug)) {
          return NextResponse.json(
            { error: 'Slug inválido' },
            { status: 400 }
          )
        }

        const quiz = await quizDB.getQuizBySlug(slug)
        
        if (!quiz) {
          return NextResponse.json(
            { error: 'Quiz não encontrado' },
            { status: 404 }
          )
        }

        return NextResponse.json(quiz)
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
  }, { limit: 30, window: 60 })
}

// POST: Criar novo quiz
export async function POST(request: NextRequest) {
  return withRateLimit(request, 'quiz-post', async () => {
    try {
      const body = await request.json()

      // Validar com Zod
      const validated = CreateQuizSchema.parse({
        titulo: body.quizData?.titulo,
        descricao: body.quizData?.descricao,
        emoji: body.quizData?.emoji,
        cores: body.quizData?.cores,
        configuracoes: body.quizData?.configuracao,
        entrega: body.quizData?.entrega,
        slug: body.quizData?.slug,
        perguntas: body.perguntas || [],
      })

      // Salvar quiz
      const quiz = await quizDB.saveQuiz(body.quizData, body.perguntas)

      return NextResponse.json({
        success: true,
        quiz,
      })
    } catch (error: any) {
      console.error('Erro ao criar quiz:', error)

      // Retornar erro de validação específico
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { 
            error: 'Dados inválidos',
            details: error.errors 
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, { limit: 10, window: 60 })
}

// PUT: Atualizar quiz
export async function PUT(request: NextRequest) {
  return withRateLimit(request, 'quiz-put', async () => {
    try {
      const body = await request.json()

      // Validar com Zod
      const validated = UpdateQuizSchema.parse({
        quizId: body.quizId,
        quizData: body.quizData,
        perguntas: body.perguntas,
        action: body.action,
      })

      if (body.action === 'publish') {
        // Validar UUID do quiz
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.quizId)) {
          return NextResponse.json(
            { error: 'Quiz ID inválido' },
            { status: 400 }
          )
        }

        // Publicar quiz
        const quiz = await quizDB.publishQuiz(body.quizId)
        return NextResponse.json({ success: true, quiz })
      }

      // Atualizar dados do quiz
      if (!body.quizId || !body.quizData) {
        return NextResponse.json(
          { error: 'Dados obrigatórios não fornecidos' },
          { status: 400 }
        )
      }

      const { data, error } = await supabaseAdmin
        .from('quizzes')
        .update({
          ...body.quizData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.quizId)
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
      if (body.perguntas && body.perguntas.length > 0) {
        // Validar número de perguntas
        if (body.perguntas.length > 20) {
          return NextResponse.json(
            { error: 'Máximo de 20 perguntas permitido' },
            { status: 400 }
          )
        }

        // Deletar perguntas antigas
        await supabaseAdmin
          .from('quiz_perguntas')
          .delete()
          .eq('quiz_id', body.quizId)

        // Inserir novas perguntas
        const perguntasData = body.perguntas.map((p: any, index: number) => ({
          quiz_id: body.quizId,
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
          return NextResponse.json(
            { error: 'Erro ao atualizar perguntas' },
            { status: 500 }
          )
        }
      }

      return NextResponse.json({ success: true, quiz: data })
    } catch (error: any) {
      console.error('Erro ao atualizar quiz:', error)

      if (error.name === 'ZodError') {
        return NextResponse.json(
          { 
            error: 'Dados inválidos',
            details: error.errors 
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }, { limit: 10, window: 60 })
}

// DELETE: Deletar quiz
export async function DELETE(request: NextRequest) {
  return withRateLimit(request, 'quiz-delete', async () => {
    try {
      const { searchParams } = new URL(request.url)
      const quizId = searchParams.get('quizId')

      if (!quizId) {
        return NextResponse.json(
          { error: 'Quiz ID não fornecido' },
          { status: 400 }
        )
      }

      // Validar UUID
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quizId)) {
        return NextResponse.json(
          { error: 'Quiz ID inválido' },
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
  }, { limit: 5, window: 60 })
}
