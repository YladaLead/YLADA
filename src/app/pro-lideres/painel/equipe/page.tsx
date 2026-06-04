import { redirect } from 'next/navigation'

import { ProLideresEquipeAttributionPanel } from '@/components/pro-lideres/ProLideresEquipeAttributionPanel'
import { ProLideresEquipeMembersCollapsible } from '@/components/pro-lideres/ProLideresEquipeMembersCollapsible'
import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'
import {
  fetchProLideresMembersEnriched,
  syncProLideresMemberExpiryPauses,
} from '@/lib/pro-lideres-members-enriched'

export default async function ProLideresEquipePage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  const isLeader = ui.isLeaderWorkspace
  if (!isLeader) {
    redirect('/pro-lideres/painel')
  }

  await syncProLideresMemberExpiryPauses(gate.tenant.id)
  const members = await fetchProLideresMembersEnriched(gate.tenant.id)

  return (
    <div className="max-w-6xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Análise da equipe</h1>

      <ProLideresEquipeMembersCollapsible
        members={members}
        canManageMembers={isLeader}
        currentUserId={gate.tenant.owner_user_id}
        paymentUrl={gate.tenant.team_bank_payment_url ?? null}
        pixUrl={gate.tenant.team_bank_pix_payment_url ?? null}
      />

      {isLeader ? <ProLideresEquipeAttributionPanel /> : null}
    </div>
  )
}
