import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  RC_SUBSCRIPTION_AREA,
  planTypeFromProductId,
  iapFeaturesForPlan,
  iapSubscriptionKey,
  type IapPlanType,
} from '@/lib/revenuecat'

/**
 * POST /api/webhooks/revenuecat
 *
 * Recebe os eventos do RevenueCat (compras IAP no app iOS) e grava/atualiza a
 * assinatura na tabela `subscriptions` — exatamente como o webhook do Mercado
 * Pago faz para a web. A "fonte da verdade" de acesso (hasYladaProPlan /
 * hasActiveSubscription) NÃO muda: ela só lê a tabela, sem se importar com a
 * origem do pagamento.
 *
 * Segurança: o RevenueCat envia um header Authorization fixo (configurado no
 * painel). Comparamos com REVENUECAT_WEBHOOK_AUTH. Sem isso, 401.
 *
 * Idempotência: upsert com onConflict em `stripe_subscription_id`
 * (`rc_sub_<original_transaction_id>`), estável entre renovações.
 *
 * Aditivo e isolado: NÃO toca em nada do fluxo Mercado Pago/Stripe.
 */

export const dynamic = 'force-dynamic'

/** Eventos que mantêm/ativam o acesso (gravam status active até a expiração). */
const ACTIVATING_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_EXTENDED',
])

/**
 * BILLING_ISSUE: ainda há período de carência (grace). Mantemos o acesso até a
 * `expiration_at_ms` que o RevenueCat manda (fim da carência).
 */
const GRACE_EVENTS = new Set(['BILLING_ISSUE'])

/** Eventos que encerram o acesso imediatamente. */
const TERMINATING_EVENTS = new Set(['EXPIRATION'])

/**
 * CANCELLATION no RevenueCat = usuário desligou a renovação automática, MAS
 * continua com acesso até a expiração. Não encerra o acesso; só marca
 * cancel_at_period_end. (Tratado à parte.)
 */

function looksLikeUuid(value: string | null | undefined): boolean {
  if (!value) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value).trim())
}

/**
 * Resolve o user_id do Supabase a partir do evento. Como chamamos
 * Purchases.logIn(user.id) no app, o app_user_id JÁ é o user_id do Supabase.
 * Fazemos fallback por original_app_user_id e aliases por garantia.
 */
function resolveUserId(event: any): string | null {
  const candidates: Array<string | undefined> = [
    event?.app_user_id,
    event?.original_app_user_id,
    ...(Array.isArray(event?.aliases) ? event.aliases : []),
  ]
  for (const c of candidates) {
    if (looksLikeUuid(c)) return String(c).trim()
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    // 1) Autenticação do webhook (header Authorization fixo configurado no RevenueCat).
    const expected = process.env.REVENUECAT_WEBHOOK_AUTH
    if (expected) {
      const got = request.headers.get('authorization') || ''
      if (got !== expected) {
        console.warn('⚠️ RevenueCat webhook: Authorization inválido')
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      }
    } else {
      console.warn('⚠️ REVENUECAT_WEBHOOK_AUTH não configurado — webhook sem verificação de segredo')
    }

    const body = await request.json().catch(() => null)
    const event = body?.event
    if (!event || !event.type) {
      return NextResponse.json({ ok: true, ignored: 'sem event.type' }, { status: 200 })
    }

    const type = String(event.type)

    // 2) Evento de teste do painel RevenueCat → só confirmar 200.
    if (type === 'TEST') {
      console.log('✅ RevenueCat webhook TEST recebido')
      return NextResponse.json({ ok: true, test: true }, { status: 200 })
    }

    // 3) TRANSFER e demais eventos sem ação direta na linha → 200 (sem retry).
    const handled =
      ACTIVATING_EVENTS.has(type) ||
      GRACE_EVENTS.has(type) ||
      TERMINATING_EVENTS.has(type) ||
      type === 'CANCELLATION'
    if (!handled) {
      console.log(`ℹ️ RevenueCat webhook: evento ${type} sem ação (ok)`)
      return NextResponse.json({ ok: true, ignored: type }, { status: 200 })
    }

    // 4) Resolver usuário e plano.
    const userId = resolveUserId(event)
    if (!userId) {
      // Sem como mapear (ex.: id anônimo do RC porque o logIn não rodou).
      // Respondemos 200 para o RC não reenviar para sempre, mas logamos.
      console.error('❌ RevenueCat webhook: não foi possível resolver user_id', {
        app_user_id: event?.app_user_id,
        type,
      })
      return NextResponse.json({ ok: true, warning: 'user_id não resolvido' }, { status: 200 })
    }

    const productId: string | undefined = event?.product_id
    const planType: IapPlanType | null = planTypeFromProductId(productId)
    if (!planType) {
      console.error('❌ RevenueCat webhook: product_id desconhecido', { productId, type })
      return NextResponse.json({ ok: true, warning: 'product_id desconhecido' }, { status: 200 })
    }

    const nowIso = new Date().toISOString()
    const expirationMs: number | undefined = event?.expiration_at_ms
    const purchasedMs: number | undefined = event?.purchased_at_ms
    const periodEndIso = expirationMs
      ? new Date(expirationMs).toISOString()
      : null
    const periodStartIso = purchasedMs ? new Date(purchasedMs).toISOString() : nowIso

    if (!periodEndIso) {
      // Sem expiração não dá para gravar vigência confiável.
      console.error('❌ RevenueCat webhook: sem expiration_at_ms', { type })
      return NextResponse.json({ ok: true, warning: 'sem expiração' }, { status: 200 })
    }

    // 5) Definir status/flags conforme o tipo de evento.
    let status: string
    let cancelAtPeriodEnd = false
    let canceledAtIso: string | null = null

    if (TERMINATING_EVENTS.has(type)) {
      status = 'canceled'
      canceledAtIso = nowIso
    } else if (type === 'CANCELLATION') {
      // Auto-renovação desligada: mantém acesso até expirar.
      status = 'active'
      cancelAtPeriodEnd = true
      canceledAtIso = nowIso
    } else {
      // INITIAL_PURCHASE, RENEWAL, UNCANCELLATION, PRODUCT_CHANGE, BILLING_ISSUE(grace)…
      status = 'active'
    }

    // 6) Montar a linha (espelha o upsert do webhook Mercado Pago).
    const subKey = iapSubscriptionKey(event?.original_transaction_id, userId)
    const priceRaw =
      typeof event?.price_in_purchased_currency === 'number'
        ? event.price_in_purchased_currency
        : typeof event?.price === 'number'
          ? event.price
          : 0
    const currency = String(event?.currency || 'brl').toLowerCase()

    const row = {
      user_id: userId,
      area: RC_SUBSCRIPTION_AREA,
      plan_type: planType,
      features: iapFeaturesForPlan(planType),
      stripe_account: null,
      stripe_subscription_id: subKey,
      stripe_customer_id: String(event?.original_app_user_id || userId),
      stripe_price_id: productId || 'revenuecat',
      amount: Math.round(priceRaw * 100),
      currency,
      status,
      current_period_start: periodStartIso,
      current_period_end: periodEndIso,
      cancel_at_period_end: cancelAtPeriodEnd,
      canceled_at: canceledAtIso,
      updated_at: nowIso,
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .upsert(row, { onConflict: 'stripe_subscription_id' })
      .select()
      .single()

    if (error) {
      console.error('❌ RevenueCat webhook: erro ao gravar subscription:', error)
      // 500 → RevenueCat reenviará (queremos retry em erro de banco).
      return NextResponse.json({ error: 'db_error' }, { status: 500 })
    }

    console.log(
      `✅ RevenueCat ${type}: user=${userId} area=${RC_SUBSCRIPTION_AREA} plan=${planType} status=${status} até=${periodEndIso}`,
    )
    return NextResponse.json({ ok: true, id: data?.id }, { status: 200 })
  } catch (error: any) {
    console.error('❌ RevenueCat webhook: exceção:', error)
    return NextResponse.json({ error: error?.message || 'erro' }, { status: 500 })
  }
}
