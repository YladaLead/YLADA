import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { LeaderTenantRow, ProLideresTenantRole } from '@/types/leader-tenant'
import {
  createProLideresServerClient,
  defaultDisplayNameFromUser,
  newLeaderTenantInsertPayload,
  resolveProLideresTenantContext,
  resolvedUserEmail,
} from '@/lib/pro-lideres-server'
import { getSupabaseAdmin } from '@/lib/supabase'

export type { LeaderTenantRow, ProLideresTenantRole }

/** Valor em `leader_tenants.vertical_code` para o Pro Joias. */
export const PRO_JOIAS_VERTICAL_CODE = 'joias'

/** ID fixo do tenant fictício (modo dev) para este produto. */
export const PRO_JOIAS_DEV_STUB_TENANT_ID = '00000000-0000-4000-8000-000000000004'

export function isJoiasVertical(tenant: Pick<LeaderTenantRow, 'vertical_code'>): boolean {
  return (tenant.vertical_code ?? '').trim() === PRO_JOIAS_VERTICAL_CODE
}

async function getServerAuthUser(supabase: SupabaseClient): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user) return sessionData.session.user
  const { data: userData } = await supabase.auth.getUser()
  return userData.user ?? null
}

export function isProJoiasDevStubTenant(tenant: Pick<LeaderTenantRow, 'id'>): boolean {
  return tenant.id === PRO_JOIAS_DEV_STUB_TENANT_ID
}

/** E-mails que sempre podem ter tenant joias criado ao entrar (idealizador / demo). */
const PRO_JOIAS_BOOTSTRAP_EMAILS_BUILTIN = ['demo@projoias.com', 'faulaandre@gmail.com'] as const

export function isProJoiasBootstrapLeaderEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  const fromEnv =
    process.env.PRO_JOIAS_BOOTSTRAP_LEADER_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? []
  return (
    (PRO_JOIAS_BOOTSTRAP_EMAILS_BUILTIN as readonly string[]).includes(normalized) ||
    fromEnv.includes(normalized)
  )
}

export function proJoiasAutoProvisionEnabled(): boolean {
  if (process.env.PRO_JOIAS_AUTO_PROVISION === 'true') return true
  if (process.env.PRO_JOIAS_AUTO_PROVISION === 'false') return false
  return process.env.NODE_ENV === 'development'
}

export function shouldProvisionJoiasTenant(email: string | undefined | null): boolean {
  return proJoiasAutoProvisionEnabled() || isProJoiasBootstrapLeaderEmail(email)
}

export function proJoiasPainelDevBypassEnabled(): boolean {
  const raw = process.env.PRO_JOIAS_DEV_OPEN_PAINEL
  if (raw === 'false') return false
  if (raw === 'true') return true
  return process.env.NODE_ENV === 'development'
}

export function proJoiasPublicPreviewNoAuthEnabled(): boolean {
  const raw = process.env.PRO_JOIAS_PUBLIC_PREVIEW
  if (raw === 'true') return true
  if (raw === 'false') return false
  return process.env.NODE_ENV === 'development'
}

const PREVIEW_FAKE_OWNER_ID = '00000000-0000-0000-0000-000000000099'

export function publicPreviewJoiasTenant(): LeaderTenantRow {
  const t = devStubJoiasTenant(PREVIEW_FAKE_OWNER_ID)
  return { ...t, display_name: 'Pré-visualização (sem login)' }
}

function devStubJoiasTenant(userId: string): LeaderTenantRow {
  const now = new Date().toISOString()
  return {
    id: PRO_JOIAS_DEV_STUB_TENANT_ID,
    owner_user_id: userId,
    slug: 'dev-sem-tenant-joias',
    display_name: 'Dev (sem tenant — joias)',
    team_name: null,
    whatsapp: null,
    contact_email: null,
    focus_notes: null,
    vertical_code: PRO_JOIAS_VERTICAL_CODE,
    created_at: now,
    updated_at: now,
  }
}

export function newJoiasTenantInsertPayload(user: User) {
  const base = newLeaderTenantInsertPayload(user)
  return {
    ...base,
    slug: `joias-${user.id.replace(/-/g, '').slice(0, 12)}`,
    vertical_code: PRO_JOIAS_VERTICAL_CODE,
    display_name: defaultDisplayNameFromUser(user),
  }
}

export async function resolveJoiasTenantContext(
  supabase: SupabaseClient,
  user: User
): Promise<{ tenant: LeaderTenantRow; role: ProLideresTenantRole } | null> {
  const ctx = await resolveProLideresTenantContext(supabase, user)
  if (!ctx) return null
  if (!isJoiasVertical(ctx.tenant)) return null
  return ctx
}

/**
 * Gate principal do Pro Joias.
 * Retorna { ok: true, tenant, role } ou { ok: false, redirect }.
 */
export async function ensureProJoiasTenantAccess(): Promise<
  | { ok: true; tenant: LeaderTenantRow; role: ProLideresTenantRole; previewWithoutLogin?: boolean }
  | { ok: false; redirect: string }
> {
  const supabase = await createProLideresServerClient()
  const user = await getServerAuthUser(supabase)

  if (!user && proJoiasPublicPreviewNoAuthEnabled()) {
    return { ok: true, tenant: publicPreviewJoiasTenant(), role: 'leader', previewWithoutLogin: true }
  }

  if (!user) {
    return { ok: false, redirect: '/pro-joias/entrar' }
  }

  let ctx = await resolveJoiasTenantContext(supabase, user)
  const admin = getSupabaseAdmin()

  if (!ctx && isProJoiasBootstrapLeaderEmail(user.email) && admin) {
    ctx = await resolveJoiasTenantContext(admin, user)
  }

  // Usuário tem tenant de outra vertical — avisa
  if (!ctx) {
    const anyCtx = await resolveProLideresTenantContext(supabase, user)
    if (anyCtx && !isJoiasVertical(anyCtx.tenant)) {
      return { ok: false, redirect: '/pro-joias/conta-outra-edicao' }
    }
  }

  // Provisiona tenant automaticamente
  if (!ctx && shouldProvisionJoiasTenant(user.email)) {
    const { data: existingOwner } = await supabase
      .from('leader_tenants')
      .select('*')
      .eq('owner_user_id', user.id)
      .maybeSingle()

    if (existingOwner && isJoiasVertical(existingOwner as LeaderTenantRow)) {
      ctx = { tenant: existingOwner as LeaderTenantRow, role: 'leader' }
    } else if (!existingOwner) {
      const { data: inserted, error } = await supabase
        .from('leader_tenants')
        .insert(newJoiasTenantInsertPayload(user))
        .select()
        .single()
      if (!error && inserted) {
        ctx = { tenant: inserted as LeaderTenantRow, role: 'leader' }
      } else if (error) {
        console.error('[ensureProJoiasTenantAccess] provision (user):', error.message, resolvedUserEmail(user))
      }
    }
  }

  // Fallback com service role
  if (!ctx && shouldProvisionJoiasTenant(user.email) && admin) {
    const { data: existingOwner } = await admin
      .from('leader_tenants')
      .select('*')
      .eq('owner_user_id', user.id)
      .maybeSingle()

    if (existingOwner) {
      if (isJoiasVertical(existingOwner as LeaderTenantRow)) {
        ctx = { tenant: existingOwner as LeaderTenantRow, role: 'leader' }
      } else {
        return { ok: false, redirect: '/pro-joias/conta-outra-edicao' }
      }
    } else {
      const { data: ins, error: insErr } = await admin
        .from('leader_tenants')
        .insert(newJoiasTenantInsertPayload(user))
        .select()
        .single()
      if (!insErr && ins) {
        ctx = { tenant: ins as LeaderTenantRow, role: 'leader' }
      } else if (insErr) {
        console.error('[ensureProJoiasTenantAccess] provision (admin):', insErr.message, resolvedUserEmail(user))
      }
    }
  }

  if (!ctx && proJoiasPainelDevBypassEnabled()) {
    return { ok: true, tenant: devStubJoiasTenant(user.id), role: 'leader' }
  }

  if (!ctx) {
    return { ok: false, redirect: '/pro-joias/aguardando-acesso' }
  }

  return { ok: true, tenant: ctx.tenant, role: ctx.role }
}

export function isDevStubJoiasPanel(tenant: Pick<LeaderTenantRow, 'id'>): boolean {
  return isProJoiasDevStubTenant(tenant)
}
