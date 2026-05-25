import { getSupabaseAdmin } from '@/lib/supabase'

export const PRO_LIDERES_MEMBRO_ATIVACAO_PATH = '/pro-lideres/membro/ativacao'

/** Fallback no browser quando o cadastro acaba de gravar os links (antes da sessão SSR). */
export const PRO_LIDERES_ATIVACAO_PAYMENT_SESSION_KEY = 'pl_pro_lideres_ativacao_payment_v1'

export type ProLideresAtivacaoPaymentSession = {
  spaceName?: string
  cardUrl?: string | null
  pixUrl?: string | null
}

export type ProLideresMembroAtivacaoResolved =
  | {
      ok: true
      spaceLabel: string
      cardUrl: string | null
      pixUrl: string | null
    }
  | { ok: false; redirect: string }

function parsePaymentUrl(raw: unknown): string | null {
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null
}

/**
 * Dados da página de pagamento pós-convite.
 * Usa service role para links do tenant — membros em `pending_activation` não leem `leader_tenants` via RLS antigo.
 */
export async function resolveProLideresMembroAtivacaoPage(
  userId: string
): Promise<ProLideresMembroAtivacaoResolved> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return { ok: false, redirect: '/pro-lideres/entrar' }
  }

  const { data: asOwner } = await admin
    .from('leader_tenants')
    .select('id')
    .eq('owner_user_id', userId)
    .maybeSingle()
  if (asOwner?.id) {
    return { ok: false, redirect: '/pro-lideres/painel' }
  }

  const { data: memberRows, error: memberErr } = await admin
    .from('leader_tenant_members')
    .select('team_access_state, leader_tenant_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (memberErr) {
    console.error('[pro-lideres/membro/ativacao] membership:', memberErr.message)
  }

  const m = memberRows?.[0]
  if (!m) {
    return { ok: false, redirect: '/pro-lideres/aguardando-acesso' }
  }

  const st = (m.team_access_state as string) ?? 'active'
  if (st === 'active') {
    return { ok: false, redirect: '/pro-lideres/membro' }
  }
  if (st === 'paused') {
    return { ok: false, redirect: '/pro-lideres/acesso-pausado' }
  }
  if (st !== 'pending_activation') {
    return { ok: false, redirect: '/pro-lideres/aguardando-acesso' }
  }

  const tenantId = m.leader_tenant_id as string
  const { data: tenant } = await admin
    .from('leader_tenants')
    .select('display_name, team_name, team_bank_payment_url, team_bank_pix_payment_url')
    .eq('id', tenantId)
    .maybeSingle()

  const spaceLabel =
    (tenant?.display_name as string | undefined)?.trim() ||
    (tenant?.team_name as string | undefined)?.trim() ||
    'seu espaço Pro Líderes'

  return {
    ok: true,
    spaceLabel,
    cardUrl: parsePaymentUrl(tenant?.team_bank_payment_url),
    pixUrl: parsePaymentUrl(tenant?.team_bank_pix_payment_url),
  }
}

export function stashProLideresAtivacaoPaymentSession(payload: ProLideresAtivacaoPaymentSession): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(PRO_LIDERES_ATIVACAO_PAYMENT_SESSION_KEY, JSON.stringify(payload))
  } catch {
    /* quota / private mode */
  }
}

export function readProLideresAtivacaoPaymentSession(): ProLideresAtivacaoPaymentSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(PRO_LIDERES_ATIVACAO_PAYMENT_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ProLideresAtivacaoPaymentSession
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function clearProLideresAtivacaoPaymentSession(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(PRO_LIDERES_ATIVACAO_PAYMENT_SESSION_KEY)
  } catch {
    /* ignore */
  }
}
