import { redirect } from 'next/navigation'

import { ProLideresTabuladoresPanel } from '@/components/pro-lideres/ProLideresTabuladoresPanel'
import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'

export default async function ProLideresTabuladoresPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const ui = await loadProLideresPainelUiForRequest(gate)
  if (!ui.isLeaderWorkspace) redirect('/pro-lideres/painel')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal · Ambiente do líder</p>
        <h1 className="text-2xl font-bold text-gray-900">Tabuladores</h1>
      </div>
      <p className="text-gray-700">
        Cadastre os nomes de tabulador da sua operação. Essa lista aparece no link de convite para a equipe escolher o
        tabulador ao criar conta ou ao aceitar o convite.
      </p>
      <ProLideresTabuladoresPanel />
    </div>
  )
}
