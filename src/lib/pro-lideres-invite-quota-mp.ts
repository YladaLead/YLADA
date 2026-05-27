import type { SupabaseClient } from '@supabase/supabase-js'
import {
  extractMercadoPagoPayerFromPayment,
  type MercadoPagoPayerSnapshot,
} from '@/lib/mercado-pago-payer'

export type { MercadoPagoPayerSnapshot }
export { extractMercadoPagoPayerFromPayment }

/** Prefixo em external_reference da Preference (tenant UUID após os dois underscores). */
export const PRO_LIDERES_INVITE_QUOTA_MP_REF_PREFIX = 'yl_pl_inv50__'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function buildProLideresInviteQuotaMpExternalReference(leaderTenantId: string): string {
  const id = leaderTenantId.trim()
  if (!UUID_RE.test(id)) {
    throw new Error('leader_tenant_id inválido para referência MP.')
  }
  return `${PRO_LIDERES_INVITE_QUOTA_MP_REF_PREFIX}${id}`
}

export function parseLeaderTenantIdFromInviteQuotaMpRef(externalReference: string | undefined | null): string | null {
  if (!externalReference || typeof externalReference !== 'string') return null
  if (!externalReference.startsWith(PRO_LIDERES_INVITE_QUOTA_MP_REF_PREFIX)) return null
  const id = externalReference.slice(PRO_LIDERES_INVITE_QUOTA_MP_REF_PREFIX.length).trim()
  return UUID_RE.test(id) ? id : null
}

const EXPECTED_BRL = 750
const AMOUNT_TOLERANCE = 0.02

export type ApplyInviteQuotaTopupResult =
  | { ok: true; alreadyProcessed: boolean; newQuota?: number }
  | { ok: false; error: string }

/**
 * Webhook MP: confirma pagamento aprovado e soma +50 em team_invite_pending_quota (idempotente por payment id).
 */
export async function applyLeaderTenantInviteQuotaTopupFromMercadoPago(
  admin: SupabaseClient,
  params: {
    paymentId: string
    leaderTenantId: string
    ownerUserIdFromCheckout: string
    transactionAmount: number
    checkoutAccountEmail?: string | null
    mpPayer?: MercadoPagoPayerSnapshot | null
  }
): Promise<ApplyInviteQuotaTopupResult> {
  const { paymentId, leaderTenantId, ownerUserIdFromCheckout, transactionAmount, checkoutAccountEmail, mpPayer } =
    params

  const { data: existing } = await admin
    .from('pro_lideres_invite_quota_mp_receipts')
    .select('mercado_pago_payment_id, mp_payer_email, mp_cardholder_name')
    .eq('mercado_pago_payment_id', paymentId)
    .maybeSingle()

  if (existing?.mercado_pago_payment_id) {
    if (mpPayer && (!existing.mp_payer_email || !existing.mp_cardholder_name)) {
      await admin
        .from('pro_lideres_invite_quota_mp_receipts')
        .update({
          mp_payer_email: mpPayer.email,
          mp_payer_name: mpPayer.name,
          mp_payer_id: mpPayer.id,
          mp_cardholder_name: mpPayer.cardholderName,
          mp_card_last_four: mpPayer.cardLastFour,
          ...(checkoutAccountEmail
            ? { checkout_account_email: checkoutAccountEmail.trim().toLowerCase() }
            : {}),
        })
        .eq('mercado_pago_payment_id', paymentId)
    }
    return { ok: true, alreadyProcessed: true }
  }

  if (Math.abs(Number(transactionAmount) - EXPECTED_BRL) > AMOUNT_TOLERANCE) {
    return {
      ok: false,
      error: `Valor do pagamento (${transactionAmount}) não corresponde ao pacote (R$ ${EXPECTED_BRL}).`,
    }
  }

  const { data: tenant, error: tErr } = await admin
    .from('leader_tenants')
    .select('id, owner_user_id, team_invite_pending_quota')
    .eq('id', leaderTenantId)
    .maybeSingle()

  if (tErr || !tenant) {
    return { ok: false, error: 'Tenant não encontrado.' }
  }
  if (String(tenant.owner_user_id) !== String(ownerUserIdFromCheckout)) {
    return { ok: false, error: 'Tenant não pertence ao utilizador do checkout.' }
  }

  const slots = 50
  const current =
    typeof tenant.team_invite_pending_quota === 'number' && tenant.team_invite_pending_quota > 0
      ? tenant.team_invite_pending_quota
      : 50
  const newQuota = current + slots

  const checkoutEmail =
    typeof checkoutAccountEmail === 'string' && checkoutAccountEmail.trim()
      ? checkoutAccountEmail.trim().toLowerCase()
      : null

  const { error: insErr } = await admin.from('pro_lideres_invite_quota_mp_receipts').insert({
    mercado_pago_payment_id: paymentId,
    leader_tenant_id: leaderTenantId,
    owner_user_id: ownerUserIdFromCheckout,
    amount_brl: Number(transactionAmount.toFixed(2)),
    slots_added: slots,
    checkout_account_email: checkoutEmail,
    mp_payer_email: mpPayer?.email ?? null,
    mp_payer_name: mpPayer?.name ?? null,
    mp_payer_id: mpPayer?.id ?? null,
    mp_cardholder_name: mpPayer?.cardholderName ?? null,
    mp_card_last_four: mpPayer?.cardLastFour ?? null,
  })

  if (insErr) {
    if (insErr.code === '23505') {
      return { ok: true, alreadyProcessed: true }
    }
    console.error('[applyLeaderTenantInviteQuotaTopupFromMercadoPago] insert receipt', insErr)
    return { ok: false, error: insErr.message || 'Erro ao registar pagamento.' }
  }

  const { error: updErr } = await admin
    .from('leader_tenants')
    .update({
      team_invite_pending_quota: newQuota,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leaderTenantId)
    .eq('owner_user_id', ownerUserIdFromCheckout)

  if (updErr) {
    console.error('[applyLeaderTenantInviteQuotaTopupFromMercadoPago] update quota', updErr)
    await admin.from('pro_lideres_invite_quota_mp_receipts').delete().eq('mercado_pago_payment_id', paymentId)
    return { ok: false, error: updErr.message || 'Erro ao atualizar cota.' }
  }

  return { ok: true, alreadyProcessed: false, newQuota }
}

/**
 * Estorno/chargeback: reverte +50 deste pagamento se ainda existir recibo.
 */
export async function reverseLeaderTenantInviteQuotaTopupFromMercadoPago(
  admin: SupabaseClient,
  paymentId: string
): Promise<boolean> {
  const { data: rec } = await admin
    .from('pro_lideres_invite_quota_mp_receipts')
    .select('leader_tenant_id, owner_user_id, slots_added')
    .eq('mercado_pago_payment_id', paymentId)
    .maybeSingle()

  if (!rec?.leader_tenant_id) return false

  const slots = typeof rec.slots_added === 'number' && rec.slots_added > 0 ? rec.slots_added : 50
  const owner = String(rec.owner_user_id)

  const { data: tenant } = await admin
    .from('leader_tenants')
    .select('team_invite_pending_quota')
    .eq('id', rec.leader_tenant_id)
    .eq('owner_user_id', owner)
    .maybeSingle()

  const cur =
    typeof tenant?.team_invite_pending_quota === 'number' && tenant.team_invite_pending_quota >= 0
      ? tenant.team_invite_pending_quota
      : 0
  const next = Math.max(0, cur - slots)

  await admin
    .from('leader_tenants')
    .update({ team_invite_pending_quota: next, updated_at: new Date().toISOString() })
    .eq('id', rec.leader_tenant_id)
    .eq('owner_user_id', owner)

  await admin.from('pro_lideres_invite_quota_mp_receipts').delete().eq('mercado_pago_payment_id', paymentId)
  console.log('↩️ Cota Pro Líderes revertida (estorno MP):', paymentId, 'tenant', rec.leader_tenant_id, next)
  return true
}

/**
 * Se for pagamento do pacote +50 convites, aplica cota e devolve true (fluxo principal do webhook deve terminar).
 */
export async function tryHandleProLideresInviteQuotaTopupWebhook(
  admin: SupabaseClient,
  fullData: Parameters<typeof extractMercadoPagoPayerFromPayment>[0] & {
    external_reference?: string | null
    metadata?: Record<string, unknown> | null
    transaction_amount?: number
  },
  paymentId: string
): Promise<boolean> {
  const tenantId = parseLeaderTenantIdFromInviteQuotaMpRef(fullData.external_reference ?? undefined)
  if (!tenantId) return false

  const ownerUserId =
    typeof fullData.metadata?.user_id === 'string'
      ? fullData.metadata.user_id
      : fullData.metadata?.user_id != null
        ? String(fullData.metadata.user_id)
        : ''
  if (!ownerUserId || !UUID_RE.test(ownerUserId)) {
    console.error('[tryHandleProLideresInviteQuotaTopupWebhook] metadata.user_id em falta ou inválido', paymentId)
    return true
  }

  const amount = Number(fullData.transaction_amount ?? 0)
  const mpPayer = extractMercadoPagoPayerFromPayment(fullData)
  const checkoutEmail =
    typeof fullData.metadata?.checkout_account_email === 'string'
      ? fullData.metadata.checkout_account_email
      : null

  const result = await applyLeaderTenantInviteQuotaTopupFromMercadoPago(admin, {
    paymentId,
    leaderTenantId: tenantId,
    ownerUserIdFromCheckout: ownerUserId,
    transactionAmount: amount,
    checkoutAccountEmail: checkoutEmail,
    mpPayer,
  })

  if (!result.ok) {
    console.error('[tryHandleProLideresInviteQuotaTopupWebhook]', paymentId, result.error)
    return true
  }
  if (result.alreadyProcessed) {
    console.log('✅ Pacote +50 convites MP já processado:', paymentId)
  } else {
    console.log('✅ Pacote +50 convites MP aplicado:', paymentId, 'nova cota', result.newQuota)
  }
  return true
}
