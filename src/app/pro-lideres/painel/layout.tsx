import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { ensureLeaderTenantAccess, isProLideresDevStubTenant } from '@/lib/pro-lideres-server'
import ProLideresAreaShell from '@/components/pro-lideres/ProLideresAreaShell'

export default async function ProLideresPainelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) {
    redirect(gate.redirect)
  }

  const operationLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? 'h-lider').trim() || 'h-lider'

  return (
    <ProLideresAreaShell
      painelContext={{
        role: gate.role,
        isLeaderWorkspace: gate.role === 'leader',
        operationLabel,
        devStubPanel: isProLideresDevStubTenant(gate.tenant),
        verticalCode,
      }}
    >
      {children}
    </ProLideresAreaShell>
  )
}
