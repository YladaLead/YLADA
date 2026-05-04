import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

/** Laboratório Noel: só líder real (igual ao Noel mentor). */
export default async function ProLideresNoelLaboratorioLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  const canUse = ui.isLeaderWorkspace
  if (!canUse) {
    redirect('/pro-lideres/painel')
  }

  return <>{children}</>
}
