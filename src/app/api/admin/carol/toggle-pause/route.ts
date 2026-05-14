import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  const db = getSupabaseAdmin()
  if (!db) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: { conversationId: string; paused: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { conversationId, paused } = body
  if (!conversationId || typeof paused !== 'boolean') {
    return NextResponse.json({ error: 'conversationId e paused são obrigatórios' }, { status: 400 })
  }

  const { error } = await db
    .from('carol_conversations')
    .update({ paused, updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  if (error) {
    console.error('[toggle-pause] Erro:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, paused })
}
