import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/limpar-duplicatas
 * Remove conversas duplicadas do banco de dados (mantém apenas a mais recente)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Buscar todas as conversas
    const { data: conversations, error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, last_message_at, created_at')
      .eq('area', 'nutri')
      .eq('status', 'active')

    if (error) {
      throw error
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma conversa encontrada',
        removed: 0,
        kept: 0,
      })
    }

    // Agrupar por telefone normalizado
    const phoneMap = new Map<string, any[]>()
    
    conversations.forEach((conv: any) => {
      let phoneKey = (conv.phone || '').replace(/\D/g, '')
      
      // Normalizar números brasileiros
      if (phoneKey.startsWith('55') && phoneKey.length >= 13) {
        phoneKey = phoneKey.substring(2)
      }
      if (phoneKey.startsWith('0')) {
        phoneKey = phoneKey.substring(1)
      }
      
      if (!phoneKey || phoneKey.length < 10) {
        phoneKey = `id_${conv.id}`
      }
      
      if (!phoneMap.has(phoneKey)) {
        phoneMap.set(phoneKey, [])
      }
      phoneMap.get(phoneKey)!.push(conv)
    })

    // Identificar duplicatas e remover (manter apenas a mais recente)
    let removed = 0
    const idsToRemove: string[] = []

    phoneMap.forEach((convs, phoneKey) => {
      if (convs.length > 1) {
        // Ordenar por última mensagem (mais recente primeiro)
        convs.sort((a, b) => {
          const dateA = a.last_message_at 
            ? new Date(a.last_message_at).getTime() 
            : (a.created_at ? new Date(a.created_at).getTime() : 0)
          const dateB = b.last_message_at 
            ? new Date(b.last_message_at).getTime() 
            : (b.created_at ? new Date(b.created_at).getTime() : 0)
          return dateB - dateA
        })

        // Manter a primeira (mais recente), remover as outras
        const toKeep = convs[0]
        const toRemove = convs.slice(1)
        
        idsToRemove.push(...toRemove.map(c => c.id))
        removed += toRemove.length
      }
    })

    // Remover duplicatas do banco
    if (idsToRemove.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .delete()
        .in('id', idsToRemove)

      if (deleteError) {
        throw deleteError
      }
    }

    return NextResponse.json({
      success: true,
      message: `Removidas ${removed} conversas duplicadas`,
      removed,
      kept: conversations.length - removed,
      total: conversations.length,
    })
  } catch (error: any) {
    console.error('[Limpar Duplicatas] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao limpar duplicatas', details: error.message },
      { status: 500 }
    )
  }
}
