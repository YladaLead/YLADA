import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProLideresPreDiagnosticoClient } from '@/components/pro-lideres/ProLideresPreDiagnosticoClient'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

export default async function ProLideresPreDiagnosticoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  if (gate.role !== 'leader' || teamViewPreview) redirect('/pro-lideres/painel')

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal · Ambiente do líder</p>
        <h1 className="text-2xl font-bold text-gray-900">
          Pré-diagnóstico estratégico para líderes
        </h1>
      </div>
      <p className="text-gray-700">
        Envie o link antes da reunião. Os contactos pedidos alinham-se ao cadastro da equipa quando quiser dar o
        próximo passo.
      </p>
      <ProLideresPreDiagnosticoClient />
    </div>
  )
}
