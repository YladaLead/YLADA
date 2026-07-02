import type { SupabaseClient } from '@supabase/supabase-js'

const MP_SUB_PREFIX = 'mp_sub_'

export type ProLideresTeamSubSyncRow = {
  id: string
  user_id: string
  stripe_subscription_id: string
  current_period_end: string
}

export type ProLideresTeamSubscriptionMpSyncResult = {
  scanned: number
  synced: number
  skipped: number
  errors: string[]
}

/** Extrai o ID de preapproval MP de `subscriptions.stripe_subscription_id` (`mp_sub_<id>`). */
export function parseMpPreapprovalIdFromStripeSubscriptionId(
  stripeSubscriptionId: string | null | undefined
): string | null {
  if (!stripeSubscriptionId?.startsWith(MP_SUB_PREFIX)) return null
  const id = stripeSubscriptionId.slice(MP_SUB_PREFIX.length).trim()
  return id.length > 0 ? id : null
}

/** Líder deve ver aviso quando a equipe está bloqueada por assinatura base vencida. */
export function proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner(input: {
  isLeaderWorkspace: boolean
  accessOk: boolean
  blockReason: string | null | undefined
}): boolean {
  if (!input.isLeaderWorkspace || input.accessOk) return false
  return (input.blockReason ?? 'base_subscription') === 'base_subscription'
}

/**
 * Assinaturas Pro Líderes equipe com vencimento passado ou nas próximas 24h —
 * re-sincroniza com o MP quando o webhook atrasa a renovação automática.
 */
export async function listProLideresTeamSubscriptionsNeedingMpSync(
  supabase: SupabaseClient,
  nowMs: number = Date.now()
): Promise<ProLideresTeamSubSyncRow[]> {
  const horizonIso = new Date(nowMs + 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, user_id, stripe_subscription_id, current_period_end')
    .eq('area', 'pro_lideres_team')
    .eq('status', 'active')
    .like('stripe_subscription_id', `${MP_SUB_PREFIX}%`)
    .lte('current_period_end', horizonIso)
    .order('current_period_end', { ascending: true })

  if (error) {
    throw new Error(`listProLideresTeamSubscriptionsNeedingMpSync: ${error.message}`)
  }
  return (data ?? []) as ProLideresTeamSubSyncRow[]
}

export async function syncProLideresTeamSubscriptionsFromMercadoPago(
  supabase: SupabaseClient,
  isTest: boolean = process.env.NODE_ENV !== 'production'
): Promise<ProLideresTeamSubscriptionMpSyncResult> {
  const rows = await listProLideresTeamSubscriptionsNeedingMpSync(supabase)
  const result: ProLideresTeamSubscriptionMpSyncResult = {
    scanned: rows.length,
    synced: 0,
    skipped: 0,
    errors: [],
  }

  if (rows.length === 0) return result

  const { syncPreapprovalByIdFromMercadoPago } = await import(
    '@/app/api/webhooks/mercado-pago/route'
  )

  for (const row of rows) {
    const preapprovalId = parseMpPreapprovalIdFromStripeSubscriptionId(row.stripe_subscription_id)
    if (!preapprovalId) {
      result.skipped += 1
      continue
    }
    const sync = await syncPreapprovalByIdFromMercadoPago(preapprovalId, isTest)
    if (sync.success) {
      result.synced += 1
    } else {
      result.errors.push(`${row.id}: ${sync.error ?? 'falha desconhecida'}`)
    }
  }

  return result
}
