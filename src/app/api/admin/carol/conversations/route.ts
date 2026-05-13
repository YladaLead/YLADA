import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data, error } = await supabaseAdmin
    .from('carol_conversations')
    .select('id, phone, nome, email, status, hipotese, created_at, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Erro ao buscar conversas' }, { status: 500 })
  }

  // Busca última mensagem de cada conversa
  const ids = (data || []).map((c) => c.id)
  let lastMessages: Record<string, { content: string; role: string; created_at: string }> = {}

  if (ids.length > 0) {
    const { data: msgs } = await supabaseAdmin
      .from('carol_messages')
      .select('conversation_id, role, content, created_at')
      .in('conversation_id', ids)
      .order('created_at', { ascending: false })

    for (const msg of msgs || []) {
      if (!lastMessages[msg.conversation_id]) {
        lastMessages[msg.conversation_id] = {
          content: msg.content,
          role: msg.role,
          created_at: msg.created_at,
        }
      }
    }
  }

  const result = (data || []).map((c) => ({
    ...c,
    last_message: lastMessages[c.id] ?? null,
  }))

  return NextResponse.json({ conversations: result })
}
