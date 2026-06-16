import { getSupabaseAdmin } from '@/lib/supabase'
import {
  computeProLideresMemberAccessExpiryUi,
  isProLideresTeamAccessExpired,
  type ProLideresMemberAccessExpiryUi,
} from '@/lib/pro-lideres-team-access-expiry-ui'

export type ProLideresMemberMembershipGate = {
  leaderTenantId: string
  teamAccessState: string
  teamAccessExpiresAt: string | null
}

export type ProLideresMembroRenovacaoContext = {
  spaceLabel: string
  cardUrl: string | null
  pixUrl: string | null
  leaderWhatsapp: string | null
  leaderContactEmail: string | null
  expiresAtIso: string | null
}

function parsePaymentUrl(raw: unknown): string | null {
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null
}

function buildWaUrl(rawPhone: string | null | undefined, text: string): string | null {
  if (!rawPhone) return null
  const digits = rawPhone.replace(/\D/g, '')
  if (digits.length < 10) return null
  const e164 = digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`
  return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`
}

export function buildProLideresLeaderRenewalWaUrl(
  leaderWhatsapp: string | null | undefined,
  memberFirstName: string,
  dateLabel: string,
  mode: 'expired' | 'upcoming' = 'expired'
): string | null {
  const intro = memberFirstName && memberFirstName !== 'Olá' ? `Oi! Sou ${memberFirstName}.` : 'Oi!'
  const body =
    mode === 'expired'
      ? `${intro} Meu acesso ao Pro Líderes venceu em ${dateLabel}. Gostaria de renovar — pode me orientar sobre o pagamento?`
      : `${intro} Meu acesso ao Pro Líderes vence em ${dateLabel}. Gostaria de renovar antes — pode me orientar sobre o pagamento?`
  return buildWaUrl(leaderWhatsapp, body)
}

/**
 * Membership de membro convidado (service role) — páginas de gate não dependem só do JWT/RLS.
 */
export async function loadProLideresMemberMembershipForGate(
  userId: string
): Promise<ProLideresMemberMembershipGate | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data: rows } = await admin
    .from('leader_tenant_members')
    .select('leader_tenant_id, role, team_access_state, team_access_expires_at, created_at')
    .eq('user_id', userId)
    .eq('role', 'member')
    .order('created_at', { ascending: false })

  const m = rows?.[0]
  if (!m) return null

  return {
    leaderTenantId: String(m.leader_tenant_id),
    teamAccessState: (m.team_access_state as string) ?? 'active',
    teamAccessExpiresAt: (m.team_access_expires_at as string | null) ?? null,
  }
}

export async function isProLideresLeaderTenantOwner(userId: string): Promise<boolean> {
  const admin = getSupabaseAdmin()
  if (!admin) return false
  const { data } = await admin
    .from('leader_tenants')
    .select('id')
    .eq('owner_user_id', userId)
    .limit(1)
    .maybeSingle()
  return Boolean(data?.id)
}

/**
 * Links de pagamento e contacto da equipe para renovação (membro com acesso expirado).
 */
export async function loadProLideresMembroRenovacaoContext(
  userId: string,
  leaderTenantId: string
): Promise<ProLideresMembroRenovacaoContext | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data: member } = await admin
    .from('leader_tenant_members')
    .select('team_access_expires_at')
    .eq('user_id', userId)
    .eq('leader_tenant_id', leaderTenantId)
    .eq('role', 'member')
    .maybeSingle()

  const { data: tenant } = await admin
    .from('leader_tenants')
    .select(
      'display_name, team_name, whatsapp, contact_email, team_bank_payment_url, team_bank_pix_payment_url'
    )
    .eq('id', leaderTenantId)
    .maybeSingle()

  if (!tenant) return null

  const spaceLabel =
    (tenant.display_name as string | undefined)?.trim() ||
    (tenant.team_name as string | undefined)?.trim() ||
    'seu espaço Pro Líderes'

  return {
    spaceLabel,
    cardUrl: parsePaymentUrl(tenant.team_bank_payment_url),
    pixUrl: parsePaymentUrl(tenant.team_bank_pix_payment_url),
    leaderWhatsapp: (tenant.whatsapp as string | null) ?? null,
    leaderContactEmail: (tenant.contact_email as string | null) ?? null,
    expiresAtIso: (member?.team_access_expires_at as string | null) ?? null,
  }
}

/** Banner discreto no painel do membro (só com `team_access_expires_at` no futuro). */
export async function loadProLideresMemberAccessExpiryBanner(
  userId: string,
  tenantId: string
): Promise<ProLideresMemberAccessExpiryUi> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return computeProLideresMemberAccessExpiryUi(null)
  }

  const { data: member } = await admin
    .from('leader_tenant_members')
    .select('team_access_expires_at, team_access_state, role')
    .eq('user_id', userId)
    .eq('leader_tenant_id', tenantId)
    .eq('role', 'member')
    .maybeSingle()

  const st = (member?.team_access_state as string | undefined) ?? 'active'
  if (!member || st !== 'active') {
    return computeProLideresMemberAccessExpiryUi(null)
  }

  return computeProLideresMemberAccessExpiryUi(
    (member.team_access_expires_at as string | null) ?? null
  )
}
