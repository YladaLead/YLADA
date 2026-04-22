import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  buildMainChallengeAnswerLine,
  buildTeamBottleneckLine,
  LEADER_ONBOARDING_ALLOWED_BOTTLENECK,
  LEADER_ONBOARDING_ALLOWED_FOLLOWUP,
  LEADER_ONBOARDING_ALLOWED_MAIN_CHALLENGE,
  LEADER_ONBOARDING_ALLOWED_TEAM_ACTIVITY,
  LEADER_ONBOARDING_ALLOWED_TOOL_IDS,
} from '@/lib/pro-lideres-leader-onboarding-fields'

type SubmitBody = {
  token?: string
  display_name?: string
  team_name?: string
  whatsapp?: string
  focus_notes?: string
  primary_goal?: string
  primary_goal_measure?: string
  main_challenge_preset?: string
  main_challenge_other?: string
  team_activity_level?: string
  follow_up_frequency?: string
  tools_used?: string[] | string
  team_bottleneck?: string
  team_bottleneck_other?: string
  /** Legado: ignorado se main_challenge_preset vier preenchido. */
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

function parseToolsUsed(raw: unknown): string[] | null {
  if (raw == null) return null
  let arr: string[]
  if (Array.isArray(raw)) {
    arr = raw.map((x) => String(x).trim()).filter(Boolean)
  } else if (typeof raw === 'string') {
    arr = raw.split(',').map((s) => s.trim()).filter(Boolean)
  } else {
    return null
  }
  const out = [...new Set(arr)]
  for (const id of out) {
    if (!LEADER_ONBOARDING_ALLOWED_TOOL_IDS.has(id)) return null
  }
  if (out.length === 0) return null
  if (out.includes('none_consistent') && out.length > 1) return null
  return out.sort()
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

  const teamActivity = String(body.team_activity_level ?? '').trim()
  if (!teamActivity || !LEADER_ONBOARDING_ALLOWED_TEAM_ACTIVITY.has(teamActivity)) {
    return NextResponse.json({ error: 'Selecione o nível de atividade da equipe.' }, { status: 400 })
  }

  const follow = String(body.follow_up_frequency ?? '').trim()
  if (!follow || !LEADER_ONBOARDING_ALLOWED_FOLLOWUP.has(follow)) {
    return NextResponse.json({ error: 'Selecione a frequência de acompanhamento.' }, { status: 400 })
  }

  const toolsUsed = parseToolsUsed(body.tools_used)
  if (!toolsUsed) {
    return NextResponse.json({ error: 'Indique as ferramentas que usa (opções válidas).' }, { status: 400 })
  }

  const primaryGoal = clip(body.primary_goal, 200)
  if (!primaryGoal || primaryGoal.length < 3) {
    return NextResponse.json({ error: 'Objetivo principal (30 dias) é obrigatório.' }, { status: 400 })
  }

  const primaryGoalMeasure = clip(body.primary_goal_measure, 400)
  if (!primaryGoalMeasure || primaryGoalMeasure.length < 8) {
    return NextResponse.json(
      { error: 'Indique como saberá que atingiu o objetivo (critério mensurável).' },
      { status: 400 }
    )
  }

  const preset = String(body.main_challenge_preset ?? '').trim()
  const otherMc = String(body.main_challenge_other ?? '').trim().slice(0, 200)

  let mainChallengeFinal: string | null
  if (preset && LEADER_ONBOARDING_ALLOWED_MAIN_CHALLENGE.has(preset)) {
    if (preset === 'other' && otherMc.length < 2) {
      return NextResponse.json({ error: 'Descreva o desafio em “Outro”.' }, { status: 400 })
    }
    mainChallengeFinal = buildMainChallengeAnswerLine(preset, otherMc)
  } else if (clip(body.main_challenge, 300)) {
    mainChallengeFinal = clip(body.main_challenge, 300)
  } else {
    return NextResponse.json({ error: 'Selecione o maior desafio hoje.' }, { status: 400 })
  }

  const bottleneck = String(body.team_bottleneck ?? '').trim()
  const otherBn = String(body.team_bottleneck_other ?? '').trim().slice(0, 200)
  if (!bottleneck || !LEADER_ONBOARDING_ALLOWED_BOTTLENECK.has(bottleneck)) {
    return NextResponse.json({ error: 'Selecione o que mais trava a equipe.' }, { status: 400 })
  }
  if (bottleneck === 'other' && otherBn.length < 2) {
    return NextResponse.json({ error: 'Descreva o gargalo em “Outro”.' }, { status: 400 })
  }
  const teamBottleneckLine = buildTeamBottleneckLine(bottleneck, otherBn)

  const answers = {
    display_name: displayName,
    team_name: clip(body.team_name, 160),
    whatsapp: clip(body.whatsapp, 40),
    focus_notes: clip(body.focus_notes, 2000),
    primary_goal: primaryGoal,
    primary_goal_measure: primaryGoalMeasure,
    main_challenge: mainChallengeFinal,
    main_challenge_preset: preset && LEADER_ONBOARDING_ALLOWED_MAIN_CHALLENGE.has(preset) ? preset : null,
    main_challenge_other: preset === 'other' ? otherMc || null : null,
    team_activity_level: teamActivity,
    follow_up_frequency: follow,
    tools_used: toolsUsed,
    team_bottleneck: bottleneck,
    team_bottleneck_other: bottleneck === 'other' ? otherBn || null : null,
    team_bottleneck_line: teamBottleneckLine,
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
