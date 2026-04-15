import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { LeaderTenantRow, ProLideresTenantRole } from '@/types/leader-tenant'
import {
  createProLideresServerClient,
  defaultDisplayNameFromUser,
  newLeaderTenantInsertPayload,
  resolveProLideresTenantContext,
} from '@/lib/pro-lideres-server'

export const PRO_ESTETICA_CAPILAR_VERTICAL_CODE = 'estetica-capilar'
export const PRO_ESTETICA_CAPILAR_DEV_STUB_TENANT_ID = '00000000-0000-4000-8000-000000000003'

export function isEsteticaCapilarVertical(tenant: Pick<LeaderTenantRow, 'vertical_code'>): boolean {
  return (tenant.vertical_code ?? '').trim() === PRO_ESTETICA_CAPILAR_VERTICAL_CODE
}

async function getServerAuthUser(supabase: SupabaseClient): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user) return sessionData.session.user
  const { data: userData } = await supabase.auth.getUser()
  return userData.user ?? null
}

function devStubCapilarTenant(userId: string): LeaderTenantRow {
  const now = new Date().toISOString()
  return {
    id: PRO_ESTETICA_CAPILAR_DEV_STUB_TENANT_ID,
    owner_user_id: userId,
    slug: 'dev-sem-tenant-estetica-capilar',
    display_name: 'Dev (sem tenant na BD — estetica capilar)',
    team_name: null,
    whatsapp: null,
    contact_email: null,
    focus_notes: null,
    vertical_code: PRO_ESTETICA_CAPILAR_VERTICAL_CODE,
    created_at: now,
    updated_at: now,
  }
}

export function isProEsteticaCapilarDevStubTenant(tenant: Pick<LeaderTenantRow, 'id'>): boolean {
  return tenant.id === PRO_ESTETICA_CAPILAR_DEV_STUB_TENANT_ID
}

export function proEsteticaCapilarAutoProvisionEnabled(): boolean {
  if (process.env.PRO_ESTETICA_CAPILAR_AUTO_PROVISION === 'true') return true
  if (process.env.PRO_ESTETICA_CAPILAR_AUTO_PROVISION === 'false') return false
  return process.env.NODE_ENV === 'development'
}

/** Conta demo capilar (separada de corporal / Pro Líderes). */
const PRO_ESTETICA_CAPILAR_BOOTSTRAP_EMAILS_BUILTIN = ['demo@proesteticacapilar.com'] as const

/** Lista: built-in + `PRO_ESTETICA_CAPILAR_BOOTSTRAP_LEADER_EMAILS` (vírgulas). */
export function isProEsteticaCapilarBootstrapLeaderEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  const fromEnv =
    process.env.PRO_ESTETICA_CAPILAR_BOOTSTRAP_LEADER_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? []
  return (
    (PRO_ESTETICA_CAPILAR_BOOTSTRAP_EMAILS_BUILTIN as readonly string[]).includes(normalized) ||
    fromEnv.includes(normalized)
  )
}

export function shouldProvisionEsteticaCapilarTenant(email: string | undefined | null): boolean {
  return proEsteticaCapilarAutoProvisionEnabled() || isProEsteticaCapilarBootstrapLeaderEmail(email)
}

export function proEsteticaCapilarPainelDevBypassEnabled(): boolean {
  const raw = process.env.PRO_ESTETICA_CAPILAR_DEV_OPEN_PAINEL
  if (raw === 'false') return false
  if (raw === 'true') return true
  return process.env.NODE_ENV === 'development'
}

/**
 * Painel sem login para construir/validar UI localmente.
 * - PRO_ESTETICA_CAPILAR_PUBLIC_PREVIEW=true -> ligado em qualquer ambiente
 * - PRO_ESTETICA_CAPILAR_PUBLIC_PREVIEW=false -> desliga sempre
 * - omitido -> ligado em development
 */
export function proEsteticaCapilarPublicPreviewNoAuthEnabled(): boolean {
  const raw = process.env.PRO_ESTETICA_CAPILAR_PUBLIC_PREVIEW
  if (raw === 'true') return true
  if (raw === 'false') return false
  return process.env.NODE_ENV === 'development'
}

const PREVIEW_FAKE_OWNER_ID = '00000000-0000-0000-0000-000000000098'

export function publicPreviewEsteticaCapilarTenant(): LeaderTenantRow {
  const t = devStubCapilarTenant(PREVIEW_FAKE_OWNER_ID)
  return {
    ...t,
    display_name: 'Pre-visualizacao (sem login)',
  }
}

export function newEsteticaCapilarTenantInsertPayload(user: User) {
  const base = newLeaderTenantInsertPayload(user)
  return {
    ...base,
    slug: `pecap-${user.id.replace(/-/g, '').slice(0, 12)}`,
    vertical_code: PRO_ESTETICA_CAPILAR_VERTICAL_CODE,
    display_name: defaultDisplayNameFromUser(user),
  }
}

export async function resolveEsteticaCapilarTenantContext(
  supabase: SupabaseClient,
  user: User
): Promise<{ tenant: LeaderTenantRow; role: ProLideresTenantRole } | null> {
  const ctx = await resolveProLideresTenantContext(supabase, user)
  if (!ctx) return null
  if (!isEsteticaCapilarVertical(ctx.tenant)) return null
  return ctx
}

export async function ensureEsteticaCapilarTenantAccess(): Promise<
  | { ok: true; tenant: LeaderTenantRow; role: ProLideresTenantRole; previewWithoutLogin?: boolean }
  | { ok: false; redirect: string }
> {
  const supabase = await createProLideresServerClient()
  const user = await getServerAuthUser(supabase)
  if (!user && proEsteticaCapilarPublicPreviewNoAuthEnabled()) {
    return {
      ok: true,
      tenant: publicPreviewEsteticaCapilarTenant(),
      role: 'leader',
      previewWithoutLogin: true,
    }
  }
  if (!user) return { ok: false, redirect: '/pro-estetica-capilar/entrar' }

  let ctx = await resolveEsteticaCapilarTenantContext(supabase, user)
  if (!ctx) {
    const anyCtx = await resolveProLideresTenantContext(supabase, user)
    if (anyCtx && !isEsteticaCapilarVertical(anyCtx.tenant)) {
      return { ok: false, redirect: '/pro-estetica-capilar/conta-outra-edicao' }
    }
  }

  if (!ctx && shouldProvisionEsteticaCapilarTenant(user.email)) {
    const { data: existingOwner } = await supabase
      .from('leader_tenants')
      .select('id')
      .eq('owner_user_id', user.id)
      .maybeSingle()
    if (!existingOwner) {
      const { data: inserted } = await supabase
        .from('leader_tenants')
        .insert(newEsteticaCapilarTenantInsertPayload(user))
        .select()
        .single()
      if (inserted) ctx = { tenant: inserted as LeaderTenantRow, role: 'leader' }
    }
  }

  if (!ctx) ctx = await resolveEsteticaCapilarTenantContext(supabase, user)
  if (!ctx) {
    if (proEsteticaCapilarPainelDevBypassEnabled()) {
      return { ok: true, tenant: devStubCapilarTenant(user.id), role: 'leader' }
    }
    return { ok: false, redirect: '/pro-estetica-capilar/aguardando-acesso' }
  }

  return { ok: true, tenant: ctx.tenant, role: ctx.role }
}

export function isDevStubEsteticaCapilarPanel(tenant: Pick<LeaderTenantRow, 'id'>): boolean {
  return isProEsteticaCapilarDevStubTenant(tenant)
}
