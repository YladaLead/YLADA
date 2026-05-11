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
import { resolveProLideresNoelMemberSurface } from '@/lib/pro-lideres-noel-member-access'
import ProLideresAreaShell from '@/components/pro-lideres/ProLideresAreaShell'
import { PRO_LIDERES_BASE_PATH, mapProLideresPathToMemberArea } from '@/config/pro-lideres-menu'

export default async function ProLideresPainelLayout({ children }: { children: ReactNode }) {
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

  if (!ui.canManageAsLeader) {
    redirect(mapProLideresPathToMemberArea(pathname))
  }

  const operationLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? 'h-lider').trim() || 'h-lider'
  const dailyTasksVisibleToTeam = gate.tenant.daily_tasks_visible_to_team !== false

  let noelMemberShowSidebarNav = false
  if (admin && user?.id) {
    const nm = await resolveProLideresNoelMemberSurface(admin, user, gate, {
      isActiveMemberRow: ui.isActiveMemberRow,
      teamViewPreview: ui.teamViewPreview,
    })
    noelMemberShowSidebarNav = nm.showSidebarNav
  }

  return (
    <ProLideresAreaShell
      painelContext={{
        role: gate.role,
        canManageAsLeader: ui.canManageAsLeader,
        isLeaderWorkspace: ui.isLeaderWorkspace,
        teamViewPreview: ui.teamViewPreview,
        operationLabel,
        devStubPanel: isProLideresDevStubTenant(gate.tenant),
        verticalCode,
        dailyTasksVisibleToTeam,
        noelMemberShowSidebarNav,
        painelBasePath: PRO_LIDERES_BASE_PATH,
      }}
    >
      {children}
    </ProLideresAreaShell>
  )
}
