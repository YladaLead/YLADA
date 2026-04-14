import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ensureLeaderTenantAccess, isProLideresDevStubTenant } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'
import ProLideresAreaShell from '@/components/pro-lideres/ProLideresAreaShell'

export default async function ProLideresPainelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) {
    redirect(gate.redirect)
  }

  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  const isLeaderWorkspace = gate.role === 'leader' && !teamViewPreview

  const operationLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? 'h-lider').trim() || 'h-lider'

  return (
    <ProLideresAreaShell
      painelContext={{
        role: gate.role,
        isLeaderWorkspace,
        teamViewPreview,
        operationLabel,
        devStubPanel: isProLideresDevStubTenant(gate.tenant),
        verticalCode,
      }}
    >
      {children}
    </ProLideresAreaShell>
  )
}
