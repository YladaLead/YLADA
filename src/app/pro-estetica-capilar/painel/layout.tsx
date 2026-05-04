import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import ProEsteticaCapilarAreaShell from '@/components/pro-estetica-capilar/ProEsteticaCapilarAreaShell'
import {
  ensureEsteticaCapilarTenantAccess,
  isDevStubEsteticaCapilarPanel,
  PRO_ESTETICA_CAPILAR_VERTICAL_CODE,
} from '@/lib/pro-estetica-capilar-server'

export default async function ProEsteticaCapilarPainelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureEsteticaCapilarTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const operationLabel = gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? PRO_ESTETICA_CAPILAR_VERTICAL_CODE).trim()
  const previewWithoutLogin = Boolean(gate.previewWithoutLogin)

  return (
    <ProEsteticaCapilarAreaShell
      painelContext={{
        role: gate.role,
        canManageAsLeader: gate.role === 'leader',
        isLeaderWorkspace: gate.role === 'leader',
        operationLabel,
        devStubPanel: isDevStubEsteticaCapilarPanel(gate.tenant) || previewWithoutLogin,
        previewWithoutLogin,
        verticalCode,
        dailyTasksVisibleToTeam: true,
        painelBasePath: '/pro-estetica-capilar/painel',
      }}
    >
      {children}
    </ProEsteticaCapilarAreaShell>
  )
}
