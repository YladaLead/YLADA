/**
 * GET /api/admin/whatsapp/v2/conversations
 * Lista conversas com fase derivada (getFaseFromTagsAndContext).
 * Enriquece nome e telefone a partir de workshop_inscricoes e contact_submissions.
 * Query: ?fase=chamou_nao_fechou&area=nutri
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getFaseFromTagsAndContext } from '@/lib/carol-v2'
import type { Fase } from '@/lib/carol-v2'
import { buildInscricoesMaps, findInscricao } from '@/lib/whatsapp-conversation-enrichment'

export interface ConversationWithFase {
  id: string
  phone: string
  name: string | null
  customer_name: string | null
  last_message_at: string | null
  created_at: string
  fase: Fase
  tags: string[]
  context: Record<string, unknown> | null
  /** Nome vindo de workshop_inscricoes ou contact_submissions quando encontrado. */
  display_name?: string | null
  /** Telefone vindo das inscrições/cadastro (formato cadastrado) quando encontrado. */
  display_phone?: string | null
}

export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const { searchParams } = new URL(request.url)
  const faseFilter = searchParams.get('fase') as Fase | null
  const area = searchParams.get('area') || 'nutri'

  // Quando filtro é "Agendou": buscar TODAS as conversas com workshop_session_id (igual à agenda Workshop),
  // para não perder quem está agendado mas tem última mensagem antiga (fora do top 300).
  const onlyAgendou = faseFilter === 'agendou'
  let rows: Record<string, unknown>[] = []

  if (onlyAgendou) {
    const { data: agendados, error: errAgendados } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, customer_name, last_message_at, created_at, context')
      .eq('area', area)
      .eq('status', 'active')
      .not('context->workshop_session_id', 'is', null)
      .order('last_message_at', { ascending: false })
      .limit(500)
    if (errAgendados) {
      return NextResponse.json({ error: errAgendados.message }, { status: 500 })
    }
    rows = agendados || []
  } else {
    const { data: allRows, error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, customer_name, last_message_at, created_at, context')
      .eq('area', area)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })
      .limit(300)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    rows = allRows || []
  }

  const maps = await buildInscricoesMaps()

  const list: ConversationWithFase[] = rows.map((r: Record<string, unknown>) => {
    const ctx = (r.context || {}) as Record<string, unknown>
    const tags = Array.isArray(ctx.tags) ? (ctx.tags as string[]) : []
    const fase = getFaseFromTagsAndContext(tags, {
      workshop_session_id: (ctx.workshop_session_id as string) ?? null,
    })
    const phone = (r.phone as string) || ''
    const fromInscricao = findInscricao(phone, ctx, maps)
    return {
      id: r.id as string,
      phone,
      name: (r.name as string) || null,
      customer_name: (r.customer_name as string) || null,
      last_message_at: (r.last_message_at as string) || null,
      created_at: (r.created_at as string) || '',
      fase,
      tags,
      context: ctx,
      display_name: fromInscricao?.nome ?? null,
      display_phone: fromInscricao?.telefone ?? null,
    }
  })

  const filtered =
    faseFilter && faseFilter.trim()
      ? list.filter((c) => c.fase === faseFilter)
      : list

  return NextResponse.json({
    conversations: filtered,
    total: filtered.length,
  })
}
