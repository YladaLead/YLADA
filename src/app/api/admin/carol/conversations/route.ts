import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  analyzeConversationMessages,
  type CarolMessageRow,
} from '@/lib/carol/conversation-insights'

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
  let lastMessages: Record<string, { content: string; role: string; created_at: string }> = {}
  const insightsMap: Record<
    string,
    ReturnType<typeof analyzeConversationMessages>
  > = {}

  if (ids.length > 0) {
    const { data: msgs } = await supabaseAdmin
      .from('carol_messages')
      .select('conversation_id, role, content, created_at')
      .in('conversation_id', ids)
      .order('created_at', { ascending: false })

    const byConv = new Map<string, CarolMessageRow[]>()
    for (const msg of msgs || []) {
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

    for (const id of ids) {
      insightsMap[id] = analyzeConversationMessages(byConv.get(id) || [])
    }
  }

  const result = (data || []).map((c) => {
    const ins = insightsMap[c.id]
    return {
      ...c,
      last_message: lastMessages[c.id] ?? null,
      has_user_reply: ins?.has_user_reply ?? false,
      has_outbound: ins?.has_outbound ?? false,
      follow_up_sent: ins?.follow_up_sent ?? false,
      awaiting_reply: ins?.awaiting_reply ?? false,
      pending_carol_reply: ins?.pending_carol_reply ?? false,
    }
  })

  const stats = {
    total: result.length,
    responded: result.filter((c) => c.has_user_reply).length,
    awaiting_reply: result.filter((c) => c.awaiting_reply).length,
    pending_carol_reply: result.filter((c) => c.pending_carol_reply).length,
    follow_up_sent: result.filter((c) => c.follow_up_sent).length,
  }

  return NextResponse.json({ conversations: result, stats })
}
