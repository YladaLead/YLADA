import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  analyzeConversationWithPause,
  type CarolMessageRow,
} from '@/lib/carol/conversation-insights'
import {
  scoreConversationReadiness,
  type ConversationReadiness,
} from '@/lib/carol/readiness'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data, error } = await supabaseAdmin
    .from('carol_conversations')
    .select('id, phone, nome, email, status, hipotese, paused, created_at, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Erro ao buscar conversas' }, { status: 500 })
  }

  const ids = (data || []).map((c) => c.id)
  const lastMessages: Record<string, { content: string; role: string; created_at: string }> = {}
  const insightsMap: Record<string, ReturnType<typeof analyzeConversationWithPause>> = {}
  const readinessMap: Record<string, ConversationReadiness> = {}

  if (ids.length > 0) {
    // Busca as mensagens em LOTES. Em volume alto (centenas de leads), um único
    // .in() com todos os ids estoura o limite de tamanho da requisição e falha
    // calado — o painel acabava mostrando tudo como "Sem mensagens" e zerava os
    // contadores. Quebrar em lotes mantém cada consulta dentro do limite.
    const CHUNK = 50
    const msgs: { conversation_id: string; role: string; content: string; created_at: string }[] = []
    for (let i = 0; i < ids.length; i += CHUNK) {
      const batch = ids.slice(i, i + CHUNK)
      const { data: batchMsgs, error: batchError } = await supabaseAdmin
        .from('carol_messages')
        .select('conversation_id, role, content, created_at')
        .in('conversation_id', batch)
        .order('created_at', { ascending: false })

      if (batchError) {
        console.error('[carol/conversations] erro ao buscar mensagens do lote', i, batchError)
        continue
      }
      if (batchMsgs) msgs.push(...batchMsgs)
    }

    const byConv = new Map<string, CarolMessageRow[]>()
    for (const msg of msgs) {
      if (!lastMessages[msg.conversation_id]) {
        lastMessages[msg.conversation_id] = {
          content: msg.content,
          role: msg.role,
          created_at: msg.created_at,
        }
      }
      const list = byConv.get(msg.conversation_id) || []
      list.push({
        role: msg.role,
        content: msg.content,
        created_at: msg.created_at,
      })
      byConv.set(msg.conversation_id, list)
    }

    for (const c of data || []) {
      insightsMap[c.id] = analyzeConversationWithPause(
        byConv.get(c.id) || [],
        Boolean(c.paused)
      )
      readinessMap[c.id] = scoreConversationReadiness(byConv.get(c.id) || [])
    }
  }

  const result = (data || []).map((c) => {
    const ins = insightsMap[c.id]
    const rdy = readinessMap[c.id]
    return {
      ...c,
      last_message: lastMessages[c.id] ?? null,
      has_user_reply: ins?.has_user_reply ?? false,
      has_outbound: ins?.has_outbound ?? false,
      follow_up_sent: ins?.follow_up_sent ?? false,
      awaiting_reply: ins?.awaiting_reply ?? false,
      pending_carol_reply: ins?.pending_carol_reply ?? false,
      paused_awaiting_andre: ins?.paused_awaiting_andre ?? false,
      readiness_score: rdy?.score ?? 0,
      readiness_level: rdy?.level ?? 'frio',
      readiness_reasons: rdy?.reasons ?? [],
      misfired_postponement: rdy?.misfired_postponement ?? false,
    }
  })

  const stats = {
    total: result.length,
    responded: result.filter((c) => c.has_user_reply).length,
    awaiting_reply: result.filter((c) => c.awaiting_reply).length,
    pending_carol_reply: result.filter((c) => c.pending_carol_reply).length,
    follow_up_sent: result.filter((c) => c.follow_up_sent).length,
    paused_awaiting_andre: result.filter((c) => c.paused_awaiting_andre).length,
    ready_to_close: result.filter((c) => c.readiness_level === 'quente').length,
    misfired_postponement: result.filter((c) => c.misfired_postponement).length,
  }

  return NextResponse.json({ conversations: result, stats })
}
