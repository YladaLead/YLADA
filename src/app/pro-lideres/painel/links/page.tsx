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
        <h1 className="text-2xl font-bold text-gray-900">Links & convites</h1>
      </div>
      <p className="text-gray-700">
        <strong className="text-gray-900">Gere um link por e-mail</strong> e envie à pessoa da equipe. Ela deve usar{' '}
        <strong className="text-gray-800">o mesmo e-mail</strong> na conta YLADA ao aceitar o convite. Quem já entrou
        aparece em <strong className="text-gray-800">Equipe</strong>.
      </p>
      <ProLideresInvitesPanel />
    </div>
  )
}
