import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createCheckout, WELLNESS_ANNUAL_CHECKOUT_DISABLED_MESSAGE } from '@/lib/payment-gateway'
import { detectCountryCode } from '@/lib/payment-helpers'

/**
 * POST /api/[area]/checkout
 * Cria sessão de checkout unificada (Mercado Pago para BR, Stripe para resto)
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
    const { planType, productType, language, paymentMethod, countryCode: bodyCountryCode } = body
    // countryCode: opcional; evita bloqueio quando geo retorna US (VPN/proxy)
    // productType: 'platform_monthly' | 'platform_annual' | 'formation_only' (apenas para área Nutri)
    // language: 'pt' | 'en' | 'es'
    // paymentMethod: 'auto' | 'pix'

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo de plano inválido. Use "monthly" ou "annual"' },
        { status: 400 }
      )
    }

    if (area === 'wellness' && planType === 'annual') {
      return NextResponse.json({ error: WELLNESS_ANNUAL_CHECKOUT_DISABLED_MESSAGE }, { status: 400 })
    }

    // Validar productType apenas para área Nutri
    if (area === 'nutri' && productType && !['platform_monthly', 'platform_monthly_12x', 'platform_annual', 'formation_only'].includes(productType)) {
      return NextResponse.json(
        { error: 'Tipo de produto inválido. Use "platform_monthly", "platform_monthly_12x", "platform_annual" ou "formation_only"' },
        { status: 400 }
      )
    }

    // País: prioridade ao enviado pelo cliente; senão detecção por headers + Accept-Language
    const countryCode = (bodyCountryCode && typeof bodyCountryCode === 'string' && bodyCountryCode.length === 2)
      ? bodyCountryCode.toUpperCase()
      : detectCountryCode(request)
    console.log(`🌍 País: ${countryCode}${bodyCountryCode ? ' (enviado pelo cliente)' : ' (detectado)'}`)

    // Criar checkout usando gateway abstraction (detecta automaticamente Mercado Pago ou Stripe)
    const checkout = await createCheckout({
      area,
      planType,
      productType: area === 'nutri' ? productType : undefined, // Apenas para área Nutri
      userId: user.id,
      userEmail: user.email || '',
      countryCode,
      language: language || 'pt',
      paymentMethod: paymentMethod, // 'auto' ou 'pix' para plano mensal
    }, request)

    console.log(`✅ Checkout criado: ${checkout.gateway} - ${checkout.sessionId}`)

    return NextResponse.json({
      sessionId: checkout.sessionId,
      url: checkout.checkoutUrl,
      gateway: checkout.metadata.gateway,
      countryCode: checkout.metadata.countryCode,
      area: checkout.metadata.area,
    })
  } catch (error: any) {
    console.error(`❌ Erro ao criar checkout para ${params.area}:`, error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}

