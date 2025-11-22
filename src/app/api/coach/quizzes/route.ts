import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { quizDB } from '@/lib/quiz-db'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Buscar todos os quizzes do usuário autenticado
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar quizzes do usuário (apenas coach)
    const allQuizzes = await quizDB.getUserQuizzes(user.id)
    // Filtrar apenas quizzes da área coach
    const quizzes = allQuizzes.filter((q: any) => !q.profession || q.profession === 'coach')

    // Buscar user_slug para construir URLs
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', user.id)
      .maybeSingle()

    // Buscar estatísticas de respostas para cada quiz
    const quizzesComEstatisticas = await Promise.all(
      quizzes.map(async (quiz) => {
        const { data: respostas, error: respostasError } = await supabaseAdmin
          .from('coach_quiz_respostas')
          .select('id')
          .eq('quiz_id', quiz.id)

        const totalRespostas = respostas?.length || 0

        // Construir URL do quiz
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
        const url = userProfile?.user_slug
          ? `${baseUrl}/pt/coach/${userProfile.user_slug}/quiz/${quiz.slug}`
          : `${baseUrl}/pt/coach/quiz/${quiz.slug}`

        return {
          ...quiz,
          url,
          totalRespostas,
          taxaConversao: quiz.views > 0 ? ((totalRespostas / quiz.views) * 100).toFixed(1) : '0.0'
        }
      })
    )

    return NextResponse.json({
      success: true,
      quizzes: quizzesComEstatisticas
    })
  } catch (error: any) {
    console.error('Erro ao buscar quizzes:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}



