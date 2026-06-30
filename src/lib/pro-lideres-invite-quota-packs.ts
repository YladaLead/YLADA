import type { SupabaseClient } from '@supabase/supabase-js'
import { PRO_LIDERES_INVITE_PACK_BRL, PRO_LIDERES_INVITE_SLOTS_PER_PACK } from '@/lib/pro-lideres-invite-slots'

export const PRO_LIDERES_INVITE_QUOTA_PACK_REF_PREFIX = 'plinv50_monthly_'
export const PRO_LIDERES_INVITE_QUOTA_PIX_REF_PREFIX = 'plinv50_pix_'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type ProLideresInviteQuotaPackStatus = 'pending' | 'active' | 'past_due' | 'canceled'

export type ProLideresInviteQuotaPackRow = {
  id: string
  leader_tenant_id: string
  owner_user_id: string
  slots: number
  amount_brl: number
  billing_day: number
  status: ProLideresInviteQuotaPackStatus
  mp_preapproval_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export type ProLideresInviteQuotaPackAccess = {
  ok: boolean
  overduePacks: ProLideresInviteQuotaPackRow[]
}

export function buildProLideresInviteQuotaPackMpExternalReference(packId: string): string {
  const id = packId.trim()
  if (!UUID_RE.test(id)) {
    throw new Error(`pack_id inválido para referência MP: "${packId}"`)
  }
  return `${PRO_LIDERES_INVITE_QUOTA_PACK_REF_PREFIX}${id}`
}

export function buildProLideresInviteQuotaPixMpExternalReference(packId: string): string {
  const id = packId.trim()
  if (!UUID_RE.test(id)) {
    throw new Error(`pack_id inválido para referência PIX MP: "${packId}"`)
  }
  return `${PRO_LIDERES_INVITE_QUOTA_PIX_REF_PREFIX}${id}`
}

export function parsePackIdFromInviteQuotaPackMpRef(externalReference: string | undefined | null): string | null {
  if (!externalReference || typeof externalReference !== 'string') return null
  for (const prefix of [PRO_LIDERES_INVITE_QUOTA_PACK_REF_PREFIX, PRO_LIDERES_INVITE_QUOTA_PIX_REF_PREFIX]) {
    if (!externalReference.startsWith(prefix)) continue
    const id = externalReference.slice(prefix.length).trim()
    if (UUID_RE.test(id)) return id
  }
  return null
}

/** Dia de cobrança (1–31) no fuso de São Paulo. */
export function billingDayFromIsoDate(iso: string): number {
  const day = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', day: 'numeric' }).format(new Date(iso))
  )
  return Number.isFinite(day) && day >= 1 && day <= 31 ? day : 1
}

/** Próximo vencimento mensal preservando o dia de cobrança. */
export function computeInviteQuotaPackPeriodEnd(from: Date, billingDay: number): Date {
  const end = new Date(from.getTime())
  end.setUTCDate(1)
  end.setUTCMonth(end.getUTCMonth() + 1)
  const lastDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate()
  end.setUTCDate(Math.min(Math.max(billingDay, 1), lastDay))
  end.setUTCHours(23, 59, 59, 999)
  return end
}

export function extendInviteQuotaPackPeriodEnd(currentEndIso: string, billingDay: number): string {
  return computeInviteQuotaPackPeriodEnd(new Date(currentEndIso), billingDay).toISOString()
}

export async function loadInviteQuotaPacksForTenant(
  admin: SupabaseClient,
  tenantId: string
): Promise<ProLideresInviteQuotaPackRow[]> {
  const { data, error } = await admin
    .from('pro_lideres_invite_quota_packs')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .neq('status', 'canceled')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[loadInviteQuotaPacksForTenant]', error)
    return []
  }
  return (data ?? []) as ProLideresInviteQuotaPackRow[]
}

async function markPackPastDue(admin: SupabaseClient, packId: string): Promise<void> {
  await admin
    .from('pro_lideres_invite_quota_packs')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('id', packId)
    .eq('status', 'active')
}

/** Marca pacotes vencidos e indica se todos estão em dia (bloqueia o painel se algum atrasar). */
export async function evaluateInviteQuotaPacksAccess(
  admin: SupabaseClient,
  tenantId: string
): Promise<ProLideresInviteQuotaPackAccess> {
  const packs = await loadInviteQuotaPacksForTenant(admin, tenantId)
  const now = Date.now()
  const overduePacks: ProLideresInviteQuotaPackRow[] = []

  for (const pack of packs) {
    if (pack.status === 'pending') continue
    if (pack.status === 'past_due') {
      overduePacks.push(pack)
      continue
    }
    if (pack.status === 'active' && pack.current_period_end) {
      if (new Date(pack.current_period_end).getTime() < now) {
        await markPackPastDue(admin, pack.id)
        overduePacks.push({ ...pack, status: 'past_due' })
      }
    }
  }

  return { ok: overduePacks.length === 0, overduePacks }
}

export async function syncTeamInvitePendingQuotaFromPacks(
  admin: SupabaseClient,
  tenantId: string,
  ownerUserId: string
): Promise<number> {
  const packs = await loadInviteQuotaPacksForTenant(admin, tenantId)
  const paidPackSlots = packs
    .filter((p) => p.status === 'active' || p.status === 'past_due')
    .reduce((sum, p) => sum + (p.slots > 0 ? p.slots : PRO_LIDERES_INVITE_SLOTS_PER_PACK), 0)

  const total = PRO_LIDERES_INVITE_SLOTS_PER_PACK + paidPackSlots

  await admin
    .from('leader_tenants')
    .update({ team_invite_pending_quota: total, updated_at: new Date().toISOString() })
    .eq('id', tenantId)
    .eq('owner_user_id', ownerUserId)

  return total
}

export async function createPendingInviteQuotaPack(
  admin: SupabaseClient,
  params: { leaderTenantId: string; ownerUserId: string; billingDay?: number }
): Promise<ProLideresInviteQuotaPackRow> {
  const billingDay = params.billingDay ?? billingDayFromIsoDate(new Date().toISOString())
  const { data, error } = await admin
    .from('pro_lideres_invite_quota_packs')
    .insert({
      leader_tenant_id: params.leaderTenantId,
      owner_user_id: params.ownerUserId,
      slots: PRO_LIDERES_INVITE_SLOTS_PER_PACK,
      amount_brl: PRO_LIDERES_INVITE_PACK_BRL,
      billing_day: billingDay,
      status: 'pending',
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Erro ao criar pacote de convites.')
  }
  return data as ProLideresInviteQuotaPackRow
}

export async function getInviteQuotaPackById(
  admin: SupabaseClient,
  packId: string
): Promise<ProLideresInviteQuotaPackRow | null> {
  const { data } = await admin.from('pro_lideres_invite_quota_packs').select('*').eq('id', packId).maybeSingle()
  return (data as ProLideresInviteQuotaPackRow | null) ?? null
}

export type ApplyInviteQuotaPackPaymentResult =
  | { ok: true; alreadyProcessed: boolean; packId: string }
  | { ok: false; error: string }

/**
 * Webhook MP: ativa ou renova um pacote +50 (cartão recorrente ou PIX de regularização).
 * Primeira ativação soma +50 na cota; renovações só estendem o período.
 */
export async function applyInviteQuotaPackPaymentFromMercadoPago(
  admin: SupabaseClient,
  params: {
    paymentId: string
    packId: string
    transactionAmount: number
    checkoutAccountEmail?: string | null
    mpPayer?: {
      email?: string | null
      name?: string | null
      id?: string | null
      cardholderName?: string | null
      cardLastFour?: string | null
    } | null
    viaPix?: boolean
  }
): Promise<ApplyInviteQuotaPackPaymentResult> {
  const { paymentId, packId, transactionAmount, checkoutAccountEmail, mpPayer, viaPix = false } = params

  const { data: existingReceipt } = await admin
    .from('pro_lideres_invite_quota_mp_receipts')
    .select('mercado_pago_payment_id')
    .eq('mercado_pago_payment_id', paymentId)
    .maybeSingle()

  if (existingReceipt?.mercado_pago_payment_id) {
    return { ok: true, alreadyProcessed: true, packId }
  }

  if (Math.abs(Number(transactionAmount) - PRO_LIDERES_INVITE_PACK_BRL) > 0.02) {
    return {
      ok: false,
      error: `Valor (${transactionAmount}) não corresponde ao pacote (R$ ${PRO_LIDERES_INVITE_PACK_BRL}).`,
    }
  }

  const pack = await getInviteQuotaPackById(admin, packId)
  if (!pack) return { ok: false, error: 'Pacote não encontrado.' }

  const isFirstActivation = pack.status === 'pending'
  const isRenewal = pack.status === 'active' && !viaPix
  const isCatchUp = pack.status === 'past_due' || viaPix

  const periodStart = new Date().toISOString()
  const periodEnd = isRenewal && pack.current_period_end
    ? extendInviteQuotaPackPeriodEnd(pack.current_period_end, pack.billing_day)
    : computeInviteQuotaPackPeriodEnd(new Date(), pack.billing_day).toISOString()

  const checkoutEmail =
    typeof checkoutAccountEmail === 'string' && checkoutAccountEmail.trim()
      ? checkoutAccountEmail.trim().toLowerCase()
      : null

  const { error: insErr } = await admin.from('pro_lideres_invite_quota_mp_receipts').insert({
    mercado_pago_payment_id: paymentId,
    leader_tenant_id: pack.leader_tenant_id,
    owner_user_id: pack.owner_user_id,
    amount_brl: Number(transactionAmount.toFixed(2)),
    slots_added: pack.slots,
    pack_id: pack.id,
    is_renewal: isRenewal,
    checkout_account_email: checkoutEmail,
    mp_payer_email: mpPayer?.email ?? null,
    mp_payer_name: mpPayer?.name ?? null,
    mp_payer_id: mpPayer?.id ?? null,
    mp_cardholder_name: mpPayer?.cardholderName ?? null,
    mp_card_last_four: mpPayer?.cardLastFour ?? null,
  })

  if (insErr) {
    if (insErr.code === '23505') return { ok: true, alreadyProcessed: true, packId }
    return { ok: false, error: insErr.message || 'Erro ao registar pagamento.' }
  }

  const { error: updErr } = await admin
    .from('pro_lideres_invite_quota_packs')
    .update({
      status: 'active',
      current_period_start: isRenewal && pack.current_period_start ? pack.current_period_start : periodStart,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pack.id)

  if (updErr) {
    await admin.from('pro_lideres_invite_quota_mp_receipts').delete().eq('mercado_pago_payment_id', paymentId)
    return { ok: false, error: updErr.message || 'Erro ao atualizar pacote.' }
  }

  if (isFirstActivation || isCatchUp) {
    await syncTeamInvitePendingQuotaFromPacks(admin, pack.leader_tenant_id, pack.owner_user_id)
  }

  return { ok: true, alreadyProcessed: false, packId }
}

export async function linkInviteQuotaPackPreapproval(
  admin: SupabaseClient,
  packId: string,
  mpPreapprovalId: string
): Promise<void> {
  await admin
    .from('pro_lideres_invite_quota_packs')
    .update({
      mp_preapproval_id: mpPreapprovalId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', packId)
}

/** Webhook preapproval MP: vincula ou suspende pacote +50 recorrente. */
export async function tryHandleProLideresInviteQuotaPackPreapprovalWebhook(
  admin: SupabaseClient,
  fullData: Record<string, unknown>
): Promise<boolean> {
  const ext = typeof fullData.external_reference === 'string' ? fullData.external_reference : ''
  if (!ext.startsWith(PRO_LIDERES_INVITE_QUOTA_PACK_REF_PREFIX)) return false

  const packId = parsePackIdFromInviteQuotaPackMpRef(ext)
  if (!packId) return false

  const pack = await getInviteQuotaPackById(admin, packId)
  if (!pack) {
    console.error('[tryHandleProLideresInviteQuotaPackPreapprovalWebhook] pack não encontrado', packId)
    return true
  }

  const mpStatus = String(fullData.status || '')
  const preapprovalId = String(fullData.id || '')

  if (mpStatus === 'cancelled' || mpStatus === 'paused') {
    await admin
      .from('pro_lideres_invite_quota_packs')
      .update({
        status: 'past_due',
        mp_preapproval_id: preapprovalId || pack.mp_preapproval_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', packId)
    await syncTeamInvitePendingQuotaFromPacks(admin, pack.leader_tenant_id, pack.owner_user_id)
    return true
  }

  if (mpStatus === 'authorized' && preapprovalId) {
    await linkInviteQuotaPackPreapproval(admin, packId, preapprovalId)
  }

  return true
}
