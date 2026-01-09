import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscription } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/nutri/subscription/extend-trial
 * Estende trial por X dias
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { subscriptionId, days = 7 } = body

    // Buscar assinatura
    let subData: any
    
    if (subscriptionId) {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .eq('user_id', user.id)
        .single()
      
      if (error || !data) {
        return NextResponse.json(
          { error: 'Nenhuma assinatura encontrada' },
          { status: 404 }
        )
      }
      subData = data
    } else {
      const subscription = await getActiveSubscription(user.id, 'nutri')
      if (!subscription) {
        return NextResponse.json(
          { error: 'Nenhuma assinatura ativa encontrada' },
          { status: 404 }
        )
      }
      subData = subscription
    }

    // Calcular nova data de expiração
    const currentExpiry = new Date(subData.current_period_end || subData.created_at)
    const newExpiry = new Date(currentExpiry)
    newExpiry.setDate(newExpiry.getDate() + days)

    // Atualizar subscription
    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        current_period_end: newExpiry.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', subData.id)

    if (updateError) {
      console.error('❌ Erro ao estender trial:', updateError)
      return NextResponse.json(
        { error: 'Erro ao estender trial' },
        { status: 500 }
      )
    }

    // Criar registro de extensão
    await supabaseAdmin
      .from('trial_extensions')
      .insert({
        user_id: user.id,
        subscription_id: subData.id,
        extension_days: days,
        original_expiry_date: currentExpiry.toISOString(),
        new_expiry_date: newExpiry.toISOString(),
        status: 'active'
      })

    return NextResponse.json({
      success: true,
      newExpiryDate: newExpiry.toISOString(),
      message: `Trial estendido por ${days} dias!`
    })
  } catch (error: any) {
    console.error('❌ Erro ao estender trial:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao estender trial' },
      { status: 500 }
    )
  }
}

