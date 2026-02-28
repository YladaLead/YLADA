/**
 * POST /api/ylada/links/[slug]/diagnosis — gera diagnóstico e grava métricas.
 * Público (sem auth). Sem rate limit por IP nesta fase (validação comportamental).
 * Body: { visitor_answers: Record<string, unknown> }
 * Retorna: { diagnosis: DiagnosisDecisionOutput, metrics_id: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { generateDiagnosis } from '@/lib/ylada'
import type { DiagnosisInput, DiagnosisArchitecture, LinkObjective, AreaProfissional } from '@/lib/ylada'
import type { StrategicProfile } from '@/lib/ylada/strategic-profile'
import { getAdaptiveDiagnosisIntro, getAdvancedCta } from '@/lib/ylada/adaptive-diagnosis'

const ARCHITECTURES: DiagnosisArchitecture[] = [
  'RISK_DIAGNOSIS',
  'BLOCKER_DIAGNOSIS',
  'PROJECTION_CALCULATOR',
  'PROFILE_TYPE',
  'READINESS_CHECKLIST',
]
const OBJECTIVES: LinkObjective[] = ['captar', 'educar', 'reter', 'propagar', 'indicar']
const AREAS: AreaProfissional[] = ['saude', 'profissional_liberal', 'vendas', 'wellness', 'geral']

/** x-forwarded-for pode vir com vários IPs (proxy); usar sempre o primeiro. */
function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  return null
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { slug } = await context.params
    if (!slug?.trim()) {
      return NextResponse.json({ success: false, error: 'slug é obrigatório' }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    let visitor_answers: Record<string, unknown> = body.visitor_answers && typeof body.visitor_answers === 'object'
      ? { ...body.visitor_answers }
      : {}

    // Normalizar campos que o motor espera como array (form pode enviar texto separado por vírgula)
    if (typeof visitor_answers.symptoms === 'string') {
      visitor_answers.symptoms = visitor_answers.symptoms.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    if (typeof visitor_answers.sintomas === 'string') {
      visitor_answers.sintomas = visitor_answers.sintomas.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    for (const key of ['history_flags', 'historico', 'history']) {
      if (typeof visitor_answers[key] === 'string') {
        visitor_answers[key] = (visitor_answers[key] as string).split(',').map((s: string) => s.trim()).filter(Boolean)
      }
    }
    if (typeof visitor_answers.barriers === 'string') {
      visitor_answers.barriers = visitor_answers.barriers.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    if (typeof visitor_answers.barreiras === 'string') {
      visitor_answers.barreiras = visitor_answers.barreiras.split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    const { data: link, error: linkError } = await supabaseAdmin
      .from('ylada_links')
      .select('id, config_json')
      .eq('slug', slug.trim())
      .eq('status', 'active')
      .maybeSingle()

    if (linkError || !link) {
      return NextResponse.json({ success: false, error: 'Link não encontrado ou inativo' }, { status: 404 })
    }

    const config = (link.config_json as Record<string, unknown>) ?? {}
    const metaRaw = config.meta as Record<string, unknown> | undefined
    if (!metaRaw) {
      return NextResponse.json({ success: false, error: 'Config do link sem meta' }, { status: 400 })
    }

    const architecture = metaRaw.architecture as string | undefined
    if (!architecture || !ARCHITECTURES.includes(architecture as DiagnosisArchitecture)) {
      return NextResponse.json({ success: false, error: 'Arquitetura de diagnóstico não suportada' }, { status: 400 })
    }

    const themeRaw = typeof metaRaw.theme_raw === 'string'
      ? metaRaw.theme_raw
      : (metaRaw.theme as Record<string, unknown>)?.raw as string | undefined
      ?? 'seu objetivo'

    // Camada 0: em safety_mode usar tema genérico (theme_display) nos textos, nunca nome de medicamento
    const safetyMode = metaRaw.safety_mode === true
    const themeDisplay = typeof metaRaw.theme_display === 'string' ? metaRaw.theme_display : null
    const themeForSlots = safetyMode && themeDisplay ? themeDisplay : themeRaw

    const objective = OBJECTIVES.includes((metaRaw.objective as LinkObjective) ?? '')
      ? (metaRaw.objective as LinkObjective)
      : 'captar'

    const area_profissional = AREAS.includes((metaRaw.area_profissional as AreaProfissional) ?? '')
      ? (metaRaw.area_profissional as AreaProfissional)
      : 'geral'

    const flow_id = typeof metaRaw.flow_id === 'string' ? metaRaw.flow_id : null
    const objectiveMeta = typeof metaRaw.objective === 'string' ? metaRaw.objective : null

    const input: DiagnosisInput = {
      meta: {
        objective,
        theme: { raw: themeForSlots },
        area_profissional,
        architecture: architecture as DiagnosisArchitecture,
      },
      professional: {},
      visitor_answers,
    }

    const { diagnosis, fallbackUsed, level } = generateDiagnosis(input)

    // Camada 0: disclaimer quando safety_mode (não parecer orientação médica)
    const copyPolicy = metaRaw.copy_policy && typeof metaRaw.copy_policy === 'object' ? metaRaw.copy_policy as { append_disclaimer?: boolean } : undefined
    const appendDisclaimer = safetyMode && copyPolicy?.append_disclaimer

    // Tom adaptativo: abertura por strategic_profile + level (sem alterar motor)
    const strategicProfile = metaRaw.strategic_profile && typeof metaRaw.strategic_profile === 'object' ? (metaRaw.strategic_profile as StrategicProfile) : null
    const introVariant = strategicProfile ? getAdaptiveDiagnosisIntro(strategicProfile, level) : null
    const baseSummary = introVariant
      ? `${introVariant}\n\n${diagnosis.profile_summary}`
      : diagnosis.profile_summary
    const profileSummary = appendDisclaimer
      ? `${baseSummary}\n\nIsto não é orientação médica. A avaliação individual é feita em consulta.`
      : baseSummary

    const ctaText = strategicProfile ? getAdvancedCta(strategicProfile, diagnosis.cta_text) : diagnosis.cta_text
    const ip = getClientIp(request)
    const ip_hash = ip ? hashIp(ip) : null
    const user_agent = request.headers.get('user-agent')?.slice(0, 500) ?? null

    const { data: row, error: insertError } = await supabaseAdmin
      .from('ylada_diagnosis_metrics')
      .insert({
        link_id: link.id,
        flow_id: flow_id,
        architecture,
        level: level ?? null,
        main_blocker: diagnosis.main_blocker,
        fallback_used: fallbackUsed,
        theme: themeRaw,
        objective: objectiveMeta ?? objective,
        cta_variant: ctaText,
        intro_variant: introVariant ?? null,
        user_agent: user_agent,
        ip_hash: ip_hash,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[ylada/links/[slug]/diagnosis] insert metrics', insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      diagnosis: {
        profile_title: diagnosis.profile_title,
        profile_summary: profileSummary,
        main_blocker: diagnosis.main_blocker,
        consequence: diagnosis.consequence,
        growth_potential: diagnosis.growth_potential,
        cta_text: ctaText,
        whatsapp_prefill: diagnosis.whatsapp_prefill,
      },
      metrics_id: row.id,
    })
  } catch (e) {
    console.error('[ylada/links/[slug]/diagnosis]', e)
    return NextResponse.json({ success: false, error: 'Erro ao gerar diagnóstico' }, { status: 500 })
  }
}
