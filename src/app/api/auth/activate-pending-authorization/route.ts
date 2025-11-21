import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Ativar autorização pendente após cadastro
 * Verifica se há autorização pendente para o email do usuário
 * e cria a assinatura automaticamente
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (qualquer perfil pode ativar sua própria autorização)
    const authResult = await requireApiAuth(request, ['wellness', 'nutri', 'coach', 'nutra', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Buscar email do usuário
    const userEmail = user.email?.toLowerCase()
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email do usuário não encontrado' },
        { status: 400 }
      )
    }

    // Buscar autorizações pendentes para este email
    const { data: pendingAuths, error: authError } = await supabaseAdmin
      .from('email_authorizations')
      .select('*')
      .eq('email', userEmail)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (authError) {
      console.error('Erro ao buscar autorizações pendentes:', authError)
      return NextResponse.json(
        { error: 'Erro ao verificar autorizações', details: authError.message },
        { status: 500 }
      )
    }

    if (!pendingAuths || pendingAuths.length === 0) {
      // Nenhuma autorização pendente - tudo bem, usuário pode se cadastrar normalmente
      return NextResponse.json({
        success: true,
        activated: false,
        message: 'Nenhuma autorização pendente encontrada'
      })
    }

    const activatedSubscriptions: any[] = []

    // Para cada autorização pendente, criar assinatura
    for (const auth of pendingAuths) {
      // Verificar se já tem assinatura ativa para esta área
      const { data: existing } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('area', auth.area)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle()

      if (existing) {
        // Já tem assinatura ativa - marcar autorização como ativada mas não criar nova
        await supabaseAdmin
          .from('email_authorizations')
          .update({
            status: 'activated',
            activated_at: new Date().toISOString(),
            activated_user_id: user.id
          })
          .eq('id', auth.id)

        continue
      }

      // Calcular datas
      const now = new Date()
      const periodStart = now.toISOString()
      const periodEnd = new Date(now.getTime() + auth.expires_in_days * 24 * 60 * 60 * 1000).toISOString()

      // Criar assinatura
      const { data: subscription, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: user.id,
          area: auth.area,
          plan_type: 'annual', // Usar 'annual' mesmo sendo gratuito
          stripe_account: 'br',
          stripe_subscription_id: `auth_${user.id}_${auth.area}_${Date.now()}`,
          stripe_customer_id: `auth_${user.id}`,
          stripe_price_id: 'authorized',
          amount: 0, // Gratuito
          currency: 'brl',
          status: 'active',
          current_period_start: periodStart,
          current_period_end: periodEnd,
          cancel_at_period_end: false
        })
        .select()
        .single()

      if (subError) {
        console.error(`Erro ao criar assinatura para área ${auth.area}:`, subError)
        // Continuar com outras áreas mesmo se uma falhar
        continue
      }

      // Marcar autorização como ativada
      await supabaseAdmin
        .from('email_authorizations')
        .update({
          status: 'activated',
          activated_at: new Date().toISOString(),
          activated_user_id: user.id
        })
        .eq('id', auth.id)

      activatedSubscriptions.push({
        area: auth.area,
        expires_in_days: auth.expires_in_days,
        period_end: periodEnd
      })
    }

    return NextResponse.json({
      success: true,
      activated: activatedSubscriptions.length > 0,
      subscriptions: activatedSubscriptions,
      message: activatedSubscriptions.length > 0
        ? `${activatedSubscriptions.length} autorização(ões) ativada(s) com sucesso!`
        : 'Nenhuma autorização foi ativada'
    })
  } catch (error: any) {
    console.error('Erro ao ativar autorização pendente:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao ativar autorização' },
      { status: 500 }
    )
  }
}

