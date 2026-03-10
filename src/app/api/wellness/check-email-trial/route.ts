import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Verifica se um e-mail já fez trial de Wellness (ativo ou expirado)
 * Usado para mostrar mensagem contextual no login e checkout
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

    // Verificar se tem/houve subscription de trial para wellness
    // Trial: plan_type='trial' OU stripe_subscription_id começa com 'trial_'
    const { data: trialSubs, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('area', 'wellness')
      .or('plan_type.eq.trial,stripe_subscription_id.like.trial_%')
      .limit(1)

    if (subError) {
      console.warn('check-email-trial: Erro ao buscar subscription:', subError.message)
      return NextResponse.json({ hadTrial: false })
    }

    return NextResponse.json({
      hadTrial: (trialSubs?.length ?? 0) > 0,
    })
  } catch (error) {
    console.error('check-email-trial:', error)
    return NextResponse.json({ hadTrial: false })
  }
}
