import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import {
  emailIsMatrixDemoVideoAccount,
  getActiveSubscriptionForYladaConfig,
  subscriptionRowIsMatrixSegmentCommercialUnlimited,
} from '@/lib/subscription-helpers'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/ylada/subscription
 * Detalhes da assinatura YLADA + estatísticas (diagnósticos, leads) para o bloco Assinatura.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const { data: profileEmailRow } = await supabaseAdmin
      .from('user_profiles')
      .select('email')
      .eq('user_id', user.id)
      .maybeSingle()

    const isDemoMatrixEmail = emailIsMatrixDemoVideoAccount(profileEmailRow?.email as string | undefined)

    let subscription = await getActiveSubscriptionForYladaConfig(user.id)
    let demoMatrixAccount = false

    if (
      isDemoMatrixEmail &&
      (!subscription || !subscriptionRowIsMatrixSegmentCommercialUnlimited(subscription))
    ) {
      demoMatrixAccount = true
      const periodEnd = new Date()
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
      subscription = {
        id: user.id,
        plan_type: 'trial',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
        stripe_subscription_id: 'demo_matrix_email',
        area: null,
      } as NonNullable<Awaited<ReturnType<typeof getActiveSubscriptionForYladaConfig>>>
    }

    let stats: { links_count: number; respostas_total: number; leads_capturados: number } = {
      links_count: 0,
      respostas_total: 0,
      leads_capturados: 0,
    }

    const { count: linksCount } = await supabaseAdmin
      .from('ylada_links')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
    stats.links_count = linksCount ?? 0

    if (stats.links_count > 0) {
      const { data: linkIds } = await supabaseAdmin
        .from('ylada_links')
        .select('id')
        .eq('user_id', user.id)
      const ids = (linkIds ?? []).map((l) => l.id)
      if (ids.length > 0) {
        const { count: respostas } = await supabaseAdmin
          .from('ylada_diagnosis_metrics')
          .select('*', { count: 'exact', head: true })
          .in('link_id', ids)
        const { count: leads } = await supabaseAdmin
          .from('ylada_diagnosis_metrics')
          .select('*', { count: 'exact', head: true })
          .in('link_id', ids)
          .eq('clicked_whatsapp', true)
        stats.respostas_total = respostas ?? 0
        stats.leads_capturados = leads ?? 0
      }
    }

    const { data: noelProfile } = await supabaseAdmin
      .from('ylada_noel_profile')
      .select('area_specific, profile_type, profession')
      .eq('user_id', user.id)
      .eq('segment', 'ylada')
      .maybeSingle()

    const nome = (noelProfile?.area_specific as { nome?: string } | null)?.nome ?? ''
    const whatsapp = (noelProfile?.area_specific as { whatsapp?: string } | null)?.whatsapp ?? ''
    const whatsappDigits = whatsapp.replace(/\D/g, '').length
    const profileOk = nome.length >= 2 && whatsappDigits >= 10 && !!noelProfile?.profile_type && !!noelProfile?.profession
    const whatsappOk = whatsappDigits >= 10

    const progress = {
      profile_ok: profileOk,
      whatsapp_ok: whatsappOk,
      first_link_ok: stats.links_count >= 1,
      shared_ok: stats.respostas_total >= 1,
      first_lead_ok: stats.leads_capturados >= 1,
    }
    const stepsTotal = 5
    const stepsDone = [progress.profile_ok, progress.whatsapp_ok, progress.first_link_ok, progress.shared_ok, progress.first_lead_ok].filter(Boolean).length

    if (!subscription) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null,
        demo_matrix_account: demoMatrixAccount,
        stats,
        progress: { ...progress, steps_done: stepsDone, steps_total: stepsTotal },
      })
    }

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription,
      demo_matrix_account: demoMatrixAccount,
      stats,
      progress: { ...progress, steps_done: stepsDone, steps_total: stepsTotal },
    })
  } catch (error: any) {
    console.error('[/api/ylada/subscription]', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar assinatura' },
      { status: 500 }
    )
  }
}
