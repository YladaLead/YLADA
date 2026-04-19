import type { ReactNode } from 'react'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  createProLideresServerClient,
  ensureLeaderTenantAccess,
  isProLideresDevStubTenant,
} from '@/lib/pro-lideres-server'
import { proLideresTeamViewPreviewFromCookies } from '@/lib/pro-lideres-team-preview'
import { proLideresTeamSubscriptionAllowsAccess } from '@/lib/pro-lideres-subscription-access'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getProLideresMemberMandatoryProfileGap } from '@/lib/pro-lideres-member-mandatory-profile'
import ProLideresAreaShell from '@/components/pro-lideres/ProLideresAreaShell'

export default async function ProLideresPainelLayout({ children }: { children: ReactNode }) {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) {
    redirect(gate.redirect)
  }

  const pathname = (await headers()).get('x-pathname') || ''
  const isAssinaturaEquipe = pathname.includes('/painel/assinatura-equipe')
  const cookieStore = await cookies()
  const teamViewPreview = proLideresTeamViewPreviewFromCookies(gate.role, cookieStore)

  if (!isAssinaturaEquipe) {
    const supabase = await createProLideresServerClient()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (
      user &&
      !(await proLideresTeamSubscriptionAllowsAccess(user, {
        tenant: gate.tenant,
        role: gate.role,
      }))
    ) {
      redirect('/pro-lideres/painel/assinatura-equipe')
    }

    if (
      user &&
      gate.role === 'member' &&
      !teamViewPreview &&
      !pathname.includes('/painel/equipe/dados-obrigatorios')
    ) {
      const admin = getSupabaseAdmin()
      if (admin) {
        const gap = await getProLideresMemberMandatoryProfileGap(admin, gate.tenant.id, user.id)
        if (gap.needsAction) {
          redirect('/pro-lideres/painel/equipe/dados-obrigatorios')
        }
      }
    }
  }
  const isLeaderWorkspace = gate.role === 'leader' && !teamViewPreview

  const operationLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || null
  const verticalCode = (gate.tenant.vertical_code ?? 'h-lider').trim() || 'h-lider'
  const dailyTasksVisibleToTeam = gate.tenant.daily_tasks_visible_to_team !== false

  return (
    <ProLideresAreaShell
      painelContext={{
        role: gate.role,
        isLeaderWorkspace,
        teamViewPreview,
        operationLabel,
        devStubPanel: isProLideresDevStubTenant(gate.tenant),
        verticalCode,
        dailyTasksVisibleToTeam,
      }}
    >
      {children}
    </ProLideresAreaShell>
  )
}
