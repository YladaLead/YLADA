import { redirect } from 'next/navigation'

import { ProLideresInvitesPanel } from '@/components/pro-lideres/ProLideresInvitesPanel'
import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

export default async function ProLideresLinksPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) redirect('/pro-lideres/painel')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal · Ambiente do líder</p>
        <h1 className="text-2xl font-bold text-gray-900">Convites equipe</h1>
      </div>
      <p className="text-gray-700">
        Gera o convite por e-mail e acompanha os links na lista. No fim da página tens o link de cobrança opcional da tua
        operação e a opção de adquirir mais 50 convites.
      </p>
      <ProLideresInvitesPanel />
    </div>
  )
}
