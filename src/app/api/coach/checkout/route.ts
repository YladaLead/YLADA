import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createCheckout } from '@/lib/payment-gateway'
import { detectCountryCode } from '@/lib/payment-helpers'

/**
 * POST /api/coach/checkout
 * Cria sessão de checkout unificada (Mercado Pago para BR, Stripe para resto)
 * Aceita checkout sem autenticação (apenas e-mail)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    console.log('📥 Checkout Coach request recebido')

    const body = await request.json()
    console.log('📋 Body recebido:', { planType: body.planType, hasEmail: !!body.email })

    const { planType, language, paymentMethod, email, countryCode: bodyCountryCode } = body

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo de plano inválido. Use "monthly" ou "annual"' },
        { status: 400 }
      )
    }

    let userEmail: string
    let userId: string | null = null

    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      console.log('ℹ️ Checkout Coach sem autenticação - usando e-mail fornecido')

      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { error: 'E-mail é obrigatório para realizar o pagamento.' },
          { status: 400 }
        )
      }

      userEmail = email
      console.log('📧 E-mail fornecido:', userEmail)
    } else {
      const { user } = authResult
      userId = user.id
      userEmail = user.email || email || ''

      if (!userEmail || !userEmail.includes('@')) {
        return NextResponse.json(
          { error: 'Email do usuário é obrigatório para realizar o pagamento. Verifique seu perfil.' },
          { status: 400 }
        )
      }
      console.log('✅ Usuário autenticado:', userId)
    }

    const countryCode = (bodyCountryCode && typeof bodyCountryCode === 'string' && bodyCountryCode.length === 2)
      ? bodyCountryCode.toUpperCase()
      : detectCountryCode(request)
    console.log(`🌍 País: ${countryCode}${bodyCountryCode ? ' (enviado pelo cliente)' : ' (detectado)'}`)

    console.log('📋 Dados do checkout:', {
      area: 'coach',
      planType,
      userId: userId || 'null (será criado após pagamento)',
      userEmail,
      countryCode,
      language: language || 'pt',
    })

    const checkoutStartTime = Date.now()
    const checkout = await createCheckout({
      area: 'coach',
      planType,
      userId: userId || `temp_${userEmail}`,
      userEmail,
      countryCode,
      language: language || 'pt',
      paymentMethod: paymentMethod,
    }, request)

    const checkoutDuration = Date.now() - checkoutStartTime
    console.log(`✅ Checkout Coach criado em ${checkoutDuration}ms: ${checkout.gateway} - ${checkout.sessionId}`)

    return NextResponse.json({
      sessionId: checkout.sessionId,
      url: checkout.checkoutUrl,
      gateway: checkout.metadata.gateway,
      countryCode: checkout.metadata.countryCode,
      area: checkout.metadata.area,
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar checkout Coach:', error)
    return NextResponse.json(
      {
        error: error.message || 'Erro ao criar sessão de checkout',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
