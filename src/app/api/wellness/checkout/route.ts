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
                        'BR' // ✅ Padrão: Brasil (já que estamos testando localhost)
    
    console.log(`🌍 País detectado: ${countryCode} → Conta Stripe: ${stripeAccount}`)

    // Obter Price ID baseado em área, plano e conta Stripe
    const priceId = getStripePriceId('wellness', planType, stripeAccount)
    console.log(`💰 Price ID: ${priceId}`)

    // Criar instância do Stripe
    const isTest = process.env.NODE_ENV !== 'production'
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV || 'undefined'}, isTest: ${isTest}, stripeAccount: ${stripeAccount}`)
    
    // Debug: verificar se as variáveis estão disponíveis
    const testPrefix = isTest ? 'TEST' : 'LIVE'
    const secretKeyVar = `STRIPE_SECRET_KEY_${stripeAccount.toUpperCase()}_${testPrefix}`
    const secretKeyFallback = `STRIPE_SECRET_KEY_${stripeAccount.toUpperCase()}`
    console.log(`🔍 Buscando: ${secretKeyVar} ou ${secretKeyFallback}`)
    console.log(`🔍 Valor encontrado: ${process.env[secretKeyVar] ? 'SIM (' + process.env[secretKeyVar].substring(0, 20) + '...)' : 'NÃO'} ou ${process.env[secretKeyFallback] ? 'SIM (fallback)' : 'NÃO'}`)
    
    const stripe = await getStripeInstance(stripeAccount, isTest)

    // Obter URL base da aplicação
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                    'http://localhost:3000'

    // Determinar modo de checkout baseado no tipo de plano
    // Plano anual no Brasil = pagamento único (permite parcelamento)
    // Plano mensal = assinatura (recorrente)
    const isAnnualPlan = planType === 'annual'
    const isBrazil = stripeAccount === 'br' || countryCode === 'BR'
    const usePaymentMode = isAnnualPlan && isBrazil // Anual no Brasil = pagamento único parcelado

    console.log(`📊 Configuração do checkout:`)
    console.log(`   - Plano: ${planType} (anual: ${isAnnualPlan})`)
    console.log(`   - País: ${countryCode} (Brasil: ${isBrazil})`)
    console.log(`   - Modo: ${usePaymentMode ? 'payment (único)' : 'subscription (recorrente)'}`)

    // Determinar métodos de pagamento baseado no país
    // Para Brasil: card (com parcelamento) + pix (se habilitado)
    // Para outros países: apenas card
    const paymentMethodTypes: string[] = ['card']
    
    // ✅ Pix agora suportado na API 2025-04-30.basil
    // Adicionar Pix para Brasil - apenas para pagamento único (plano anual)
    // ⚠️ IMPORTANTE: Pix NÃO está disponível no modo de teste (test mode)
    // Pix só funciona em produção (live mode)
    // Fonte: Suporte Stripe - "O método de pagamento Pix não está disponível no ambiente de testes"
    // Nota: Na nova API, pode ser 'pix' ou 'link' - o Stripe escolhe automaticamente
    if (isBrazil && usePaymentMode && !isTest) {
      // Usar 'link' que inclui Pix automaticamente no Brasil
      // Apenas em produção (não em modo de teste)
      paymentMethodTypes.push('link') // Link inclui Pix no Brasil
      console.log(`   ✅ Pix habilitado (link) - Modo produção`)
    } else if (isBrazil && usePaymentMode && isTest) {
      console.log(`   ⚠️ Pix não disponível em modo de teste - Só funciona em produção`)
    } else {
      console.log(`   ⚠️ Pix não habilitado: isBrazil=${isBrazil}, usePaymentMode=${usePaymentMode}, isTest=${isTest}`)
    }

    // ⚠️ IMPORTANTE: Stripe NÃO oferece parcelamento nativo para cartões no Brasil
    // Segundo suporte do Stripe: "O Stripe não oferece parcelamento nativo para cartões no Brasil"
    // Alternativas: usar assinaturas recorrentes ou soluções customizadas
    // Fonte: https://support.stripe.com/
    const paymentMethodOptions: any = {}
    
    // Parcelamento removido - não é suportado pelo Stripe no Brasil
    // Se precisar de parcelamento, considere:
    // 1. Usar assinaturas recorrentes (plano mensal)
    // 2. Implementar solução customizada com gateway brasileiro (Mercado Pago, Asaas, etc)
    console.log(`   ⚠️ Parcelamento não disponível: Stripe não oferece parcelamento nativo no Brasil`)

    // Verificar o tipo do Price ID no Stripe (para debug)
    try {
      const price = await stripe.prices.retrieve(priceId)
      console.log(`📦 Tipo do Price ID: ${price.type} (recurring: ${price.recurring ? 'sim' : 'não'})`)
      if (usePaymentMode && price.type === 'recurring') {
        console.warn(`⚠️ ATENÇÃO: Price ID é 'recurring' mas estamos usando modo 'payment'!`)
        console.warn(`   Isso pode impedir parcelamento e Pix. Considere usar um Price ID 'one_time' para plano anual.`)
      }
    } catch (err) {
      console.warn(`⚠️ Não foi possível verificar tipo do Price ID: ${err}`)
    }

    console.log(`🔧 Criando sessão de checkout:`)
    console.log(`   - Métodos de pagamento: ${paymentMethodTypes.join(', ')}`)
    console.log(`   - Opções de pagamento: ${JSON.stringify(paymentMethodOptions)}`)
    console.log(`   - Modo: ${usePaymentMode ? 'payment' : 'subscription'}`)

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
      mode: usePaymentMode ? 'payment' : 'subscription', // Pagamento único para anual BR, assinatura para mensal
      customer_email: user.email || undefined, // ✅ E-mail do usuário logado
      client_reference_id: user.id,
      // Forçar coleta de e-mail (caso o Stripe não use o customer_email)
      // billing_address_collection: 'required', // Opcional: se quiser coletar endereço também
      // phone_number_collection: { enabled: false }, // Desabilitar coleta de telefone se não necessário
      metadata: {
        user_id: user.id,
        area: 'wellness',
        plan_type: planType,
        stripe_account: stripeAccount,
        country_code: countryCode,
        payment_mode: usePaymentMode ? 'one_time' : 'subscription', // Indica se é pagamento único ou assinatura
        price_id: priceId, // Price ID para referência no webhook
        user_email: user.email || '', // ✅ Garantir que e-mail está no metadata também
      },
      success_url: `${baseUrl}/pt/wellness/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pt/wellness/checkout?canceled=true`,
      locale: isBrazil ? 'pt-BR' : getLocale(stripeAccount, countryCode), // ✅ Forçar pt-BR para Brasil
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
    
    // Mensagens de erro mais amigáveis
    let errorMessage = error.message || 'Erro ao criar sessão de checkout'
    
    if (error.message?.includes('Invalid API Key') || error.message?.includes('No such')) {
      errorMessage = 'Chave de API do Stripe inválida ou não configurada. Verifique as variáveis de ambiente STRIPE_SECRET_KEY_BR ou STRIPE_SECRET_KEY_US.'
    } else if (error.message?.includes('Price ID')) {
      errorMessage = 'Preço não configurado. Verifique STRIPE_PRICE_WELLNESS_MONTHLY_BR ou STRIPE_PRICE_WELLNESS_ANNUAL_BR no .env'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

