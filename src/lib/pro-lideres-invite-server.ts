import type { SupabaseClient } from '@supabase/supabase-js'
import type { LeaderTenantInviteRow } from '@/types/leader-tenant'

export type LoadedInviteResult =
  | { ok: true; invite: LeaderTenantInviteRow }
  | { ok: false; reason: string; status: number }

/** Convite válido: pending, não expirado, não revogado nem usado. Atualiza para expired quando aplicável. */
export async function loadValidPendingProLideresInvite(
  supabase: SupabaseClient,
  token: string
): Promise<LoadedInviteResult> {
  const t = token?.trim()
  if (!t) {
    return { ok: false, reason: 'missing_token', status: 400 }
  }

  const { data: invite, error } = await supabase
    .from('leader_tenant_invites')
    .select('*')
    .eq('token', t)
    .maybeSingle()

  if (error || !invite) {
    return { ok: false, reason: 'not_found', status: 404 }
  }

  const inv = invite as LeaderTenantInviteRow
  const now = new Date()

  if (inv.status === 'revoked') {
    return { ok: false, reason: 'revoked', status: 400 }
  }
  if (inv.status === 'used' || inv.used_at) {
    return { ok: false, reason: 'used', status: 400 }
  }
  if (inv.status !== 'pending') {
    return { ok: false, reason: 'invalid_status', status: 400 }
  }
  if (new Date(inv.expires_at) < now) {
    await supabase
      .from('leader_tenant_invites')
      .update({ status: 'expired' })
      .eq('id', inv.id)
      .eq('status', 'pending')
    return { ok: false, reason: 'expired', status: 400 }
  }

  return { ok: true, invite: inv }
}
