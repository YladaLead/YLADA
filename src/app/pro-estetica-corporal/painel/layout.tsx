import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import {
  ensureEsteticaCorporalTenantAccess,
  isDevStubEsteticaCorporalPanel,
  PRO_ESTETICA_CORPORAL_VERTICAL_CODE,
} from '@/lib/pro-estetica-corporal-server'
import ProEsteticaCorporalAreaShell from '@/components/pro-estetica-corporal/ProEsteticaCorporalAreaShell'

export default async function ProEsteticaCorporalPainelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureEsteticaCorporalTenantAccess()
  if (!gate.ok) {
    redirect(gate.redirect)
  }

  const operationLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? PRO_ESTETICA_CORPORAL_VERTICAL_CODE).trim()
  const previewWithoutLogin = Boolean(gate.previewWithoutLogin)

  return (
    <ProEsteticaCorporalAreaShell
      painelContext={{
        role: gate.role,
        isLeaderWorkspace: gate.role === 'leader',
        operationLabel,
        devStubPanel: isDevStubEsteticaCorporalPanel(gate.tenant) || previewWithoutLogin,
        previewWithoutLogin,
        verticalCode,
      }}
    >
      {children}
    </ProEsteticaCorporalAreaShell>
  )
}
