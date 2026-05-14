import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

const VALID_STATUSES = ['novo', 'em_andamento', 'diagnostico_agendado', 'diagnostico_feito', 'proposta']

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  const db = getSupabaseAdmin()
  if (!db) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: { conversationId: string; status: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { conversationId, status } = body
  if (!conversationId || !status) {
    return NextResponse.json({ error: 'conversationId e status são obrigatórios' }, { status: 400 })
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Status inválido. Use: ${VALID_STATUSES.join(', ')}` }, { status: 400 })
  }

  const { error } = await db
    .from('carol_conversations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  if (error) {
    console.error('[update-status] Erro:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, status })
}
