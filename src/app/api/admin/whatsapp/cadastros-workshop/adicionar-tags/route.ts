import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/cadastros-workshop/adicionar-tags
 * Adiciona tags às conversas relacionadas aos cadastros selecionados
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { registrationIds, tags } = body

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de cadastros são obrigatórios' },
        { status: 400 }
      )
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Tags são obrigatórias' },
        { status: 400 }
      )
    }

    // Buscar cadastros
    let registrations: any[] = []
    
    const { data: workshopRegs } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('*')
      .in('id', registrationIds)

    if (workshopRegs && workshopRegs.length > 0) {
      registrations = workshopRegs
    } else {
      const { data: contactRegs } = await supabaseAdmin
        .from('contact_submissions')
        .select('*')
        .in('id', registrationIds)

      if (contactRegs) {
        registrations = contactRegs
      }
    }

    // Buscar instância
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 500 }
      )
    }

    let updated = 0

    // Processar cada cadastro
    for (const reg of registrations) {
      const phone = (reg.telefone || reg.phone || '').replace(/\D/g, '')
      if (!phone) continue
      const contactKey = (phone.startsWith('55') ? phone : `55${phone}`).replace(/\D/g, '')

      // Buscar conversa
      const { data: conversation } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id, context')
        .eq('contact_key', contactKey)
        .eq('area', 'nutri')
        .eq('instance_id', instance.id)
        .maybeSingle()

      if (conversation) {
        const context = conversation.context || {}
        const existingTags = Array.isArray(context.tags) ? context.tags : []
        const newTags = [...new Set([...existingTags, ...tags])]

        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: { ...context, tags: newTags }
          })
          .eq('id', conversation.id)

        updated++
      }
    }

    return NextResponse.json({
      success: true,
      updated
    })

  } catch (error: any) {
    console.error('[Adicionar Tags] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao adicionar tags' },
      { status: 500 }
    )
  }
}
