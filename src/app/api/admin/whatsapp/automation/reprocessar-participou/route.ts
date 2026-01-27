/**
 * POST /api/admin/whatsapp/automation/reprocessar-participou
 * Reprocessa quem tem tag "participou_aula" mas ainda não recebeu link de cadastro
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendRegistrationLinkAfterClass } from '@/lib/whatsapp-carol-ai'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Buscar todas conversas com tag "participou_aula"
    const { data: conversations, error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar conversas: ${error.message}` },
        { status: 500 }
      )
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        sent: 0,
        errors: 0,
      })
    }

    // Filtrar quem tem tag "participou_aula"
    const participantes = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      return tags.includes('participou_aula')
    })

    let processed = 0
    let sent = 0
    let errors = 0

    // Reprocessar cada um
    for (const conv of participantes) {
      try {
        processed++
        const result = await sendRegistrationLinkAfterClass(conv.id)
        if (result.success) {
          sent++
        } else {
          errors++
          console.error(`[Reprocessar Participou] Erro para ${conv.phone}:`, result.error)
        }
        // Delay entre processamentos
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error: any) {
        errors++
        console.error(`[Reprocessar Participou] Erro para ${conv.phone}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      sent,
      errors,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[Reprocessar Participou] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao reprocessar', details: error.message },
      { status: 500 }
    )
  }
}
