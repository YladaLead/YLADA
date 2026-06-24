/**
 * POST /api/ylada/referrals/landing — público, anônimo.
 * Registra que alguém abriu a página /criar com um ?ref (topo do funil do loop).
 * Body: { ref?: string, source?: 'diagnostico'|'conteudo' }.
 * Flag OFF → no-op { success: true, skipped: true }.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isReferralLoopEnabled } from '@/lib/referrals/referral-loop-flag'
import { isValidReferralCode } from '@/lib/referrals/referral-code'
import { recordReferralEvent } from '@/lib/referrals/referral-events'

export async function POST(request: NextRequest) {
  if (!isReferralLoopEnabled()) {
    return NextResponse.json({ success: true, skipped: true })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const ref = typeof body.ref === 'string' ? body.ref.trim() : ''
  const source = body.source === 'conteudo' ? 'conteudo' : 'diagnostico'

  await recordReferralEvent(supabaseAdmin, {
    eventType: 'referral_landing_view',
    userId: null,
    payload: { code: isValidReferralCode(ref) ? ref : null, source },
  })
  return NextResponse.json({ success: true })
}
