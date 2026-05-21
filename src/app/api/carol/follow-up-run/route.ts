import { NextRequest, NextResponse } from 'next/server'
import {
  runFollowUpBatch,
  getFollowUpCandidates,
  DEFAULT_FOLLOW_UP_CONFIG,
  normalizeFollowUpConfig,
  META_MARKETING_WINDOW_MINUTES,
  FOLLOWUP_MAX_AFTER_MINUTES,
  type FollowUpConfig,
} from '@/lib/carol/follow-up'

function checkSecret(request: NextRequest): boolean {
  const secret = process.env.YLADA_OUTBOUND_SYNC_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  return auth.slice(7) === secret
}

function configFromEnv(overrides?: Partial<FollowUpConfig>): FollowUpConfig {
  return normalizeFollowUpConfig({
    ...DEFAULT_FOLLOW_UP_CONFIG,
    enabled: process.env.CAROL_FOLLOWUP_ENABLED !== 'false',
    afterMinutes: Number(process.env.CAROL_FOLLOWUP_AFTER_MINUTES) || 60,
    firstTemplate:
      process.env.CAROL_FOLLOWUP_FIRST_TEMPLATE || DEFAULT_FOLLOW_UP_CONFIG.firstTemplate,
    followUpTemplate:
      process.env.CAROL_FOLLOWUP_SECOND_TEMPLATE ||
      DEFAULT_FOLLOW_UP_CONFIG.followUpTemplate,
    maxPerRun: Number(process.env.CAROL_FOLLOWUP_MAX_PER_RUN) || 10,
    ...overrides,
  })
}

/** Lista candidatos ou dispara follow-up (template 2) para quem não respondeu */
export async function POST(request: NextRequest) {
  if (!process.env.YLADA_OUTBOUND_SYNC_SECRET) {
    return NextResponse.json({ error: 'YLADA_OUTBOUND_SYNC_SECRET não configurado' }, { status: 503 })
  }
  if (!checkSecret(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: { dryRun?: boolean; config?: Partial<FollowUpConfig> } = {}
  try {
    body = await request.json().catch(() => ({}))
  } catch {
    body = {}
  }

  const config = configFromEnv(body.config)

  try {
    if (body.dryRun) {
      const candidates = await getFollowUpCandidates(config)
      return NextResponse.json({
        dryRun: true,
        config,
        meta_window_hours: META_MARKETING_WINDOW_MINUTES / 60,
        max_after_minutes: FOLLOWUP_MAX_AFTER_MINUTES,
        candidates: candidates.length,
        preview: candidates.slice(0, 20),
      })
    }

    const result = await runFollowUpBatch(config)
    return NextResponse.json({ success: true, config, ...result })
  } catch (error) {
    console.error('[follow-up-run] Erro:', error)
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!checkSecret(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const config = configFromEnv()
  const candidates = await getFollowUpCandidates(config)
  return NextResponse.json({ config, candidates: candidates.length, preview: candidates.slice(0, 30) })
}
