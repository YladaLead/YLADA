import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { diagnoseConversation } from '@/lib/whatsapp-carol-diagnostic'

/**
 * GET /api/admin/whatsapp/diagnose-conversation
 * Diagnostica uma conversa específica
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
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
