/**
 * GET /api/ylada/links — lista links do usuário logado com template e estatísticas.
 * @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

type EventCounts = { view: number; start: number; complete: number; cta_click: number }

function buildStatsMap(
  rows: Array<{ link_id: string; event_type: string; cnt: number | string }> | null
): Record<string, EventCounts> {
  const map: Record<string, EventCounts> = {}
  if (!rows?.length) return map
  for (const r of rows) {
    if (!map[r.link_id]) {
      map[r.link_id] = { view: 0, start: 0, complete: 0, cta_click: 0 }
    }
    const n = typeof r.cnt === 'number' ? r.cnt : parseInt(String(r.cnt), 10) || 0
    if (r.event_type === 'view') map[r.link_id].view = n
    else if (r.event_type === 'start') map[r.link_id].start = n
    else if (r.event_type === 'complete') map[r.link_id].complete = n
    else if (r.event_type === 'cta_click') map[r.link_id].cta_click = n
  }
  return map
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: linksData, error } = await supabaseAdmin
      .from('ylada_links')
      .select('id, slug, title, template_id, status, cta_whatsapp, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[ylada/links]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const links = linksData ?? []
    const linkIds = links.map((l) => l.id)

    let templatesMap: Record<string, { name: string; type: string }> = {}
    let statsMap: Record<string, EventCounts> = {}

    if (links.length > 0) {
      const templateIds = [...new Set(links.map((l) => l.template_id).filter(Boolean))]
      const templatesRes =
        templateIds.length > 0
          ? await supabaseAdmin
              .from('ylada_link_templates')
              .select('id, name, type')
              .in('id', templateIds)
          : { data: [] }
      if (templatesRes.data?.length) {
        for (const t of templatesRes.data) {
          templatesMap[t.id] = { name: t.name, type: t.type }
        }
      }
      if (linkIds.length > 0) {
        try {
          const statsRes = await supabaseAdmin.rpc('get_ylada_link_stats', { link_ids: linkIds })
          if (Array.isArray(statsRes.data)) {
            statsMap = buildStatsMap(statsRes.data as Array<{ link_id: string; event_type: string; cnt: number | string }>)
          }
        } catch {
          // Função pode não existir se migration 212 não foi aplicada; stats ficam zerados
        }
      }
    }

    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = host ? `${protocol}://${host}` : ''

    const list = links.map((row) => ({
      ...row,
      url: baseUrl ? `${baseUrl}/l/${row.slug}` : `/l/${row.slug}`,
      template_name: row.template_id ? templatesMap[row.template_id]?.name ?? null : null,
      template_type: row.template_id ? templatesMap[row.template_id]?.type ?? null : null,
      stats: statsMap[row.id] ?? { view: 0, start: 0, complete: 0, cta_click: 0 },
    }))

    return NextResponse.json({ success: true, data: list })
  } catch (e) {
    console.error('[ylada/links]', e)
    return NextResponse.json({ success: false, error: 'Erro ao listar links' }, { status: 500 })
  }
}
