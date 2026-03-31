/**
 * Registro server-side de limite freemium atingido (uma vez por dia UTC por usuário/kind).
 * @see migrations/290-freemium-conversion-fase1-events.sql
 */
import type { FreemiumConversionKind } from '@/config/freemium-limits'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Quota esgotada ou bloqueio equivalente (Noel, WhatsApp mensal, diagnóstico ativo).
 * Dedupe: no máximo 1 evento por (user_id, kind) por dia UTC.
 */
export async function recordFreemiumLimitHit(
  userId: string,
  kind: FreemiumConversionKind,
  extra?: { link_id?: string | null }
): Promise<void> {
  try {
    if (!supabaseAdmin || !userId) return

    const now = new Date()
    const utcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    const { data: existing, error: selErr } = await supabaseAdmin
      .from('ylada_behavioral_events')
      .select('id')
      .eq('user_id', userId)
      .eq('event_type', 'freemium_limit_hit')
      .contains('payload', { kind })
      .gte('created_at', utcStart.toISOString())
      .limit(1)
      .maybeSingle()

    if (selErr) {
      console.warn('[freemium-behavioral] dedupe select:', selErr.message)
    }
    if (existing) return

    const payload: Record<string, unknown> = { kind }
    if (extra?.link_id) payload.link_id = extra.link_id

    const { error: insErr } = await supabaseAdmin.from('ylada_behavioral_events').insert({
      event_type: 'freemium_limit_hit',
      user_id: userId,
      link_id: extra?.link_id ?? null,
      metrics_id: null,
      payload,
    })
    if (insErr) console.warn('[freemium-behavioral] insert freemium_limit_hit:', insErr.message)
  } catch (e) {
    console.warn('[freemium-behavioral] recordFreemiumLimitHit:', e)
  }
}
