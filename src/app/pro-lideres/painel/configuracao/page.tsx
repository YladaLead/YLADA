import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'
import ProLideresNoelMemberOfferSettings from '@/components/pro-lideres/ProLideresNoelMemberOfferSettings'

export default async function ProLideresConfiguracaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) redirect('/pro-lideres/painel')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-blue-600">Conta · Ambiente do líder</p>
        <h1 className="text-2xl font-bold text-gray-900">Noel equipe</h1>
        <p className="max-w-2xl text-gray-600">
          Defina se a sua equipe pode ver o Noel de campo no painel e para quem vale a opção.
        </p>
      </div>
      <ProLideresNoelMemberOfferSettings />
    </div>
  )
}
