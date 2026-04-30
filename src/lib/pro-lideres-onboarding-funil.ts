import type { FichaPipelineItem } from '@/lib/estetica-consultoria-fichas-pipeline'
import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'
import { normalizeEsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'

/** Campos necessários para o cartão no funil admin (vista Pro líder). */
export type ProLideresLeaderOnboardingFunilRow = {
  id: string
  leader_name: string
  invited_email: string
  status: string
  created_at: string
  updated_at: string
  response_completed_at: string | null
  linked_leader_tenant_id: string | null
  created_by_user_id: string | null
  admin_funnel_stage?: string | null
}

export function leaderOnboardingRowToFichaPipelineItem(row: ProLideresLeaderOnboardingFunilRow): FichaPipelineItem {
  const funnelStage =
    row.status === 'completed'
      ? normalizeEsteticaConsultFunnelStage(row.admin_funnel_stage)
      : 'entrada'

  const client: YladaEsteticaConsultClientRow = {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    business_name: row.leader_name,
    contact_name: null,
    contact_email: row.invited_email,
    phone: null,
    segment: 'corporal',
    leader_tenant_id: row.linked_leader_tenant_id,
    consulting_paid_amount: null,
    payment_currency: 'BRL',
    last_payment_at: null,
    is_annual_plan: false,
    annual_plan_start: null,
    annual_plan_end: null,
    admin_notes: null,
    meeting_summary: null,
    funnel_stage: funnelStage,
    created_by_user_id: row.created_by_user_id,
  }

  return {
    funilCardSource: 'leader_onboarding',
    client,
    ultimoPreAt: row.response_completed_at,
    ultimoDiagnosticoAt: null,
  }
}
