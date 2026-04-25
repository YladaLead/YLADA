/**
 * Handoff unificado: ylada.com (segmento/nicho) → /pt/{area} sem perder o nicho escolhido.
 * Fase 2: escrita será usada nas telas da matriz; leitura no YladaPublicEntryFlow.
 */

export const YLADA_PUBLIC_FLOW_HANDOFF_KEY = 'ylada_public_flow_handoff_v1'

export type PublicFlowHandoffPayload = {
  areaCodigo: string
  nichoSlug?: string | null
  /** Joias: joia_fina | semijoia | bijuteria (opcional na entrada matriz). */
  linhaSlug?: string | null
  /** Origem opcional (ex.: matrix_home) para analytics futuro */
  source?: string
}

function parseHandoff(raw: string | null): PublicFlowHandoffPayload | null {
  if (!raw) return null
  try {
    const o = JSON.parse(raw) as unknown
    if (!o || typeof o !== 'object') return null
    const areaCodigo = (o as { areaCodigo?: unknown }).areaCodigo
    if (typeof areaCodigo !== 'string' || !areaCodigo.trim()) return null
    const nichoSlug = (o as { nichoSlug?: unknown }).nichoSlug
    const linhaSlug = (o as { linhaSlug?: unknown }).linhaSlug
    const source = (o as { source?: unknown }).source
    return {
      areaCodigo: areaCodigo.trim(),
      nichoSlug: typeof nichoSlug === 'string' ? nichoSlug : nichoSlug == null ? null : String(nichoSlug),
      linhaSlug: typeof linhaSlug === 'string' ? linhaSlug : linhaSlug == null ? null : String(linhaSlug),
      source: typeof source === 'string' ? source : undefined,
    }
  } catch {
    return null
  }
}

export function readPublicFlowHandoff(): PublicFlowHandoffPayload | null {
  if (typeof window === 'undefined') return null
  try {
    return parseHandoff(sessionStorage.getItem(YLADA_PUBLIC_FLOW_HANDOFF_KEY))
  } catch {
    return null
  }
}

export function savePublicFlowHandoff(payload: PublicFlowHandoffPayload): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(YLADA_PUBLIC_FLOW_HANDOFF_KEY, JSON.stringify(payload))
  } catch {
    /* storage indisponível */
  }
}

export function clearPublicFlowHandoff(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(YLADA_PUBLIC_FLOW_HANDOFF_KEY)
  } catch {
    /* ok */
  }
}
