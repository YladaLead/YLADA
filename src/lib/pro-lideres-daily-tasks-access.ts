import type { LeaderTenantRow } from '@/types/leader-tenant'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

/** Membro não deve aceder a tarefas/lembretes quando o líder ocultou a área. */
export function proLideresDailyTasksBlockedForMember(
  tenant: Pick<LeaderTenantRow, 'daily_tasks_visible_to_team'>,
  role: ProLideresTenantRole
): boolean {
  return role === 'member' && tenant.daily_tasks_visible_to_team === false
}
