import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription } from '@/lib/subscription-helpers'

export type PromoBemEstarCheckResponse = {
  accountFound: boolean
  hasActiveWellnessSubscription: boolean
  /** Só `true` quando dá para oferecer wellness → coach-bem-estar (mesma assinatura). */
  canOfferProfileConversion: boolean
  /** `wellness`, `coach-bem-estar`, etc., quando conta existe. */
  currentPerfil: string | null
}

/**
 * POST /api/promo/bem-estar/check
 * Verifica se o e-mail já tem assinatura wellness ativa (landing do convite).
 * Não exige autenticação — uso consciente de enumeração em página promocional.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const raw = typeof body.email === 'string' ? body.email.trim() : ''
    const email = raw.toLowerCase()
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    const { data: rows, error } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, perfil')
      .ilike('email', email)
      .limit(1)

    if (error) {
      console.error('[promo/bem-estar/check]', error)
      return NextResponse.json({ error: 'Não foi possível verificar o e-mail.' }, { status: 500 })
    }

    const profile = rows?.[0]
    if (!profile) {
      const payload: PromoBemEstarCheckResponse = {
        accountFound: false,
        hasActiveWellnessSubscription: false,
        canOfferProfileConversion: false,
        currentPerfil: null,
      }
      return NextResponse.json(payload)
    }

    const hasWell = await hasActiveSubscription(profile.user_id, 'wellness')
    const canOffer = hasWell && profile.perfil === 'wellness'

    const payload: PromoBemEstarCheckResponse = {
      accountFound: true,
      hasActiveWellnessSubscription: hasWell,
      canOfferProfileConversion: canOffer,
      currentPerfil: profile.perfil ?? null,
    }
    return NextResponse.json(payload)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erro ao verificar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
