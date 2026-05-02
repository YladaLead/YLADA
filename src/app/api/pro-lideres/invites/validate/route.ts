import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ownerHasProLideresTeamSubscription } from '@/lib/pro-lideres-subscription-access'
import { fetchTabulatorLabelsForTenant } from '@/lib/pro-lideres-tabulators'
import type { LeaderTenantInviteRow } from '@/types/leader-tenant'

/**
 * Público: valida token para a página de convite (sem expor dados sensíveis além do necessário).
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim()
  if (!token) {
    return NextResponse.json({ ok: false, reason: 'missing_token' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, reason: 'server' }, { status: 503 })
  }

  const { data: invite, error } = await supabaseAdmin
    .from('leader_tenant_invites')
    .select('id, leader_tenant_id, invited_email, expires_at, status, used_at')
    .eq('token', token)
    .maybeSingle()

  if (error || !invite) {
    return NextResponse.json({ ok: false, reason: 'not_found' })
  }

  const row = invite as Pick<
    LeaderTenantInviteRow,
    'id' | 'leader_tenant_id' | 'invited_email' | 'expires_at' | 'status' | 'used_at'
  >

  const now = new Date()
  if (row.status === 'revoked') {
    return NextResponse.json({ ok: false, reason: 'revoked' })
  }
  if (row.status === 'used' || row.used_at) {
    return NextResponse.json({ ok: false, reason: 'used' })
  }
  if (row.status !== 'pending') {
    return NextResponse.json({ ok: false, reason: 'invalid_status' })
  }
  if (new Date(row.expires_at) < now) {
    await supabaseAdmin
      .from('leader_tenant_invites')
      .update({ status: 'expired' })
      .eq('id', row.id)
      .eq('status', 'pending')
    return NextResponse.json({ ok: false, reason: 'expired' })
  }

  const { data: tenant } = await supabaseAdmin
    .from('leader_tenants')
    .select('display_name, team_name, owner_user_id')
    .eq('id', row.leader_tenant_id)
    .maybeSingle()

  if (
    tenant &&
    !(await ownerHasProLideresTeamSubscription(tenant.owner_user_id as string))
  ) {
    return NextResponse.json({ ok: false, reason: 'leader_subscription_inactive' })
  }

  const spaceName =
    (tenant?.display_name as string) ||
    (tenant?.team_name as string) ||
    'Pro Líderes'

  const tabulatorNames = await fetchTabulatorLabelsForTenant(supabaseAdmin, row.leader_tenant_id as string)

  return NextResponse.json({
    ok: true,
    invitedEmail: row.invited_email,
    spaceName,
    expiresAt: row.expires_at,
    tabulatorNames,
  })
}
