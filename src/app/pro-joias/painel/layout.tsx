import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { ensureProJoiasTenantAccess, isDevStubJoiasPanel, PRO_JOIAS_VERTICAL_CODE } from '@/lib/pro-joias-server'
import ProJoiasAreaShell from '@/components/pro-joias/ProJoiasAreaShell'

export const metadata: Metadata = {
  title: {
    default: 'Painel | Pro Joias',
    template: '%s | Pro Joias',
  },
  description: 'Painel YLADA Pro Joias — scripts, equipe e diagnósticos.',
}

export default async function ProJoiasPainelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureProJoiasTenantAccess()

  if (!gate.ok) {
    redirect(gate.redirect)
  }

  const operationLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? PRO_JOIAS_VERTICAL_CODE).trim()
  const previewWithoutLogin = Boolean(gate.previewWithoutLogin)

  return (
    <ProJoiasAreaShell
      painelContext={{
        role: gate.role,
        canManageAsLeader: gate.role === 'leader',
        isLeaderWorkspace: gate.role === 'leader',
        operationLabel,
        devStubPanel: isDevStubJoiasPanel(gate.tenant) || previewWithoutLogin,
        previewWithoutLogin,
        verticalCode,
        dailyTasksVisibleToTeam: false,
        noelMemberShowSidebarNav: false,
        painelBasePath: '/pro-joias/painel',
      }}
    >
      {children}
    </ProJoiasAreaShell>
  )
}
