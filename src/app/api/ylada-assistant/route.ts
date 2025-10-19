import { NextRequest, NextResponse } from 'next/server'
import { yladaAssistant } from '@/lib/openai-assistant-specialized'

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile, threadId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Se threadId não foi fornecido, criar um novo thread
    if (!threadId) {
      const newThreadId = await yladaAssistant.createThread()
      
      const response = await yladaAssistant.sendMessage(message, userProfile)
      
      return NextResponse.json({
        ...response,
        threadId: newThreadId
      })
    }

    // Usar thread existente
    const response = await yladaAssistant.sendMessage(message, userProfile)
    
    return NextResponse.json({
      ...response,
      threadId
    })

  } catch (error) {
    console.error('Erro na API da YLADA Assistant:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Desculpe, estou com uma pequena dificuldade técnica. Vamos continuar nossa conversa!'
      },
      { status: 500 }
    )
  }
}

// Endpoint para criar novo thread
export async function GET() {
  try {
    const threadId = await yladaAssistant.createThread()
    
    return NextResponse.json({
      threadId,
      message: 'Thread criado com sucesso'
    })
    
  } catch (error) {
    console.error('Erro ao criar thread:', error)
    
    return NextResponse.json(
      { error: 'Erro ao criar thread' },
      { status: 500 }
    )
  }
}
