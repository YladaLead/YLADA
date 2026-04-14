import { randomBytes } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ProLideresLeaderOnboardingRow = {
  id: string
  token: string
  leader_name: string
  invited_email: string
  segment_code: string
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

export function normalizeLeaderOnboardingEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidLeaderOnboardingEmail(email: string): boolean {
  const n = normalizeLeaderOnboardingEmail(email)
  return n.length > 3 && n.length < 320 && EMAIL_RE.test(n)
}

export function generateLeaderOnboardingToken(): string {
  return randomBytes(24).toString('base64url')
}

export function proLideresLeaderOnboardingPath(token: string): string {
  return `/pro-lideres/onboarding/${encodeURIComponent(token)}`
}

export function buildProLideresLeaderOnboardingUrl(origin: string, token: string): string {
  return `${origin.replace(/\/$/, '')}${proLideresLeaderOnboardingPath(token)}`
}

export function leaderOnboardingExpiresAtDefault(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 10)
  return d
}

export async function applyCompletedLeaderOnboardingForEmail(params: {
  supabase: SupabaseClient
  email: string | null | undefined
  ownerUserId: string
  tenantId: string
}): Promise<void> {
  const email = normalizeLeaderOnboardingEmail(params.email ?? '')
  if (!email) return

  const { data: row } = await params.supabase
    .from('pro_lideres_leader_onboarding_links')
    .select('*')
    .eq('invited_email', email)
    .eq('status', 'completed')
    .is('applied_to_tenant_at', null)
    .order('response_completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!row) return

  const item = row as ProLideresLeaderOnboardingRow
  const ans = (item.questionnaire_answers ?? {}) as Record<string, unknown>

  const displayNameRaw = typeof ans.display_name === 'string' ? ans.display_name : ''
  const teamNameRaw = typeof ans.team_name === 'string' ? ans.team_name : ''
  const whatsappRaw = typeof ans.whatsapp === 'string' ? ans.whatsapp : ''
  const focusRaw = typeof ans.focus_notes === 'string' ? ans.focus_notes : ''

  const display_name = displayNameRaw.trim() || item.leader_name
  const team_name = teamNameRaw.trim() || null
  const whatsapp = whatsappRaw.trim() || null
  const focus_notes = focusRaw.trim() || null

  await params.supabase
    .from('leader_tenants')
    .update({
      display_name,
      team_name,
      whatsapp,
      contact_email: email,
      focus_notes,
      vertical_code: item.segment_code || 'h-lider',
    })
    .eq('id', params.tenantId)
    .eq('owner_user_id', params.ownerUserId)

  await params.supabase
    .from('pro_lideres_leader_onboarding_links')
    .update({
      applied_to_tenant_at: new Date().toISOString(),
      linked_user_id: params.ownerUserId,
      linked_leader_tenant_id: params.tenantId,
    })
    .eq('id', item.id)
}
