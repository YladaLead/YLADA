import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

/** Noel Pro Líderes: apenas líder (não equipe nem modo «ver como equipe»). */
export default async function ProLideresNoelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  const canUseNoel = gate.role === 'leader' && !teamViewPreview
  if (!canUseNoel) {
    redirect('/pro-lideres/painel')
  }

  return <>{children}</>
}
