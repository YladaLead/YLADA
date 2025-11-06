import { NextRequest, NextResponse } from 'next/server'
import { detectCountry, getStripePriceId, getStripeInstance, getCurrency, getLocale } from '@/lib/stripe-helpers'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/[area]/checkout
 * Cria sessão de checkout no Stripe para qualquer área
 * 
 * Áreas suportadas: wellness, nutri, coach, nutra
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { area: string } }
) {
  try {
    const area = params.area as 'wellness' | 'nutri' | 'coach' | 'nutra'
    
    // Validar área
    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    // Verificar autenticação
    const authResult = await requireApiAuth(request, [area, 'admin'])
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

    // Obter Price ID baseado em área, plano, conta Stripe e país específico
    const priceId = getStripePriceId(area, planType, stripeAccount, countryCode)
    console.log(`💰 Price ID para ${area} ${planType} ${stripeAccount} (${countryCode}): ${priceId}`)

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
        area: area,
        plan_type: planType,
        stripe_account: stripeAccount,
        country_code: countryCode,
      },
      success_url: `${baseUrl}/pt/${area}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pt/${area}/checkout?canceled=true`,
      locale: getLocale(stripeAccount, countryCode),
      currency: getCurrency(stripeAccount),
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      stripeAccount,
      countryCode,
      area,
    })
  } catch (error: any) {
    console.error(`❌ Erro ao criar checkout para ${params.area}:`, error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}

