import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe-subscriptions'
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

    // Buscar sessões de checkout do Stripe por email
    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
      expand: ['data.subscription']
    })

    // Filtrar apenas sessões pagas e com assinatura que correspondem ao email
    const paidSessions = sessions.data.filter(session => 
      session.payment_status === 'paid' && 
      session.subscription &&
      (session.customer_email === email || session.customer_details?.email === email)
    )

    // Se não encontrou nas sessões, buscar nas assinaturas órfãs
    let latestSession = paidSessions[0]
    
    if (!latestSession) {
      // Buscar assinaturas órfãs por email
      const { data: orphanSubscriptions } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id, stripe_subscription_id, customer_email')
        .eq('customer_email', email)
        .is('user_id', null)
        .order('created_at', { ascending: false })
        .limit(1)

      if (orphanSubscriptions && orphanSubscriptions.length > 0) {
        const orphanSub = orphanSubscriptions[0]
        // Buscar sessão correspondente
        const sessionsForCustomer = await stripe.checkout.sessions.list({
          limit: 10,
          expand: ['data.subscription']
        })
        
        latestSession = sessionsForCustomer.data.find(session => 
          session.payment_status === 'paid' && 
          session.subscription === orphanSub.stripe_subscription_id
        )
      }
    }

    if (!latestSession) {
      return NextResponse.json({ 
        error: 'Nenhum pagamento encontrado para este email',
        found: false 
      }, { status: 404 })
    }

    // Verificar se já existe profissional com este email
    const { data: professional } = await supabase
      .from('professionals')
      .select('id, name, subscription_status')
      .eq('email', email)
      .single()

    // Verificar se já existe assinatura ativa
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, status, plan_type')
      .eq('stripe_customer_id', latestSession.customer as string)
      .single()

    return NextResponse.json({
      found: true,
      session_id: latestSession.id,
      email: email,
      payment_status: latestSession.payment_status,
      subscription_status: subscription?.status || 'pending',
      professional_exists: !!professional,
      professional_name: professional?.name,
      can_complete_registration: !professional || !professional.name
    })

  } catch (error) {
    console.error('Erro ao recuperar pagamento:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
