import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * PATCH /api/admin/trials/[id]/fix-duration
 * Ajusta a assinatura de trial para exatamente 3 dias a partir do current_period_start.
 * Só aplica a subscriptions com stripe_subscription_id começando com 'trial_' (ou plan_type = 'trial').
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) return authResult
    if (!authResult.profile?.is_admin) {
      return NextResponse.json({ error: 'Apenas administradores' }, { status: 403 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'ID da assinatura é obrigatório' }, { status: 400 })
    }

    const { data: sub, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, area, current_period_start, current_period_end, stripe_subscription_id, plan_type')
      .eq('id', id)
      .single()

    if (fetchError || !sub) {
      return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 404 })
    }

    const isTrial =
      sub.area === 'wellness' &&
      (sub.plan_type === 'trial' || (sub.stripe_subscription_id && String(sub.stripe_subscription_id).startsWith('trial_')))

    if (!isTrial) {
      return NextResponse.json(
        { error: 'Esta assinatura não é um trial Wellness. Só é possível corrigir trials.' },
        { status: 400 }
      )
    }

    const start = new Date(sub.current_period_start)
    const newEnd = new Date(start)
    newEnd.setDate(newEnd.getDate() + 3)

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        current_period_end: newEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Erro ao corrigir trial:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Trial ajustado para 3 dias.',
      data_fim: newEnd.toISOString(),
    })
  } catch (error: any) {
    console.error('Erro em fix-duration:', error)
    return NextResponse.json({ error: error.message || 'Erro ao corrigir' }, { status: 500 })
  }
}
