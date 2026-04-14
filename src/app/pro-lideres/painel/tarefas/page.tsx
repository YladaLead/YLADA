import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProLideresDailyTasksClient } from '@/components/pro-lideres/ProLideresDailyTasksClient'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

export default async function ProLideresTarefasPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  const isLeaderWorkspace = gate.role === 'leader' && !teamViewPreview
  const visibleForTeam = gate.tenant.daily_tasks_visible_to_team !== false

  if (!isLeaderWorkspace && !visibleForTeam) {
    redirect('/pro-lideres/painel')
  }

  return <ProLideresDailyTasksClient />
}
