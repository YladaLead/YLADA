import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { sendWhatsAppMessage } from '@/lib/carol/sender'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  const db = getSupabaseAdmin()
  if (!db) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: { conversationId: string; text: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { conversationId, text } = body
  if (!conversationId || !text?.trim()) {
    return NextResponse.json({ error: 'conversationId e text são obrigatórios' }, { status: 400 })
  }

  // Busca a conversa para pegar o número
  const { data: conversation, error: convError } = await db
    .from('carol_conversations')
    .select('id, phone, nome')
    .eq('id', conversationId)
    .single()

  if (convError || !conversation) {
    return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
  }

  try {
    // Envia via WhatsApp API
    await sendWhatsAppMessage(conversation.phone, text.trim())

    // Salva no Supabase como mensagem do assistente com prefixo de Andre
    const { error: msgError } = await db.from('carol_messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: `[ANDRE] ${text.trim()}`,
    })

    if (msgError) {
      console.error('[send-message] Erro ao salvar mensagem:', msgError)
    }

    // Andre assumiu a conversa → pausa a Carol automaticamente (regra de handoff:
    // "assim que eu assumo, a Carol para"). Ela só volta se o Andre despausar.
    await db
      .from('carol_conversations')
      .update({ paused: true, updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[send-message] Erro:', error)
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
