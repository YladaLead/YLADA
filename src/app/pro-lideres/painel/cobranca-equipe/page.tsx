import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

export default async function ProLideresCobrancaEquipePage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) redirect('/pro-lideres/painel')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal · Ambiente do líder</p>
        <h1 className="text-2xl font-bold text-gray-900">Cobrança da equipe</h1>
      </div>
      <p className="text-gray-600">Você precisa cadastrar para aparecer aqui.</p>
    </div>
  )
}
