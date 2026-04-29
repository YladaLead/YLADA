import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCorporalTenantContext } from '@/lib/pro-estetica-corporal-server'

type StatsRow = { link_id: string; event_type: string; cnt: number | string }

function sumViewsAndWhatsapp(
  rows: StatsRow[] | null,
  linkIds: string[]
): { totalViews: number; totalWhatsapp: number } {
  const byLink: Record<string, { view: number; cta_click: number }> = {}
  for (const id of linkIds) {
    byLink[id] = { view: 0, cta_click: 0 }
  }
  for (const r of rows ?? []) {
    if (!byLink[r.link_id]) continue
    const n = typeof r.cnt === 'number' ? r.cnt : parseInt(String(r.cnt), 10) || 0
    if (r.event_type === 'view') byLink[r.link_id].view = n
    else if (r.event_type === 'cta_click') byLink[r.link_id].cta_click = n
  }
  let totalViews = 0
  let totalWhatsapp = 0
  for (const id of linkIds) {
    totalViews += byLink[id].view
    totalWhatsapp += byLink[id].cta_click
  }
  return { totalViews, totalWhatsapp }
}

/**
 * GET — totais agregados dos links YLADA da conta da clínica (dona do tenant corporal).
 * Usado na faixa de análise rápida do painel.
 */
export async function GET(_request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
    if (!ctx) {
      return NextResponse.json({ success: false, error: 'Sem acesso ao painel Pro Estética Corporal.' }, { status: 403 })
    }

    const ownerId = ctx.tenant.owner_user_id

    const { data: links, error: linksErr } = await supabaseAdmin
      .from('ylada_links')
      .select('id, status')
      .eq('user_id', ownerId)

    if (linksErr) {
      console.error('[pro-estetica-corporal/links-analytics-summary]', linksErr)
      return NextResponse.json({ success: false, error: 'Erro ao listar links' }, { status: 500 })
    }

    const rows = links ?? []
    const linkIds = rows.map((l) => l.id)
    const linksActive = rows.filter((l) => l.status === 'active').length

    let totalViews = 0
    let totalWhatsapp = 0

    if (linkIds.length > 0) {
      try {
        const statsRes = await supabaseAdmin.rpc('get_ylada_link_stats', { link_ids: linkIds })
        const summed = sumViewsAndWhatsapp(
          Array.isArray(statsRes.data) ? (statsRes.data as StatsRow[]) : null,
          linkIds
        )
        totalViews = summed.totalViews
        totalWhatsapp = summed.totalWhatsapp
      } catch {
        /* RPC ausente: mantém zeros */
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          links_active: linksActive,
          link_opens: totalViews,
          whatsapp_clicks: totalWhatsapp,
        },
      },
      { headers: { 'Cache-Control': 'private, no-store, must-revalidate' } }
    )
  } catch (e) {
    console.error('[pro-estetica-corporal/links-analytics-summary]', e)
    return NextResponse.json({ success: false, error: 'Erro ao agregar métricas' }, { status: 500 })
  }
}
