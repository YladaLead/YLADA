import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Indica se vale mostrar CTA de assinatura no login: já existiu trial na área wellness **e** não há
 * assinatura ativa (trial/mensal/anual) — Coach de bem-estar compartilha `subscriptions.area = wellness`.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail.includes('@')) {
      return NextResponse.json({ hadTrial: false })
    }

    // Buscar user_id pelo email em user_profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .ilike('email', normalizedEmail)
      .limit(1)

    if (profileError || !profiles?.[0]?.user_id) {
      return NextResponse.json({ hadTrial: false })
    }

    const userId = profiles[0].user_id

    // Trial “de verdade” na stack wellness (Herbalife + Coach de bem-estar compartilham area=wellness)
    const { data: wellnessSubs, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_type, status, current_period_end, stripe_subscription_id')
      .eq('user_id', userId)
      .eq('area', 'wellness')

    if (subError) {
      console.warn('check-email-trial: Erro ao buscar subscription:', subError.message)
      return NextResponse.json({ hadTrial: false })
    }

    const rows = wellnessSubs ?? []

    const isTrialLike = (r: {
      plan_type?: string | null
      stripe_subscription_id?: string | null
    }) =>
      String(r.plan_type || '').toLowerCase() === 'trial' ||
      String(r.stripe_subscription_id || '').toLowerCase().includes('trial')

    const now = Date.now()

    const hadWellnessTrialEver = rows.some(isTrialLike)

    /** Acesso atual à stack wellness (Herbalife + Coach de bem-estar): não pedir “assinar” se ainda está coberto. */
    const hasActiveWellnessAccess = rows.some((r) => {
      if (String(r.status || '').toLowerCase() !== 'active') return false
      if (!r.current_period_end) return false
      if (new Date(r.current_period_end).getTime() <= now) return false
      const pt = String(r.plan_type || '').toLowerCase()
      return pt === 'trial' || pt === 'monthly' || pt === 'annual'
    })

    return NextResponse.json({
      hadTrial: hadWellnessTrialEver && !hasActiveWellnessAccess,
    })
  } catch (error) {
    console.error('check-email-trial:', error)
    return NextResponse.json({ hadTrial: false })
  }
}
