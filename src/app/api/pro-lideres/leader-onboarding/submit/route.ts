import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type SubmitBody = {
  token?: string
  display_name?: string
  team_name?: string
  whatsapp?: string
  focus_notes?: string
  primary_goal?: string
  main_challenge?: string
  /** Idade do líder (anos). */
  leader_age?: number | string
  /** Anos na Herbalife (só anos). */
  herbalife_years?: number | string
  /** Ocupação / experiência antes da Herbalife. */
  career_before_herbalife?: string
  /** Total de pessoas na equipe. */
  team_total_people?: number | string
  /** Número de líderes na equipe. */
  team_leaders_count?: number | string
  /** Linhas / pernas distintas na estrutura. */
  team_distinct_lines?: number | string
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
    .from('pro_lideres_leader_onboarding_links')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (error || !row) return NextResponse.json({ error: 'Link não encontrado.' }, { status: 404 })
  if (row.status !== 'pending') {
    return NextResponse.json({ error: 'Este link não está mais disponível.' }, { status: 400 })
  }
  if (new Date(row.expires_at) < new Date()) {
    await supabaseAdmin
      .from('pro_lideres_leader_onboarding_links')
      .update({ status: 'expired' })
      .eq('id', row.id)
      .eq('status', 'pending')
    return NextResponse.json({ error: 'Este link expirou.' }, { status: 400 })
  }

  const displayName = clip(body.display_name, 160)
  if (!displayName || displayName.length < 2) {
    return NextResponse.json({ error: 'Nome para exibição é obrigatório.' }, { status: 400 })
  }

  const leaderAge = parseOptionalInt(body.leader_age, { min: 16, max: 110 })
  const herbalifeYears = parseOptionalInt(body.herbalife_years, { min: 0, max: 70 })
  const teamTotal = parseOptionalInt(body.team_total_people, { min: 0, max: 500_000 })
  const teamLeaders = parseOptionalInt(body.team_leaders_count, { min: 0, max: 100_000 })
  const teamLines = parseOptionalInt(body.team_distinct_lines, { min: 0, max: 50_000 })

  const answers = {
    display_name: displayName,
    team_name: clip(body.team_name, 160),
    whatsapp: clip(body.whatsapp, 40),
    focus_notes: clip(body.focus_notes, 2000),
    primary_goal: clip(body.primary_goal, 200),
    main_challenge: clip(body.main_challenge, 300),
    leader_age: leaderAge,
    herbalife_years: herbalifeYears,
    career_before_herbalife: clip(body.career_before_herbalife, 300),
    team_total_people: teamTotal,
    team_leaders_count: teamLeaders,
    team_distinct_lines: teamLines,
  }

  const { error: updateErr } = await supabaseAdmin
    .from('pro_lideres_leader_onboarding_links')
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
