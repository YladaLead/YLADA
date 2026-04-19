import { redirect } from 'next/navigation'
import {
  createProLideresServerClient,
  ensureLeaderTenantAccess,
} from '@/lib/pro-lideres-server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getProLideresMemberMandatoryProfileGap } from '@/lib/pro-lideres-member-mandatory-profile'
import { DadosObrigatoriosClient } from './DadosObrigatoriosClient'

export default async function ProLideresDadosObrigatoriosPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) {
    redirect(gate.redirect)
  }
  if (gate.role !== 'member') {
    redirect('/pro-lideres/painel')
  }

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    redirect('/pro-lideres/entrar')
  }

  const admin = getSupabaseAdmin()
  if (!admin) {
    redirect('/pro-lideres/painel')
  }

  const gap = await getProLideresMemberMandatoryProfileGap(admin, gate.tenant.id, user.id)
  if (!gap.needsAction) {
    redirect('/pro-lideres/painel')
  }

  const spaceLabel =
    gate.tenant.display_name?.trim() || gate.tenant.team_name?.trim() || 'Esta equipe'

  return <DadosObrigatoriosClient spaceLabel={spaceLabel} initialGap={gap} />
}
