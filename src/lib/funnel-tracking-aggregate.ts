/**
 * Agregação em memória para relatório admin do funil (filtros data / segmento / nicho).
 */

export const FUNNEL_EVENT_TYPES = [
  'funnel_landing_pt_view',
  'funnel_landing_cta_segmentos',
  'funnel_segmentos_view',
  'funnel_hub_segmento_clicado',
  'funnel_entrada_nicho',
  'funnel_cadastro_view',
  'funnel_cadastro_area_selected',
  'user_created',
] as const

export type FunnelEventType = (typeof FUNNEL_EVENT_TYPES)[number]

export type FunnelRow = {
  event_type: string
  payload: Record<string, unknown> | null
}

function segmentFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return ''
  const p = payload as Record<string, unknown>
  const a = p.area ?? p.perfil ?? p.segment
  return typeof a === 'string' && a.trim() ? a.trim().toLowerCase() : ''
}

function nichoFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return ''
  const p = payload as Record<string, unknown>
  const n = p.nicho ?? p.opcao
  return typeof n === 'string' && n.trim() ? n.trim().toLowerCase() : ''
}

function rowMatchesSegment(payload: unknown, segment: string): boolean {
  return segmentFromPayload(payload) === segment.toLowerCase()
}

function rowMatchesNicho(payload: unknown, nicho: string): boolean {
  return nichoFromPayload(payload) === nicho.toLowerCase()
}

export function filterFunnelRows(
  rows: FunnelRow[],
  filters: { segment?: string | null; nicho?: string | null }
): FunnelRow[] {
  const segFilter = filters.segment?.trim().toLowerCase() || null
  const nicFilter = filters.nicho?.trim().toLowerCase() || null
  return rows.filter((r) => {
    if (segFilter && !rowMatchesSegment(r.payload, segFilter)) return false
    if (nicFilter && !rowMatchesNicho(r.payload, nicFilter)) return false
    return true
  })
}

function countByEventType(rows: FunnelRow[]): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const t of FUNNEL_EVENT_TYPES) totals[t] = 0
  for (const r of rows) {
    const t = r.event_type
    if (t && t in totals) totals[t] = (totals[t] ?? 0) + 1
  }
  return totals
}

/** Totais por tipo de evento (linhas já filtradas). */
export function totalsFromRows(rows: FunnelRow[]): Record<string, number> {
  return countByEventType(rows)
}

/** Quebra por segmento (área/perfil no payload) — usa todas as linhas do período. */
export function breakdownBySegment(rows: FunnelRow[]): Record<string, Partial<Record<string, number>>> {
  const bySegment: Record<string, Partial<Record<string, number>>> = {}
  for (const r of rows) {
    const seg = segmentFromPayload(r.payload)
    if (!seg) continue
    if (!bySegment[seg]) bySegment[seg] = {}
    const et = r.event_type
    if (et) bySegment[seg][et] = (bySegment[seg][et] ?? 0) + 1
  }
  return bySegment
}

/** Contagem escolha de nicho na entrada matriz, por segmento e slug de nicho. */
export function breakdownNichoPorSegmento(rows: FunnelRow[]): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {}
  for (const r of rows) {
    if (r.event_type !== 'funnel_entrada_nicho') continue
    const seg = segmentFromPayload(r.payload)
    const nic = nichoFromPayload(r.payload)
    if (!seg || !nic) continue
    if (!out[seg]) out[seg] = {}
    out[seg][nic] = (out[seg][nic] ?? 0) + 1
  }
  return out
}

/** Conversão aproximada: contas / escolhas de área (útil quando filtra por segmento). */
export function conversionCadastroToConta(totals: Record<string, number>): number | null {
  const escolheu = totals['funnel_cadastro_area_selected'] ?? 0
  const contas = totals['user_created'] ?? 0
  if (escolheu <= 0) return null
  return Math.round((contas / escolheu) * 1000) / 10
}
