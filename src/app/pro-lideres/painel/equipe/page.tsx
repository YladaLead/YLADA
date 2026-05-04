import { redirect } from 'next/navigation'

import { ProLideresEquipeAttributionPanel } from '@/components/pro-lideres/ProLideresEquipeAttributionPanel'
import { ProLideresEquipeMembersCollapsible } from '@/components/pro-lideres/ProLideresEquipeMembersCollapsible'
import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'
import {
  fetchProLideresMembersEnriched,
  syncProLideresMemberExpiryPauses,
} from '@/lib/pro-lideres-members-enriched'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

function roleLabel(role: ProLideresTenantRole): string {
  return role === 'leader' ? 'Líder' : 'Equipe'
}

export default async function ProLideresEquipePage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  const isLeader = ui.isLeaderWorkspace
  if (!isLeader) {
    redirect('/pro-lideres/painel')
  }

  await syncProLideresMemberExpiryPauses(gate.tenant.id)
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
              Aqui você vê <strong className="text-gray-900">quem está com você neste espaço</strong> e gerencia o
              acesso: convide novas pessoas em <strong className="text-gray-800">Convites equipe</strong>. Quem acabou de
              entrar aparece como <strong className="text-gray-800">aguarda ativação</strong> até você confirmar o
              pagamento e clicar em <strong className="text-gray-800">Ativar</strong>, definindo quantos dias o acesso fica
              válido (ex.: 30 ou 31 dias, ou sem data de fim). Na lista você vê a{' '}
              <strong className="text-gray-800">data de validade</strong>; quando essa data passa, o acesso{' '}
              <strong className="text-gray-800">pausa automaticamente</strong> até você renovar. Use{' '}
              <strong className="text-gray-800">Pausar</strong>, <strong className="text-gray-800">Ativar</strong> ou{' '}
              <strong className="text-gray-800">Remover</strong> —{' '}
              <strong className="text-gray-800">o que a pessoa já criou na conta YLADA não some</strong>.
            </>
          ) : (
            <>
              Aqui você vê quem compartilha este espaço com você. A gestão de novos acessos é feita pela operação.
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
