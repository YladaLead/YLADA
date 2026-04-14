import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ProLideresEquipeAttributionPanel } from '@/components/pro-lideres/ProLideresEquipeAttributionPanel'
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
        <h1 className="text-2xl font-bold text-gray-900">Equipe</h1>
        <p className="mt-2 text-gray-700">
          {isLeader ? (
            <>
              Quem faz parte deste espaço: o <strong className="text-gray-900">líder</strong> (você, após a consultoria)
              e a <strong className="text-gray-900">equipe</strong> que convidar. Gere links em{' '}
              <strong className="text-gray-800">Links &amp; convites</strong>.
            </>
          ) : (
            <>
              Lista de quem partilha este espaço contigo: o <strong className="text-gray-900">líder</strong> e a{' '}
              <strong className="text-gray-900">equipe</strong>. Novos acessos são geridos pelo líder.
            </>
          )}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">Pessoas neste espaço</p>
          <p className="text-xs text-gray-500">O seu papel aqui: {roleLabel(ctx.role)}</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {members.length === 0 ? (
            <li className="px-4 py-6 text-sm text-gray-600">Nenhuma pessoa listada.</li>
          ) : (
            members.map((m) => {
              const title = m.displayName?.trim() || m.email?.trim() || 'Conta sem nome no perfil YLADA'
              const subtitle = m.email && m.displayName ? m.email : m.userId
              return (
                <li key={m.userId} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{title}</p>
                    <p className="truncate text-sm text-gray-500">{subtitle}</p>
                  </div>
                  <span
                    className={
                      m.role === 'leader'
                        ? 'mt-1 inline-flex w-fit shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 sm:mt-0'
                        : 'mt-1 inline-flex w-fit shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 sm:mt-0'
                    }
                  >
                    {roleLabel(m.role)}
                  </span>
                </li>
              )
            })
          )}
        </ul>
      </div>

      {isLeader ? <ProLideresEquipeAttributionPanel /> : null}
    </div>
  )
}
