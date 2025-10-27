import { NextRequest, NextResponse } from 'next/server'
import { quizDB } from '@/lib/quiz-db'

// GET: Verificar disponibilidade de slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug não fornecido' },
        { status: 400 }
      )
    }

    const disponivel = await quizDB.checkSlugAvailability(slug)

    return NextResponse.json({
      slug,
      disponivel,
    })
  } catch (error) {
    console.error('Erro ao verificar slug:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

