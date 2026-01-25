import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/whatsapp/cadastros-workshop
 * Lista todos os cadastros do workshop com informações de conversas e tags
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Buscar cadastros (tentar workshop_inscricoes primeiro, depois contact_submissions)
    let registrations: any[] = []
    let error: any = null

    // Tentar buscar de workshop_inscricoes
    const { data: workshopRegs, error: workshopError } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('*')
      .order('created_at', { ascending: false })

    if (workshopRegs && !workshopError) {
      registrations = workshopRegs
    } else {
      // Fallback para contact_submissions
      // Tentar buscar com filtro de source primeiro
      let contactRegs: any[] = []
      let contactError: any = null
      
      const { data: withSource, error: sourceError } = await supabaseAdmin
        .from('contact_submissions')
        .select('*')
        .eq('source', 'workshop_landing_page')
        .order('created_at', { ascending: false })

      if (withSource && !sourceError) {
        contactRegs = withSource
      } else {
        // Se coluna source não existe, buscar todos (sem filtro)
        const { data: allContacts, error: allError } = await supabaseAdmin
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000) // Limitar para não sobrecarregar

        if (allContacts && !allError) {
          contactRegs = allContacts
        } else {
          contactError = allError || sourceError
        }
      }

      if (contactRegs.length > 0) {
        registrations = contactRegs
      } else if (contactError) {
        error = contactError
      }
    }

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar cadastros: ${error.message}` },
        { status: 500 }
      )
    }

    // Buscar conversas relacionadas por telefone
    const phones = registrations.map(r => r.telefone?.replace(/\D/g, '')).filter(Boolean)
    
    let conversationsMap: Record<string, any> = {}
    if (phones.length > 0) {
      const { data: conversations } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id, phone, context')
        .in('phone', phones)
        .eq('area', 'nutri')

      if (conversations) {
        conversations.forEach(conv => {
          const phoneClean = conv.phone.replace(/\D/g, '')
          conversationsMap[phoneClean] = conv
        })
      }
    }

    // Enriquecer registrations com dados de conversas
    const enrichedRegistrations = registrations.map(reg => {
      const phoneClean = reg.telefone?.replace(/\D/g, '') || ''
      const conversation = conversationsMap[phoneClean]
      const context = conversation?.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []

      return {
        id: reg.id,
        nome: reg.nome || reg.name || 'Sem nome',
        email: reg.email || reg.email_address || '',
        telefone: reg.telefone || reg.phone || '',
        crn: reg.crn || null,
        source: reg.source || 'workshop_landing_page',
        created_at: reg.created_at || reg.createdAt || new Date().toISOString(),
        conversation_id: conversation?.id || null,
        conversation_tags: tags,
        has_conversation: !!conversation
      }
    })

    return NextResponse.json({
      success: true,
      registrations: enrichedRegistrations,
      total: enrichedRegistrations.length
    })

  } catch (error: any) {
    console.error('[Cadastros Workshop] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar cadastros' },
      { status: 500 }
    )
  }
}
