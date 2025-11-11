import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createCheckout } from '@/lib/payment-gateway'
import { detectCountryCode } from '@/lib/payment-helpers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/wellness/checkout
 * Cria sessão de checkout unificada (Mercado Pago para BR, Stripe para resto)
 * AGORA ACEITA CHECKOUT SEM AUTENTICAÇÃO (apenas e-mail)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    console.log('📥 Checkout request recebido')
    
    const body = await request.json()
    console.log('📋 Body recebido:', { planType: body.planType, hasEmail: !!body.email })
    
    const { planType, language, paymentMethod, email } = body // 'monthly' | 'annual', 'pt' | 'en' | 'es', 'auto' | 'pix', email

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo de plano inválido. Use "monthly" ou "annual"' },
        { status: 400 }
      )
    }

    // NOVO: Aceitar checkout sem autenticação (apenas e-mail)
    // Tentar autenticação opcional - se não tiver, usar e-mail fornecido
    let userEmail: string
    let userId: string | null = null
    
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
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

    // Detectar país
    const countryCode = detectCountryCode(request)
    console.log(`🌍 País detectado: ${countryCode}`)

    console.log('📋 Dados do checkout:', {
      area: 'wellness',
      planType,
      userId: userId || 'null (será criado após pagamento)',
      userEmail,
      countryCode,
      language: language || 'pt',
    })

    // Criar checkout usando gateway abstraction (detecta automaticamente Mercado Pago ou Stripe)
    // Se userId for null, usar e-mail como identificador temporário
    console.log('🔄 Iniciando criação de checkout...', {
      area: 'wellness',
      planType,
      userId: userId || `temp_${userEmail}`,
      userEmail,
      countryCode,
    })
    
    const checkoutStartTime = Date.now()
    const checkout = await createCheckout({
      area: 'wellness',
      planType,
      userId: userId || `temp_${userEmail}`, // ID temporário baseado em e-mail
      userEmail,
      countryCode,
      language: language || 'pt',
      paymentMethod: paymentMethod, // 'auto' ou 'pix' para plano mensal
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
    })
  } catch (error: any) {
    const totalDuration = Date.now() - startTime
    console.error('❌ Erro ao criar checkout:', {
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

