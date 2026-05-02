import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProLideresTabuladoresPanel } from '@/components/pro-lideres/ProLideresTabuladoresPanel'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

export default async function ProLideresTabuladoresPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  if (gate.role !== 'leader' || teamViewPreview) redirect('/pro-lideres/painel')

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
