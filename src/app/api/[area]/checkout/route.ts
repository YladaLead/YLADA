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

    // Determinar métodos de pagamento baseado no país
    // Para Brasil: card (com parcelamento) + link (Pix)
    // Para outros países: apenas card
    const paymentMethodTypes: string[] = ['card']
    
    // Adicionar 'link' (Pix) para Brasil
    if (stripeAccount === 'br' || countryCode === 'BR') {
      paymentMethodTypes.push('link')
    }

    // Configurações de parcelamento para Brasil
    // Para assinaturas, o Stripe não oferece parcelamento tradicional
    // O cliente paga mensalmente (recorrente) ou anualmente (valor único)
    const paymentMethodOptions: any = {}
    
    // Habilitar parcelamento para cartão no Brasil (se for pagamento único)
    // Para assinaturas, isso não se aplica - o cliente paga mensalmente ou anualmente
    if (stripeAccount === 'br' || countryCode === 'BR') {
      paymentMethodOptions.card = {
        installments: {
          enabled: true, // Habilita opção de parcelamento
          // O Stripe mostra automaticamente as opções disponíveis
        }
      }
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      payment_method_options: Object.keys(paymentMethodOptions).length > 0 ? paymentMethodOptions : undefined,
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

