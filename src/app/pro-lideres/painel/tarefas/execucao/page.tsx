import { redirect } from 'next/navigation'

import { ProLideresDailyTasksExecucaoClient } from '@/components/pro-lideres/ProLideresDailyTasksExecucaoClient'
import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

export default async function ProLideresTarefasExecucaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  const isLeaderWorkspace = ui.isLeaderWorkspace

  if (!isLeaderWorkspace) {
    redirect('/pro-lideres/painel/tarefas')
  }

  return <ProLideresDailyTasksExecucaoClient />
}
