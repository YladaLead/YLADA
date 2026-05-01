import type { FichaPipelineItem } from '@/lib/estetica-consultoria-fichas-pipeline'
import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'
import { normalizeEsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'
import { PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID } from '@/lib/pro-lideres-pre-diagnostico'

export type ProLideresConsultancyResponseFunilRow = {
  id: string
  material_id: string
  leader_tenant_id: string | null
  respondent_name: string | null
  respondent_email: string | null
  submitted_at: string
  admin_funnel_stage?: string | null
}

function displayNameFromResponse(row: ProLideresConsultancyResponseFunilRow): string {
  const n = (row.respondent_name ?? '').trim()
  if (n.length >= 2) return n.slice(0, 300)
  const e = (row.respondent_email ?? '').trim()
  if (e) return e.slice(0, 300)
  return 'Resposta sem nome'
}

/** Resposta do formulário Pro Líderes (admin) → cartão no funil vista «lider». */
export function proLideresConsultoriaResponseToFichaPipelineItem(
  row: ProLideresConsultancyResponseFunilRow
): FichaPipelineItem {
  const isPreDiagnostico = row.material_id === PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID
  const funnelStage = normalizeEsteticaConsultFunnelStage(
    row.admin_funnel_stage ?? (isPreDiagnostico ? 'pendente_pagamento' : 'entrada')
  )

  const now = row.submitted_at
  const client: YladaEsteticaConsultClientRow = {
    id: row.id,
    created_at: now,
    updated_at: now,
    business_name: displayNameFromResponse(row),
    contact_name: null,
    contact_email: row.respondent_email,
    phone: null,
    segment: 'corporal',
    leader_tenant_id: row.leader_tenant_id,
    consulting_paid_amount: null,
    payment_currency: 'BRL',
    last_payment_at: null,
    is_annual_plan: false,
    annual_plan_start: null,
    annual_plan_end: null,
    admin_notes: null,
    meeting_summary: null,
    funnel_stage: funnelStage,
    created_by_user_id: null,
  }

  return {
    funilCardSource: 'pro_lideres_consultoria',
    proLideresConsultoria: { materialId: row.material_id, responseId: row.id },
    client,
    ultimoPreAt: row.submitted_at,
    ultimoDiagnosticoAt: null,
  }
}
