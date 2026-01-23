import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/corrigir-telefones
 * Corrige telefones inválidos no banco (IDs do WhatsApp, etc)
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
      .select('id, phone, name')
      .eq('area', 'nutri')

    if (error) {
      throw error
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma conversa encontrada',
        corrigidas: 0,
        invalidas: 0,
      })
    }

    let corrigidas = 0
    let invalidas = 0
    const updates: Array<{ id: string; phone: string }> = []

    conversations.forEach((conv: any) => {
      const originalPhone = conv.phone || ''
      let cleanPhone = originalPhone.replace(/\D/g, '')

      // Se contém @, é ID do WhatsApp - tentar extrair número
      if (originalPhone.includes('@')) {
        const match = originalPhone.match(/(\d{10,15})/)
        if (match) {
          cleanPhone = match[1]
        }
      }

      // Validar se é telefone válido (10-15 dígitos)
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        invalidas++
        console.warn(`[Corrigir Telefones] Telefone inválido: ${originalPhone} (${cleanPhone.length} dígitos)`)
        
        // Se o número é muito longo (provavelmente é ID do WhatsApp), arquivar a conversa
        if (cleanPhone.length > 15) {
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({ status: 'archived' })
            .eq('id', conv.id)
          console.log(`[Corrigir Telefones] Conversa arquivada (número inválido): ${conv.id}`)
        }
        
        return // Pular esta conversa
      }

      // Normalizar telefone brasileiro
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11 && !cleanPhone.startsWith('55')) {
        // Adicionar código do país se não tiver
        if (cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1)
        }
        cleanPhone = `55${cleanPhone}`
      }

      // Se o telefone mudou, adicionar à lista de atualizações
      if (cleanPhone !== originalPhone.replace(/\D/g, '')) {
        updates.push({
          id: conv.id,
          phone: cleanPhone,
        })
        corrigidas++
      }
    })

    // Atualizar telefones no banco
    if (updates.length > 0) {
      for (const update of updates) {
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({ phone: update.phone })
          .eq('id', update.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Corrigidas ${corrigidas} conversas`,
      corrigidas,
      invalidas,
      total: conversations.length,
    })
  } catch (error: any) {
    console.error('[Corrigir Telefones] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao corrigir telefones', details: error.message },
      { status: 500 }
    )
  }
}
