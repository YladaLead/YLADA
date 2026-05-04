import { redirect } from 'next/navigation'

import { ensureLeaderTenantAccess, loadProLideresPainelUiForRequest } from '@/lib/pro-lideres-server'
import { ProLideresPainelOverview } from '@/components/pro-lideres/ProLideresPainelOverview'

export default async function ProLideresPainelVisaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const ui = await loadProLideresPainelUiForRequest(gate)
  const isLeader = ui.isLeaderWorkspace
  const op =
    gate.tenant.display_name?.trim() ||
    gate.tenant.team_name?.trim() ||
    'este espaço'

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Visão geral</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLeader ? 'Painel do líder' : 'Seu espaço na equipe'}
          </h1>
          {!isLeader ? (
            <p className="mt-1 text-gray-600">
              Você está no <strong className="text-emerald-800">ambiente da equipe</strong> de{' '}
              <strong className="text-gray-800">{op}</strong>. O líder cuida de convites, equipe e configurações; aqui
              você acessa só o <strong>catálogo</strong> e os <strong>scripts</strong> para usar no campo — sem Noel nem
              gestão de equipe.
            </p>
          ) : null}
        </div>
      </div>

      {isLeader ? (
        <div id="painel-comando" className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Atividade e métricas</h2>
          <ProLideresPainelOverview />
        </div>
      ) : null}
    </div>
  )
}
