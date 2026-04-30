import { randomBytes } from 'crypto'
import type { ProLideresConsultoriaMaterialKind } from '@/lib/pro-lideres-consultoria'
import type { EsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'

export const ESTETICA_CONSULT_SEGMENTS = ['capilar', 'corporal', 'ambos'] as const
export type EsteticaConsultSegment = (typeof ESTETICA_CONSULT_SEGMENTS)[number]

export function isEsteticaConsultSegment(v: string): v is EsteticaConsultSegment {
  return (ESTETICA_CONSULT_SEGMENTS as readonly string[]).includes(v)
}

export type YladaEsteticaConsultClientRow = {
  id: string
  created_at: string
  updated_at: string
  business_name: string
  contact_name: string | null
  contact_email: string | null
  phone: string | null
  segment: EsteticaConsultSegment
  leader_tenant_id: string | null
  consulting_paid_amount: number | null
  payment_currency: string
  last_payment_at: string | null
  is_annual_plan: boolean
  annual_plan_start: string | null
  annual_plan_end: string | null
  /** Até esta data (inclusive) o acesso contratado vale para esta ficha (capilar, corporal ou ambos). */
  access_valid_until?: string | null
  access_expiry_reminder_sent_15d?: boolean
  access_expiry_reminder_sent_7d?: boolean
  access_expiry_reminder_sent_1d?: boolean
  admin_notes: string | null
  /** Resumo da reunião pré-diagnóstico (admin) — lembrete do combinado na call após o pré. */
  meeting_summary?: string | null
  /** Estágio manual do funil (Kanban admin). */
  funnel_stage?: EsteticaConsultFunnelStage | string | null
  created_by_user_id: string | null
}

export type YladaEsteticaConsultancyMaterialRow = {
  id: string
  created_at: string
  updated_at: string
  /** Null quando é material global (template_key). */
  client_id: string | null
  template_key?: string | null
  title: string
  material_kind: ProLideresConsultoriaMaterialKind
  description: string | null
  content: Record<string, unknown>
  sort_order: number
  is_published: boolean
  created_by_user_id: string | null
}

export type YladaEsteticaConsultancyShareLinkRow = {
  id: string
  material_id: string
  /** Null = link público de pré (cria ficha ao enviar). */
  estetica_consult_client_id: string | null
  token: string
  label: string | null
  expires_at: string | null
  created_at: string
  /** Diagnóstico corporal: e-mail da clínica + confirmação antes do formulário (migração 332). */
  recipient_email?: string | null
  recipient_confirmed_at?: string | null
  email_confirm_token?: string | null
  email_confirm_expires_at?: string | null
  last_confirmation_sent_at?: string | null
  /** Link canónico desta clínica para este material (migração 371). */
  is_primary?: boolean | null
}

export type YladaEsteticaConsultancyFormResponseRow = {
  id: string
  material_id: string
  share_link_id: string | null
  estetica_consult_client_id: string
  respondent_name: string | null
  respondent_email: string | null
  answers: Record<string, unknown>
  submitted_at: string
}

export function generateEsteticaConsultoriaShareToken(): string {
  return randomBytes(24).toString('base64url')
}

export function esteticaConsultoriaResponderPath(token: string): string {
  return `/estetica-consultoria/responder/${encodeURIComponent(token)}`
}

export function buildEsteticaConsultoriaResponderUrl(origin: string, token: string): string {
  return `${origin.replace(/\/$/, '')}${esteticaConsultoriaResponderPath(token)}`
}

export function esteticaConsultSegmentLabel(s: EsteticaConsultSegment): string {
  switch (s) {
    case 'capilar':
      return 'Capilar'
    case 'corporal':
      return 'Corporal'
    case 'ambos':
      return 'Capilar + corporal'
    default:
      return s
  }
}
