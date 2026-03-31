/**
 * POST /api/ylada/funnel-events — funil landing → cadastro (público).
 * - Eventos anônimos: user_id NULL, payload com path/search/utm.
 * - user_created: exige sessão; insere com user_id (dedupe por usuário).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const ANONYMOUS_TYPES = [
  'funnel_landing_pt_view',
  'funnel_landing_cta_segmentos',
  'funnel_segmentos_view',
  'funnel_hub_segmento_clicado',
  'funnel_entrada_nicho',
  'funnel_cadastro_view',
  'funnel_cadastro_area_selected',
] as const

const AUTH_TYPES = ['user_created'] as const

type AnonymousType = (typeof ANONYMOUS_TYPES)[number]
type AuthType = (typeof AUTH_TYPES)[number]

function isAnonymousType(t: string): t is AnonymousType {
  return (ANONYMOUS_TYPES as readonly string[]).includes(t)
}

function isAuthType(t: string): t is AuthType {
  return (AUTH_TYPES as readonly string[]).includes(t)
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const eventType = typeof body.event_type === 'string' ? body.event_type.trim() : ''
    const payload =
      body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : {}
    const client_session_id =
      typeof body.client_session_id === 'string' ? body.client_session_id.trim().slice(0, 80) : null

    if (!eventType || (!isAnonymousType(eventType) && !isAuthType(eventType))) {
      return NextResponse.json({ success: false, error: 'event_type inválido' }, { status: 400 })
    }

    if (isAnonymousType(eventType)) {
      const merged = {
        ...payload,
        ...(client_session_id ? { client_session_id } : {}),
      }
      const { error } = await supabaseAdmin.from('ylada_behavioral_events').insert({
        event_type: eventType,
        user_id: null,
        link_id: null,
        metrics_id: null,
        payload: merged,
      })
      if (error) {
        console.error('[ylada/funnel-events]', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    // user_created
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth

    const { data: existing } = await supabaseAdmin
      .from('ylada_behavioral_events')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('event_type', 'user_created')
      .limit(1)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, skipped: true })
    }

    const { error: insErr } = await supabaseAdmin.from('ylada_behavioral_events').insert({
      event_type: 'user_created',
      user_id: auth.user.id,
      link_id: null,
      metrics_id: null,
      payload: {
        ...payload,
        ...(client_session_id ? { client_session_id } : {}),
      },
    })
    if (insErr) {
      console.error('[ylada/funnel-events] user_created', insErr)
      return NextResponse.json({ success: false, error: insErr.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[ylada/funnel-events]', e)
    return NextResponse.json({ success: false, error: 'Erro ao registrar evento' }, { status: 500 })
  }
}
