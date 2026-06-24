/**
 * GET /api/ylada/referrals/code?slug=<slug>&pl_m=<token> — público.
 * Devolve o código de indicação do dono do link (ou do membro Pró-Líderes, se pl_m).
 * Usado pelo selo "Powered by Ylada" pra montar o ?ref sem expor UUID interno.
 * Flag OFF → { code: null } (selo cai no destino antigo).
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isReferralLoopEnabled } from '@/lib/referrals/referral-loop-flag'
import { resolveReferralCodeForLink } from '@/lib/referrals/referral-attribution'

export async function GET(request: NextRequest) {
  if (!isReferralLoopEnabled()) {
    return NextResponse.json({ code: null })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ code: null }, { status: 503 })
  }

  const slug = request.nextUrl.searchParams.get('slug')?.trim() ?? ''
  const plToken = request.nextUrl.searchParams.get('pl_m')?.trim() || null
  if (!slug) {
    return NextResponse.json({ code: null, error: 'slug ausente' }, { status: 400 })
  }

  try {
    const code = await resolveReferralCodeForLink(supabaseAdmin, { slug, plToken })
    return NextResponse.json({ code })
  } catch (e) {
    console.error('[referrals/code]', e)
    return NextResponse.json({ code: null }, { status: 500 })
  }
}
