import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { LeaderTenantRow, ProLideresTenantRole } from '@/types/leader-tenant'
import { applyCompletedLeaderOnboardingForEmail } from '@/lib/pro-lideres-leader-onboarding'
import { getSupabaseAdmin } from '@/lib/supabase'

export type { LeaderTenantRow, ProLideresTenantRole }

export type ProLideresTenantContext = {
  tenant: LeaderTenantRow
  role: ProLideresTenantRole
}

export async function createProLideresServerClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error('Supabase URL ou anon key não configurados')
  }
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll() {
        // Server layout: refresh é tratado em rotas que escrevem cookies
      },
    },
  })
}

/** E-mails que sempre podem ter tenant criado ao entrar (idealizador / admin geral), mesmo com auto-provision global desligada. */
const PRO_LIDERES_BOOTSTRAP_EMAILS_BUILTIN = ['andre@prolider.com', 'demo@prolider.com'] as const

/** IDs auth.users (fallback se o JWT no servidor vier sem `email`). */
const PRO_LIDERES_BOOTSTRAP_USER_IDS_BUILTIN = ['acafb4af-e805-4078-857e-1d7966044cab'] as const

/** Lista normalizada: built-in + PRO_LIDERES_BOOTSTRAP_LEADER_EMAILS (vírgulas). */
export function isProLideresBootstrapLeaderEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  const fromEnv =
    process.env.PRO_LIDERES_BOOTSTRAP_LEADER_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? []
  return (
    (PRO_LIDERES_BOOTSTRAP_EMAILS_BUILTIN as readonly string[]).includes(normalized) ||
    fromEnv.includes(normalized)
  )
}

/** E-mail visível no cliente nem sempre vem em `user.email` no servidor (JWT). */
export function resolvedUserEmail(user: User): string | null {
  const direct = user.email?.trim()
  if (direct) return direct
  const meta = user.user_metadata?.email
  if (typeof meta === 'string' && meta.trim()) return meta.trim()
  return null
}

/** Bootstrap por e-mail, por UUID (env ou built-in) ou metadata. */
export function isProLideresBootstrapLeader(user: User): boolean {
  const envIds =
    process.env.PRO_LIDERES_BOOTSTRAP_LEADER_USER_IDS?.split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) ?? []
  const uid = user.id.toLowerCase()
  if ((PRO_LIDERES_BOOTSTRAP_USER_IDS_BUILTIN as readonly string[]).some((x) => x.toLowerCase() === uid)) return true
  if (envIds.includes(uid)) return true
  return isProLideresBootstrapLeaderEmail(resolvedUserEmail(user))
}

/** true se PRO_LIDERES_AUTO_PROVISION=true, ou false se =false; senão só em development. */
export function proLideresAutoProvisionEnabled(): boolean {
  if (process.env.PRO_LIDERES_AUTO_PROVISION === 'true') return true
  if (process.env.PRO_LIDERES_AUTO_PROVISION === 'false') return false
  return process.env.NODE_ENV === 'development'
}

/**
 * Abre o painel Pro Líderes sem tenant real (stub) para trabalhar UI/local sem migrations ou RLS a bloquear.
 * - PRO_LIDERES_DEV_OPEN_PAINEL=true → ativo em qualquer NODE_ENV
 * - PRO_LIDERES_DEV_OPEN_PAINEL=false → desliga mesmo em development (testar fluxo real)
 * - variável omitida → ativo só em development
 */
export function proLideresPainelDevBypassEnabled(): boolean {
  const raw = process.env.PRO_LIDERES_DEV_OPEN_PAINEL
  if (raw === 'false') return false
  if (raw === 'true') return true
  return process.env.NODE_ENV === 'development'
}

/** ID fixo do tenant fictício usado quando o painel abre em modo dev sem linha em leader_tenants. */
export const PRO_LIDERES_DEV_STUB_TENANT_ID = '00000000-0000-4000-8000-000000000001'

export function isProLideresDevStubTenant(tenant: Pick<LeaderTenantRow, 'id'>): boolean {
  return tenant.id === PRO_LIDERES_DEV_STUB_TENANT_ID
}

function devStubLeaderTenant(userId: string): LeaderTenantRow {
  const now = new Date().toISOString()
  return {
    id: PRO_LIDERES_DEV_STUB_TENANT_ID,
    owner_user_id: userId,
    slug: 'dev-sem-tenant',
    display_name: 'Dev (sem tenant na BD)',
    team_name: null,
    whatsapp: null,
    contact_email: null,
    focus_notes: null,
    vertical_code: 'h-lider',
    daily_tasks_visible_to_team: true,
    daily_tasks_full_day_bonus_points: 10,
    created_at: now,
    updated_at: now,
  }
}

/** Cria tenant na primeira entrada para qualquer utilizador em dev/auto OU para contas bootstrap. */
export function shouldProvisionProLideresTenant(user: User): boolean {
  return proLideresAutoProvisionEnabled() || isProLideresBootstrapLeader(user)
}

export function defaultDisplayNameFromUser(user: User): string {
  return (
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Líder'
  )
}

export function newLeaderTenantInsertPayload(user: User) {
  return {
    owner_user_id: user.id,
    slug: `pl-${user.id.replace(/-/g, '').slice(0, 12)}`,
    display_name: defaultDisplayNameFromUser(user),
    contact_email: resolvedUserEmail(user),
    vertical_code: 'h-lider',
  }
}

/**
 * Líder no Pro Líderes: dono de `leader_tenants` ou membro com `role = leader` (equipa não incluída).
 * Permite `/api/ylada/interpret` e `/api/ylada/links/generate` sem `user_profiles.perfil` da matriz YLADA.
 */
export async function isProLideresLeaderForYladaLinkApis(userId: string): Promise<boolean> {
  const admin = getSupabaseAdmin()
  if (!admin) return false

  const { data: asOwner } = await admin
    .from('leader_tenants')
    .select('id')
    .eq('owner_user_id', userId)
    .limit(1)
    .maybeSingle()
  if (asOwner) return true

  const { data: row } = await admin
    .from('leader_tenant_members')
    .select('team_access_state')
    .eq('user_id', userId)
    .eq('role', 'leader')
    .limit(1)
    .maybeSingle()

  if (!row) return false
  const st = (row.team_access_state as string | undefined) ?? 'active'
  return st !== 'paused'
}

/**
 * Resolve tenant + papel (dono = líder na consultoria; user_id em leader_tenant_members = equipe ou líder registado).
 */
export async function resolveProLideresTenantContext(
  supabase: SupabaseClient,
  user: User
): Promise<ProLideresTenantContext | null> {
  const { data: asOwner } = await supabase
    .from('leader_tenants')
    .select('*')
    .eq('owner_user_id', user.id)
    .maybeSingle()

  if (asOwner) {
    return { tenant: asOwner as LeaderTenantRow, role: 'leader' }
  }

  const { data: membership } = await supabase
    .from('leader_tenant_members')
    .select('leader_tenant_id, role, team_access_state')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!membership) return null

  const accessState = (membership.team_access_state as string | undefined) ?? 'active'
  if (accessState === 'paused') return null

  const { data: tenant } = await supabase
    .from('leader_tenants')
    .select('*')
    .eq('id', membership.leader_tenant_id as string)
    .maybeSingle()

  if (!tenant) return null

  const dbRole = membership.role as string
  const role: ProLideresTenantRole =
    dbRole === 'leader' || dbRole === 'member' ? (dbRole as ProLideresTenantRole) : 'member'

  return { tenant: tenant as LeaderTenantRow, role }
}

/**
 * Garante sessão + acesso a um tenant (dono ou membro). Auto-provision só cria tenant para o dono (dev/bootstrap).
 * Redireciona para entrar se não autenticado; aguardando-acesso se sem tenant e sem provision.
 */
export async function ensureLeaderTenantAccess(): Promise<
  | { ok: true; tenant: LeaderTenantRow; role: ProLideresTenantRole }
  | { ok: false; redirect: string }
> {
  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    return { ok: false, redirect: '/pro-lideres/entrar' }
  }

  let ctx = await resolveProLideresTenantContext(supabase, user)

  if (!ctx) {
    const { data: selfMembership } = await supabase
      .from('leader_tenant_members')
      .select('team_access_state')
      .eq('user_id', user.id)
      .maybeSingle()
    const st = (selfMembership?.team_access_state as string | undefined) ?? 'active'
    if (st === 'paused') {
      return { ok: false, redirect: '/pro-lideres/acesso-pausado' }
    }
  }

  const admin = getSupabaseAdmin()

  /** Com JWT, RLS por vezes não devolve linha; com service role lemos o tenant real (bootstrap). */
  if (!ctx && isProLideresBootstrapLeader(user) && admin) {
    ctx = await resolveProLideresTenantContext(admin, user)
  }

  if (!ctx && shouldProvisionProLideresTenant(user)) {
    const { data: inserted, error } = await supabase
      .from('leader_tenants')
      .insert(newLeaderTenantInsertPayload(user))
      .select()
      .single()
    if (error) {
      console.error(
        '[ensureLeaderTenantAccess] provision (user client) falhou:',
        error.code,
        error.message,
        resolvedUserEmail(user),
        user.id
      )
    }
    if (!error && inserted) {
      ctx = { tenant: inserted as LeaderTenantRow, role: 'leader' }
    }
  }

  /**
   * Fallback com service role: corrige casos em que RLS/cookie impede SELECT/INSERT com o JWT
   * (utilizador autenticado mas sem contexto → aguardando-acesso em loop).
   */
  if (!ctx && shouldProvisionProLideresTenant(user) && admin) {
    const { data: existingOwner, error: fetchErr } = await admin
      .from('leader_tenants')
      .select('*')
      .eq('owner_user_id', user.id)
      .maybeSingle()
    if (fetchErr) {
      console.error('[ensureLeaderTenantAccess] admin lookup owner:', fetchErr.message, resolvedUserEmail(user))
    }
    if (existingOwner) {
      ctx = { tenant: existingOwner as LeaderTenantRow, role: 'leader' }
    } else {
      const { data: ins, error: insErr } = await admin
        .from('leader_tenants')
        .insert(newLeaderTenantInsertPayload(user))
        .select()
        .single()
      if (insErr) {
        console.error(
          '[ensureLeaderTenantAccess] provision (admin) falhou:',
          insErr.code,
          insErr.message,
          resolvedUserEmail(user),
          user.id
        )
      }
      if (!insErr && ins) {
        ctx = { tenant: ins as LeaderTenantRow, role: 'leader' }
      }
    }
  }

  if (!ctx && shouldProvisionProLideresTenant(user) && !admin) {
    console.error(
      '[ensureLeaderTenantAccess] SUPABASE_SERVICE_ROLE_KEY ausente — não é possível provisionar tenant em produção.',
      user.id,
      resolvedUserEmail(user)
    )
  }

  if (!ctx) {
    if (proLideresPainelDevBypassEnabled()) {
      return {
        ok: true,
        tenant: devStubLeaderTenant(user.id),
        role: 'leader',
      }
    }
    return { ok: false, redirect: '/pro-lideres/aguardando-acesso' }
  }

  if (ctx.role === 'leader') {
    await applyCompletedLeaderOnboardingForEmail({
      supabase,
      email: user.email,
      ownerUserId: user.id,
      tenantId: ctx.tenant.id,
    })
  }

  return { ok: true, tenant: ctx.tenant, role: ctx.role }
}
