/**
 * GET /api/ylada/links/metrics — lista métricas de diagnóstico (leads) dos links do usuário.
 * Inclui perfume_usage para PERFUME_PROFILE. Suporta filtro por link_id e perfume_usage.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get('link_id')?.trim() || null
    const perfumeUsage = searchParams.get('perfume_usage')?.trim() || null
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500)

    const { data: links, error: linksErr } = await supabaseAdmin
      .from('ylada_links')
      .select('id, slug, title')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (linksErr || !links?.length) {
      return NextResponse.json({ success: true, data: [] })
    }

    const linkIds = links.map((l) => l.id)
    const linksMap = Object.fromEntries(links.map((l) => [l.id, l]))

    let query = supabaseAdmin
      .from('ylada_diagnosis_metrics')
      .select('id, link_id, architecture, main_blocker, theme, perfume_usage, clicked_whatsapp, clicked_at, created_at')
      .in('link_id', linkIds)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (linkId && linkIds.includes(linkId)) {
      query = query.eq('link_id', linkId)
    }
    if (perfumeUsage) {
      query = query.eq('perfume_usage', perfumeUsage)
    }

    const { data: metrics, error: metricsErr } = await query

    if (metricsErr) {
      console.error('[ylada/links/metrics]', metricsErr)
      return NextResponse.json({ success: false, error: 'Erro ao buscar métricas' }, { status: 500 })
    }

    const list = (metrics ?? []).map((m) => {
      const link = linksMap[m.link_id]
      return {
        id: m.id,
        link_id: m.link_id,
        link_slug: link?.slug ?? null,
        link_title: link?.title ?? null,
        architecture: m.architecture,
        main_blocker: m.main_blocker,
        theme: m.theme,
        perfume_usage: m.perfume_usage ?? null,
        clicked_whatsapp: m.clicked_whatsapp,
        clicked_at: m.clicked_at,
        created_at: m.created_at,
      }
    })

    return NextResponse.json({ success: true, data: list })
  } catch (e) {
    console.error('[ylada/links/metrics]', e)
    return NextResponse.json({ success: false, error: 'Erro ao listar métricas' }, { status: 500 })
  }
}
