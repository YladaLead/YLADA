import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getZApiInstance } from '@/lib/whatsapp-carol-ai'
import { sendWhatsAppMessage } from '@/lib/whatsapp-carol-ai'

function normalizePhone(t: string): string {
  const d = String(t || '').replace(/\D/g, '')
  if (d.length === 10 || d.length === 11) return '55' + d
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) return d
  return d ? '55' + d : ''
}

const DEFAULT_LEMBRETE = `Olá! Lembrete: nossa aula da YLADA Nutri é na *quarta-feira, 11 de fevereiro às 19h30*. Em breve você receberá o link de acesso por aqui. Qualquer dúvida, responda nesta conversa.`

/**
 * POST /api/admin/nutri/agenda-cheia-inscritos/lembrete
 * Envia lembrete por WhatsApp para os inscritos selecionados (aula paga).
 * Body: { ids: string[], message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { ids, message } = body as { ids?: string[]; message?: string }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Envie um array "ids" com pelo menos um id.' },
        { status: 400 }
      )
    }

    const { data: rows, error: fetchError } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('id, nome, telefone')
      .eq('workshop_type', 'aula_paga')
      .in('id', ids)

    if (fetchError || !rows?.length) {
      return NextResponse.json(
        { success: false, error: 'Nenhum inscrito encontrado com os ids informados.' },
        { status: 400 }
      )
    }

    const instance = await getZApiInstance('nutri')
    if (!instance?.token || !instance?.instance_id) {
      return NextResponse.json(
        { success: false, error: 'Instância WhatsApp (Nutri) não configurada ou desconectada.' },
        { status: 503 }
      )
    }

    const text = (message && message.trim()) || DEFAULT_LEMBRETE
    const results: { id: string; phone: string; success: boolean; error?: string }[] = []

    for (const row of rows) {
      const phone = normalizePhone(row.telefone)
      if (!phone || phone.length < 12) {
        results.push({ id: row.id, phone: row.telefone, success: false, error: 'Telefone inválido' })
        continue
      }
      const sent = await sendWhatsAppMessage(phone, text, instance.instance_id, instance.token)
      results.push({
        id: row.id,
        phone,
        success: sent.success,
        error: sent.error,
      })
      if (rows.length > 1) {
        await new Promise((r) => setTimeout(r, 1500))
      }
    }

    const ok = results.filter((r) => r.success).length
    return NextResponse.json({
      success: true,
      enviados: ok,
      total: results.length,
      detalhes: results,
    })
  } catch (error: any) {
    console.error('[Agenda Cheia Lembrete] Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao enviar lembretes' },
      { status: 500 }
    )
  }
}
