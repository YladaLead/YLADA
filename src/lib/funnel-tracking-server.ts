/**
 * Busca eventos de funil no banco (uso em rotas admin).
 */
import { supabaseAdmin } from '@/lib/supabase'
import { FUNNEL_EVENT_TYPES, type FunnelRow } from '@/lib/funnel-tracking-aggregate'

export const FUNNEL_FETCH_PAGE_SIZE = 1000
export const FUNNEL_FETCH_MAX_ROWS = 80_000

export async function fetchFunnelRowsInRange(
  fromIso: string,
  toIso: string
): Promise<{ rows: FunnelRow[]; truncated: boolean }> {
  if (!supabaseAdmin) throw new Error('Backend não configurado')

  const all: FunnelRow[] = []
  let offset = 0
  let truncated = false

  while (offset < FUNNEL_FETCH_MAX_ROWS) {
    const { data, error } = await supabaseAdmin
      .from('ylada_behavioral_events')
      .select('event_type, payload')
      .in('event_type', [...FUNNEL_EVENT_TYPES])
      .gte('created_at', fromIso)
      .lte('created_at', toIso)
      .order('created_at', { ascending: true })
      .range(offset, offset + FUNNEL_FETCH_PAGE_SIZE - 1)

    if (error) throw new Error(error.message)
    const chunk = (data ?? []) as { event_type: string; payload: unknown }[]
    for (const r of chunk) {
      const p = r.payload
      all.push({
        event_type: r.event_type,
        payload:
          p && typeof p === 'object' && !Array.isArray(p)
            ? (p as Record<string, unknown>)
            : null,
      })
    }
    if (chunk.length < FUNNEL_FETCH_PAGE_SIZE) break
    offset += FUNNEL_FETCH_PAGE_SIZE
    if (offset >= FUNNEL_FETCH_MAX_ROWS) {
      truncated = true
      break
    }
  }

  return { rows: all, truncated }
}
