/**
 * POST /api/ylada/freemium-events
 * Eventos autenticados: freemium_paywall_view, freemium_upgrade_cta_click
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { FREEMIUM_CONVERSION_KINDS, type FreemiumConversionKind } from '@/config/freemium-limits'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_TYPES = ['freemium_paywall_view', 'freemium_upgrade_cta_click'] as const

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json().catch(() => ({}))
    const eventType = typeof body.event_type === 'string' ? body.event_type.trim() : ''
    const rawPayload =
      body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : {}

    if (!ALLOWED_TYPES.includes(eventType as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json({ success: false, error: 'event_type inválido' }, { status: 400 })
    }

    const surface = typeof rawPayload.surface === 'string' ? rawPayload.surface.trim().slice(0, 120) : ''
    const kind = typeof rawPayload.kind === 'string' ? rawPayload.kind.trim().toLowerCase() : ''
    const kinds = FREEMIUM_CONVERSION_KINDS as readonly string[]
    if (!surface || !kinds.includes(kind)) {
      return NextResponse.json({ success: false, error: 'payload.surface e payload.kind são obrigatórios' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('ylada_behavioral_events').insert({
      event_type: eventType,
      user_id: auth.user.id,
      link_id: null,
      metrics_id: null,
      payload: { surface, kind: kind as FreemiumConversionKind },
    })
    if (error) {
      console.error('[ylada/freemium-events]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[ylada/freemium-events]', e)
    return NextResponse.json({ success: false, error: 'Erro ao registrar evento' }, { status: 500 })
  }
}
