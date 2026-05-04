import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

/** Noel Pro Líderes: apenas líder (não equipe nem modo «ver como equipe»). */
export default async function ProLideresNoelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  const canUseNoel = ui.isLeaderWorkspace
  if (!canUseNoel) {
    redirect('/pro-lideres/painel')
  }

  return <>{children}</>
}
