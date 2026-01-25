import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { activateCarolInConversation, activateCarolInMultipleConversations } from '@/lib/whatsapp-carol-diagnostic'

/**
 * POST /api/admin/whatsapp/activate-carol
 * Ativa Carol em uma ou múltiplas conversas
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { conversationIds, tags } = body

    if (!conversationIds || !Array.isArray(conversationIds) || conversationIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs das conversas são obrigatórios (array)' },
        { status: 400 }
      )
    }

    const tagsToAdd = Array.isArray(tags) ? tags : []

    // Se for apenas uma conversa, usar função simples
    if (conversationIds.length === 1) {
      const result = await activateCarolInConversation(conversationIds[0], tagsToAdd)
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Erro ao ativar Carol' },
          { status: 400 }
        )
      }

      return NextResponse.json({ 
        success: true,
        message: 'Carol ativada com sucesso'
      })
    }

    // Múltiplas conversas
    const result = await activateCarolInMultipleConversations(conversationIds, tagsToAdd)

    return NextResponse.json({
      success: result.success,
      errors: result.errors,
      total: conversationIds.length,
      results: result.results,
      message: `Carol ativada em ${result.success} de ${conversationIds.length} conversas`
    })
  } catch (error: any) {
    console.error('[API] Erro ao ativar Carol:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao ativar Carol' },
      { status: 500 }
    )
  }
}
