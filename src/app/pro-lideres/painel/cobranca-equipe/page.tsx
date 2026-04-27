import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

export default async function ProLideresCobrancaEquipePage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  if (gate.role !== 'leader' || teamViewPreview) redirect('/pro-lideres/painel')

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
