import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createCheckout } from '@/lib/payment-gateway'
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
      area,
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

