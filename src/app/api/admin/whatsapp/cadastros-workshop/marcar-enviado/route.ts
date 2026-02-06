import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

function digits(input: string): string {
  return String(input || '').replace(/\D/g, '')
}

function phoneCandidates(raw: string): string[] {
  const d0 = digits(raw)
  if (!d0) return []
  const out = new Set<string>()
  out.add(d0)
  if (d0.startsWith('0')) out.add(d0.slice(1))

  // BR: com/sem 55
  if ((d0.length === 10 || d0.length === 11) && !d0.startsWith('55')) out.add(`55${d0}`)
  if (d0.startsWith('55') && (d0.length === 12 || d0.length === 13)) out.add(d0.slice(2))

  // BR: com/sem 9
  if (d0.startsWith('55') && d0.length === 13) out.add(d0.slice(0, 4) + d0.slice(5)) // 55DD9XXXXXXXX -> 55DDXXXXXXXX
  if (d0.startsWith('55') && d0.length === 12) out.add(d0.slice(0, 4) + '9' + d0.slice(4)) // 55DDXXXXXXXX -> 55DD9XXXXXXXX
  if (!d0.startsWith('55') && d0.length === 11) out.add(d0.slice(0, 2) + d0.slice(3)) // DD9XXXXXXXX -> DDXXXXXXXX
  if (!d0.startsWith('55') && d0.length === 10) out.add(d0.slice(0, 2) + '9' + d0.slice(2)) // DDXXXXXXXX -> DD9XXXXXXXX

  return Array.from(out)
}

async function getNutriConnectedInstance() {
  const { data: instance } = await supabaseAdmin
    .from('z_api_instances')
    .select('id')
    .eq('area', 'nutri')
    .eq('status', 'connected')
    .limit(1)
    .maybeSingle()
  return instance || null
}

/**
 * POST /api/admin/whatsapp/cadastros-workshop/marcar-enviado
 * Marca (manual) que a 1ª mensagem já foi enviada, sem disparar WhatsApp.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json().catch(() => ({}))
    const registrationIds = Array.isArray(body.registrationIds) ? body.registrationIds : []
    if (registrationIds.length === 0) {
      return NextResponse.json({ error: 'IDs de cadastros são obrigatórios' }, { status: 400 })
    }

    const instance = await getNutriConnectedInstance()
    if (!instance) {
      return NextResponse.json({ error: 'Instância Z-API (nutri) não encontrada/conectada' }, { status: 500 })
    }

    // Buscar cadastros (workshop_inscricoes ou fallback contact_submissions)
    let registrations: any[] = []
    const { data: workshopRegs } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('*')
      .in('id', registrationIds)
    if (workshopRegs && workshopRegs.length > 0) {
      // Não marcar enviado para aula paga (cadastros workshop = só aula gratuita)
      registrations = workshopRegs.filter((r: any) => r.workshop_type !== 'aula_paga')
    } else {
      const { data: contactRegs } = await supabaseAdmin
        .from('contact_submissions')
        .select('*')
        .in('id', registrationIds)
      registrations = contactRegs || []
    }

    let processed = 0
    let updated = 0
    let created = 0
    let errors = 0
    const details: string[] = []
    const nowIso = new Date().toISOString()

    for (const reg of registrations) {
      try {
        const phoneRaw = reg.telefone || reg.phone || ''
        const name = reg.nome || reg.name || 'Cliente'
        const candidates = phoneCandidates(phoneRaw)
        if (candidates.length === 0) {
          errors++
          details.push(`❌ ${name}: telefone inválido`)
          continue
        }

        // Buscar conversa existente por qualquer candidato
        const { data: conv } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('id, phone, context, created_at, last_message_at')
          .eq('area', 'nutri')
          .in('phone', candidates)
          .order('last_message_at', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        let conversationId = conv?.id || null
        if (!conversationId) {
          // Criar conversa “placeholder” (sem disparar mensagem) para permitir controle no admin
          const primaryPhone = candidates.find((p) => digits(p).startsWith('55')) || candidates[0]
          const { data: newConv, error: createErr } = await supabaseAdmin
            .from('whatsapp_conversations')
            .insert({
              instance_id: instance.id,
              area: 'nutri',
              phone: primaryPhone,
              name,
              customer_name: name,
              status: 'active',
              context: {
                tags: ['veio_aula_pratica', 'primeiro_contato', 'manual_welcome_sent'],
                manual_welcome_sent_at: nowIso,
                manual_welcome_source: 'admin_marked_sent',
              },
            })
            .select('id')
            .single()
          if (createErr || !newConv) {
            throw new Error(createErr?.message || 'Erro ao criar conversa')
          }
          conversationId = newConv.id
          created++
          processed++
          details.push(`✅ ${name}: marcado como enviado (criou conversa)`)
          continue
        }

        // Atualizar contexto/tags da conversa existente
        const prevCtx =
          conv?.context && typeof conv.context === 'object' && !Array.isArray(conv.context)
            ? (conv.context as Record<string, unknown>)
            : {}
        const prevTags = Array.isArray((prevCtx as any).tags) ? (prevCtx as any).tags : []
        const nextTags = [...new Set([...prevTags, 'manual_welcome_sent'])]

        const { error: updErr } = await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: {
              ...prevCtx,
              tags: nextTags,
              manual_welcome_sent_at: (prevCtx as any).manual_welcome_sent_at || nowIso,
              manual_welcome_source: (prevCtx as any).manual_welcome_source || 'admin_marked_sent',
            },
          })
          .eq('id', conversationId)

        if (updErr) throw new Error(updErr.message)

        updated++
        processed++
        details.push(`✅ ${name}: marcado como enviado`)
      } catch (e: any) {
        errors++
        details.push(`❌ ${reg.nome || reg.name || 'Desconhecido'}: ${e.message || 'erro'}`)
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      updated,
      created,
      errors,
      details: details.slice(0, 200).join('\n'),
      timestamp: nowIso,
    })
  } catch (error: any) {
    console.error('[Marcar Enviado] Erro:', error)
    return NextResponse.json({ error: error.message || 'Erro ao marcar como enviado' }, { status: 500 })
  }
}

