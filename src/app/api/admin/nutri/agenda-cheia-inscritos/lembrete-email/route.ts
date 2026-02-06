import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'
import { AULA_PAGA_ZOOM_LINK, AULA_PAGA_DATA_HORARIO_LONGO } from '@/lib/aula-paga-config'

/**
 * POST /api/admin/nutri/agenda-cheia-inscritos/lembrete-email
 * Envia lembrete por e-mail para os inscritos selecionados (aula paga), com link do Zoom.
 * Body: { ids: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!isResendConfigured() || !resend) {
      return NextResponse.json(
        { success: false, error: 'E-mail (Resend) não configurado.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { ids } = body as { ids?: string[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Envie um array "ids" com pelo menos um id.' },
        { status: 400 }
      )
    }

    const { data: rows, error: fetchError } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('id, nome, email')
      .eq('workshop_type', 'aula_paga')
      .in('id', ids)

    if (fetchError || !rows?.length) {
      return NextResponse.json(
        { success: false, error: 'Nenhum inscrito encontrado com os ids informados.' },
        { status: 400 }
      )
    }

    const subject = `Lembrete: Aula YLADA Nutri – ${AULA_PAGA_DATA_HORARIO_LONGO}`
    const results: { id: string; email: string; success: boolean; error?: string }[] = []

    for (const row of rows) {
      const email = (row.email || '').trim()
      if (!email || !email.includes('@')) {
        results.push({ id: row.id, email: row.email || '', success: false, error: 'E-mail inválido' })
        continue
      }
      const html = `
        <h1>Lembrete – Aula YLADA Nutri</h1>
        <p>Olá, <strong>${(row.nome || '').trim() || 'você'}</strong>!</p>
        <p>Nossa aula é <strong>${AULA_PAGA_DATA_HORARIO_LONGO}</strong>. Entre com alguns minutos de antecedência.</p>
        <p><strong>Link da sala Zoom:</strong></p>
        <p><a href="${AULA_PAGA_ZOOM_LINK}">${AULA_PAGA_ZOOM_LINK}</a></p>
        <p>Qualquer dúvida, responda por WhatsApp.</p>
        <p>Equipe YLADA</p>
      `
      try {
        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject,
          html,
        })
        results.push({ id: row.id, email, success: true })
      } catch (err: any) {
        results.push({ id: row.id, email, success: false, error: err?.message || 'Erro ao enviar' })
      }
    }

    const enviados = results.filter((r) => r.success).length
    return NextResponse.json({
      success: true,
      enviados,
      total: results.length,
      detalhes: results,
    })
  } catch (error: any) {
    console.error('[Agenda Cheia Lembrete Email] Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao enviar lembretes por e-mail' },
      { status: 500 }
    )
  }
}
