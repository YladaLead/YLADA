import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscriptionForYladaConfig } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'

/**
 * POST /api/ylada/subscription/cancel
 * Cancela a assinatura YLADA do usuário (status = canceled).
 * Acesso até o fim do período já pago; não renova no próximo ciclo.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const subscription = await getActiveSubscriptionForYladaConfig(user.id)

    if (!subscription) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura ativa encontrada' },
        { status: 404 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('[/api/ylada/subscription/cancel]', updateError)
      return NextResponse.json(
        { error: 'Erro ao cancelar assinatura' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Assinatura cancelada. Você continua com acesso até o fim do período atual.',
      canceled: true,
    })
  } catch (error: any) {
    console.error('[/api/ylada/subscription/cancel]', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar cancelamento' },
      { status: 500 }
    )
  }
}
