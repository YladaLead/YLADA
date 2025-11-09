import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createCheckout } from '@/lib/payment-gateway'
import { detectCountryCode } from '@/lib/payment-helpers'

/**
 * POST /api/wellness/checkout
 * Cria sessão de checkout unificada (Mercado Pago para BR, Stripe para resto)
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Checkout request recebido')
    
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      console.error('❌ Autenticação falhou:', {
        status: authResult.status,
        statusText: authResult.statusText,
      })
      return authResult
    }
    const { user } = authResult
    console.log('✅ Usuário autenticado:', user.id)

    const body = await request.json()
    const { planType, language } = body // 'monthly' | 'annual', 'pt' | 'en' | 'es'

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo de plano inválido. Use "monthly" ou "annual"' },
        { status: 400 }
      )
    }

    // Detectar país
    const countryCode = detectCountryCode(request)
    console.log(`🌍 País detectado: ${countryCode}`)

    // Criar checkout usando gateway abstraction (detecta automaticamente Mercado Pago ou Stripe)
    const checkout = await createCheckout({
      area: 'wellness',
      planType,
      userId: user.id,
      userEmail: user.email || '',
      countryCode,
      language: language || 'pt',
    }, request)

    console.log(`✅ Checkout criado: ${checkout.gateway} - ${checkout.sessionId}`)

    return NextResponse.json({
      sessionId: checkout.sessionId,
      url: checkout.checkoutUrl,
      gateway: checkout.metadata.gateway,
      countryCode: checkout.metadata.countryCode,
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}

