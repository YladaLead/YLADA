import { redirect } from 'next/navigation'

import { ProLideresDailyTasksClient } from '@/components/pro-lideres/ProLideresDailyTasksClient'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'

export default async function ProLideresMembroTarefasPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  const visibleForTeam = gate.tenant.daily_tasks_visible_to_team !== false

  if (!visibleForTeam) {
    redirect('/pro-lideres/membro')
  }

  return <ProLideresDailyTasksClient />
}
