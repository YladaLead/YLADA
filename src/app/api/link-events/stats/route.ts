/**
 * GET /api/link-events/stats — contagem de eventos por link e totais por período.
 * Autenticado; retorna view, whatsapp_click, lead_capture por link e totais para o user.
 * Query: ?area=nutri&link_source=user_template&link_ids=uuid1,uuid2&since=ISO (opcional)
 * @see docs/PASSO-A-PASSO-CONTAGEM-LINKS.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'wellness', 'coach', 'admin'])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Backend não configurado' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area') || 'nutri'
    const linkSource = searchParams.get('link_source') || 'user_template'
    const linkIdsParam = searchParams.get('link_ids') // uuid1,uuid2
    const since = searchParams.get('since') // ISO date, opcional

    const userId = user.id

    let query = supabaseAdmin
      .from('link_events')
      .select('link_id, event_type')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('link_source', linkSource)

    if (since) {
      query = query.gte('created_at', since)
    }

    const { data: rows, error } = await query

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Tabela link_events não existe. Execute a migration 215.' },
          { status: 501 }
        )
      }
      console.error('[link-events/stats]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const byLink: Record<string, { view: number; whatsapp_click: number; lead_capture: number }> = {}
    let totalView = 0
    let totalWhatsappClick = 0
    let totalLeadCapture = 0

    for (const row of rows || []) {
      const id = row.link_id as string
      if (!byLink[id]) byLink[id] = { view: 0, whatsapp_click: 0, lead_capture: 0 }
      if (row.event_type === 'view') {
        byLink[id].view++
        totalView++
      } else if (row.event_type === 'whatsapp_click') {
        byLink[id].whatsapp_click++
        totalWhatsappClick++
      } else if (row.event_type === 'lead_capture') {
        byLink[id].lead_capture++
        totalLeadCapture++
      }
    }

    const linkIdsFilter = linkIdsParam ? linkIdsParam.split(',').map((s) => s.trim()).filter(Boolean) : null
    const linksOut = linkIdsFilter
      ? linkIdsFilter.map((id) => ({ link_id: id, ...(byLink[id] || { view: 0, whatsapp_click: 0, lead_capture: 0 }) }))
      : Object.entries(byLink).map(([link_id, counts]) => ({ link_id, ...counts }))

    return NextResponse.json({
      success: true,
      data: {
        by_link: linksOut,
        totals: {
          view: totalView,
          whatsapp_click: totalWhatsappClick,
          lead_capture: totalLeadCapture,
          conversations: totalWhatsappClick + totalLeadCapture,
        },
        area,
        link_source: linkSource,
      },
    })
  } catch (e: any) {
    console.error('[link-events/stats]', e)
    return NextResponse.json(
      { error: e?.message || 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
