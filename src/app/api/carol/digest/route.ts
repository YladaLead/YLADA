import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  analyzeConversationWithPause,
  type CarolMessageRow,
} from '@/lib/carol/conversation-insights'
import { scoreConversationReadiness } from '@/lib/carol/readiness'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'
import { ANDRE_NOTIFY_EMAILS } from '@/lib/carol/andre-notifications'

/**
 * Resumo automático das conversas da Carol (disparado por tarefa agendada do
 * Claude, NÃO pela Vercel cron). Protegido por senha na URL:
 *   GET /api/carol/digest?key=SECRET[&mins=75]
 *
 * Lê as conversas que se MOVERAM na última janela (default ~75 min), pontua a
 * prontidão, e — se houver algo — manda um e-mail pro Andre com:
 *  • quem está QUENTE pra fechar
 *  • quem PRECISA de você (Carol pausada e a lead falou por último)
 *  • quem ADIOU e foi descartada por engano (resgatar)
 * Se não houver nada novo, não manda e-mail (evita encher a caixa).
 */
export const dynamic = 'force-dynamic'

const PAINEL = 'https://www.ylada.com/admin/whatsapp/carol/conversas'

function label(nome: string | null, phone: string): string {
  return nome?.trim() ? `${nome.trim()} (+${phone})` : `+${phone}`
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key') || ''
  const expected = process.env.CAROL_DIGEST_KEY || ''
  if (!expected || key !== expected) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'sem service role' }, { status: 503 })
  }

  const mins = Math.min(
    Math.max(parseInt(request.nextUrl.searchParams.get('mins') || '75', 10) || 75, 5),
    1440
  )
  const since = new Date(Date.now() - mins * 60_000).toISOString()

  // Conversas que se moveram na janela.
  const { data: convs, error } = await supabaseAdmin
    .from('carol_conversations')
    .select('id, phone, nome, paused, updated_at')
    .gte('updated_at', since)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'erro ao buscar conversas' }, { status: 500 })
  }

  const ids = (convs || []).map((c) => c.id)
  const byConv = new Map<string, CarolMessageRow[]>()

  if (ids.length > 0) {
    const CHUNK = 50
    for (let i = 0; i < ids.length; i += CHUNK) {
      const batch = ids.slice(i, i + CHUNK)
      const { data: msgs } = await supabaseAdmin
        .from('carol_messages')
        .select('conversation_id, role, content, created_at')
        .in('conversation_id', batch)
        .order('created_at', { ascending: false })
      for (const m of msgs || []) {
        const list = byConv.get(m.conversation_id) || []
        list.push({ role: m.role, content: m.content, created_at: m.created_at })
        byConv.set(m.conversation_id, list)
      }
    }
  }

  const quentes: string[] = []
  const precisaVoce: string[] = []
  const resgatar: string[] = []

  for (const c of convs || []) {
    const msgs = byConv.get(c.id) || []
    const rdy = scoreConversationReadiness(msgs)
    const ins = analyzeConversationWithPause(msgs, Boolean(c.paused))
    const line = label(c.nome, c.phone)
    if (rdy.misfired_postponement) resgatar.push(line)
    else if (rdy.level === 'quente') quentes.push(line)
    if (ins.paused_awaiting_andre || ins.pending_carol_reply) precisaVoce.push(line)
  }

  const total = quentes.length + precisaVoce.length + resgatar.length
  if (total === 0) {
    return NextResponse.json({ ok: true, sent: false, msg: 'nada novo na janela' })
  }

  const bloco = (titulo: string, itens: string[]) =>
    itens.length ? `${titulo}\n${itens.map((i) => `• ${i}`).join('\n')}\n` : ''

  const texto =
    `Resumo da Carol (última ${mins} min)\n\n` +
    bloco('🔥 Prontos pra fechar:', quentes) +
    (quentes.length ? '\n' : '') +
    bloco('↩️ Adiaram — resgatar:', resgatar) +
    (resgatar.length ? '\n' : '') +
    bloco('📩 Precisam de você:', precisaVoce) +
    `\n${PAINEL}`

  if (isResendConfigured() && resend) {
    const html = `<div style="font-family:Arial,sans-serif;background:#f5f7f6;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 6px rgba(0,0,0,.06)">
        <div style="font-size:13px;color:#0d9488;font-weight:700;text-transform:uppercase">Resumo da Carol · última ${mins} min</div>
        <div style="white-space:pre-line;color:#0f172a;font-size:15px;line-height:1.55;margin-top:12px">${texto
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')}</div>
        <a href="${PAINEL}" style="display:inline-block;margin-top:18px;background:#0d9488;color:#fff;text-decoration:none;padding:10px 18px;border-radius:9px;font-weight:700;font-size:14px">Abrir o painel ›</a>
      </div></div>`
    try {
      await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: ANDRE_NOTIFY_EMAILS,
        subject: `Carol — ${quentes.length} quente(s), ${precisaVoce.length} precisam de você`,
        html,
      })
    } catch (e) {
      console.error('[carol/digest] falha ao enviar e-mail:', e)
      return NextResponse.json({ ok: true, sent: false, error: 'email falhou', counts: { quentes: quentes.length, precisaVoce: precisaVoce.length, resgatar: resgatar.length } })
    }
  }

  return NextResponse.json({
    ok: true,
    sent: true,
    counts: { quentes: quentes.length, precisaVoce: precisaVoce.length, resgatar: resgatar.length },
    resumo: texto,
  })
}
