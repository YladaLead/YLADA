/**
 * Agrega eventos de conversão Free → Pro (últimos N dias) para Inteligência YLADA.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { FreemiumConversionKind } from '@/config/freemium-limits'
import { FREEMIUM_CONVERSION_KINDS } from '@/config/freemium-limits'

const EVENT_TYPES = [
  'freemium_limit_hit',
  'freemium_paywall_view',
  'freemium_upgrade_cta_click',
] as const

export type FreemiumConversionStats = {
  totals: {
    freemium_limit_hit: number
    freemium_paywall_view: number
    freemium_upgrade_cta_click: number
  }
  byKind: Record<FreemiumConversionKind, { limitHit: number; paywallView: number; upgradeCta: number }>
  truncated: boolean
}

function emptyByKind(): Record<FreemiumConversionKind, { limitHit: number; paywallView: number; upgradeCta: number }> {
  const o = {} as Record<FreemiumConversionKind, { limitHit: number; paywallView: number; upgradeCta: number }>
  for (const k of FREEMIUM_CONVERSION_KINDS) {
    o[k] = { limitHit: 0, paywallView: 0, upgradeCta: 0 }
  }
  return o
}

function kindFromPayload(p: unknown): FreemiumConversionKind | null {
  if (!p || typeof p !== 'object') return null
  const k = (p as Record<string, unknown>).kind
  if (typeof k !== 'string') return null
  const low = k.trim().toLowerCase()
  return FREEMIUM_CONVERSION_KINDS.includes(low as FreemiumConversionKind) ? (low as FreemiumConversionKind) : null
}

const FETCH_CAP = 12000

/**
 * Lê eventos freemium no intervalo e agrega totais e por `payload.kind`.
 */
export async function fetchFreemiumConversionStats(
  supabase: SupabaseClient,
  fromIso: string,
  toIso: string
): Promise<FreemiumConversionStats> {
  const totals = {
    freemium_limit_hit: 0,
    freemium_paywall_view: 0,
    freemium_upgrade_cta_click: 0,
  }
  const byKind = emptyByKind()

  const { data: rows, error } = await supabase
    .from('ylada_behavioral_events')
    .select('event_type, payload')
    .in('event_type', [...EVENT_TYPES])
    .gte('created_at', fromIso)
    .lte('created_at', toIso)
    .limit(FETCH_CAP + 1)

  if (error) {
    console.warn('[freemium-inteligencia]', error.message)
    return { totals, byKind, truncated: false }
  }

  const list = rows ?? []
  const truncated = list.length > FETCH_CAP
  const capped = truncated ? list.slice(0, FETCH_CAP) : list

  for (const row of capped) {
    const et = row.event_type as string
    const payload = row.payload as Record<string, unknown> | null
    const kind = kindFromPayload(payload)

    if (et === 'freemium_limit_hit') {
      totals.freemium_limit_hit += 1
      if (kind) byKind[kind].limitHit += 1
    } else if (et === 'freemium_paywall_view') {
      totals.freemium_paywall_view += 1
      if (kind) byKind[kind].paywallView += 1
    } else if (et === 'freemium_upgrade_cta_click') {
      totals.freemium_upgrade_cta_click += 1
      if (kind) byKind[kind].upgradeCta += 1
    }
  }

  return { totals, byKind, truncated }
}
