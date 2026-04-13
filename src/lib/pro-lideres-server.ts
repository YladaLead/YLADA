import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { LeaderTenantRow, ProLideresTenantRole } from '@/types/leader-tenant'

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
const PRO_LIDERES_BOOTSTRAP_EMAILS_BUILTIN = ['faulaandre@gmail.com'] as const

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
    created_at: now,
    updated_at: now,
  }
}

/** Cria tenant na primeira entrada para qualquer utilizador em dev/auto OU para e-mails bootstrap. */
export function shouldProvisionProLideresTenant(email: string | undefined | null): boolean {
  return proLideresAutoProvisionEnabled() || isProLideresBootstrapLeaderEmail(email)
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
    contact_email: user.email ?? null,
    vertical_code: 'h-lider',
  }
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
    .select('leader_tenant_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!membership) return null

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

  if (!ctx && shouldProvisionProLideresTenant(user.email)) {
    const { data: inserted, error } = await supabase
      .from('leader_tenants')
      .insert(newLeaderTenantInsertPayload(user))
      .select()
      .single()
    if (!error && inserted) {
      ctx = { tenant: inserted as LeaderTenantRow, role: 'leader' }
    }
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

  return { ok: true, tenant: ctx.tenant, role: ctx.role }
}
