import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProLideresEquipeAttributionPanel } from '@/components/pro-lideres/ProLideresEquipeAttributionPanel'
import { ProLideresEquipeMembersCollapsible } from '@/components/pro-lideres/ProLideresEquipeMembersCollapsible'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { fetchProLideresMembersEnriched } from '@/lib/pro-lideres-members-enriched'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

function roleLabel(role: ProLideresTenantRole): string {
  return role === 'leader' ? 'Líder' : 'Equipe'
}

export default async function ProLideresEquipePage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)
  const isLeader = gate.role === 'leader' && !teamViewPreview
  if (!isLeader) {
    redirect('/pro-lideres/painel')
  }

  const members = await fetchProLideresMembersEnriched(gate.tenant.id)
  const ctx = { tenant: gate.tenant, role: gate.role }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal</p>
        <h1 className="text-2xl font-bold text-gray-900">Análise da equipe</h1>
        <p className="mt-2 text-gray-700">
          {isLeader ? (
            <>
              Aqui vês <strong className="text-gray-900">quem está contigo neste espaço</strong> e geres o acesso: convida
              novas pessoas em <strong className="text-gray-800">Convites equipe</strong>. Quem acabou de entrar aparece como{' '}
              <strong className="text-gray-800">aguarda ativação</strong> até confirmares o pagamento e clicares em{' '}
              <strong className="text-gray-800">Ativar</strong>, definindo quantos dias o acesso fica válido (ou sem data de fim).
              Depois podes <strong className="text-gray-800">pausar</strong>, <strong className="text-gray-800">retomar</strong> ou{' '}
              <strong className="text-gray-800">remover</strong> — <strong className="text-gray-800">o que a pessoa já criou na conta YLADA não some</strong>.
            </>
          ) : (
            <>
              Aqui vês quem partilha este espaço contigo. A gestão de novos acessos é feita pela operação.
            </>
          )}
        </p>
      </div>

      <ProLideresEquipeMembersCollapsible
        members={members}
        viewerRoleLabel={roleLabel(ctx.role)}
        canManageMembers={isLeader}
      />

      {isLeader ? <ProLideresEquipeAttributionPanel /> : null}
    </div>
  )
}
