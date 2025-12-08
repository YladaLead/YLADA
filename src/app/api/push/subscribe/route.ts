import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/push/subscribe
 * Salva subscription de notificações push do usuário
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'nutri', 'coach', 'nutra', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { subscription, user_id } = body

    // Validar subscription
    if (!subscription || !subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return NextResponse.json(
        { error: 'Subscription inválida. Endpoint e keys são obrigatórios.' },
        { status: 400 }
      )
    }

    // Usar user_id do auth ou do body
    const finalUserId = user_id || user.id

    // Buscar user agent
    const userAgent = request.headers.get('user-agent') || null

    // Salvar ou atualizar subscription
    const { data, error } = await supabaseAdmin
      .from('push_subscriptions')
      .upsert({
        user_id: finalUserId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_agent: userAgent,
        ativo: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,endpoint'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar subscription:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar subscription', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Subscription salva:', data.id)

    return NextResponse.json({
      success: true,
      subscription: data
    })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/push/subscribe:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/push/subscribe
 * Remove subscription de notificações push
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'nutri', 'coach', 'nutra', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { endpoint } = body

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint é obrigatório' },
        { status: 400 }
      )
    }

    // Remover subscription
    const { error } = await supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint)

    if (error) {
      console.error('❌ Erro ao remover subscription:', error)
      return NextResponse.json(
        { error: 'Erro ao remover subscription', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription removida com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro no DELETE /api/push/subscribe:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
