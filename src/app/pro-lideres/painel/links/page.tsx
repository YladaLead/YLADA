import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProLideresInvitesPanel } from '@/components/pro-lideres/ProLideresInvitesPanel'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'

export default async function ProLideresLinksPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  if (gate.role !== 'leader' || teamViewPreview) redirect('/pro-lideres/painel')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal · Ambiente do líder</p>
        <h1 className="text-2xl font-bold text-gray-900">Convites equipe</h1>
      </div>
      <p className="text-gray-700">
        Configura o link de cobrança do teu banco (opcional) e gera o convite por e-mail; quem aceitar vê o pagamento
        depois do cadastro. O plano YLADA da equipe aparece no topo da lista abaixo.
      </p>
      <ProLideresInvitesPanel />
    </div>
  )
}
