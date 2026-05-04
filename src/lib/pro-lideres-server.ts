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

type LeaderMemberLite = {
  leader_tenant_id: string
  role: string
  team_access_state: string | null | undefined
  team_access_expires_at: string | null | undefined
  created_at?: string | null
}

function accessStateOf(m: LeaderMemberLite): string {
  return (m.team_access_state as string | undefined) ?? 'active'
}

/** true se não há data de fim ou se ainda não passou */
function membershipExpiryStillValid(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return true
  const end = new Date(expiresAt).getTime()
  return Number.isNaN(end) || end > Date.now()
}

/**
 * Com várias linhas em `leader_tenant_members` (vários tenants), não podemos usar
 * `.limit(1)` sem ordenação nem `.maybeSingle()` na lista inteira — o PostgREST devolve erro
 * ao haver mais de uma linha e o utilizador cai em /aguardando-acesso mesmo estando «Ativo»
 * noutra equipa.
 */
function pickResolvableMembership(rows: LeaderMemberLite[]): LeaderMemberLite | null {
  if (!rows.length) return null
  const actives = rows.filter((r) => accessStateOf(r) === 'active')
  actives.sort((a, b) => {
    const av = membershipExpiryStillValid(a.team_access_expires_at) ? 0 : 1
    const bv = membershipExpiryStillValid(b.team_access_expires_at) ? 0 : 1
    if (av !== bv) return av - bv
    const ta = new Date(a.created_at ?? 0).getTime()
    const tb = new Date(b.created_at ?? 0).getTime()
    return tb - ta
  })
  return actives.find((r) => membershipExpiryStillValid(r.team_access_expires_at)) ?? null
}

/** Quando não há tenant resolvível (ctx null), onde enviar antes de `/aguardando-acesso`. */
function pickEnsureRedirectAmongMemberships(rows: LeaderMemberLite[]): string | null {
  if (!rows.length) return null

  const hasActiveValid = rows.some(
    (r) =>
      accessStateOf(r) === 'active' && membershipExpiryStillValid(r.team_access_expires_at)
  )
  if (hasActiveValid) return null

  const hasPending = rows.some((r) => accessStateOf(r) === 'pending_activation')
  if (hasPending) return '/pro-lideres/membro/ativacao'

  const hasPaused = rows.some((r) => accessStateOf(r) === 'paused')
  if (hasPaused) return '/pro-lideres/acesso-pausado'

  const hasExpiredWhileActive = rows.some(
    (r) => accessStateOf(r) === 'active' && !membershipExpiryStillValid(r.team_access_expires_at)
  )
  if (hasExpiredWhileActive) return '/pro-lideres/membro/acesso-expirado'

  return null
}

/**
 * Monta o contexto a partir de uma membership já escolhida (ex. por pickResolvableMembership).
 * Não usar como fallback para dono de tenant quando membership !== null e isto devolver null —
 * evita dar painel de líder do tenant “pessoal” a quem tem equipa.
 */
async function tenantContextFromMembership(
  supabase: SupabaseClient,
  membership: LeaderMemberLite
): Promise<ProLideresTenantContext | null> {
  const accessStateRaw = accessStateOf(membership)
  if (accessStateRaw === 'paused') return null
  if (accessStateRaw === 'pending_activation') return null

  const dbRole = membership.role as string
  const role: ProLideresTenantRole =
    dbRole === 'leader' || dbRole === 'member' ? (dbRole as ProLideresTenantRole) : 'member'

  if (role === 'member' && accessStateRaw === 'active') {
    const expRaw = membership.team_access_expires_at as string | null | undefined
    if (expRaw) {
      const end = new Date(expRaw).getTime()
      if (!Number.isNaN(end) && end <= Date.now()) return null
    }
  }

  const { data: tenant } = await supabase
    .from('leader_tenants')
    .select('*')
    .eq('id', membership.leader_tenant_id as string)
    .maybeSingle()

  let resolvedTenant = tenant

  /**
   * RLS pode não devolver o tenant mesmo havendo membership ativa — evita falso `/aguardando-acesso`;
   * fallback com service role só após termos membership válida na mesma conta.
   */
  if (!resolvedTenant) {
    const admin = getSupabaseAdmin()
    if (admin) {
      const { data: bypass } = await admin
        .from('leader_tenants')
        .select('*')
        .eq('id', membership.leader_tenant_id as string)
        .maybeSingle()
      resolvedTenant = bypass
    }
  }

  if (!resolvedTenant) return null

  return { tenant: resolvedTenant as LeaderTenantRow, role }
}

/**
 * Quem tem convite ativo (`leader_tenant_members.role = member`) para este tenant nunca deve ser tratado
 * como líder na UI/API, mesmo que `leader_tenants.owner_user_id` coincida (dados incoerentes ou resolução antiga).
 */
async function reconcileProLideresCtxForMemberRow(
  ctx: ProLideresTenantContext,
  userId: string
): Promise<ProLideresTenantContext> {
  if (ctx.role === 'member') return ctx
  const admin = getSupabaseAdmin()
  if (!admin) return ctx

  const { data: row, error } = await admin
    .from('leader_tenant_members')
    .select('role, team_access_state, team_access_expires_at')
    .eq('user_id', userId)
    .eq('leader_tenant_id', ctx.tenant.id)
    .maybeSingle()

  if (error || !row || row.role !== 'member') return ctx

  const st = (row.team_access_state as string | undefined) ?? 'active'
  if (st !== 'active') return ctx
  if (!membershipExpiryStillValid(row.team_access_expires_at as string | null | undefined)) return ctx

  return { tenant: ctx.tenant, role: 'member' }
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
    team_bank_payment_url: null,
    team_bank_pix_payment_url: null,
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
  return st === 'active'
}

/**
 * Resolve tenant + papel (dono = líder na consultoria; user_id em leader_tenant_members = equipe ou líder registado).
 *
 * - Memberships ativas têm prioridade sobre `leader_tenants.owner_user_id` (evita membro com tenant pessoal em dev).
 * - Leitura de `leader_tenant_members` com service role quando existir: o JWT por vezes não devolve linhas como o esperado;
 *   sem isto o utilizador cai só em `asOwner` e vê sidebar de líder.
 * - Se existem linhas em `leader_tenant_members` mas nenhuma ativa/resolvível (ex.: pending_activation), não usar `asOwner`:
 *   senão um tenant pessoal transforma convite pendente em “líder” no painel.
 */
export async function resolveProLideresTenantContext(
  supabase: SupabaseClient,
  user: User
): Promise<ProLideresTenantContext | null> {
  const finish = async (ctx: ProLideresTenantContext | null): Promise<ProLideresTenantContext | null> => {
    if (!ctx) return null
    return reconcileProLideresCtxForMemberRow(ctx, user.id)
  }

  const admin = getSupabaseAdmin()
  const membershipClient = admin ?? supabase

  const { data: memberships, error: memErr } = await membershipClient
    .from('leader_tenant_members')
    .select('leader_tenant_id, role, team_access_state, team_access_expires_at, created_at')
    .eq('user_id', user.id)

  if (memErr) {
    console.error('[resolveProLideresTenantContext] memberships:', memErr.message, resolvedUserEmail(user))
    return null
  }

  const rows = (memberships ?? []) as LeaderMemberLite[]
  const membership = pickResolvableMembership(rows)
  if (membership) {
    const fromTeam = await tenantContextFromMembership(supabase, membership)
    return finish(fromTeam)
  }

  if (rows.length > 0) {
    return null
  }

  const { data: asOwner } = await supabase
    .from('leader_tenants')
    .select('*')
    .eq('owner_user_id', user.id)
    .maybeSingle()

  if (asOwner) {
    return finish({ tenant: asOwner as LeaderTenantRow, role: 'leader' })
  }

  if (admin) {
    const { data: ownerBypass } = await admin
      .from('leader_tenants')
      .select('*')
      .eq('owner_user_id', user.id)
      .maybeSingle()
    if (ownerBypass) {
      return finish({ tenant: ownerBypass as LeaderTenantRow, role: 'leader' })
    }
  }

  return null
}

/**
 * Garante sessão + acesso a um tenant (dono ou membro). Auto-provision só cria tenant para o dono (dev/bootstrap).
 * Redireciona para entrar se não autenticado; aguardando-acesso se sem tenant e sem forma de o resolver.
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
    const { data: memberships, error: selfMembershipErr } = await supabase
      .from('leader_tenant_members')
      .select('leader_tenant_id, role, team_access_state, team_access_expires_at, created_at')
      .eq('user_id', user.id)

    if (selfMembershipErr) {
      console.error(
        '[ensureLeaderTenantAccess] leader_tenant_members lookup:',
        selfMembershipErr.message,
        resolvedUserEmail(user)
      )
    }

    const list = (memberships ?? []) as LeaderMemberLite[]
    const redirect = pickEnsureRedirectAmongMemberships(list)
    if (redirect) {
      return { ok: false, redirect }
    }
  }

  const admin = getSupabaseAdmin()

  /**
   * JWT/RLS por vezes não devolve memberships ou `leader_tenants`.
   * Resolver com service role aplica a mesma regra (equipa antes de dono) — evita forçar papel de líder
   * só porque existe `leader_tenants.owner_user_id` ignorando `leader_tenant_members`.
   */
  if (!ctx && admin) {
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
      ctx = await reconcileProLideresCtxForMemberRow(
        { tenant: inserted as LeaderTenantRow, role: 'leader' },
        user.id
      )
    }
  }

  /**
   * Inserção com service role só quando o provisionamento automático está ligado
   * (o tenant existente já foi resolvido no lookup admin acima).
   */
  if (!ctx && shouldProvisionProLideresTenant(user) && admin) {
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
      ctx = await reconcileProLideresCtxForMemberRow(
        { tenant: ins as LeaderTenantRow, role: 'leader' },
        user.id
      )
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
