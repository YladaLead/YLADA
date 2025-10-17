import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    console.log('🔗 Tentando vincular assinatura para:', email)

    // 1. Buscar usuário na professionals
    const { data: user, error: userError } = await supabase
      .from('professionals')
      .select('id, email, subscription_status')
      .eq('email', email)
      .single()

    if (userError || !user) {
      console.error('❌ Usuário não encontrado:', email)
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    console.log('✅ Usuário encontrado:', user.id)

    // 2. Verificar se já tem assinatura ativa
    if (user.subscription_status === 'active') {
      console.log('✅ Usuário já tem assinatura ativa')
      return NextResponse.json({ 
        success: true, 
        message: 'Usuário já tem assinatura ativa',
        subscription_status: 'active'
      })
    }

    // 3. Buscar assinatura órfã pelo email
    const { data: orphanSub, error: subError } = await supabase
      .from('subscriptions')
      .select('id, stripe_customer_id, stripe_subscription_id, status')
      .eq('customer_email', email)
      .is('user_id', null)
      .single()

    if (subError || !orphanSub) {
      console.log('⚠️ Nenhuma assinatura órfã encontrada para:', email)
      
      // Criar assinatura manual para teste
      const { data: newSub, error: createError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          stripe_customer_id: 'cus_manual_' + Date.now(),
          stripe_subscription_id: 'sub_manual_' + Date.now(),
          stripe_price_id: 'price_manual_monthly',
          status: 'active',
          plan_type: 'monthly',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false,
          customer_email: email
        })
        .select('id')
        .single()

      if (createError) {
        console.error('❌ Erro ao criar assinatura manual:', createError)
        return NextResponse.json({ error: 'Erro ao criar assinatura' }, { status: 500 })
      }

      // Atualizar status do profissional
      await supabase
        .from('professionals')
        .update({ 
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      console.log('✅ Assinatura manual criada e vinculada')
      return NextResponse.json({ 
        success: true, 
        message: 'Assinatura criada e vinculada com sucesso',
        subscription_status: 'active'
      })
    }

    // 4. Vincular assinatura órfã ao usuário
    const { error: linkError } = await supabase
      .from('subscriptions')
      .update({ user_id: user.id })
      .eq('id', orphanSub.id)

    if (linkError) {
      console.error('❌ Erro ao vincular assinatura:', linkError)
      return NextResponse.json({ error: 'Erro ao vincular assinatura' }, { status: 500 })
    }

    // 5. Atualizar status do profissional
    const { error: updateError } = await supabase
      .from('professionals')
      .update({ 
        subscription_status: 'active',
        stripe_customer_id: orphanSub.stripe_customer_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Erro ao atualizar status do profissional:', updateError)
      return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 })
    }

    console.log('✅ Assinatura órfã vinculada com sucesso')
    return NextResponse.json({ 
      success: true, 
      message: 'Assinatura vinculada com sucesso',
      subscription_status: 'active'
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
