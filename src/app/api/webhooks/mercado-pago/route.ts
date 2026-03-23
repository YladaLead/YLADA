import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPayment } from '@/lib/mercado-pago'
import { createAccessToken } from '@/lib/email-tokens'
import { sendWelcomeEmail } from '@/lib/email-templates'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import { redirectToSupportAfterPayment } from '@/lib/whatsapp-carol-ai'
import { createYladaFreeMatrizSubscription } from '@/lib/admin-ylada-free-matriz'

function mercadoPagoReversalStatus(status: string | undefined): boolean {
  return status === 'refunded' || status === 'charged_back'
}

/**
 * Estorno ou chargeback no MP: cancela assinatura ligada a mp_<paymentId>, marca pagamento,
 * cancela comissões pendentes e cria plano free Ylada (matriz) quando havia assinatura paga ativa.
 */
async function applyMercadoPagoReversal(paymentId: string, fullData: any) {
  console.log('💸 Estorno/chargeback Mercado Pago:', paymentId, fullData?.status)
  const stripeSubId = `mp_${paymentId}`
  const nowIso = new Date().toISOString()

  const { data: subsByMp, error: subErr } = await supabaseAdmin
    .from('subscriptions')
    .select('id, user_id, area, plan_type, status')
    .eq('stripe_subscription_id', stripeSubId)

  if (subErr) {
    console.error('❌ Erro ao buscar assinatura por mp_ id:', subErr)
    return
  }

  let targets = subsByMp || []
  if (targets.length === 0) {
    const { data: payLink } = await supabaseAdmin
      .from('payments')
      .select('subscription_id')
      .eq('stripe_payment_intent_id', paymentId)
      .maybeSingle()
    if (payLink?.subscription_id) {
      const { data: subOne } = await supabaseAdmin
        .from('subscriptions')
        .select('id, user_id, area, plan_type, status')
        .eq('id', payLink.subscription_id)
        .maybeSingle()
      if (subOne) targets = [subOne]
    }
  }

  let grantYladaFreeUserId: string | null = null
  let hadActivePaid = false

  for (const sub of targets) {
    const isPaidPlan = sub.plan_type === 'monthly' || sub.plan_type === 'annual'
    const wasActive = sub.status === 'active'
    if (isPaidPlan && wasActive) hadActivePaid = true

    if (wasActive) {
      const uid = String(sub.user_id)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uid)
      if (isPaidPlan && isUuid) grantYladaFreeUserId = uid

      const { error: cancelErr } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: nowIso,
          updated_at: nowIso,
        })
        .eq('id', sub.id)

      if (cancelErr) {
        console.error(`❌ Erro ao cancelar assinatura ${sub.id}:`, cancelErr)
      } else {
        console.log('✅ Assinatura cancelada (estorno MP):', sub.id, sub.area, sub.plan_type)
      }
    }
  }

  const { data: payRows } = await supabaseAdmin.from('payments').select('id').eq('stripe_payment_intent_id', paymentId)

  for (const p of payRows || []) {
    await supabaseAdmin
      .from('payments')
      .update({ status: 'refunded', updated_at: nowIso })
      .eq('id', p.id)
    await supabaseAdmin
      .from('vendedor_comissoes')
      .update({ status: 'cancelled' })
      .eq('payment_id', p.id)
      .eq('status', 'pending')
  }

  let finalUserId = grantYladaFreeUserId
  if (!finalUserId && hadActivePaid) {
    const emailSources = [
      fullData?.payer?.email,
      fullData?.payer_email,
      fullData?.payer?.identification?.email,
      fullData?.additional_info?.payer?.email,
      fullData?.additional_info?.payer?.email_address,
    ]
    const payerEmail = emailSources.find((e) => e && typeof e === 'string' && e.includes('@')) as string | undefined
    if (payerEmail) {
      const { data: prof } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .ilike('email', payerEmail)
        .limit(1)
        .maybeSingle()
      if (prof?.user_id) finalUserId = prof.user_id
    }
  }

  if (finalUserId && hadActivePaid) {
    const { error: freeErr } = await createYladaFreeMatrizSubscription(finalUserId, 365, 'courtesy')
    if (freeErr) console.error('❌ Free matriz pós-estorno:', freeErr)
    else console.log('✅ Plano free Ylada (matriz) após estorno:', finalUserId)
  } else if (hadActivePaid && !finalUserId) {
    console.warn('⚠️ Estorno MP: não foi possível resolver user_id para criar free matriz; use o admin.')
  }
}

/**
 * Determina features baseado em área, planType e productType.
 * Garantia: Nutri sempre recebe acesso a ferramentas + cursos quando productType
 * não vem no metadata (ex.: MP não repassa metadata da Preference no Payment).
 */
function determineFeatures(
  area: string,
  planType: string,
  productType?: string
): string[] {
  // Área Nutri: pacote plataforma = ferramentas + cursos; formation_only = só cursos
  if (area === 'nutri') {
    if (productType === 'formation_only') {
      return ['cursos']
    }
    // Qualquer outro caso Nutri (platform_*, ou productType ausente): acesso completo à plataforma
    if (
      productType === 'platform_monthly' ||
      productType === 'platform_monthly_12x' ||
      productType === 'platform_annual' ||
      !productType
    ) {
      return ['ferramentas', 'cursos']
    }
  }

  // Outras áreas: Anual = completo, Mensal = gestão + ferramentas
  if (planType === 'annual') {
    return ['completo']
  }
  return ['gestao', 'ferramentas']
}

/**
 * Cancela assinaturas mensais ativas quando uma assinatura anual é criada
 */
async function cancelMonthlySubscriptions(
  userId: string,
  area: string
): Promise<void> {
  try {
    // Buscar todas as assinaturas mensais ativas do mesmo usuário e área
    const { data: monthlySubscriptions, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, stripe_subscription_id, plan_type')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('plan_type', 'monthly')
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())

    if (fetchError) {
      console.error('❌ Erro ao buscar assinaturas mensais:', fetchError)
      return
    }

    if (!monthlySubscriptions || monthlySubscriptions.length === 0) {
      console.log('ℹ️ Nenhuma assinatura mensal ativa encontrada para cancelar')
      return
    }

    console.log(`🔄 Cancelando ${monthlySubscriptions.length} assinatura(s) mensal(is) ativa(s)...`)

    // Cancelar todas as assinaturas mensais encontradas
    for (const subscription of monthlySubscriptions) {
      const { error: cancelError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id)

      if (cancelError) {
        console.error(`❌ Erro ao cancelar assinatura mensal ${subscription.id}:`, cancelError)
      } else {
        console.log(`✅ Assinatura mensal cancelada: ${subscription.id} (${subscription.stripe_subscription_id})`)
      }
    }

    console.log(`✅ Todas as assinaturas mensais foram canceladas para usuário ${userId} na área ${area}`)
  } catch (error: any) {
    console.error('❌ Erro ao cancelar assinaturas mensais:', error)
    // Não lançar erro para não interromper o fluxo principal
  }
}

/**
 * POST /api/webhooks/mercado-pago
 * Webhook para processar eventos do Mercado Pago
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-signature')
    const requestId = request.headers.get('x-request-id')

    // Detectar se é teste ou produção baseado no live_mode do webhook
    const isTest = body.live_mode === false || body.live_mode === 'false'

    // Processar tanto pagamentos de teste quanto de produção para melhor experiência do usuário
    console.log('📥 Webhook Mercado Pago recebido:', {
      type: body.type,
      action: body.action,
      requestId,
      live_mode: body.live_mode,
      isTest: isTest, // Baseado em live_mode, não NODE_ENV
      hasData: !!body.data,
      dataKeys: body.data ? Object.keys(body.data) : [],
    })

    // Validar webhook secret (se configurado)
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      // TODO: Implementar validação completa do webhook
      // Por enquanto, apenas verificar se o secret está configurado
      console.log('✅ Webhook secret configurado')
    }

    // Processar evento baseado no tipo
    const eventType = body.type || body.action

    console.log('🔄 Processando evento:', eventType)

    // Verificar se body.data existe
    if (!body.data) {
      console.warn('⚠️ Webhook sem data, retornando sucesso (pode ser teste)')
      return NextResponse.json({ received: true, message: 'Webhook recebido sem data' })
    }

    try {
      switch (eventType) {
        case 'payment':
          await handlePaymentEvent(body.data, isTest)
          break

        case 'merchant_order':
          await handleMerchantOrderEvent(body.data, isTest)
          break

        case 'subscription':
        case 'preapproval':
          await handleSubscriptionEvent(body.data, isTest)
          break

        default:
          console.log(`⚠️ Evento não processado: ${eventType}`)
      }
    } catch (eventError: any) {
      // Logar erro mas não falhar o webhook (para não bloquear notificações)
      console.error('❌ Erro ao processar evento:', {
        eventType,
        error: eventError.message,
        stack: eventError.stack,
        data: body.data,
      })
      // Continuar e retornar sucesso para não bloquear webhook
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Erro no webhook Mercado Pago:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    // Retornar 200 mesmo com erro para não bloquear webhook
    // O Mercado Pago vai continuar tentando se retornar 500
    return NextResponse.json(
      { 
        received: true, 
        error: error.message || 'Internal server error',
        note: 'Erro logado, mas webhook aceito para não bloquear notificações'
      },
      { status: 200 }
    )
  }
}

/**
 * Processa evento de pagamento.
 * @param data - Payload do webhook (geralmente { id }) ou dados completos
 * @param isTest - Se é ambiente de teste do MP
 * @param preFetchedFullData - Dados completos já buscados da API (usado pelo sync manual admin)
 */
async function handlePaymentEvent(data: any, isTest: boolean = false, preFetchedFullData?: any) {
  if (!data || !data.id) {
    console.error('❌ handlePaymentEvent: data inválida ou sem ID')
    console.log('📋 Data recebida:', JSON.stringify(data, null, 2))
    return
  }

  const paymentId = data.id
  console.log('💳 Processando pagamento:', paymentId)
  console.log('📋 Dados completos do pagamento:', {
    id: data.id,
    status: data.status,
    status_detail: data.status_detail,
    live_mode: data.live_mode,
    isTest: isTest,
    hasPayer: !!data.payer,
    hasMetadata: !!data.metadata,
    hasExternalReference: !!data.external_reference,
  })

    // Estorno/chargeback com dados já buscados (ex.: sync admin)
    if (preFetchedFullData && mercadoPagoReversalStatus(preFetchedFullData.status)) {
      await applyMercadoPagoReversal(String(paymentId), preFetchedFullData)
      return
    }

    // Usar dados já buscados (sync manual) ou buscar via API
    let paymentDataFull: any =
      preFetchedFullData && preFetchedFullData.status === 'approved' ? preFetchedFullData : null

    if (!paymentDataFull) {
      try {
        // Se for teste do Mercado Pago (payment.id = "123456"), pular verificação
        if (paymentId === '123456' || paymentId === 123456) {
          console.log('🧪 Teste do Mercado Pago detectado, processando sem verificação')
          paymentDataFull = data
        } else {
          // Buscar dados completos do pagamento via API do Mercado Pago
          const { Payment } = await import('mercadopago')
          const { createMercadoPagoClient } = await import('@/lib/mercado-pago')

          paymentDataFull = null
          for (const tryTest of [isTest, !isTest]) {
            try {
              console.log('🔍 Buscando dados completos do pagamento via API...', { isTest: tryTest })
              const client = createMercadoPagoClient(tryTest)
              const payment = new Payment(client)
              const got = await payment.get({ id: paymentId })
              if (got?.id) {
                paymentDataFull = got
                console.log('✅ Pagamento obtido na API MP:', {
                  hasMetadata: !!got.metadata,
                  hasExternalReference: !!got.external_reference,
                  hasPayer: !!got.payer,
                  status: got.status,
                })
                break
              }
            } catch (apiError: any) {
              console.warn(`⚠️ Falha ao buscar pagamento (isTest=${tryTest}):`, apiError?.message || apiError)
            }
          }

          if (paymentDataFull && mercadoPagoReversalStatus(paymentDataFull.status)) {
            await applyMercadoPagoReversal(String(paymentId), paymentDataFull)
            return
          }

          if (!paymentDataFull || paymentDataFull.status !== 'approved') {
            console.error(
              '❌ Pagamento não aprovado ou não encontrado (tentou ambos os tokens).',
              paymentId,
              paymentDataFull?.status
            )
            return
          }
        }
      } catch (error: any) {
        console.error('❌ Erro ao processar pagamento:', error)
        return
      }
    } else {
      console.log('✅ Usando dados do pagamento já fornecidos (sync manual)')
    }

    // Usar dados completos do pagamento em vez de apenas data do webhook
    const fullData = paymentDataFull || data

    try {
      // Obter metadata do pagamento (usar dados completos obtidos via API)
    const metadata = fullData.metadata || {}
    let userId = metadata.user_id
    
    console.log('🔍 Tentando extrair user_id:', {
      'metadata.user_id': metadata.user_id,
      'metadata completo': metadata,
      'external_reference': fullData.external_reference,
      'payer.email': fullData.payer?.email,
      'payer_email': fullData.payer_email,
    })
    
    // Se não tiver user_id no metadata, tentar extrair do external_reference
    // Formatos: area_planType_<uuid> | area_planType_temp_email@dominio | area_planType_temp_apelido (truncado — exige e-mail do pagador)
    if (!userId && fullData.external_reference && typeof fullData.external_reference === 'string') {
      const ref = fullData.external_reference
      const tempWithEmail = ref.match(/_temp_(.+@.+\..+)$/i)
      if (tempWithEmail?.[1]) {
        userId = `temp_${tempWithEmail[1]}`
        console.log('✅ User ID extraído (temp + e-mail na referência):', userId)
      } else {
        const parts = ref.split('_')
        if (parts.length >= 3) {
          userId = parts.slice(2).join('_')
          console.log('✅ User ID extraído do external_reference:', userId)
        } else {
          console.warn('⚠️ external_reference não tem formato esperado:', ref)
        }
      }
    }
    
    // Obter e-mail do pagador cedo (usado em vários fallbacks) — várias fontes para transferência bancária / fluxos sem payer preenchido
    const earlyEmailSources = [
      fullData.payer?.email,
      fullData.payer_email,
      fullData.payer?.identification?.email,
      fullData.additional_info?.payer?.email,
      fullData.additional_info?.payer?.email_address,
      fullData.collector?.email,
    ]
    const payerEmailEarly = earlyEmailSources.find((e) => e && typeof e === 'string' && e.includes('@')) || null
    // Fallback: extrair e-mail do external_reference quando formato é area_planType_temp_email@...
    let payerEmailFromRef: string | null = null
    if (!payerEmailEarly && fullData.external_reference && typeof fullData.external_reference === 'string') {
      const ref = fullData.external_reference
      const afterLastUnderscore = ref.slice(ref.lastIndexOf('_') + 1)
      if (afterLastUnderscore.includes('@')) payerEmailFromRef = afterLastUnderscore
      else if (ref.includes('temp_')) {
        const afterTemp = ref.replace(/^[^_]*_[^_]*_temp_/i, '')
        if (afterTemp.includes('@')) payerEmailFromRef = afterTemp
      }
    }
    const payerEmailEarlyFinal = payerEmailEarly || payerEmailFromRef

    // nutri_monthly_temp_cavalcantesirle (sem @) virava temp_cavalcantesirle e quebrava o fluxo — corrigir com e-mail do MP
    if (userId && String(userId).startsWith('temp_')) {
      const tail = String(userId).slice('temp_'.length)
      if (tail && !tail.includes('@')) {
        if (payerEmailEarlyFinal && payerEmailEarlyFinal.includes('@')) {
          userId = `temp_${payerEmailEarlyFinal}`
          console.log('✅ Referência temp_ sem e-mail: usando e-mail do pagador Mercado Pago')
        } else {
          console.warn('⚠️ Referência temp_ truncada e pagador sem e-mail — limpando userId para fallbacks')
          userId = undefined as unknown as string
        }
      }
    }

    // Conta já cadastrada: associar pagamento ao UUID (ex.: assinatura após free matriz)
    if (payerEmailEarlyFinal?.includes('@')) {
      const { data: profMatch } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .ilike('email', payerEmailEarlyFinal)
        .limit(1)
        .maybeSingle()
      if (profMatch?.user_id && (!userId || String(userId).startsWith('temp_'))) {
        userId = profMatch.user_id
        console.log('✅ Pagamento associado a user_id existente via e-mail do pagador:', userId)
      }
    }

    // Se ainda não tiver, tentar usar o e-mail do pagador como temp_email
    if (!userId && payerEmailEarlyFinal && payerEmailEarlyFinal.includes('@')) {
      userId = `temp_${payerEmailEarlyFinal}`
      console.log('✅ User ID criado a partir do e-mail do pagador:', userId)
    }

    // Fallback: se userId veio da referência mas não é UUID nem temp_ (ex: link MP com ref "wellness...f0674781"),
    // buscar usuário existente por e-mail do pagador para associar o pagamento ao usuário correto
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(userId || ''))
    if (userId && !userId.startsWith('temp_') && !isUuid && payerEmailEarlyFinal && payerEmailEarlyFinal.includes('@')) {
      const { data: profileByEmail } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .ilike('email', payerEmailEarlyFinal)
        .limit(1)
        .maybeSingle()
      if (profileByEmail?.user_id) {
        console.log('✅ Usuário encontrado por e-mail (referência inválida):', profileByEmail.user_id)
        userId = profileByEmail.user_id
      } else {
        // Não existe perfil com esse e-mail; tratar como temp_ para criar conta no fluxo abaixo
        userId = `temp_${payerEmailEarlyFinal}`
        console.log('✅ User ID inválido na referência; usando temp_ e-mail:', userId)
      }
    }
    
    if (!userId) {
      console.error('❌ User ID não encontrado no metadata do pagamento')
      console.log('📋 Dados disponíveis para debug:', {
        metadata,
        external_reference: fullData.external_reference,
        payer: fullData.payer,
        payer_email: fullData.payer_email,
        additional_info_payer: fullData.additional_info?.payer,
        payerEmailEarlyFinal: payerEmailEarlyFinal ?? undefined,
        'fullData completo (primeiros 1000 chars)': JSON.stringify(fullData).substring(0, 1000),
      })
      // NÃO retornar - continuar processamento para não bloquear webhook
      // Mas não criar usuário/subscription sem userId
      return
    }
    
    console.log('✅ User ID encontrado/criado:', userId)

    // Idempotência: não processar o mesmo pagamento duas vezes
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id, subscription_id')
      .eq('stripe_payment_intent_id', String(paymentId))
      .maybeSingle()
    if (existingPayment) {
      console.log('✅ Pagamento já processado (idempotência), ignorando:', paymentId)
      return
    }
    
    let area = metadata.area || (fullData.external_reference?.split('_')[0]) || ''
    let planType = metadata.plan_type || (fullData.external_reference?.split('_')[1]) || ''
    // Fallback: inferir área e plano pela descrição (ex: "YLADA WELLNESS - Plano Anual") quando referência vem truncada/errada
    const desc = (fullData.description || fullData.additional_info?.items?.[0]?.title || '').toUpperCase()
    if (!area || !['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      if (desc.includes('WELLNESS')) area = 'wellness'
      else if (desc.includes('NUTRI')) area = 'nutri'
      else if (desc.includes('COACH')) area = 'coach'
      else if (desc.includes('NUTRA')) area = 'nutra'
      else area = area || 'wellness'
    }
    if (!planType || !['monthly', 'annual'].includes(planType)) {
      if (desc.includes('ANUAL') || desc.includes('PLANO ANUAL')) planType = 'annual'
      else if (desc.includes('MENSAL') || desc.includes('PLANO MENSAL')) planType = 'monthly'
      else planType = planType || 'monthly'
    }
    const productType = metadata.product_type || metadata.productType // Suportar ambos os formatos
    const paymentMethod = fullData.payment_method_id || 'unknown'
    // Sem ref na URL = matriz (ida); com ref=paula (etc) = esse vendedor
    const refVendedor = metadata.ref_vendedor && String(metadata.ref_vendedor).trim() ? String(metadata.ref_vendedor).trim() : 'ida'
    
    // Determinar features baseado em productType (apenas Nutri)
    let features = determineFeatures(area, planType, productType)
    // Garantir que Nutri sempre tenha acesso à plataforma (evita "Acesso Restrito" quando metadata falta)
    if (area === 'nutri' && (!features || features.length === 0)) {
      features = ['ferramentas', 'cursos']
      console.log('🛡️ Features Nutri garantidas (fallback):', features)
    }
    console.log('🎯 Features determinadas:', { area, planType, productType, features })

    // Obter informações do pagamento
    const amount = fullData.transaction_amount || 0
    const currency = fullData.currency_id || 'BRL'
    
    // Obter e-mail do pagador (importante para suporte e para transferência bancária)
    // Tentar múltiplas fontes: payer, additional_info (usado em alguns fluxos/transferência), collector, external_reference
    const payerEmailSources = [
      fullData.payer?.email,
      fullData.payer_email,
      fullData.payer?.identification?.email,
      fullData.collector?.email,
      fullData.additional_info?.payer?.email,
      fullData.additional_info?.payer?.email_address,
      (typeof fullData.payer === 'object' && fullData.payer !== null && (fullData.payer as any).email_address),
      fullData.external_reference?.split('email:')[1],
      // external_reference pode ser "wellness_monthly_temp_email@domain.com" — extrair e-mail se terminar com @
      (() => {
        const ref = fullData.external_reference
        if (!ref || typeof ref !== 'string') return null
        const idx = ref.indexOf('@')
        if (idx === -1) return null
        const possibleEmail = ref.includes('temp_') ? ref.replace(/^[^_]*_[^_]*_temp_/i, '') : ref.slice(ref.lastIndexOf('_') + 1)
        return possibleEmail.includes('@') ? possibleEmail : null
      })(),
    ]
    let payerEmail = payerEmailSources.find((e) => e && typeof e === 'string' && e.includes('@')) || null
    
    console.log('📧 Tentando capturar e-mail do pagador:', {
      'fullData.payer?.email': fullData.payer?.email,
      'fullData.payer_email': fullData.payer_email,
      'fullData.payer?.identification?.email': fullData.payer?.identification?.email,
      'fullData.collector?.email': fullData.collector?.email,
      'fullData.additional_info?.payer': fullData.additional_info?.payer ? 'present' : undefined,
      'payerEmail final': payerEmail,
      'payer completo': fullData.payer,
    })
    
    // NOVO: Se userId começar com "temp_", criar usuário automaticamente
    if (userId && userId.startsWith('temp_')) {
      const tempEmail = userId.replace('temp_', '')
      console.log('🆕 Criando usuário automaticamente após pagamento:', tempEmail)
      
      // Usar o e-mail do temp_ ou o payerEmail
      const emailParaCriar = tempEmail.includes('@') ? tempEmail : (payerEmail || tempEmail)
      
      if (!emailParaCriar || !emailParaCriar.includes('@')) {
        console.error('❌ E-mail do pagador não encontrado. Não é possível criar usuário.')
        console.log('📋 Dados disponíveis:', {
          tempEmail,
          payerEmail,
          emailParaCriar,
          userId,
        })
        return
      }
      
      // Atualizar payerEmail com o e-mail correto
      const emailFinal = emailParaCriar
      
      // Verificar se usuário já existe
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        u => u.email?.toLowerCase() === emailFinal.toLowerCase()
      )
      
      if (existingUser) {
        // Usuário já existe, usar o ID existente
        console.log('✅ Usuário já existe, usando ID existente:', existingUser.id)
        userId = existingUser.id
      } else {
        // Criar novo usuário
        const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + 'A1!'
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: emailFinal,
            password: randomPassword,
            email_confirm: true, // Confirmar email automaticamente
            user_metadata: {
              full_name: fullData.payer?.first_name || fullData.payer?.name || '',
              name: fullData.payer?.first_name || fullData.payer?.name || '',
              perfil: area
            }
          })
        
        if (createError || !newUser.user) {
          console.error('❌ Erro ao criar usuário automaticamente:', createError)
          return
        }
        
        userId = newUser.user.id
        console.log('✅ Usuário criado automaticamente:', userId)
        
        // Aguardar trigger criar perfil (ou criar manualmente se necessário)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificar se perfil foi criado pelo trigger
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('user_id', userId)
          .single()
        
        if (!profile) {
            // Criar perfil manualmente se trigger não funcionou
            const { error: profileError } = await supabaseAdmin
              .from('user_profiles')
              .insert({
                user_id: userId,
                email: emailFinal,
                nome_completo: fullData.payer?.first_name || fullData.payer?.name || '',
                perfil: area
              })
          
          if (profileError) {
            console.error('❌ Erro ao criar perfil:', profileError)
          } else {
            console.log('✅ Perfil criado manualmente')
          }
        }
        
        // NÃO enviar e-mail aqui - será enviado após criar a subscription
        // Isso evita envios duplicados quando o webhook é chamado múltiplas vezes
        console.log('✅ Usuário criado. E-mail será enviado após criar subscription.')
        
        // Atualizar payerEmail para usar no resto do código
        payerEmail = emailFinal
      }
    }
    
    if (!userId) {
      console.error('❌ User ID não encontrado no metadata do pagamento')
      return
    }
    
    // Salvar/atualizar e-mail do usuário no perfil (se disponível e diferente)
    if (payerEmail && payerEmail.includes('@')) {
      try {
        const { error: emailError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            email: payerEmail,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        
        if (emailError) {
          console.warn('⚠️ Erro ao atualizar e-mail do usuário:', emailError)
        } else {
          console.log('✅ E-mail do pagador salvo no perfil:', payerEmail)
        }
      } catch (error: any) {
        console.warn('⚠️ Erro ao salvar e-mail do pagador:', error.message)
      }
    } else {
      console.warn('⚠️ E-mail do pagador não encontrado ou inválido no webhook')
    }

    // 🚀 CORREÇÃO: Verificar se usuário já tem subscription ativa para ESTENDER em vez de criar nova (inclui ref_vendedor para comissão em renovação)
    const { data: existingSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('id, current_period_end, welcome_email_sent, status, ref_vendedor')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('status', 'active')
      .order('current_period_end', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Calcular data de expiração
    let expiresAt: Date
    if (existingSubscription && existingSubscription.current_period_end) {
      // 🚀 RENOVAÇÃO: Estender a partir da data atual de vencimento
      expiresAt = new Date(existingSubscription.current_period_end)
      console.log('🔄 Renovação detectada! Estendendo subscription existente:', {
        subscriptionId: existingSubscription.id,
        vencimentoAtual: existingSubscription.current_period_end,
      })
      
      if (planType === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      } else if (planType === 'annual') {
        expiresAt.setMonth(expiresAt.getMonth() + 12)
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      }
      
      // 🛡️ VALIDAÇÃO: Verificar que data calculada é razoável
      const daysUntilExpiry = Math.floor((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (planType === 'monthly' && daysUntilExpiry > 60) {
        console.error('⚠️ Data de vencimento inválida para mensal:', daysUntilExpiry, 'dias. Recalculando...')
        expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      } else if (planType === 'annual' && daysUntilExpiry > 400) {
        console.error('⚠️ Data de vencimento inválida para anual:', daysUntilExpiry, 'dias. Recalculando...')
        expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 12)
      }
      
      console.log('✅ Nova data de vencimento após renovação:', expiresAt.toISOString())
    } else {
      // NOVA ASSINATURA: Calcular a partir de agora
      expiresAt = new Date()
      if (planType === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      } else if (planType === 'annual') {
        expiresAt.setMonth(expiresAt.getMonth() + 12)
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      }
      
      // 🛡️ VALIDAÇÃO: Verificar que data calculada é razoável
      const daysUntilExpiry = Math.floor((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (planType === 'monthly' && daysUntilExpiry > 60) {
        console.error('⚠️ Data de vencimento inválida para mensal:', daysUntilExpiry, 'dias. Recalculando...')
        expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      } else if (planType === 'annual' && daysUntilExpiry > 400) {
        console.error('⚠️ Data de vencimento inválida para anual:', daysUntilExpiry, 'dias. Recalculando...')
        expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 12)
      }
      
      console.log('🆕 Nova assinatura! Data de vencimento:', expiresAt.toISOString())
    }

    // Verificar se é PIX ou Boleto (para assinaturas mensais manuais, marcar reminder_sent como false)
    const isManualPayment = 
      paymentMethod === 'account_money' || 
      paymentMethod === 'pix' || 
      paymentMethod === 'ticket' || 
      paymentMethod === 'boleto'
    const reminderSent = planType === 'monthly' && isManualPayment ? false : null

    // 🚨 CANCELAR ASSINATURAS MENSAIS quando assinatura anual é criada
    if (planType === 'annual') {
      await cancelMonthlySubscriptions(userId, area)
    }

    let subscription: any
    
    if (existingSubscription) {
      // 🚀 ATUALIZAR subscription existente (renovação)
      const subscriptionId = `mp_${paymentId}` // ID único para este pagamento
      
      const { data: updatedSubscription, error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          current_period_start: new Date().toISOString(), // Novo período começa agora
          current_period_end: expiresAt.toISOString(), // Estender vencimento
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          status: 'active',
          features: features, // Atualizar features na renovação
          cancel_at_period_end: false,
          reminder_sent: reminderSent,
          updated_at: new Date().toISOString(),
          // Manter welcome_email_sent se já foi enviado (não reenviar em renovação)
          welcome_email_sent: existingSubscription.welcome_email_sent || false,
        })
        .eq('id', existingSubscription.id)
        .select()
        .single()
      
      if (updateError) {
        console.error('❌ Erro ao atualizar subscription:', updateError)
        throw updateError
      }
      
      subscription = updatedSubscription
      console.log('✅ Subscription renovada com sucesso!', {
        subscriptionId: subscription.id,
        novoVencimento: subscription.current_period_end,
      })
    } else {
      // 🆕 CRIAR nova subscription (primeiro pagamento)
      const subscriptionId = `mp_${paymentId}`
      
      const { data: newSubscription, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          area: area,
          plan_type: planType,
          features: features,
          stripe_account: null,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: fullData.payer?.id?.toString() || 'mp_customer',
          stripe_price_id: 'mp_price',
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: expiresAt.toISOString(),
          cancel_at_period_end: false,
          reminder_sent: reminderSent,
          welcome_email_sent: false,
          ref_vendedor: refVendedor,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (subError) {
        console.error('❌ Erro ao criar subscription:', subError)
        throw subError
      }
      
      subscription = newSubscription
      console.log('✅ Nova subscription criada!', {
        subscriptionId: subscription.id,
        vencimento: subscription.current_period_end,
      })
    }

    // Criar registro de pagamento
    const amountCents = Math.round(amount * 100)
    const { data: paymentRow, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        subscription_id: subscription.id,
        user_id: userId,
        stripe_account: null, // Mercado Pago não usa stripe_account
        stripe_payment_intent_id: paymentId, // Usar como ID único
        stripe_invoice_id: fullData.order?.id?.toString() || null,
        stripe_charge_id: null,
        amount: amountCents,
        currency: currency.toLowerCase(),
        status: 'succeeded',
        receipt_url: fullData.external_resource_url || null,
        payment_method: fullData.payment_method_id || 'unknown',
      })
      .select('id')
      .single()

    if (paymentError) {
      console.error('❌ Erro ao salvar pagamento:', paymentError)
      throw paymentError
    }

    // Comissão do vendedor: 20% apenas para vendedores (não para ida/matriz)
    const refVendedorComissao = subscription.ref_vendedor && String(subscription.ref_vendedor).trim() ? String(subscription.ref_vendedor).trim() : null
    const isVendedorComissao = refVendedorComissao && refVendedorComissao !== 'ida'
    if (isVendedorComissao && amountCents > 0) {
      const commissionPct = 20
      const commissionAmountCents = Math.round(amountCents * (commissionPct / 100))
      if (commissionAmountCents > 0) {
        const { error: comissaoError } = await supabaseAdmin
          .from('vendedor_comissoes')
          .insert({
            ref_vendedor: refVendedorComissao,
            subscription_id: subscription.id,
            payment_id: paymentRow?.id || null,
            amount_cents: amountCents,
            commission_pct: commissionPct,
            commission_amount_cents: commissionAmountCents,
            status: 'pending',
          })
        if (comissaoError) {
          console.error('❌ Erro ao registrar comissão do vendedor:', comissaoError)
          // Não falhar o webhook; comissão pode ser lançada manualmente
        } else {
          console.log('✅ Comissão 20% registrada para vendedor:', refVendedorComissao, 'valor:', commissionAmountCents, 'centavos')
        }
      }
    }

    // 🆕 NOVO: Direcionar para suporte via WhatsApp (apenas para área nutri)
    if (area === 'nutri') {
      try {
        console.log('📱 Tentando direcionar para suporte via WhatsApp...')
        
        // Buscar conversa pelo telefone ou email
        let conversationId: string | null = null
        
        // Tentar buscar pelo telefone do pagador (se disponível)
        const payerPhone = fullData.payer?.phone?.number || null
        if (payerPhone) {
          const phoneClean = payerPhone.replace(/\D/g, '')
          const phoneFormatted = phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`
          
          const { data: convByPhone } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('id')
            .eq('phone', phoneFormatted)
            .eq('area', 'nutri')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          
          if (convByPhone) {
            conversationId = convByPhone.id
            console.log('✅ Conversa encontrada pelo telefone:', conversationId)
          }
        }
        
        // Se não encontrou pelo telefone, tentar pelo email
        if (!conversationId && payerEmail) {
          // Buscar em user_profiles e depois em whatsapp_conversations
          const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('id')
            .eq('email', payerEmail)
            .maybeSingle()
          
          if (profile) {
            // Tentar encontrar conversa relacionada (pode precisar de lógica adicional)
            // Por enquanto, vamos tentar buscar pelo nome se disponível
            const { data: convByEmail } = await supabaseAdmin
              .from('whatsapp_conversations')
              .select('id, name')
              .eq('area', 'nutri')
              .eq('status', 'active')
              .ilike('name', `%${payerEmail.split('@')[0]}%`)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle()
            
            if (convByEmail) {
              conversationId = convByEmail.id
              console.log('✅ Conversa encontrada pelo email:', conversationId)
            }
          }
        }
        
        // Se encontrou conversa e automação ligada, direcionar para suporte via WhatsApp
        const carolDisabled = await getCarolAutomationDisabled()
        if (conversationId && !carolDisabled) {
          const redirectResult = await redirectToSupportAfterPayment(conversationId, {
            amount,
            plan: `${area}_${planType}`,
          })
          if (redirectResult.success) {
            console.log('✅ Direcionado para suporte com sucesso!')
          } else {
            console.warn('⚠️ Erro ao direcionar para suporte:', redirectResult.error)
          }
        } else if (conversationId && carolDisabled) {
          console.log('ℹ️ Automação desligada - direcionamento WhatsApp pós-pagamento não enviado')
        } else {
          console.log('ℹ️ Conversa não encontrada para direcionar ao suporte')
        }
      } catch (whatsappError: any) {
        // Não falhar o webhook se houver erro no WhatsApp
        console.error('❌ Erro ao direcionar para suporte (não bloqueia webhook):', whatsappError)
      }
    }

    // IMPORTANTE: Verificar ANTES de enviar se já foi enviado (proteção contra duplicação)
    // Re-buscar subscription para garantir que temos os dados mais recentes
    const { data: currentSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('id, welcome_email_sent, welcome_email_sent_at')
      .eq('id', subscription.id)
      .single()
    
    const alreadySent = currentSubscription?.welcome_email_sent === true
    const isNewSubscription = !existingSubscription // Se não tinha subscription antes, é nova
    
    // 🚀 CORREÇÃO: Enviar email apenas se:
    // 1. É nova subscription (não renovação) OU
    // 2. É renovação mas ainda não foi enviado email de boas-vindas
    const shouldSendEmail = (isNewSubscription || !alreadySent) && payerEmail
    
    // Enviar e-mail de boas-vindas (apenas se ainda não foi enviado)
    console.log('📧 ========================================')
    console.log('📧 VERIFICAÇÃO DE ENVIO DE E-MAIL')
    console.log('📧 ========================================')
    console.log('📧 Condições para enviar e-mail:', {
      hasSubscription: !!subscription,
      subscriptionId: subscription?.id,
      isNewSubscription,
      welcomeEmailSent: currentSubscription?.welcome_email_sent,
      welcomeEmailSentAt: currentSubscription?.welcome_email_sent_at,
      alreadySent: alreadySent,
      shouldSendEmail,
      hasPayerEmail: !!payerEmail,
      payerEmail: payerEmail,
      userId,
      area,
      planType,
    })
    console.log('📧 ========================================')

    if (subscription && shouldSendEmail) {
      try {
        console.log('📧 ✅ TODAS AS CONDIÇÕES ATENDIDAS - INICIANDO ENVIO')
        console.log('📧 Iniciando envio de e-mail de boas-vindas...')
        
        // Obter base URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                       process.env.NEXT_PUBLIC_APP_URL || 
                       'https://www.ylada.com'
        
        console.log('📧 Base URL configurada:', baseUrl)

        // Criar token de acesso
        console.log('📧 Criando token de acesso para userId:', userId)
        const accessToken = await createAccessToken(userId, 30)
        console.log('📧 ✅ Token de acesso criado:', accessToken.substring(0, 20) + '...')

        // Obter nome do usuário (se disponível)
        const { data: userProfile, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .select('nome_completo')
          .eq('user_id', userId)
          .single()
        
        if (profileError) {
          console.warn('⚠️ Erro ao buscar perfil do usuário:', profileError)
        } else {
          console.log('📧 Perfil do usuário encontrado:', userProfile?.nome_completo || 'sem nome')
        }

        // Verificar se Resend está configurado
        const resendApiKey = process.env.RESEND_API_KEY
        console.log('📧 Verificando RESEND_API_KEY...')
        console.log('📧 RESEND_API_KEY existe?', !!resendApiKey)
        console.log('📧 RESEND_API_KEY prefix:', resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'NÃO CONFIGURADA')
        
        if (!resendApiKey) {
          console.error('❌ ❌ ❌ RESEND_API_KEY NÃO CONFIGURADA! ❌ ❌ ❌')
          console.error('❌ Verifique se a variável está configurada no Vercel')
          throw new Error('RESEND_API_KEY não configurada')
        }

        // Verificar se resend client está disponível
        const { isResendConfigured } = await import('@/lib/resend')
        const resendConfigured = isResendConfigured()
        console.log('📧 isResendConfigured() retornou:', resendConfigured)
        
        if (!resendConfigured) {
          console.error('❌ ❌ ❌ Resend não está configurado corretamente! ❌ ❌ ❌')
          throw new Error('Resend não está configurado corretamente')
        }

        // Enviar e-mail
        console.log('📧 ========================================')
        console.log('📧 CHAMANDO sendWelcomeEmail')
        console.log('📧 ========================================')
        console.log('📧 Parâmetros:', {
          email: payerEmail,
          userName: userProfile?.nome_completo || undefined,
          area,
          planType,
          hasAccessToken: !!accessToken,
          accessTokenLength: accessToken.length,
          baseUrl,
        })
        console.log('📧 ========================================')
        
        await sendWelcomeEmail({
          email: payerEmail,
          userName: userProfile?.nome_completo || undefined,
          area: area,
          planType: planType,
          accessToken,
          baseUrl,
        })

        console.log('📧 ✅ sendWelcomeEmail executado sem erros')

        // Marcar como enviado ANTES de confirmar (proteção contra duplicação)
        // Usar UPDATE com verificação para evitar condições de corrida
        console.log('📧 Marcando e-mail como enviado no banco (proteção contra duplicação)...')
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            welcome_email_sent: true,
            welcome_email_sent_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)
          .eq('welcome_email_sent', false) // Apenas atualizar se ainda não foi enviado

        if (updateError) {
          console.error('❌ Erro ao marcar e-mail como enviado:', updateError)
          // Verificar se foi porque já estava marcado (não é erro crítico)
          const { data: checkSub } = await supabaseAdmin
            .from('subscriptions')
            .select('welcome_email_sent')
            .eq('id', subscription.id)
            .single()
          
          if (checkSub?.welcome_email_sent) {
            console.log('ℹ️ E-mail já estava marcado como enviado (outro processo pode ter enviado)')
          } else {
            console.error('❌ Erro real ao marcar e-mail como enviado')
          }
        } else {
          console.log('📧 ✅ E-mail marcado como enviado no banco')
          console.log('📧 ✅ ✅ ✅ E-MAIL DE BOAS-VINDAS ENVIADO COM SUCESSO! ✅ ✅ ✅')
          console.log('📧 E-mail enviado para:', payerEmail)
        }
      } catch (emailError: any) {
        // Não bloquear o fluxo se o e-mail falhar
        console.error('❌ ❌ ❌ ERRO AO ENVIAR E-MAIL DE BOAS-VINDAS ❌ ❌ ❌')
        console.error('❌ Erro completo:', {
          message: emailError.message,
          stack: emailError.stack,
          name: emailError.name,
          details: JSON.stringify(emailError, null, 2),
          payerEmail,
          userId,
        })
        console.error('❌ ❌ ❌ FIM DO ERRO ❌ ❌ ❌')
        // Continuar normalmente - o usuário pode solicitar novo link depois
      }
    } else {
      console.log('📧 ⚠️ CONDIÇÕES NÃO ATENDIDAS PARA ENVIO DE E-MAIL')
      if (subscription?.welcome_email_sent) {
        console.log('ℹ️ E-mail de boas-vindas já foi enviado anteriormente para:', payerEmail)
        console.log('ℹ️ Data do envio anterior:', subscription.welcome_email_sent_at)
      } else if (!payerEmail) {
        console.warn('⚠️ E-mail do pagador não disponível, não foi possível enviar e-mail de boas-vindas.')
        console.warn('⚠️ Dados do webhook disponíveis:', {
          'fullData.payer': fullData.payer,
          'fullData.payer_email': fullData.payer_email,
          'fullData.payer?.email': fullData.payer?.email,
          'fullData.payer?.identification?.email': fullData.payer?.identification?.email,
        })
      } else if (!subscription) {
        console.warn('⚠️ Subscription não encontrada, não foi possível enviar e-mail de boas-vindas')
      } else {
        console.warn('⚠️ Condição desconhecida - verificar lógica')
      }
    }

    console.log('✅ Pagamento processado e acesso ativado:', paymentId)
    console.log(`📅 Acesso válido até: ${expiresAt.toISOString()}`)
  } catch (error: any) {
    console.error('❌ Erro ao processar pagamento:', error)
    throw error
  }
}

/**
 * Processa evento de ordem do comerciante
 */
async function handleMerchantOrderEvent(data: any, isTest: boolean = false) {
  console.log('📦 Processando merchant order:', data?.id, 'isTest:', isTest)
  // Merchant order geralmente contém informações sobre múltiplos pagamentos
  // Por enquanto, vamos processar apenas os pagamentos individuais
}

/**
 * Processa evento de assinatura recorrente (Preapproval)
 */
async function handleSubscriptionEvent(data: any, isTest: boolean = false) {
  const subscriptionId = data.id
  console.log('🔄 Processando assinatura recorrente (Preapproval):', subscriptionId, 'isTest:', isTest)

  try {
    const metadata = data.metadata || {}
    let userId = metadata.user_id
    let area = metadata.area || (data.external_reference?.split('_')[0]) || ''
    let planType = metadata.plan_type || (data.external_reference?.split('_')[1]) || ''
    const productType = metadata.product_type || metadata.productType
    // Sem ref na URL = matriz (ida); com ref=paula (etc) = esse vendedor
    const refVendedor = metadata.ref_vendedor && String(metadata.ref_vendedor).trim() ? String(metadata.ref_vendedor).trim() : 'ida'

    // Fallback: extrair userId do external_reference (formato area_planType_userId)
    if (!userId && data.external_reference) {
      const parts = data.external_reference.split('_')
      if (parts.length >= 3) userId = parts.slice(2).join('_')
    }

    const payerEmailSub = data.payer_email || data.payer?.email || data.payer?.identification?.email || null

    // Fallback: usuário por e-mail quando metadata/referência não trazem user_id
    if (!userId && payerEmailSub && payerEmailSub.includes('@')) {
      const { data: profileByEmail } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .ilike('email', payerEmailSub)
        .limit(1)
        .maybeSingle()
      if (profileByEmail?.user_id) {
        userId = profileByEmail.user_id
        console.log('✅ [Subscription] User ID obtido por e-mail:', userId)
      } else {
        userId = `temp_${payerEmailSub}`
        console.log('✅ [Subscription] User ID temp_ a partir do e-mail:', userId)
      }
    }

    // Fallback: área e plano pela descrição (reason)
    const reasonUpper = (data.reason || '').toUpperCase()
    if (!area || !['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      if (reasonUpper.includes('WELLNESS')) area = 'wellness'
      else if (reasonUpper.includes('NUTRI')) area = 'nutri'
      else if (reasonUpper.includes('COACH')) area = 'coach'
      else if (reasonUpper.includes('NUTRA')) area = 'nutra'
      else area = area || 'wellness'
    }
    if (!planType || !['monthly', 'annual'].includes(planType)) {
      if (reasonUpper.includes('ANUAL')) planType = 'annual'
      else if (reasonUpper.includes('MENSAL')) planType = 'monthly'
      else planType = planType || 'monthly'
    }

    if (!userId) {
      console.error('❌ User ID não encontrado no metadata nem por e-mail (assinatura)')
      return
    }

    // Resolver temp_ para UUID: buscar ou criar usuário por e-mail (assinatura com checkout sem login)
    if (userId.startsWith('temp_') && payerEmailSub?.includes('@')) {
      const emailParaCriar = userId.replace('temp_', '')
      const { data: profileByEmail } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .ilike('email', emailParaCriar)
        .limit(1)
        .maybeSingle()
      if (profileByEmail?.user_id) {
        userId = profileByEmail.user_id
        console.log('✅ [Subscription] temp_ resolvido para usuário existente:', userId)
      } else {
        try {
          const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + 'A1!'
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: emailParaCriar,
            password: randomPassword,
            email_confirm: true,
            user_metadata: { perfil: area, name: data.payer?.first_name || data.payer?.name || '' },
          })
          if (!createError && newUser?.user) {
            userId = newUser.user.id
            await new Promise((r) => setTimeout(r, 800))
            const { data: profile } = await supabaseAdmin.from('user_profiles').select('id').eq('user_id', userId).single()
            if (!profile) {
              await supabaseAdmin.from('user_profiles').insert({
                user_id: userId,
                email: emailParaCriar,
                nome_completo: data.payer?.first_name || data.payer?.name || '',
                perfil: area,
              })
            }
            console.log('✅ [Subscription] Usuário criado a partir de temp_:', userId)
          }
        } catch (e: any) {
          console.error('❌ [Subscription] Erro ao criar usuário para temp_:', e?.message)
          return
        }
      }
    }
    
    // Determinar features baseado em productType (apenas Nutri)
    let features = determineFeatures(area, planType, productType)
    if (area === 'nutri' && (!features || features.length === 0)) {
      features = ['ferramentas', 'cursos']
      console.log('🛡️ Features Nutri garantidas (Subscription fallback):', features)
    }
    console.log('🎯 Features determinadas (Subscription):', { area, planType, productType, features })

    // Status da assinatura
    const status = data.status // 'authorized', 'paused', 'cancelled'
    
    // Mapear status do Mercado Pago para nosso status
    const statusMap: Record<string, string> = {
      authorized: 'active',
      paused: 'paused',
      cancelled: 'canceled',
      pending: 'pending',
    }
    
    const mappedStatus = statusMap[status] || 'pending'

    // Obter informações financeiras
    const amount = data.auto_recurring?.transaction_amount || 0
    const currency = data.auto_recurring?.currency_id || 'BRL'
    
    // E-mail do pagador (já obtido acima como payerEmailSub; garantir variável única para o resto do fluxo)
    const payerEmail = payerEmailSub || data.collector?.email || null

    console.log('📧 [Subscription] Tentando capturar e-mail do pagador:', {
      'data.payer_email': data.payer_email,
      'data.payer?.email': data.payer?.email,
      'data.payer?.identification?.email': data.payer?.identification?.email,
      'data.collector?.email': data.collector?.email,
      'payerEmail final': payerEmail,
      'payer completo': data.payer,
    })
    
    // Salvar/atualizar e-mail do usuário no perfil (se disponível e diferente)
    if (payerEmail && payerEmail.includes('@')) {
      try {
        const { error: emailError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            email: payerEmail,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        
        if (emailError) {
          console.warn('⚠️ Erro ao atualizar e-mail do usuário:', emailError)
        } else {
          console.log('✅ E-mail do pagador salvo no perfil:', payerEmail)
        }
      } catch (error: any) {
        console.warn('⚠️ Erro ao salvar e-mail do pagador:', error.message)
      }
    } else {
      console.warn('⚠️ E-mail do pagador não encontrado ou inválido no webhook de assinatura')
    }

           // Calcular datas de período baseado no tipo de plano
           const now = new Date()
           const periodEnd = new Date()
           if (planType === 'monthly') {
             periodEnd.setMonth(periodEnd.getMonth() + 1) // Próximo mês
           } else if (planType === 'annual') {
             periodEnd.setMonth(periodEnd.getMonth() + 12) // Próximo ano
           } else {
             periodEnd.setMonth(periodEnd.getMonth() + 1) // Fallback
           }

    // Criar ou atualizar assinatura no banco
    const subscriptionIdDb = `mp_sub_${subscriptionId}`
    
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        area: area,
        plan_type: planType,
        features: features,
        stripe_account: null,
        stripe_subscription_id: subscriptionIdDb,
        stripe_customer_id: data.payer_id?.toString() || 'mp_customer',
        stripe_price_id: 'mp_recurring',
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        status: mappedStatus,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: status === 'cancelled',
        ref_vendedor: refVendedor,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_subscription_id',
      })
      .select()
      .single()

    if (subError) {
      console.error('❌ Erro ao salvar subscription recorrente:', subError)
      throw subError
    }

    // Enviar e-mail de boas-vindas (apenas se ainda não foi enviado e status é authorized)
    if (subscription && !subscription.welcome_email_sent && mappedStatus === 'active' && payerEmail) {
      try {
        // Obter base URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                       process.env.NEXT_PUBLIC_APP_URL || 
                       'https://www.ylada.com'

        // Criar token de acesso
        const accessToken = await createAccessToken(userId, 30)

        // Obter nome do usuário (se disponível)
        const { data: userProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('nome_completo')
          .eq('user_id', userId)
          .single()

        // Enviar e-mail
        await sendWelcomeEmail({
          email: payerEmail,
          userName: userProfile?.nome_completo || undefined,
          area: area,
          planType: planType,
          accessToken,
          baseUrl,
        })

        // Marcar como enviado
        await supabaseAdmin
          .from('subscriptions')
          .update({
            welcome_email_sent: true,
            welcome_email_sent_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)

        console.log('✅ E-mail de boas-vindas enviado para assinatura recorrente:', payerEmail)
      } catch (emailError: any) {
        // Não bloquear o fluxo se o e-mail falhar
        console.error('❌ Erro ao enviar e-mail de boas-vindas (recorrente):', emailError)
      }
    }

    console.log('✅ Assinatura recorrente processada:', subscriptionId)
    console.log(`📅 Status: ${mappedStatus}, Próxima cobrança: ${periodEnd.toISOString()}`)
  } catch (error: any) {
    console.error('❌ Erro ao processar assinatura recorrente:', error)
    throw error
  }
}

/**
 * Sincroniza um pagamento pelo ID do Mercado Pago (uso admin quando o webhook não notificou).
 * Busca o pagamento na API do MP e processa como se o webhook tivesse sido recebido.
 */
export async function syncPaymentByIdFromMercadoPago(
  paymentId: string | number,
  isTest: boolean = false
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { Payment } = await import('mercadopago')
    const { createMercadoPagoClient } = await import('@/lib/mercado-pago')
    const client = createMercadoPagoClient(isTest)
    const payment = new Payment(client)
    const fullData = await payment.get({ id: String(paymentId) })
    if (!fullData) {
      return { success: false, error: 'Pagamento não encontrado na API do Mercado Pago.' }
    }
    if (mercadoPagoReversalStatus(fullData.status)) {
      await applyMercadoPagoReversal(String(fullData.id), fullData)
      return { success: true, message: 'Estorno/chargeback sincronizado (assinatura cancelada / free matriz se aplicável).' }
    }
    if (fullData.status !== 'approved') {
      return {
        success: false,
        error: `Pagamento não aprovado. Status: ${fullData.status ?? 'n/a'}`,
      }
    }
    await handlePaymentEvent({ id: fullData.id }, isTest, fullData)
    return { success: true, message: 'Pagamento sincronizado com sucesso.' }
  } catch (e: any) {
    console.error('syncPaymentByIdFromMercadoPago:', e)
    return {
      success: false,
      error: e?.message || 'Erro ao sincronizar pagamento',
    }
  }
}

