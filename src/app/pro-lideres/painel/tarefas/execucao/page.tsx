import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProLideresDailyTasksExecucaoClient } from '@/components/pro-lideres/ProLideresDailyTasksExecucaoClient'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

export default async function ProLideresTarefasExecucaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  const isLeaderWorkspace = gate.role === 'leader' && !teamViewPreview

  if (!isLeaderWorkspace) {
    redirect('/pro-lideres/painel/tarefas')
  }

  return <ProLideresDailyTasksExecucaoClient />
}
