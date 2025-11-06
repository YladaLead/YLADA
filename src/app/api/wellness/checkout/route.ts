import { NextRequest, NextResponse } from 'next/server'
import { detectCountry, getStripePriceId, getStripeInstance, getCurrency, getLocale } from '@/lib/stripe-helpers'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/wellness/checkout
 * Cria sessão de checkout no Stripe
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { planType } = body // 'monthly' | 'annual'

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo de plano inválido. Use "monthly" ou "annual"' },
        { status: 400 }
      )
    }

    // Detectar país do usuário e escolher conta Stripe
    const stripeAccount = detectCountry(request)
    const countryCode = request.headers.get('x-vercel-ip-country') || 
                        request.headers.get('cf-ipcountry') || 
                        'UNKNOWN'
    
    console.log(`🌍 País detectado: ${countryCode} → Conta Stripe: ${stripeAccount}`)

    // Obter Price ID baseado em área, plano e conta Stripe
    const priceId = getStripePriceId('wellness', planType, stripeAccount)
    console.log(`💰 Price ID: ${priceId}`)

    // Criar instância do Stripe
    const stripe = await getStripeInstance(stripeAccount, process.env.NODE_ENV !== 'production')

    // Obter URL base da aplicação
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                    'http://localhost:3000'

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        area: 'wellness',
        plan_type: planType,
        stripe_account: stripeAccount,
        country_code: countryCode,
      },
      success_url: `${baseUrl}/pt/wellness/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pt/wellness/checkout?canceled=true`,
      locale: getLocale(stripeAccount, countryCode),
      currency: getCurrency(stripeAccount),
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      stripeAccount,
      countryCode,
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}

