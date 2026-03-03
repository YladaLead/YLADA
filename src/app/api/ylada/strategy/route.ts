/**
 * POST /api/ylada/strategy — Direção Estratégica (diagnóstico + 2 estratégias).
 * Endpoint dedicado para a UI de Links: retorna só o necessário para exibir
 * o bloco "Direção Estratégica" e os 2 cards.
 * Suporta perfil simulado (cookie ylada_simulate_profile) para testes.
 * @see docs/PLANO-IMPLANTACAO-DIRECAO-ESTRATEGICA.md (Etapa 3)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { SIMULATE_COOKIE_NAME, PERFIS_SIMULADOS } from '@/data/perfis-simulados'
import { getStrategyRecommendation } from '@/lib/ylada/strategy-engine'
import { buildProfileInput, fetchBehavior, hasNoelProfile } from '@/lib/ylada/strategy-engine/profile-fetcher'

export interface StrategyApiResponse {
  /** Quando perfil simulado está ativo (para testes). */
  simulated_profile_key?: string
  simulated_profile_label?: string
  professional_diagnosis: {
    blocker: string
    focus: string
    why: string
    tone: string
    summary_lines: string[]
  }
  strategic_focus: string
  profile_incomplete?: boolean
  strategies: Array<{
    type: 'activation' | 'authority'
    flow_id: string
    title: string
    reason: string
    theme: string
    questions: Array<{ key: string; label: string; type: string }>
    cta_suggestion: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json().catch(() => ({}))
    const segmentHint = typeof body.segment === 'string' ? body.segment.trim() : 'ylada'
    const segment = segmentHint && YLADA_SEGMENT_CODES.includes(segmentHint as any) ? segmentHint : 'ylada'
    const simulateKey = request.cookies.get(SIMULATE_COOKIE_NAME)?.value?.trim() || null

    const [profileInput, behavior, hasProfile] = await Promise.all([
      buildProfileInput(user.id, segment, {}, simulateKey),
      fetchBehavior(user.id),
      hasNoelProfile(user.id, segment, simulateKey),
    ])
    const recommendation = getStrategyRecommendation(profileInput, behavior)

    const [activation, authority] = recommendation.strategies
    const diagnosis = recommendation.professional_diagnosis

    const simMeta = simulateKey ? PERFIS_SIMULADOS.find((p) => p.key === simulateKey) : null
    const response: StrategyApiResponse = {
      profile_incomplete: !hasProfile,
      ...(simMeta && { simulated_profile_key: simMeta.key, simulated_profile_label: simMeta.label }),
      professional_diagnosis: {
        blocker: diagnosis.blocker,
        focus: diagnosis.focus,
        why: diagnosis.why,
        tone: diagnosis.tone,
        summary_lines: diagnosis.summary_lines,
      },
      strategic_focus: diagnosis.focus,
      strategies: [
        {
          type: 'activation',
          flow_id: activation.flow_id,
          title: activation.title,
          reason: activation.reason,
          theme: activation.theme,
          questions: activation.questions.map((q) => ({ key: q.key, label: q.label, type: q.type })),
          cta_suggestion: activation.cta_suggestion,
        },
        {
          type: 'authority',
          flow_id: authority.flow_id,
          title: authority.title,
          reason: authority.reason,
          theme: authority.theme,
          questions: authority.questions.map((q) => ({ key: q.key, label: q.label, type: q.type })),
          cta_suggestion: authority.cta_suggestion,
        },
      ],
    }

    return NextResponse.json({ success: true, data: response })
  } catch (e) {
    console.error('[ylada/strategy]', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar direção estratégica' },
      { status: 500 }
    )
  }
}
