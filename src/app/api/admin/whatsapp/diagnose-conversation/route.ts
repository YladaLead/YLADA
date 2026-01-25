import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { diagnoseConversation } from '@/lib/whatsapp-carol-diagnostic'

/**
 * GET /api/admin/whatsapp/diagnose-conversation
 * Diagnostica uma conversa específica
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id')

    if (!conversationId) {
      return NextResponse.json({ error: 'ID da conversa é obrigatório' }, { status: 400 })
    }

    const diagnostic = await diagnoseConversation(conversationId)

    if (!diagnostic) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ diagnostic })
  } catch (error: any) {
    console.error('[API] Erro ao diagnosticar conversa:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao diagnosticar conversa' },
      { status: 500 }
    )
  }
}
