/**
 * GET — destino para conta Wellness/Coach Bem-estar com vínculo Pro Líderes (evita onboarding /pt).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { resolveProLideresRedirectForWellnessAccount } from '@/lib/pro-lideres-server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('perfil, nome_completo, whatsapp')
    .eq('user_id', user.id)
    .maybeSingle()

  const perfil = typeof profile?.perfil === 'string' ? profile.perfil : ''
  if (perfil !== 'wellness' && perfil !== 'coach-bem-estar') {
    return NextResponse.json({ redirectTo: null })
  }

  const plRedirect = await resolveProLideresRedirectForWellnessAccount(user.id)
  if (plRedirect) {
    return NextResponse.json({ redirectTo: plRedirect })
  }

  const nomeOk = profile?.nome_completo && String(profile.nome_completo).trim().length >= 2
  const waDigits = profile?.whatsapp ? String(profile.whatsapp).replace(/\D/g, '') : ''
  const waOk = waDigits.length >= 10
  if (nomeOk && waOk) {
    return NextResponse.json({
      redirectTo: perfil === 'coach-bem-estar' ? '/pt/coach-bem-estar/home' : '/pt/wellness/home',
    })
  }

  return NextResponse.json({ redirectTo: null })
}
