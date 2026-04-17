/**
 * GET /api/ylada/links/by-id/[id] — obtém um link do usuário (para edição).
 * PUT /api/ylada/links/by-id/[id] — atualiza título, CTA WhatsApp e status.
 * @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { resolveYladaPublicLinkBaseUrl } from '@/lib/ylada-public-link-base-url'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'

const ALLOWED_ROLES = [...YLADA_API_ALLOWED_PROFILES] as const
const ALLOWED_STATUSES = ['active', 'paused', 'archived'] as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_ROLES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id } = await params
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: link, error } = await supabaseAdmin
      .from('ylada_links')
      .select('id, slug, title, template_id, status, config_json, cta_whatsapp, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error || !link) {
      return NextResponse.json({ success: false, error: 'Link não encontrado' }, { status: 404 })
    }

    // Stats para "Diagnóstico em movimento" (respostas, views, etc.)
    let stats: {
      view: number
      start: number
      complete: number
      cta_click: number
      result_view: number
      share_click: number
      full_analysis_expand: number
      diagnosis_count: number
      conversion_rate: number | null
    } = {
      view: 0,
      start: 0,
      complete: 0,
      cta_click: 0,
      result_view: 0,
      share_click: 0,
      full_analysis_expand: 0,
      diagnosis_count: 0,
      conversion_rate: null,
    }
    try {
      const statsRes = await supabaseAdmin.rpc('get_ylada_link_stats', { link_ids: [id] })
      if (Array.isArray(statsRes.data) && statsRes.data.length > 0) {
        for (const r of statsRes.data as Array<{ link_id: string; event_type: string; cnt: number | string }>) {
          const n = typeof r.cnt === 'number' ? r.cnt : parseInt(String(r.cnt), 10) || 0
          if (r.event_type === 'view') stats.view = n
          else if (r.event_type === 'start') stats.start = n
          else if (r.event_type === 'complete') stats.complete = n
          else if (r.event_type === 'cta_click') stats.cta_click = n
          else if (r.event_type === 'result_view') stats.result_view = n
          else if (r.event_type === 'share_click') stats.share_click = n
          else if (r.event_type === 'full_analysis_expand') stats.full_analysis_expand = n
        }
      }
      const { count: diagCount } = await supabaseAdmin
        .from('ylada_diagnosis_metrics')
        .select('id', { count: 'exact', head: true })
        .eq('link_id', id)
      stats.diagnosis_count = diagCount ?? 0
      stats.conversion_rate =
        stats.diagnosis_count > 0 && stats.cta_click > 0
          ? Math.round((stats.cta_click / stats.diagnosis_count) * 1000) / 10
          : null
    } catch {
      // RPC ou tabela podem não existir; stats ficam zerados
    }

    const baseUrl = resolveYladaPublicLinkBaseUrl(request)
    const url = baseUrl ? `${baseUrl}/l/${link.slug}` : `/l/${link.slug}`

    return NextResponse.json({
      success: true,
      data: { ...link, url, stats },
    })
  } catch (e) {
    console.error('[ylada/links/by-id/[id]] GET', e)
    return NextResponse.json({ success: false, error: 'Erro ao buscar link' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_ROLES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id } = await params
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('ylada_links')
      .select('id, config_json')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: 'Link não encontrado' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const title = typeof body.title === 'string' ? body.title.trim() || null : undefined
    const ctaWhatsapp = typeof body.cta_whatsapp === 'string' ? body.cta_whatsapp.trim() || null : undefined
    const status = typeof body.status === 'string' && ALLOWED_STATUSES.includes(body.status as (typeof ALLOWED_STATUSES)[number])
      ? body.status
      : undefined
    const configOverride = body.config_json && typeof body.config_json === 'object' ? body.config_json as Record<string, unknown> : undefined

    const updates: Record<string, unknown> = {}
    if (title !== undefined) updates.title = title
    if (ctaWhatsapp !== undefined) updates.cta_whatsapp = ctaWhatsapp
    if (status !== undefined) updates.status = status

    let configJson = (existing.config_json as Record<string, unknown>) || {}
    if (title !== undefined) configJson = { ...configJson, title }
    if (ctaWhatsapp !== undefined) configJson = { ...configJson, ctaText: ctaWhatsapp }
    if (configOverride) {
      configJson = { ...configJson, ...configOverride }
    }
    updates.config_json = configJson

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, data: existing })
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('ylada_links')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, slug, title, status, config_json, cta_whatsapp, updated_at')
      .single()

    if (updateError) {
      console.error('[ylada/links/by-id/[id]] PUT', updateError)
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    console.error('[ylada/links/by-id/[id]] PUT', e)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar link' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_ROLES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id } = await params
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { error } = await supabaseAdmin
      .from('ylada_links')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[ylada/links/by-id/[id]] DELETE', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[ylada/links/by-id/[id]] DELETE', e)
    return NextResponse.json({ success: false, error: 'Erro ao excluir link' }, { status: 500 })
  }
}
