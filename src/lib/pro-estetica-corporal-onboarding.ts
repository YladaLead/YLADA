import { randomBytes } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

const PRO_ESTETICA_CORPORAL_VERTICAL = 'estetica-corporal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ProEsteticaCorporalOnboardingLinkRow = {
  id: string
  token: string
  professional_name: string
  invited_email: string
  status: 'pending' | 'completed' | 'cancelled' | 'expired'
  questionnaire_answers: Record<string, unknown> | null
  response_completed_at: string | null
  applied_to_tenant_at: string | null
  linked_user_id: string | null
  linked_leader_tenant_id: string | null
  created_by_user_id: string | null
  expires_at: string
  created_at: string
  updated_at: string
}

export function normalizeCorporalOnboardingEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidCorporalOnboardingEmail(email: string): boolean {
  const n = normalizeCorporalOnboardingEmail(email)
  return n.length > 3 && n.length < 320 && EMAIL_RE.test(n)
}

export function generateCorporalOnboardingToken(): string {
  return randomBytes(24).toString('base64url')
}

export function proEsteticaCorporalOnboardingPath(token: string): string {
  return `/pro-estetica-corporal/onboarding/${encodeURIComponent(token)}`
}

export function buildProEsteticaCorporalOnboardingUrl(origin: string, token: string): string {
  return `${origin.replace(/\/$/, '')}${proEsteticaCorporalOnboardingPath(token)}`
}

export function corporalOnboardingExpiresAtDefault(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 10)
  return d
}

/**
 * Aplica respostas do onboarding (por e-mail) ao `leader_tenants` corporal da dona,
 * após primeiro acesso com tenant resolvido — mesmo fluxo que Pro Líderes.
 */
export async function applyCompletedCorporalOnboardingForEmail(params: {
  supabase: SupabaseClient
  email: string | null | undefined
  ownerUserId: string
  tenantId: string
}): Promise<void> {
  const email = normalizeCorporalOnboardingEmail(params.email ?? '')
  if (!email) return

  const { data: row, error: rowErr } = await params.supabase
    .from('pro_estetica_corporal_onboarding_links')
    .select('*')
    .eq('invited_email', email)
    .eq('status', 'completed')
    .is('applied_to_tenant_at', null)
    .order('response_completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (rowErr) {
    if (!/relation|does not exist|Could not find the table/i.test(rowErr.message ?? '')) {
      console.warn('[applyCompletedCorporalOnboardingForEmail] read:', rowErr.message)
    }
    return
  }
  if (!row) return

  const item = row as ProEsteticaCorporalOnboardingLinkRow
  const ans = (item.questionnaire_answers ?? {}) as Record<string, unknown>

  const displayNameRaw = typeof ans.display_name === 'string' ? ans.display_name : ''
  const teamNameRaw = typeof ans.team_name === 'string' ? ans.team_name : ''
  const whatsappRaw = typeof ans.whatsapp === 'string' ? ans.whatsapp : ''
  const focusRaw = typeof ans.focus_notes === 'string' ? ans.focus_notes : ''

  const display_name = displayNameRaw.trim() || item.professional_name
  const team_name = teamNameRaw.trim() || null
  const whatsapp = whatsappRaw.trim() || null

  const years = typeof ans.years_in_aesthetics === 'number' ? ans.years_in_aesthetics : null
  const goal = typeof ans.primary_goal === 'string' ? ans.primary_goal.trim() : ''
  const challenge = typeof ans.main_challenge === 'string' ? ans.main_challenge.trim() : ''

  const bodyLines: string[] = []
  if (years != null) bodyLines.push(`Tempo na estética: ${years} ${years === 1 ? 'ano' : 'anos'}`)
  if (goal) bodyLines.push(`Objetivo (90 dias): ${goal}`)
  if (challenge) bodyLines.push(`Maior desafio: ${challenge}`)
  const structured =
    bodyLines.length > 0 ? ['[Onboarding Pro Estética Corporal]', ...bodyLines].join('\n') : ''

  const focusExtra = focusRaw.trim()
  const focus_notes =
    focusExtra && structured
      ? `${structured}\n\n---\n\n${focusExtra}`
      : focusExtra || (structured || null)

  await params.supabase
    .from('leader_tenants')
    .update({
      display_name,
      team_name,
      whatsapp,
      contact_email: email,
      focus_notes,
      vertical_code: PRO_ESTETICA_CORPORAL_VERTICAL,
    })
    .eq('id', params.tenantId)
    .eq('owner_user_id', params.ownerUserId)

  await params.supabase
    .from('pro_estetica_corporal_onboarding_links')
    .update({
      applied_to_tenant_at: new Date().toISOString(),
      linked_user_id: params.ownerUserId,
      linked_leader_tenant_id: params.tenantId,
    })
    .eq('id', item.id)
}
