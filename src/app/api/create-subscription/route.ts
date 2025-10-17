import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripePlans } from '../../../../lib/stripe-subscriptions'

export async function POST(request: NextRequest) {
  try {
    const { planType, email } = await request.json()
    
    console.log('Creating subscription for plan:', planType, 'email:', email)
    
    // Get plan configuration
    const plan = stripePlans[planType as keyof typeof stripePlans]
    if (!plan) {
      console.error('Invalid plan type:', planType)
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }
    
    console.log('Using plan:', plan)

    // Always create a new price for test mode
    let priceId = plan.priceId
    if (plan.priceId.startsWith('price_test_') || process.env.STRIPE_SECRET_KEY_TEST) {
      try {
        // Create product first if it doesn't exist
        const product = await stripe.products.create({
          name: plan.name,
          description: `Teste - ${plan.name}`,
        })
        
        // Create price
        const price = await stripe.prices.create({
          unit_amount: plan.unit_amount,
          currency: plan.currency,
          recurring: { interval: plan.interval as 'month' | 'year' },
          product: product.id,
        })
        
        priceId = price.id
        console.log('Created test price:', priceId)
      } catch (error) {
        console.error('Error creating test price:', error)
        return NextResponse.json({ error: 'Erro ao criar preço de teste' }, { status: 500 })
      }
    }

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://herbalead.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://herbalead.com'}/payment`,
      customer_email: email,
    })
    
    console.log('Stripe session created:', session.id)
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Error creating Stripe subscription:', error)
    return NextResponse.json({ 
      error: 'Erro ao criar assinatura',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
