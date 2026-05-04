import { redirect } from 'next/navigation'
import {
  createProLideresServerClient,
  ensureLeaderTenantAccess,
  loadProLideresPainelUiForRequest,
} from '@/lib/pro-lideres-server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getProLideresMemberMandatoryProfileGap } from '@/lib/pro-lideres-member-mandatory-profile'
import { DadosObrigatoriosClient } from '@/app/pro-lideres/painel/equipe/dados-obrigatorios/DadosObrigatoriosClient'

export default async function ProLideresMembroDadosObrigatoriosPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) {
    redirect(gate.redirect)
  }

  const ui = await loadProLideresPainelUiForRequest(gate)
  if (ui.canManageAsLeader) {
    redirect('/pro-lideres/painel/equipe/dados-obrigatorios')
  }

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    redirect('/pro-lideres/entrar')
  }

  const admin = getSupabaseAdmin()
  if (!admin) {
    redirect('/pro-lideres/membro')
  }

  const gap = await getProLideresMemberMandatoryProfileGap(admin, gate.tenant.id, user.id)
  if (!gap.needsAction) {
    redirect('/pro-lideres/membro')
  }

  const spaceLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || 'Esta equipe'

  return <DadosObrigatoriosClient spaceLabel={spaceLabel} initialGap={gap} homeHref="/pro-lideres/membro" />
}
