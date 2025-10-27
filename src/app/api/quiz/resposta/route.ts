import { NextRequest, NextResponse } from 'next/server'
import { quizDB } from '@/lib/quiz-db'

// POST: Salvar resposta de um quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quizId,
      perguntaId,
      nome,
      email,
      telefone,
      resposta,
      ipAddress,
      userAgent,
    } = body

    if (!quizId || !perguntaId || !resposta) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Obter IP e User Agent da requisição
    const requestIp = ipAddress || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const requestUserAgent = userAgent || request.headers.get('user-agent') || 'unknown'

    // Salvar resposta
    const respostaData = await quizDB.saveQuizResponse({
      quiz_id: quizId,
      pergunta_id: perguntaId,
      nome,
      email,
      telefone,
      resposta,
      ip_address: requestIp,
      user_agent: requestUserAgent,
    })

    return NextResponse.json({
      success: true,
      resposta: respostaData,
    })
  } catch (error) {
    console.error('Erro ao salvar resposta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET: Buscar respostas de um quiz
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')
    const userId = searchParams.get('userId')

    if (!quizId || !userId) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const respostas = await quizDB.getQuizResponses(quizId, userId)

    return NextResponse.json(respostas)
  } catch (error) {
    console.error('Erro ao buscar respostas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

