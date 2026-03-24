/**
 * POST /api/ylada/diagnostico-profissional/submit
 * Submete o quiz de diagnóstico estratégico do profissional.
 * Auth obrigatória. Persiste resultado em ylada_noel_memory e ylada_professional_strategy_map.
 *
 * Body: { answers: Record<string, string> }
 * Retorna: { success: true, result: ProfessionalDiagnosisResult }
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import {
  getProfessionalDiagnosisResult,
  DIAGNOSTICO_PROFISSIONAL_QUESTIONS,
  type ProfessionalDiagnosisResult,
} from '@/config/diagnostico-profissional'
import { upsertNoelMemory } from '@/lib/noel-wellness/noel-memory'
import { updateStrategyMapFromDiagnosis } from '@/lib/noel-wellness/noel-strategy-map'

const ALLOWED_PROFILES = [
  'ylada',
  'med',
  'psi',
  'psicanalise',
  'odonto',
  'nutra',
  'coach',
  'seller',
  'perfumaria',
  'estetica',
  'fitness',
  'nutri',
  'admin',
] as const

function normalizeAnswers(body: unknown): Record<string, string> {
  if (!body || typeof body !== 'object') return {}
  const answers: Record<string, string> = {}
  const obj = body as Record<string, unknown>
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') answers[k] = v
    else if (typeof v === 'number') answers[k] = String(v)
  }
  return answers
}

function validateAnswers(answers: Record<string, string>): string | null {
  const required: Array<{ id: string; alt?: string }> = [
    { id: 'q1_geracao', alt: 'q1' },
    { id: 'q2_conversas', alt: 'q2' },
    { id: 'q3_conversas', alt: 'q3' },
    { id: 'q4_diagnostico', alt: 'q4' },
  ]
  for (const { id, alt } of required) {
    const val = answers[id] || (alt ? answers[alt] : '')
    if (!val?.trim()) return `Resposta obrigatória: ${id}`
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json().catch(() => ({}))
    const rawAnswers = body.answers && typeof body.answers === 'object' ? body.answers : body
    const answers = normalizeAnswers(rawAnswers)

    const validationError = validateAnswers(answers)
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 })
    }

    const result = getProfessionalDiagnosisResult(answers) as ProfessionalDiagnosisResult

    const segment = (typeof body.segment === 'string' ? body.segment : 'ylada').toLowerCase()
    const validSegment = YLADA_SEGMENT_CODES.includes(segment as (typeof YLADA_SEGMENT_CODES)[number])
      ? segment
      : 'ylada'

    await upsertNoelMemory(user.id, validSegment, {
      professional_profile: result.profile_title,
      main_problem: result.main_blocker,
      main_goal: result.next_action,
      current_strategy: result.recommended_strategy,
      funnel_stage: result.growth_stage,
      action_to_add: 'fez_diagnostico_profissional',
    })

    await updateStrategyMapFromDiagnosis(user.id, validSegment, {
      profile_title: result.profile_title,
      main_blocker: result.main_blocker,
      recommended_strategy: result.recommended_strategy,
      next_action: result.next_action,
      growth_stage: result.growth_stage,
    })

    return NextResponse.json({
      success: true,
      result: {
        profile_title: result.profile_title,
        main_blocker: result.main_blocker,
        growth_potential: result.growth_potential,
        recommended_strategy: result.recommended_strategy,
        next_action: result.next_action,
        growth_stage: result.growth_stage,
      },
      segment: validSegment,
    })
  } catch (error: unknown) {
    console.error('[/api/ylada/diagnostico-profissional/submit]', error)
    const message = error instanceof Error ? error.message : 'Erro ao processar diagnóstico.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
