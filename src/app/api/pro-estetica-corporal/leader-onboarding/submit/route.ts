import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { normalizeCorporalOnboardingMarketContext } from '@/lib/pro-estetica-corporal-onboarding'

type SubmitBody = {
  token?: string
  display_name?: string
  team_name?: string
  whatsapp?: string
  focus_notes?: string
  primary_goal?: string
  main_challenge?: string
  years_in_aesthetics?: number | string
  city_region?: string
  market_context?: string
  service_to_grow?: string
  main_lead_channel?: string
}

const clip = (value: unknown, max = 500): string | null => {
  const s = String(value ?? '').trim()
  return s ? s.slice(0, max) : null
}

function parseOptionalInt(value: unknown, opts: { min: number; max: number }): number | null {
  if (value === '' || value === null || value === undefined) return null
  const n = typeof value === 'number' ? value : parseInt(String(value).trim(), 10)
  if (!Number.isFinite(n)) return null
  if (n < opts.min || n > opts.max) return null
  return n
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: SubmitBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const token = String(body.token ?? '').trim()
  if (!token) return NextResponse.json({ error: 'Token ausente.' }, { status: 400 })

  const { data: row, error } = await supabaseAdmin
    .from('pro_estetica_corporal_onboarding_links')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (error || !row) return NextResponse.json({ error: 'Link não encontrado.' }, { status: 404 })
  if (row.status !== 'pending') {
    return NextResponse.json({ error: 'Este link não está mais disponível.' }, { status: 400 })
  }
  if (new Date(row.expires_at) < new Date()) {
    await supabaseAdmin
      .from('pro_estetica_corporal_onboarding_links')
      .update({ status: 'expired' })
      .eq('id', row.id)
      .eq('status', 'pending')
    return NextResponse.json({ error: 'Este link expirou.' }, { status: 400 })
  }

  const displayName = clip(body.display_name, 160)
  if (!displayName || displayName.length < 2) {
    return NextResponse.json({ error: 'Indica como queres ser chamada no painel.' }, { status: 400 })
  }

  const yearsAesthetics = parseOptionalInt(body.years_in_aesthetics, { min: 0, max: 70 })
  const market_context = normalizeCorporalOnboardingMarketContext(body.market_context)

  const answers = {
    display_name: displayName,
    team_name: clip(body.team_name, 160),
    whatsapp: clip(body.whatsapp, 40),
    focus_notes: clip(body.focus_notes, 2000),
    primary_goal: clip(body.primary_goal, 200),
    main_challenge: clip(body.main_challenge, 300),
    years_in_aesthetics: yearsAesthetics,
    city_region: clip(body.city_region, 120),
    market_context: market_context || null,
    service_to_grow: clip(body.service_to_grow, 200),
    main_lead_channel: clip(body.main_lead_channel, 120),
  }

  const { error: updateErr } = await supabaseAdmin
    .from('pro_estetica_corporal_onboarding_links')
    .update({
      questionnaire_answers: answers,
      status: 'completed',
      response_completed_at: new Date().toISOString(),
    })
    .eq('id', row.id)
    .eq('status', 'pending')

  if (updateErr) {
    return NextResponse.json({ error: 'Não foi possível guardar respostas.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
