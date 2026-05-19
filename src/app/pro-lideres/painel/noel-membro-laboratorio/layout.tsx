import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

/** Laboratório Noel membro: só líder (testa o mesmo API da equipe). */
export default async function ProLideresMemberNoelLabLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) {
    redirect('/pro-lideres/painel')
  }

  return <>{children}</>
}
