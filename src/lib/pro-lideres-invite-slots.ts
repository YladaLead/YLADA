import type { SupabaseClient } from '@supabase/supabase-js'

/** Vagas por pacote (assinatura base ou +50 no Mercado Pago). */
export const PRO_LIDERES_INVITE_SLOTS_PER_PACK = 50

export const PRO_LIDERES_INVITE_PACK_BRL = 750

export type ProLideresInviteSlotsStatus = {
  /** Total de vagas compradas (soma dos pacotes em `team_invite_pending_quota`). */
  slotsPurchased: number
  /** Pessoas com cadastro na equipe (`leader_tenant_members`, papel member). */
  teamMembersCount: number
  /** `slotsPurchased - teamMembersCount` (negativo = acima do limite). */
  remaining: number
  invitesBlocked: boolean
  packSize: number
  packPriceBrl: number
}

export function resolveProLideresInviteSlotsPurchased(
  teamInvitePendingQuota: number | undefined | null
): number {
  return typeof teamInvitePendingQuota === 'number' && teamInvitePendingQuota > 0
    ? teamInvitePendingQuota
    : PRO_LIDERES_INVITE_SLOTS_PER_PACK
}

export function buildProLideresInviteSlotsStatus(
  slotsPurchased: number,
  teamMembersCount: number
): ProLideresInviteSlotsStatus {
  const remaining = slotsPurchased - teamMembersCount
  return {
    slotsPurchased,
    teamMembersCount,
    remaining,
    invitesBlocked: teamMembersCount >= slotsPurchased,
    packSize: PRO_LIDERES_INVITE_SLOTS_PER_PACK,
    packPriceBrl: PRO_LIDERES_INVITE_PACK_BRL,
  }
}

/** Mensagem padrão quando o líder esgotou o pacote (por cadastros na equipe, não por links gerados). */
export function proLideresInviteSlotsBlockedMessage(status: ProLideresInviteSlotsStatus): string {
  const { teamMembersCount, slotsPurchased, remaining } = status
  if (remaining >= 0) {
    return `Seus convites estão bloqueados. Você já tem ${teamMembersCount} de ${slotsPurchased} cadastros na equipe do seu pacote. Adquira mais ${PRO_LIDERES_INVITE_SLOTS_PER_PACK} vagas (R$ ${PRO_LIDERES_INVITE_PACK_BRL}) pelo Mercado Pago para convidar outras pessoas.`
  }
  const over = Math.abs(remaining)
  return `Seus convites estão bloqueados. Você já tem ${teamMembersCount} de ${slotsPurchased} cadastros na equipe (${over} acima do limite). Adquira mais ${PRO_LIDERES_INVITE_SLOTS_PER_PACK} vagas (R$ ${PRO_LIDERES_INVITE_PACK_BRL}) pelo Mercado Pago para continuar.`
}

/** Conta membros da equipe (cadastro concluído), não links de convite gerados. */
export async function countProLideresTeamMembers(
  admin: SupabaseClient,
  tenantId: string
): Promise<number> {
  const { count, error } = await admin
    .from('leader_tenant_members')
    .select('id', { count: 'exact', head: true })
    .eq('leader_tenant_id', tenantId)
    .eq('role', 'member')

  if (error) {
    console.error('[countProLideresTeamMembers]', error)
    return 0
  }
  return count ?? 0
}

export async function loadProLideresInviteSlotsStatus(
  admin: SupabaseClient,
  tenantId: string,
  teamInvitePendingQuota: number | undefined | null
): Promise<ProLideresInviteSlotsStatus> {
  const slotsPurchased = resolveProLideresInviteSlotsPurchased(teamInvitePendingQuota)
  const teamMembersCount = await countProLideresTeamMembers(admin, tenantId)
  return buildProLideresInviteSlotsStatus(slotsPurchased, teamMembersCount)
}
