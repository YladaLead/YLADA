import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { resolveTeamAccessExpiresAt } from '@/lib/pro-lideres-team-access-expiry'
import { supabaseAdmin } from '@/lib/supabase'

type ProLideresAccessState = 'active' | 'paused' | 'pending_activation'

export type AdminUsuarioProLideresDetail = {
  hasProLideres: boolean
  /** Dono do tenant (líder) */
  isOwner: boolean
  tenantId: string | null
  tenantDisplayName: string | null
  verticalCode: string | null
  membershipId: string | null
  role: 'leader' | 'member' | null
  teamAccessState: ProLideresAccessState | null
  teamAccessExpiresAt: string | null
}

async function loadDetail(userId: string): Promise<AdminUsuarioProLideresDetail | null> {
  if (!supabaseAdmin) return null

  const empty: AdminUsuarioProLideresDetail = {
    hasProLideres: false,
    isOwner: false,
    tenantId: null,
    tenantDisplayName: null,
    verticalCode: null,
    membershipId: null,
    role: null,
    teamAccessState: null,
    teamAccessExpiresAt: null,
  }

  const { data: owned } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, display_name, vertical_code')
    .eq('owner_user_id', userId)
    .limit(1)
    .maybeSingle()

  if (owned?.id) {
    return {
      hasProLideres: true,
      isOwner: true,
      tenantId: owned.id as string,
      tenantDisplayName: (owned.display_name as string | null) ?? null,
      verticalCode: (owned.vertical_code as string | null) ?? 'h-lider',
      membershipId: null,
      role: 'leader',
      teamAccessState: 'active',
      teamAccessExpiresAt: null,
    }
  }

  const { data: memberships } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('id, leader_tenant_id, role, team_access_state, team_access_expires_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const rows = memberships ?? []
  if (!rows.length) return empty

  const hLider = rows.find((r) => {
    const role = (r.role as string) ?? 'member'
    return role === 'member' || role === 'leader'
  })
  const pick = hLider ?? rows[0]
  const tenantId = String(pick.leader_tenant_id)

  const { data: tenant } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, display_name, vertical_code, owner_user_id')
    .eq('id', tenantId)
    .maybeSingle()

  const vc = (tenant?.vertical_code as string | undefined)?.trim() || 'h-lider'
  if (vc !== 'h-lider') {
    return empty
  }

  const st = ((pick.team_access_state as string) ?? 'active') as ProLideresAccessState
  const dbRole = (pick.role as string) === 'leader' ? 'leader' : 'member'

  return {
    hasProLideres: true,
    isOwner: tenant?.owner_user_id === userId,
    tenantId,
    tenantDisplayName: (tenant?.display_name as string | null) ?? null,
    verticalCode: vc,
    membershipId: pick.id as string,
    role: dbRole,
    teamAccessState: st,
    teamAccessExpiresAt: (pick.team_access_expires_at as string | null) ?? null,
  }
}

/**
 * GET — vínculo Pro Líderes do utilizador (equipa ou dono de tenant).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const auth = await requireApiAuth(_request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { id: userId } = await Promise.resolve(params)
  const detail = await loadDetail(userId)
  return NextResponse.json({ success: true, proLideres: detail })
}

type PatchBody = {
  action?: 'activate' | 'pause' | 'resume' | 'remove' | 'set_expiry'
  accessDays?: number | null
  accessExpiresAt?: string | null
}

/**
 * PATCH — ativar / pausar / retomar / remover membro Pro Líderes (admin).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { id: userId } = await Promise.resolve(params)
  let body: PatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const action = body.action
  if (!action || !['activate', 'pause', 'resume', 'remove', 'set_expiry'].includes(action)) {
    return NextResponse.json({ error: 'action inválida' }, { status: 400 })
  }

  const detail = await loadDetail(userId)
  if (!detail?.hasProLideres) {
    return NextResponse.json({ error: 'Sem vínculo Pro Líderes.' }, { status: 400 })
  }
  if (detail.isOwner && action !== 'remove') {
    return NextResponse.json({ error: 'Dono do tenant — validade não se aplica aqui.' }, { status: 400 })
  }
  if ((action === 'activate' || action === 'pause' || action === 'resume' || action === 'set_expiry') && !detail.membershipId) {
    return NextResponse.json({ error: 'Membership não encontrada.' }, { status: 404 })
  }
  const state = detail.teamAccessState ?? 'active'

  if (action === 'remove') {
    const { error } = await supabaseAdmin
      .from('leader_tenant_members')
      .delete()
      .eq('id', detail.membershipId)
      .eq('leader_tenant_id', detail.tenantId)
      .eq('role', 'member')
    if (error) {
      return NextResponse.json({ error: 'Não foi possível remover da equipa.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, message: 'Membro removido da equipa Pro Líderes.' })
  }

  if (action === 'activate') {
    if (state !== 'pending_activation') {
      return NextResponse.json(
        { error: 'Só é possível ativar quando o estado é «aguardando ativação».' },
        { status: 400 }
      )
    }
    const resolved = resolveTeamAccessExpiresAt({
      accessDays: body.accessDays,
      accessExpiresAt: body.accessExpiresAt,
      requireFutureDate: false,
    })
    if (resolved.error) {
      return NextResponse.json({ error: resolved.error }, { status: 400 })
    }
    const { error } = await supabaseAdmin
      .from('leader_tenant_members')
      .update({ team_access_state: 'active', team_access_expires_at: resolved.expiresAt })
      .eq('id', detail.membershipId!)
      .eq('leader_tenant_id', detail.tenantId!)
      .eq('role', 'member')
    if (error) {
      return NextResponse.json({ error: 'Não foi possível ativar.' }, { status: 500 })
    }
    return NextResponse.json({
      success: true,
      message: 'Acesso Pro Líderes ativado. A pessoa pode entrar em /pro-lideres/entrar.',
      accessExpiresAt: resolved.expiresAt,
    })
  }

  if (action === 'set_expiry') {
    if (state !== 'active') {
      return NextResponse.json({ error: 'Só membros ativos.' }, { status: 400 })
    }
    const resolvedExpiry = resolveTeamAccessExpiresAt({
      accessDays: body.accessDays,
      accessExpiresAt: body.accessExpiresAt,
      requireFutureDate: false,
    })
    if (resolvedExpiry.error) {
      return NextResponse.json({ error: resolvedExpiry.error }, { status: 400 })
    }
    const { error } = await supabaseAdmin
      .from('leader_tenant_members')
      .update({ team_access_expires_at: resolvedExpiry.expiresAt })
      .eq('id', detail.membershipId!)
      .eq('leader_tenant_id', detail.tenantId!)
    if (error) {
      return NextResponse.json({ error: 'Não foi possível atualizar a validade.' }, { status: 500 })
    }
    return NextResponse.json({
      success: true,
      message: 'Validade Pro Líderes atualizada.',
      accessExpiresAt: resolvedExpiry.expiresAt,
    })
  }

  if (action === 'pause') {
    if (state === 'pending_activation') {
      return NextResponse.json({ error: 'Membro ainda não ativado — use Ativar ou Remover.' }, { status: 400 })
    }
    if (state !== 'active') {
      return NextResponse.json({ error: 'Só membros ativos podem ser pausados.' }, { status: 400 })
    }
    const { error } = await supabaseAdmin
      .from('leader_tenant_members')
      .update({ team_access_state: 'paused' })
      .eq('id', detail.membershipId)
      .eq('leader_tenant_id', detail.tenantId)
    if (error) {
      return NextResponse.json({ error: 'Não foi possível pausar.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, message: 'Acesso pausado.' })
  }

  if (action === 'resume') {
    if (state !== 'paused') {
      return NextResponse.json({ error: 'Só membros pausados podem ser retomados.' }, { status: 400 })
    }
    const { error } = await supabaseAdmin
      .from('leader_tenant_members')
      .update({ team_access_state: 'active' })
      .eq('id', detail.membershipId)
      .eq('leader_tenant_id', detail.tenantId)
    if (error) {
      return NextResponse.json({ error: 'Não foi possível retomar.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, message: 'Acesso retomado.' })
  }

  return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 })
}
