/**
 * POST /api/ylada/referrals/capture — exige sessão (usuário recém-cadastrado/logado).
 * Liga o novo usuário ao indicador a partir do código. Idempotente; ignora auto-indicação.
 * Body: { ref: string, source?: 'diagnostico'|'conteudo', origin_slug?: string }.
 * Flag OFF → no-op { success: true, skipped: true }.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isReferralLoopEnabled } from '@/lib/referrals/referral-loop-flag'
import { isValidReferralCode } from '@/lib/referrals/referral-code'
import { captureReferralSignup } from '@/lib/referrals/referral-capture'
import type { ReferralSource } from '@/lib/referrals/referral-url'

function readSource(value: unknown): ReferralSource {
  return value === 'conteudo' ? 'conteudo' : 'diagnostico'
}

export async function POST(request: NextRequest) {
  if (!isReferralLoopEnabled()) {
    return NextResponse.json({ success: true, skipped: true })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
  }

  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth

  const body = await request.json().catch(() => ({}))
  const ref = typeof body.ref === 'string' ? body.ref.trim() : ''
  if (!isValidReferralCode(ref)) {
    return NextResponse.json({ success: true, skipped: true, reason: 'ref inválido' })
  }

  const originSlug = typeof body.origin_slug === 'string' ? body.origin_slug.trim().slice(0, 200) : null
  const result = await captureReferralSignup(supabaseAdmin, {
    referredUserId: auth.user.id,
    code: ref,
    source: readSource(body.source),
    originSlug,
  })
  return NextResponse.json({ success: true, result })
}
