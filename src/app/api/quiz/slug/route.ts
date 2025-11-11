import { NextRequest, NextResponse } from 'next/server'
import { quizDB } from '@/lib/quiz-db'
import { requireApiAuth } from '@/lib/api-auth'

// GET: Verificar disponibilidade de slug
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação para obter user_id
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug não fornecido' },
        { status: 400 }
      )
    }

    // ✅ Verificar disponibilidade apenas para o usuário atual
    const disponivel = await quizDB.checkSlugAvailability(slug, user.id)

    return NextResponse.json({
      slug,
      disponivel,
      message: disponivel 
        ? 'URL disponível!' 
        : 'Esta URL já está em uso por você. Escolha outra.'
    })
  } catch (error) {
    console.error('Erro ao verificar slug:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

