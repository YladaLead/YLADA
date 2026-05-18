import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import ProLideresNoelMembroClient from '@/components/pro-lideres/ProLideresNoelMembroClient'
import { PRO_LIDERES_MEMBER_BASE_PATH } from '@/config/pro-lideres-menu'
import {
  createProLideresServerClient,
  ensureLeaderTenantAccess,
  resolveProLideresPainelUiState,
} from '@/lib/pro-lideres-server'
import { proLideresNoelMemberMonthlyAmountBrl, resolveProLideresNoelMemberSurface } from '@/lib/pro-lideres-noel-member-access'
import { getSupabaseAdmin } from '@/lib/supabase'

export default async function ProLideresMembroNoelMembroPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user?.id) {
    redirect('/pro-lideres/entrar')
  }

  const admin = getSupabaseAdmin()
  if (!admin) {
    redirect(PRO_LIDERES_MEMBER_BASE_PATH)
  }

  const cookieStore = await cookies()
  const ui = await resolveProLideresPainelUiState(gate, user.id, cookieStore, admin)

  const leaderPreviewingAsTeam = gate.role === 'leader' && ui.teamViewPreview
  if (gate.role !== 'member' && !leaderPreviewingAsTeam) {
    redirect('/pro-lideres/painel')
  }

  const surface = await resolveProLideresNoelMemberSurface(admin, user, gate, {
    isActiveMemberRow: ui.isActiveMemberRow,
    teamViewPreview: ui.teamViewPreview,
  })
  if (!surface.showSidebarNav) {
    redirect(PRO_LIDERES_MEMBER_BASE_PATH)
  }

  return (
    <Suspense fallback={<p className="p-4 text-sm text-gray-500">Carregando…</p>}>
      <ProLideresNoelMembroClient
        variant={leaderPreviewingAsTeam ? 'leader_preview_member_noel' : 'member'}
        initialHasSubscription={surface.hasPersonalSubscription}
        initialNoelMemberLapsed={surface.noelMemberLapsed}
        initialCanChat={surface.canOpenChat}
        monthlyAmountBrl={proLideresNoelMemberMonthlyAmountBrl()}
      />
    </Suspense>
  )
}
