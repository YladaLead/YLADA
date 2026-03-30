import { supabaseAdmin } from '@/lib/supabase'
import { notifyAgentsNewTicket } from '@/lib/support-notifications'
import { PLATFORM_SUPPORT_AREA } from '@/lib/platform-support-constants'
import type { User } from '@supabase/supabase-js'

/**
 * Primeira mensagem no chat Nina (Noel channel support) — grava ticket `platform`
 * para aparecer em /admin/suporte, com o mesmo comportamento que POST /api/platform/support/tickets.
 */
export async function createPlatformTicketFromNinaFirstTurn(params: {
  user: User
  primeiraMensagem: string
  segmentLabel: string
  supportUi: 'matrix' | 'wellness'
}): Promise<{ ok: true; ticketId: string } | { ok: false; error: string }> {
  if (!supabaseAdmin) {
    return { ok: false, error: 'supabase_admin' }
  }

  const { user, primeiraMensagem, segmentLabel, supportUi } = params
  const msg = String(primeiraMensagem).trim()
  if (!msg) {
    return { ok: false, error: 'empty_message' }
  }

  const areaTag = supportUi === 'wellness' ? 'Wellness' : segmentLabel
  const assunto = `Nina · ${areaTag}`.substring(0, 200)

  const { data: ticket, error } = await supabaseAdmin
    .from('support_tickets')
    .insert({
      area: PLATFORM_SUPPORT_AREA,
      user_id: user.id,
      status: 'aguardando',
      categoria: 'nina',
      assunto,
      primeira_mensagem: msg,
      ultima_mensagem: msg,
      ultima_mensagem_em: new Date().toISOString(),
      prioridade: 'normal',
      mensagens_count: 1,
    })
    .select()
    .single()

  if (error || !ticket) {
    console.error('[platform-support-from-nina] insert', error)
    return { ok: false, error: error?.message || 'insert' }
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Usuário'

  const { error: msgErr } = await supabaseAdmin.from('support_messages').insert({
    ticket_id: ticket.id,
    sender_type: 'user',
    sender_id: user.id,
    sender_name: displayName,
    message: msg,
    is_bot_response: false,
  })

  if (msgErr) {
    console.error('[platform-support-from-nina] message insert', msgErr)
    await supabaseAdmin.from('support_tickets').delete().eq('id', ticket.id)
    return { ok: false, error: msgErr.message }
  }

  notifyAgentsNewTicket({
    ticketId: ticket.id,
    area: PLATFORM_SUPPORT_AREA,
    assunto,
    primeiraMensagem: msg,
    prioridade: 'normal',
    categoria: 'nina',
    userName: displayName,
    userEmail: user.email || undefined,
    createdAt: ticket.created_at,
  }).catch((err) => console.error('[platform-support-from-nina] notify:', err))

  return { ok: true, ticketId: ticket.id }
}

/** Após `completeNinaSupportTurn`, grava a resposta da Nina no mesmo ticket (admin vê o contexto completo). */
export async function appendNinaBotReplyToPlatformTicket(
  ticketId: string,
  responseText: string
): Promise<void> {
  if (!supabaseAdmin) return
  const text = String(responseText || '').trim()
  if (!text) return

  const { data: row } = await supabaseAdmin
    .from('support_tickets')
    .select('id, mensagens_count')
    .eq('id', ticketId)
    .eq('area', PLATFORM_SUPPORT_AREA)
    .maybeSingle()

  if (!row?.id) return

  const { error: insErr } = await supabaseAdmin.from('support_messages').insert({
    ticket_id: ticketId,
    sender_type: 'bot',
    sender_id: null,
    sender_name: 'Nina',
    message: text,
    is_bot_response: true,
  })

  if (insErr) {
    console.error('[platform-support-from-nina] bot message', insErr)
    return
  }

  const nextCount = (row.mensagens_count ?? 0) + 1
  const preview = text.length > 500 ? `${text.slice(0, 500)}…` : text
  await supabaseAdmin
    .from('support_tickets')
    .update({
      ultima_mensagem: preview,
      ultima_mensagem_em: new Date().toISOString(),
      mensagens_count: nextCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId)
}
