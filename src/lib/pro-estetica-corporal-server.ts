import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { LeaderTenantRow, ProLideresTenantRole } from '@/types/leader-tenant'
import {
  createProLideresServerClient,
  defaultDisplayNameFromUser,
  newLeaderTenantInsertPayload,
  resolveProLideresTenantContext,
} from '@/lib/pro-lideres-server'

export type { LeaderTenantRow, ProLideresTenantRole }

/** Valor em `leader_tenants.vertical_code` para a edição YLADA Pro Estética Corporal. */
export const PRO_ESTETICA_CORPORAL_VERTICAL_CODE = 'estetica-corporal'

/** ID fixo do tenant fictício (modo dev) para este produto. */
export const PRO_ESTETICA_CORPORAL_DEV_STUB_TENANT_ID = '00000000-0000-4000-8000-000000000002'

export function isEsteticaCorporalVertical(tenant: Pick<LeaderTenantRow, 'vertical_code'>): boolean {
  return (tenant.vertical_code ?? '').trim() === PRO_ESTETICA_CORPORAL_VERTICAL_CODE
}

/** Sessão nos cookies (getSession) costuma ser mais fiável no servidor que só getUser(). */
async function getServerAuthUser(supabase: SupabaseClient): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user) return sessionData.session.user
  const { data: userData } = await supabase.auth.getUser()
  return userData.user ?? null
}

export function isProEsteticaCorporalDevStubTenant(tenant: Pick<LeaderTenantRow, 'id'>): boolean {
  return tenant.id === PRO_ESTETICA_CORPORAL_DEV_STUB_TENANT_ID
}

/** E-mails que sempre podem ter tenant estética criado ao entrar (idealizador), além da env. */
const PRO_ESTETICA_CORPORAL_BOOTSTRAP_EMAILS_BUILTIN = ['andre@proestetica.com'] as const

/** Lista normalizada: built-in + PRO_ESTETICA_CORPORAL_BOOTSTRAP_LEADER_EMAILS (vírgulas). */
export function isProEsteticaCorporalBootstrapLeaderEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  const fromEnv =
    process.env.PRO_ESTETICA_CORPORAL_BOOTSTRAP_LEADER_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? []
  return (
    (PRO_ESTETICA_CORPORAL_BOOTSTRAP_EMAILS_BUILTIN as readonly string[]).includes(normalized) ||
    fromEnv.includes(normalized)
  )
}

/** Igual à filosofia do Pro Líderes: true em dev por omissão, a menos que a env desligue. */
export function proEsteticaCorporalAutoProvisionEnabled(): boolean {
  if (process.env.PRO_ESTETICA_CORPORAL_AUTO_PROVISION === 'true') return true
  if (process.env.PRO_ESTETICA_CORPORAL_AUTO_PROVISION === 'false') return false
  return process.env.NODE_ENV === 'development'
}

export function shouldProvisionEsteticaCorporalTenant(email: string | undefined | null): boolean {
  return proEsteticaCorporalAutoProvisionEnabled() || isProEsteticaCorporalBootstrapLeaderEmail(email)
}

/**
 * Abre o painel sem tenant real (stub) — mesma filosofia que PRO_LIDERES_DEV_OPEN_PAINEL.
 */
export function proEsteticaCorporalPainelDevBypassEnabled(): boolean {
  const raw = process.env.PRO_ESTETICA_CORPORAL_DEV_OPEN_PAINEL
  if (raw === 'false') return false
  if (raw === 'true') return true
  return process.env.NODE_ENV === 'development'
}

/**
 * Painel **sem login** para construir / visualizar UI localmente.
 * - `PRO_ESTETICA_CORPORAL_PUBLIC_PREVIEW=true` → liga em qualquer ambiente
 * - `=false` → desliga sempre
 * - omitido → **ligado só em development** (padrão para o equipa iterar sem conta)
 */
export function proEsteticaCorporalPublicPreviewNoAuthEnabled(): boolean {
  const raw = process.env.PRO_ESTETICA_CORPORAL_PUBLIC_PREVIEW
  if (raw === 'true') return true
  if (raw === 'false') return false
  return process.env.NODE_ENV === 'development'
}

const PREVIEW_FAKE_OWNER_ID = '00000000-0000-0000-0000-000000000099'

/** Tenant stub quando o painel está em pré-visualização pública (sem auth). */
export function publicPreviewEsteticaTenant(): LeaderTenantRow {
  const t = devStubEsteticaTenant(PREVIEW_FAKE_OWNER_ID)
  return {
    ...t,
    display_name: 'Pré-visualização (sem login)',
  }
}

function devStubEsteticaTenant(userId: string): LeaderTenantRow {
  const now = new Date().toISOString()
  return {
    id: PRO_ESTETICA_CORPORAL_DEV_STUB_TENANT_ID,
    owner_user_id: userId,
    slug: 'dev-sem-tenant-estetica',
    display_name: 'Dev (sem tenant na BD — estética)',
    team_name: null,
    whatsapp: null,
    contact_email: null,
    focus_notes: null,
    vertical_code: PRO_ESTETICA_CORPORAL_VERTICAL_CODE,
    created_at: now,
    updated_at: now,
  }
}

export function newEsteticaCorporalTenantInsertPayload(user: User) {
  const base = newLeaderTenantInsertPayload(user)
  return {
    ...base,
    slug: `pec-${user.id.replace(/-/g, '').slice(0, 12)}`,
    vertical_code: PRO_ESTETICA_CORPORAL_VERTICAL_CODE,
    display_name: defaultDisplayNameFromUser(user),
  }
}

/**
 * Resolve tenant só se a linha for **estética corporal** (não mistura com Pro Líderes / outras verticais).
 */
export async function resolveEsteticaCorporalTenantContext(
  supabase: SupabaseClient,
  user: User
): Promise<{ tenant: LeaderTenantRow; role: ProLideresTenantRole } | null> {
  const ctx = await resolveProLideresTenantContext(supabase, user)
  if (!ctx) return null
  if (!isEsteticaCorporalVertical(ctx.tenant)) return null
  return ctx
}

/**
 * Garante sessão + tenant **estética corporal** (dono ou membro convidado).
 * Pré-visualização pública (sem login) só quando **não** há sessão — quem está autenticado
 * segue sempre para resolução real do tenant (painel / aguardando / outra edição).
 */
export async function ensureEsteticaCorporalTenantAccess(): Promise<
  | { ok: true; tenant: LeaderTenantRow; role: ProLideresTenantRole; previewWithoutLogin?: boolean }
  | { ok: false; redirect: string }
> {
  const supabase = await createProLideresServerClient()
  const user = await getServerAuthUser(supabase)

  if (!user && proEsteticaCorporalPublicPreviewNoAuthEnabled()) {
    return {
      ok: true,
      tenant: publicPreviewEsteticaTenant(),
      role: 'leader',
      previewWithoutLogin: true,
    }
  }

  if (!user) {
    return { ok: false, redirect: '/pro-estetica-corporal/entrar' }
  }

  let ctx = await resolveEsteticaCorporalTenantContext(supabase, user)

  if (!ctx) {
    const anyCtx = await resolveProLideresTenantContext(supabase, user)
    if (anyCtx && !isEsteticaCorporalVertical(anyCtx.tenant)) {
      return { ok: false, redirect: '/pro-estetica-corporal/conta-outra-edicao' }
    }
  }

  if (!ctx && shouldProvisionEsteticaCorporalTenant(user.email)) {
    const { data: existingOwner } = await supabase
      .from('leader_tenants')
      .select('id, vertical_code')
      .eq('owner_user_id', user.id)
      .maybeSingle()

    if (!existingOwner) {
      const { data: inserted, error } = await supabase
        .from('leader_tenants')
        .insert(newEsteticaCorporalTenantInsertPayload(user))
        .select()
        .single()
      if (!error && inserted) {
        ctx = { tenant: inserted as LeaderTenantRow, role: 'leader' }
      }
    }
  }

  if (!ctx) {
    ctx = await resolveEsteticaCorporalTenantContext(supabase, user)
  }

  if (!ctx) {
    if (proEsteticaCorporalPainelDevBypassEnabled()) {
      return {
        ok: true,
        tenant: devStubEsteticaTenant(user.id),
        role: 'leader',
      }
    }
    return { ok: false, redirect: '/pro-estetica-corporal/aguardando-acesso' }
  }

  return { ok: true, tenant: ctx.tenant, role: ctx.role }
}

/** true se o painel está no stub de desenvolvimento desta vertical. */
export function isDevStubEsteticaCorporalPanel(tenant: Pick<LeaderTenantRow, 'id'>): boolean {
  return isProEsteticaCorporalDevStubTenant(tenant)
}
