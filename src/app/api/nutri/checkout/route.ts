import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createCheckout } from '@/lib/payment-gateway'
import { detectCountryCode } from '@/lib/payment-helpers'

/**
 * POST /api/nutri/checkout
 * Cria sessão de checkout unificada (Mercado Pago para BR, Stripe para resto)
 * AGORA ACEITA CHECKOUT SEM AUTENTICAÇÃO (apenas e-mail)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    console.log('📥 Checkout Nutri request recebido')
    
    const body = await request.json()
    console.log('📋 Body recebido:', { 
      planType: body.planType, 
      productType: body.productType,
      hasEmail: !!body.email 
    })
    
    const { planType, productType, language, paymentMethod, email, refVendedor, countryCode: bodyCountryCode } = body
    // Área Nutri: plano mensal R$ 300 ou anual 12× de R$ 150 (R$ 1.800)
    // countryCode: opcional; se enviado pelo cliente (ex: BR), evita erro de geo incorreto (IP US)
    // planType: 'monthly' | 'annual'
    // productType: 'platform_monthly' | 'platform_annual' | etc.
    // language: 'pt' | 'en' | 'es'
    // paymentMethod: 'auto' | 'pix'
    // email: string (obrigatório se não autenticado)

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Plano inválido. Escolha mensal ou anual.' },
        { status: 400 }
      )
    }

    // Validar productType (opcional, mas se fornecido deve ser válido)
    if (productType && !['platform_monthly', 'platform_monthly_12x', 'platform_annual', 'formation_only'].includes(productType)) {
      return NextResponse.json(
        { error: 'Tipo de produto inválido. Use "platform_monthly", "platform_monthly_12x", "platform_annual" ou "formation_only"' },
        { status: 400 }
      )
    }

    // NOVO: Aceitar checkout sem autenticação (apenas e-mail)
    // Tentar autenticação opcional - se não tiver, usar e-mail fornecido
    let userEmail: string
    let userId: string | null = null
    
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      // Não autenticado - usar e-mail fornecido
      console.log('ℹ️ Checkout sem autenticação - usando e-mail fornecido')
      
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { error: 'E-mail é obrigatório para realizar o pagamento.' },
          { status: 400 }
        )
      }
      
      userEmail = email
      // userId será null - será criado no webhook após pagamento
      console.log('📧 E-mail fornecido:', userEmail)
    } else {
      // Autenticado - usar dados do usuário
      const { user } = authResult
      userId = user.id
      userEmail = user.email || email || ''
      
      if (!userEmail || !userEmail.includes('@')) {
        console.error('❌ Email do usuário inválido:', userEmail)
        return NextResponse.json(
          { error: 'Email do usuário é obrigatório para realizar o pagamento. Verifique seu perfil.' },
          { status: 400 }
        )
      }
      
      console.log('✅ Usuário autenticado:', userId)
    }

    // País: prioridade ao enviado pelo cliente (ex: BR no checkout pt); senão detecção por headers + Accept-Language
    const countryCode = (bodyCountryCode && typeof bodyCountryCode === 'string' && bodyCountryCode.length === 2)
      ? bodyCountryCode.toUpperCase()
      : detectCountryCode(request)
    console.log(`🌍 País: ${countryCode}${bodyCountryCode ? ' (enviado pelo cliente)' : ' (detectado)'}`)

    // Determinar productType se não fornecido
    const finalProductType = productType || (planType === 'annual' ? 'platform_annual' : 'platform_monthly')

    console.log('📋 Dados do checkout:', {
      area: 'nutri',
      planType,
      productType: finalProductType,
      userId: userId || 'null (será criado após pagamento)',
      userEmail,
      countryCode,
      language: language || 'pt',
    })

    // Criar checkout usando gateway abstraction (detecta automaticamente Mercado Pago ou Stripe)
    // Se userId for null, usar e-mail como identificador temporário
    console.log('🔄 Iniciando criação de checkout...', {
      area: 'nutri',
      planType,
      productType: finalProductType,
      userId: userId || `temp_${userEmail}`,
      userEmail,
      countryCode,
    })
    
    const checkoutStartTime = Date.now()
    const checkout = await createCheckout({
      area: 'nutri',
      planType,
      productType: finalProductType, // Apenas para área Nutri
      userId: userId || `temp_${userEmail}`, // ID temporário baseado em e-mail
      userEmail,
      countryCode,
      language: language || 'pt',
      paymentMethod: paymentMethod, // 'auto' ou 'pix' para plano mensal
      refVendedor: refVendedor && String(refVendedor).trim() ? String(refVendedor).trim() : undefined,
    }, request)

    const checkoutDuration = Date.now() - checkoutStartTime
    console.log(`✅ Checkout criado em ${checkoutDuration}ms: ${checkout.gateway} - ${checkout.sessionId}`)

    const totalDuration = Date.now() - startTime
    console.log(`⏱️ Tempo total do request: ${totalDuration}ms`)

    return NextResponse.json({
      sessionId: checkout.sessionId,
      url: checkout.checkoutUrl,
      gateway: checkout.metadata.gateway,
      countryCode: checkout.metadata.countryCode,
      area: checkout.metadata.area,
    })
  } catch (error: any) {
    const totalDuration = Date.now() - startTime
    console.error('❌ Erro ao criar checkout Nutri:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      duration: `${totalDuration}ms`,
    })
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao criar sessão de checkout',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}









