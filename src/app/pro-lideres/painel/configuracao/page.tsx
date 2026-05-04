import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

export default async function ProLideresConfiguracaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) redirect('/pro-lideres/painel')

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-blue-600">Conta · Ambiente do líder</p>
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      <p className="max-w-2xl text-gray-600">Preferências do painel e plano. Em construção.</p>
    </div>
  )
}
