import type { SupabaseClient } from '@supabase/supabase-js'
import { daysUntilEsteticaConsultAccessEnds } from '@/lib/estetica-consult-access'
import { PRO_ESTETICA_CAPILAR_VERTICAL_CODE } from '@/lib/pro-estetica-capilar-server'
import { isProEsteticaCapilarBootstrapLeaderEmail } from '@/lib/pro-estetica-capilar-server'
import { hasActiveSubscription } from '@/lib/subscription-helpers'

export const PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA = 'pro_estetica_capilar' as const

/** Slug curto no external_reference do Mercado Pago (ver `toMercadoPagoExternalAreaSlug`). */
export const PRO_ESTETICA_CAPILAR_MP_AREA_SLUG = 'pecapilar'

/** Link curto para enviar à cliente (login → checkout). */
export const PRO_ESTETICA_CAPILAR_ASSINATURA_PUBLIC_PATH = '/pro-estetica-capilar/assinatura'
export const PRO_ESTETICA_CAPILAR_ASSINATURA_PAINEL_PATH = '/pro-estetica-capilar/painel/assinatura'
export const PRO_ESTETICA_CAPILAR_ENTRAR_ASSINATURA_PATH = `/pro-estetica-capilar/entrar?next=${encodeURIComponent(PRO_ESTETICA_CAPILAR_ASSINATURA_PAINEL_PATH)}`

/** Mensalidade avulsa (recorrente todo mês). */
export const PRO_ESTETICA_CAPILAR_MONTHLY_BRL_DEFAULT = 300
/** Anual: cobrança única a cada 12 meses = 12 × R$ 150. */
export const PRO_ESTETICA_CAPILAR_ANNUAL_TOTAL_BRL_DEFAULT = 1800
export const PRO_ESTETICA_CAPILAR_ANNUAL_MONTHLY_EQUIVALENT_BRL_DEFAULT = 150

function parseEnvAmount(raw: string | undefined, fallback: number): number {
  if (!raw?.trim()) return fallback
  const n = Number(raw.trim().replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : fallback
}

export function proEsteticaCapilarMonthlyAmountBrl(): number {
  return parseEnvAmount(
    process.env.PRO_ESTETICA_CAPILAR_MONTHLY_BRL,
    PRO_ESTETICA_CAPILAR_MONTHLY_BRL_DEFAULT
  )
}

export function proEsteticaCapilarAnnualTotalAmountBrl(): number {
  return parseEnvAmount(
    process.env.PRO_ESTETICA_CAPILAR_ANNUAL_TOTAL_BRL,
    PRO_ESTETICA_CAPILAR_ANNUAL_TOTAL_BRL_DEFAULT
  )
}

export function proEsteticaCapilarAnnualMonthlyEquivalentBrl(): number {
  const total = proEsteticaCapilarAnnualTotalAmountBrl()
  return Math.round((total / 12) * 100) / 100
}

export type ProEsteticaCapilarPlanType = 'monthly' | 'annual'

export function proEsteticaCapilarCheckoutAmountBrl(planType: ProEsteticaCapilarPlanType): number {
  return planType === 'annual' ? proEsteticaCapilarAnnualTotalAmountBrl() : proEsteticaCapilarMonthlyAmountBrl()
}

function toYmd(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function parseYmd(s: string | null | undefined): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}/.test(String(s).trim())) return null
  const d = new Date(`${String(s).trim().slice(0, 10)}T12:00:00.000Z`)
  return Number.isFinite(d.getTime()) ? d : null
}

/** Soma meses a uma data YYYY-MM-DD (calendário UTC noon). */
export function addMonthsToYmd(baseYmd: string, months: number): string {
  const d = parseYmd(baseYmd) ?? new Date()
  const out = new Date(d)
  out.setUTCMonth(out.getUTCMonth() + months)
  return toYmd(out)
}

export type ExtendProEsteticaCapilarAccessResult = {
  extended: boolean
  clientIds: string[]
  accessValidUntil: string | null
  createdClient?: boolean
  warning?: string
}

/**
 * Estende `access_valid_until` nas fichas de consultoria ligadas ao tenant capilar / e-mail da dona.
 * Usado pelo webhook MP (assinatura + cobranças mensais).
 */
export async function extendProEsteticaCapilarConsultAccess(
  admin: SupabaseClient,
  args: {
    userId: string
    userEmail?: string | null
    months?: number
    paymentAmountBrl?: number | null
  }
): Promise<ExtendProEsteticaCapilarAccessResult> {
  const months = args.months ?? 1
  const emailNorm = args.userEmail?.trim().toLowerCase() || null

  const { data: tenant } = await admin
    .from('leader_tenants')
    .select('id, vertical_code, contact_email')
    .eq('owner_user_id', args.userId)
    .eq('vertical_code', PRO_ESTETICA_CAPILAR_VERTICAL_CODE)
    .maybeSingle()

  if (!tenant?.id) {
    return {
      extended: false,
      clientIds: [],
      accessValidUntil: null,
      warning: 'Tenant capilar não encontrado para o utilizador.',
    }
  }

  const tenantId = tenant.id as string
  const clientIds = new Set<string>()

  const { data: byTenant } = await admin
    .from('ylada_estetica_consult_clients')
    .select('id, access_valid_until, segment')
    .eq('leader_tenant_id', tenantId)

  for (const row of byTenant || []) {
    if (row?.id) clientIds.add(row.id as string)
  }

  if (emailNorm) {
    const { data: byEmail } = await admin
      .from('ylada_estetica_consult_clients')
      .select('id')
      .ilike('contact_email', emailNorm)
    for (const row of byEmail || []) {
      if (row?.id) clientIds.add(row.id as string)
    }
  }

  let createdClient = false
  if (clientIds.size === 0) {
    const businessName =
      emailNorm?.split('@')[0]?.replace(/[._-]/g, ' ')?.trim() || 'Clínica Pro Estética Capilar'
    const { data: inserted, error: insErr } = await admin
      .from('ylada_estetica_consult_clients')
      .insert({
        business_name: businessName.slice(0, 300),
        segment: 'capilar',
        contact_email: emailNorm,
        leader_tenant_id: tenantId,
        access_valid_until: addMonthsToYmd(toYmd(new Date()), months),
        last_payment_at: new Date().toISOString(),
        consulting_paid_amount: args.paymentAmountBrl ?? null,
        payment_currency: 'BRL',
        is_annual_plan: false,
      })
      .select('id')
      .single()
    if (insErr) {
      return {
        extended: false,
        clientIds: [],
        accessValidUntil: null,
        warning: `Sem ficha consultoria e falha ao criar: ${insErr.message}`,
      }
    }
    if (inserted?.id) {
      clientIds.add(inserted.id as string)
      createdClient = true
    }
  }

  const todayYmd = toYmd(new Date())
  let latestUntil: string | null = null

  for (const clientId of clientIds) {
    const { data: row } = await admin
      .from('ylada_estetica_consult_clients')
      .select('access_valid_until')
      .eq('id', clientId)
      .maybeSingle()

    const cur = (row as { access_valid_until?: string | null } | null)?.access_valid_until
    const base =
      cur && daysUntilEsteticaConsultAccessEnds(cur) != null && (daysUntilEsteticaConsultAccessEnds(cur) ?? -1) >= 0
        ? String(cur).slice(0, 10)
        : todayYmd
    const nextUntil = addMonthsToYmd(base, months)
    if (!latestUntil || nextUntil > latestUntil) latestUntil = nextUntil

    const patch: Record<string, unknown> = {
      access_valid_until: nextUntil,
      last_payment_at: new Date().toISOString(),
      leader_tenant_id: tenantId,
      access_expiry_reminder_sent_15d: false,
      access_expiry_reminder_sent_7d: false,
      access_expiry_reminder_sent_1d: false,
      updated_at: new Date().toISOString(),
    }
    if (args.paymentAmountBrl != null && Number.isFinite(args.paymentAmountBrl)) {
      patch.consulting_paid_amount = args.paymentAmountBrl
      patch.payment_currency = 'BRL'
    }
    if (emailNorm) {
      patch.contact_email = emailNorm
    }

    await admin.from('ylada_estetica_consult_clients').update(patch).eq('id', clientId)
  }

  return {
    extended: clientIds.size > 0,
    clientIds: [...clientIds],
    accessValidUntil: latestUntil,
    createdClient,
  }
}

export async function proEsteticaCapilarPaidAccessOk(
  admin: SupabaseClient,
  args: { userId: string; userEmail?: string | null; tenantId: string }
): Promise<boolean> {
  if (isProEsteticaCapilarBootstrapLeaderEmail(args.userEmail)) return true
  if (await hasActiveSubscription(args.userId, PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA)) return true

  const { data } = await admin
    .from('ylada_estetica_consult_clients')
    .select('access_valid_until')
    .eq('leader_tenant_id', args.tenantId)
    .order('access_valid_until', { ascending: false })
    .limit(1)
    .maybeSingle()

  const until = (data as { access_valid_until?: string | null } | null)?.access_valid_until
  const days = daysUntilEsteticaConsultAccessEnds(until)
  return days != null && days >= 0
}

export function mapMercadoPagoAreaSlugToProEsteticaCapilar(area: string): string {
  if (area === PRO_ESTETICA_CAPILAR_MP_AREA_SLUG) return PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA
  return area
}

export function isProEsteticaCapilarSubscriptionArea(area: string): boolean {
  return area === PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA || area === PRO_ESTETICA_CAPILAR_MP_AREA_SLUG
}
