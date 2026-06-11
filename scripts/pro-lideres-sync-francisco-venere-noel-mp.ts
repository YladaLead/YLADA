#!/usr/bin/env npx tsx
/**
 * Sincroniza pagamento MP 160169962971 (Noel membro Pro Líderes — Francisco Venere)
 * e define o período a partir da data real do pagamento (25/05/2026).
 *
 * Uso: npx tsx scripts/pro-lideres-sync-francisco-venere-noel-mp.ts
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { Payment } from 'mercadopago'
import { createMercadoPagoClient } from '../src/lib/mercado-pago'

config({ path: '.env.local' })
config({ path: '.env' })

const PAYMENT_ID = '160169962971'
const USER_ID = '50687700-0e12-4871-b69d-79b20afad34d'
const AREA = 'pro_lideres_noel_member'
const PREAPPROVAL_ID = 'e5be9db79606472c8d26fa3f254b19ef'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function periodEndFromStart(start: Date): string {
  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)
  return end.toISOString()
}

async function main() {
  const client = createMercadoPagoClient(false)
  const payment = new Payment(client)
  const mp = await payment.get({ id: PAYMENT_ID })

  if (!mp?.id || mp.status !== 'approved') {
    throw new Error(`Pagamento ${PAYMENT_ID} não aprovado: ${mp?.status ?? 'não encontrado'}`)
  }

  const ref = String(mp.external_reference || '')
  if (!ref.includes(USER_ID) || !ref.startsWith('plnoelmem_')) {
    throw new Error(`Referência inesperada: ${ref}`)
  }

  const amountCents = Math.round(Number(mp.transaction_amount || 40) * 100)
  const payerId = mp.payer?.id?.toString() || 'mp_customer'
  const stripeSubId = `mp_sub_${PREAPPROVAL_ID}`

  // Data do pagamento no MP (date_approved ou date_created)
  const paidAtRaw =
    (mp as { date_approved?: string }).date_approved ||
    (mp as { date_created?: string }).date_created ||
    '2026-05-25T17:57:00.000Z'
  const periodStart = new Date(paidAtRaw)
  const periodEnd = periodEndFromStart(periodStart)

  console.log('MP pagamento:', {
    id: mp.id,
    status: mp.status,
    amount: mp.transaction_amount,
    payer: mp.payer?.email,
    periodStart: periodStart.toISOString(),
    periodEnd,
  })

  const { data: existingPay } = await admin
    .from('payments')
    .select('id')
    .eq('stripe_payment_intent_id', PAYMENT_ID)
    .maybeSingle()

  const { data: existingSub } = await admin
    .from('subscriptions')
    .select('id, current_period_end')
    .eq('user_id', USER_ID)
    .eq('area', AREA)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let subscriptionId: string

  const subPayload = {
    user_id: USER_ID,
    area: AREA,
    plan_type: 'monthly' as const,
    features: ['noel_campo_pro_lideres'],
    stripe_account: null,
    stripe_subscription_id: stripeSubId,
    stripe_customer_id: payerId,
    stripe_price_id: 'mp_price',
    amount: amountCents,
    currency: 'brl',
    status: 'active',
    current_period_start: periodStart.toISOString(),
    current_period_end: periodEnd,
    cancel_at_period_end: false,
    updated_at: new Date().toISOString(),
  }

  if (existingSub?.id) {
    const { error } = await admin.from('subscriptions').update(subPayload).eq('id', existingSub.id)
    if (error) throw new Error(`subscription update: ${error.message}`)
    subscriptionId = existingSub.id
    console.log('✓ Assinatura atualizada:', subscriptionId)
  } else {
    const { data: inserted, error } = await admin
      .from('subscriptions')
      .insert({
        ...subPayload,
        welcome_email_sent: false,
        created_at: periodStart.toISOString(),
      })
      .select('id')
      .single()
    if (error) throw new Error(`subscription insert: ${error.message}`)
    subscriptionId = inserted.id as string
    console.log('✓ Assinatura criada:', subscriptionId)
  }

  if (!existingPay?.id) {
    const { error: payErr } = await admin.from('payments').insert({
      subscription_id: subscriptionId,
      user_id: USER_ID,
      stripe_account: null,
      stripe_payment_intent_id: PAYMENT_ID,
      stripe_invoice_id: mp.order?.id?.toString() || null,
      amount: amountCents,
      currency: 'brl',
      status: 'succeeded',
      payment_method: mp.payment_method_id || 'unknown',
      created_at: periodStart.toISOString(),
      updated_at: new Date().toISOString(),
    })
    if (payErr) throw new Error(`payment insert: ${payErr.message}`)
    console.log('✓ Pagamento registrado:', PAYMENT_ID)
  } else {
    console.log('✓ Pagamento já existia:', PAYMENT_ID)
  }

  const { data: verify } = await admin
    .from('subscriptions')
    .select('status, current_period_start, current_period_end, stripe_subscription_id')
    .eq('id', subscriptionId)
    .single()

  const endMs = new Date(verify?.current_period_end || 0).getTime()
  const active = verify?.status === 'active' && endMs > Date.now()

  console.log('\n✅ Francisco Venere — Noel membro Pro Líderes')
  console.log('   Período:', verify?.current_period_start?.slice(0, 10), '→', verify?.current_period_end?.slice(0, 10))
  console.log('   Ativo agora:', active ? 'sim' : 'não (verificar datas)')
  console.log('   Chat: https://www.ylada.com/pro-lideres/membro/noel-membro')
}

main().catch((e) => {
  console.error('\n❌', e instanceof Error ? e.message : e)
  process.exit(1)
})
