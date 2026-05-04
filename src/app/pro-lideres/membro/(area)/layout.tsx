import type { ReactNode } from 'react'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  createProLideresServerClient,
  ensureLeaderTenantAccess,
  isProLideresDevStubTenant,
  resolveProLideresPainelUiState,
} from '@/lib/pro-lideres-server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getProLideresMemberMandatoryProfileGap } from '@/lib/pro-lideres-member-mandatory-profile'
import ProLideresAreaShell from '@/components/pro-lideres/ProLideresAreaShell'
import {
  PRO_LIDERES_MEMBER_BASE_PATH,
  mapProLideresPathToLeaderArea,
} from '@/config/pro-lideres-menu'

/**
 * Área autenticada só para equipa (convidados). Líderes reais são enviados para `/pro-lideres/painel`.
 * Nota: não usar `cookies().delete()` aqui — no App Router só Route Handlers / Server Actions podem alterar cookies.
 * O modo «ver como equipe» já fica desligado na UI via `teamViewPreview: false` e `canManageAsLeader: false`.
 */
export default async function ProLideresMembroAreaLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) {
    redirect(gate.redirect)
  }

  const pathname = (await headers()).get('x-pathname') || ''
  const cookieStore = await cookies()

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  const admin = getSupabaseAdmin()
  const ui =
    user?.id != null
      ? await resolveProLideresPainelUiState(gate, user.id, cookieStore, admin)
      : {
          canManageAsLeader: false,
          isActiveMemberRow: false,
          teamViewPreview: false,
          isLeaderWorkspace: false,
        }

  if (ui.canManageAsLeader) {
    redirect(mapProLideresPathToLeaderArea(pathname))
  }

  if (
    user &&
    ui.isActiveMemberRow &&
    !ui.teamViewPreview &&
    !pathname.includes('dados-obrigatorios')
  ) {
    if (admin) {
      const gap = await getProLideresMemberMandatoryProfileGap(admin, gate.tenant.id, user.id)
      if (gap.needsAction) {
        redirect('/pro-lideres/membro/equipe/dados-obrigatorios')
      }
    }
  }

  const operationLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? 'h-lider').trim() || 'h-lider'
  const dailyTasksVisibleToTeam = gate.tenant.daily_tasks_visible_to_team !== false

  return (
    <ProLideresAreaShell
      painelContext={{
        role: gate.role,
        canManageAsLeader: false,
        isLeaderWorkspace: false,
        teamViewPreview: false,
        operationLabel,
        devStubPanel: isProLideresDevStubTenant(gate.tenant),
        verticalCode,
        dailyTasksVisibleToTeam,
        painelBasePath: PRO_LIDERES_MEMBER_BASE_PATH,
      }}
    >
      {children}
    </ProLideresAreaShell>
  )
}
