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
import {
  PRO_LIDERES_MEMBER_BASE_PATH,
  mapProLideresPathToLeaderArea,
} from '@/config/pro-lideres-menu'

/**
 * Área autenticada só para a equipe (convidados). Líderes reais são enviados para `/pro-lideres/painel`.
 * Nota: não usar `cookies().delete()` aqui — no App Router só Route Handlers / Server Actions podem alterar cookies.
 * Exceção: líder com cookie «Ver como equipe» pode abrir rotas em `/membro` para pré-visualizar (ex.: Noel membro).
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

  if (ui.canManageAsLeader && !ui.teamViewPreview) {
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
        canManageAsLeader: Boolean(ui.canManageAsLeader && ui.teamViewPreview),
        isLeaderWorkspace: false,
        teamViewPreview: ui.teamViewPreview,
        operationLabel,
        devStubPanel: isProLideresDevStubTenant(gate.tenant),
        verticalCode,
        dailyTasksVisibleToTeam,
        noelMemberShowSidebarNav,
        painelBasePath: PRO_LIDERES_MEMBER_BASE_PATH,
      }}
    >
      {children}
    </ProLideresAreaShell>
  )
}
