import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { processIncomingMessageWithCarol } from '@/lib/whatsapp-carol-ai'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/test-carol
 * Testa se Carol está funcionando
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { conversationId, message } = body

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'conversationId e message são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar conversa
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, area, instance_id')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Testar Carol
    const result = await processIncomingMessageWithCarol(
      conversationId,
      conversation.phone,
      message,
      conversation.area || 'nutri',
      conversation.instance_id
    )

    return NextResponse.json({
      success: result.success,
      response: result.response,
      error: result.error,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    })
  } catch (error: any) {
    console.error('[Test Carol] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao testar Carol', details: error.message },
      { status: 500 }
    )
  }
}
