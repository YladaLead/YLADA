import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

/** Laboratório Noel: só líder real (igual ao Noel mentor). */
export default async function ProLideresNoelLaboratorioLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  const canUse = gate.role === 'leader' && !teamViewPreview
  if (!canUse) {
    redirect('/pro-lideres/painel')
  }

  return <>{children}</>
}
