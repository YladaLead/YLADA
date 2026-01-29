import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

function digits(input: string): string {
  return String(input || '').replace(/\D/g, '')
}

function phoneCandidates(raw: string): string[] {
  const d = digits(raw)
  const out = new Set<string>()
  if (!d) return []
  out.add(d)
  // Padrão BR: se vier sem DDI e tiver 10/11 dígitos, adicionar 55
  if ((d.length === 10 || d.length === 11) && !d.startsWith('55')) {
    out.add(`55${d}`)
  }
  // Se vier com 55, também guardar versão sem 55 para mapear registros antigos
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) {
    out.add(d.slice(2))
  }
  return Array.from(out)
}

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

    // Buscar conversas relacionadas por telefone (considerar variações com/sem 55)
    const allPhoneCandidates = new Set<string>()
    for (const r of registrations) {
      const tel = r.telefone || r.phone || ''
      for (const cand of phoneCandidates(tel)) allPhoneCandidates.add(cand)
    }

    let conversationsByPhone: Record<string, any> = {}
    if (allPhoneCandidates.size > 0) {
      const { data: conversations } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id, phone, context')
        .in('phone', Array.from(allPhoneCandidates))
        .eq('area', 'nutri')

      if (conversations) {
        conversations.forEach(conv => {
          const phoneClean = digits(conv.phone)
          // Se existirem duplicadas, manter a mais recente (ordem do select pode variar).
          // Para este endpoint, basta "uma" conversa por telefone.
          conversationsByPhone[phoneClean] = conv
        })
      }
    }

    // Buscar se já existe mensagem da Carol (boas-vindas/opções) por conversa
    const conversationIds = Array.from(
      new Set(
        Object.values(conversationsByPhone)
          .map((c: any) => c?.id)
          .filter(Boolean)
      )
    )

    const welcomeByConversationId: Record<string, { has: boolean; sentAt: string | null }> = {}
    if (conversationIds.length > 0) {
      const { data: botMsgs } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('conversation_id, created_at')
        .in('conversation_id', conversationIds)
        .eq('sender_type', 'bot')
        .eq('sender_name', 'Carol - Secretária')
        .order('created_at', { ascending: true })

      for (const m of botMsgs || []) {
        const convId = (m as any).conversation_id as string
        if (!convId) continue
        if (!welcomeByConversationId[convId]) {
          welcomeByConversationId[convId] = { has: true, sentAt: (m as any).created_at || null }
        }
      }
    }

    // Enriquecer registrations com dados de conversas
    const enrichedRegistrations = registrations.map(reg => {
      const regPhone = reg.telefone || reg.phone || ''
      const candidates = phoneCandidates(regPhone)
      const matched = candidates
        .map((c) => conversationsByPhone[digits(c)])
        .find(Boolean)
      const conversation = matched || null
      const context = conversation?.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      const hasWelcome = conversation?.id ? !!welcomeByConversationId[conversation.id]?.has : false
      const sentAt =
        (conversation?.context && typeof conversation.context === 'object' && !Array.isArray(conversation.context) && (conversation.context as any).manual_welcome_sent_at)
          ? String((conversation.context as any).manual_welcome_sent_at)
          : (conversation?.id ? (welcomeByConversationId[conversation.id]?.sentAt || null) : null)

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
        has_conversation: !!conversation,
        has_welcome_message: hasWelcome,
        welcome_sent_at: sentAt,
        needs_manual_whatsapp: !hasWelcome
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
