/**
 * POST /api/ylada/links/events — registra evento de visitante (view, start, complete, result_view, cta_click).
 * Pública (sem auth). Insere em ylada_link_events; view e cta_click espelham em link_events.
 * Body: { slug, event_type, utm_json?, device?, metrics_id? }
 * - result_view + metrics_id: atualiza ylada_diagnosis_metrics.diagnosis_shown_at (quando o resultado foi exibido).
 * - cta_click + metrics_id: atualiza clicked_whatsapp, clicked_at, time_to_click_ms, diagnosis_read_time_ms (tempo de leitura até o clique).
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_TYPES = ['view', 'start', 'complete', 'result_view', 'cta_click'] as const

/** Mapeia evento YLADA → evento unificado (só view e whatsapp_click entram em link_events) */
function toUnifiedEventType(eventType: string): 'view' | 'whatsapp_click' | null {
  if (eventType === 'view') return 'view'
  if (eventType === 'cta_click') return 'whatsapp_click'
  return null
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const eventType = typeof body.event_type === 'string' ? body.event_type.trim().toLowerCase() : ''
    const metricsId = typeof body.metrics_id === 'string' ? body.metrics_id.trim() || null : null

    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug é obrigatório' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(eventType as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json({ success: false, error: 'event_type inválido' }, { status: 400 })
    }

    const { data: link, error: linkError } = await supabaseAdmin
      .from('ylada_links')
      .select('id, user_id')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()

    if (linkError || !link) {
      return NextResponse.json({ success: false, error: 'Link não encontrado ou inativo' }, { status: 404 })
    }

    const utmJson = body.utm_json && typeof body.utm_json === 'object' ? body.utm_json : {}
    const device = typeof body.device === 'string' ? body.device.trim() || null : null

    const { error: insertError } = await supabaseAdmin.from('ylada_link_events').insert({
      link_id: link.id,
      event_type: eventType,
      utm_json: utmJson,
      device,
    })

    if (insertError) {
      console.error('[ylada/links/events]', insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
    }

    if (eventType === 'result_view' && metricsId) {
      await supabaseAdmin
        .from('ylada_diagnosis_metrics')
        .update({ diagnosis_shown_at: new Date().toISOString() })
        .eq('id', metricsId)
        .eq('link_id', link.id)
        .is('diagnosis_shown_at', null)
        .then(({ error: updateErr }) => {
          if (updateErr) console.error('[ylada/links/events] diagnosis_metrics result_view:', updateErr)
        })
    }

    // Só atualiza métricas no primeiro clique (evita duplicidade)
    if (eventType === 'cta_click' && metricsId) {
      const { data: metric } = await supabaseAdmin
        .from('ylada_diagnosis_metrics')
        .select('created_at, diagnosis_shown_at, clicked_whatsapp')
        .eq('id', metricsId)
        .eq('link_id', link.id)
        .maybeSingle()
      if (metric && metric.clicked_whatsapp === false) {
        const now = new Date()
        const nowIso = now.toISOString()
        const timeToClickMs = metric.created_at
          ? Math.max(0, Math.round(now.getTime() - new Date(metric.created_at).getTime()))
          : null
        const diagnosisShownAt = metric.diagnosis_shown_at
        const diagnosisReadTimeMs = diagnosisShownAt
          ? Math.max(0, Math.round(now.getTime() - new Date(diagnosisShownAt).getTime()))
          : null
        await supabaseAdmin
          .from('ylada_diagnosis_metrics')
          .update({
            clicked_whatsapp: true,
            clicked_at: nowIso,
            time_to_click_ms: timeToClickMs,
            diagnosis_read_time_ms: diagnosisReadTimeMs,
          })
          .eq('id', metricsId)
          .eq('link_id', link.id)
          .eq('clicked_whatsapp', false)
          .then(({ error: updateErr }) => {
            if (updateErr) console.error('[ylada/links/events] diagnosis_metrics update:', updateErr)
          })
      }
    }

    // Fase 4: espelhar view e cta_click na tabela unificada link_events
    const unifiedType = toUnifiedEventType(eventType)
    if (unifiedType) {
      await supabaseAdmin.from('link_events').insert({
        event_type: unifiedType,
        link_source: 'ylada_link',
        link_id: link.id,
        user_id: link.user_id,
        area: 'ylada',
      }).then(() => {}, (err: unknown) => {
        const e = err as { code?: string }
        if (e?.code !== '42P01') console.error('[ylada/links/events] link_events insert:', err)
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[ylada/links/events]', e)
    return NextResponse.json({ success: false, error: 'Erro ao registrar evento' }, { status: 500 })
  }
}
