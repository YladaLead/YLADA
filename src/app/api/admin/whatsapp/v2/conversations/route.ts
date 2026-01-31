/**
 * GET /api/admin/whatsapp/v2/conversations
 * Lista conversas (v2) com "fase" derivada das tags/contexto.
 *
 * Motivação: A UI em /admin/whatsapp/v2 espera este endpoint.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireApiAuth } from '@/lib/api-auth'
import { buildInscricoesMaps, findInscricao } from '@/lib/whatsapp-conversation-enrichment'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Fase =
  | 'inscrito_nao_chamou'
  | 'chamou_nao_fechou'
  | 'agendou'
  | 'participou'
  | 'nao_participou'

function getTags(context: any): string[] {
  const ctx = context && typeof context === 'object' ? context : {}
  const tags = (ctx as any).tags
  return Array.isArray(tags) ? tags.filter((t) => typeof t === 'string') : []
}

function deriveFase(conv: {
  context: any
}): Fase {
  const ctx = conv.context && typeof conv.context === 'object' ? conv.context : {}
  const tags = getTags(ctx)

  const participou = tags.includes('participou_aula')
  const naoParticipou = tags.includes('nao_participou_aula') && !participou
  if (participou) return 'participou'
  if (naoParticipou) return 'nao_participou'

  const agendou = tags.includes('agendou_aula') || Boolean((ctx as any).workshop_session_id)
  if (agendou) return 'agendou'

  const chamou = tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop')
  if (chamou) return 'chamou_nao_fechou'

  return 'inscrito_nao_chamou'
}

export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  try {
    const searchParams = request.nextUrl.searchParams
    const area = searchParams.get('area') || 'nutri'
    const faseFilter = searchParams.get('fase') || ''

    const { data: conversations, error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, customer_name, last_message_at, created_at, context, area')
      .eq('area', area)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })
      .limit(500)

    if (error) throw error

    const maps = await buildInscricoesMaps()

    // Última mensagem real (para evitar "—" quando last_message_at não foi atualizado)
    const ids = (conversations || []).map((c: any) => c.id).filter(Boolean)
    const lastByConversation = new Map<string, string>()
    if (ids.length > 0) {
      const { data: lastMessages, error: lastErr } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('conversation_id,created_at')
        .in('conversation_id', ids)
        .order('created_at', { ascending: false })
        .limit(Math.max(500, ids.length * 3))
      if (lastErr) {
        console.error('[WhatsApp v2 Conversations] Erro ao buscar last_message_at por mensagens:', lastErr)
      } else {
        for (const m of lastMessages || []) {
          if (!lastByConversation.has(m.conversation_id)) {
            lastByConversation.set(m.conversation_id, m.created_at)
          }
        }
      }
    }

    let result = (conversations || []).map((c: any) => {
      const ctx = c.context && typeof c.context === 'object' ? c.context : null
      const tags = getTags(ctx)
      const fase = deriveFase({ context: ctx })
      const fromInscricao = findInscricao(c.phone, ctx || {}, maps)
      const lastFromMessages = lastByConversation.get(c.id) || null
      const last = c.last_message_at || lastFromMessages
      return {
        id: c.id,
        phone: c.phone,
        name: c.name ?? null,
        customer_name: c.customer_name ?? null,
        last_message_at: last,
        created_at: c.created_at,
        fase,
        tags,
        context: ctx,
        display_name: fromInscricao?.nome ?? null,
        display_phone: fromInscricao?.telefone ?? null,
      }
    })

    if (faseFilter) {
      result = result.filter((c: any) => c.fase === faseFilter)
    }

    // Reordenar pelo last_message_at calculado (fallback: created_at)
    result.sort((a: any, b: any) => {
      const da = a.last_message_at ? new Date(a.last_message_at).getTime() : new Date(a.created_at).getTime()
      const db = b.last_message_at ? new Date(b.last_message_at).getTime() : new Date(b.created_at).getTime()
      return db - da
    })

    return NextResponse.json({ conversations: result })
  } catch (error: any) {
    console.error('[WhatsApp v2 Conversations] Erro:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao carregar conversas (v2)' },
      { status: 500 }
    )
  }
}

