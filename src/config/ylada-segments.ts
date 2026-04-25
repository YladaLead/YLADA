/**
 * Registry de segmentos YLADA — arquitetura e metadados por segment_code.
 * Fonte única para inferir architecture quando meta do item da biblioteca está vazio.
 * @see docs/YLADA-SEGMENTOS-E-VARIANTES-IMPLANTACAO.md
 */

export type DiagnosisArchitecture =
  | 'RISK_DIAGNOSIS'
  | 'BLOCKER_DIAGNOSIS'
  | 'PROFILE_TYPE'
  | 'READINESS_CHECKLIST'
  | 'PERFUME_PROFILE'
  | 'PROJECTION_CALCULATOR'

export interface SegmentRegistryEntry {
  segment_code: string
  architecture: DiagnosisArchitecture
  label: string
}

/** Registry: segment_code → architecture (segmentos com arquitetura específica). */
export const SEGMENT_REGISTRY: SegmentRegistryEntry[] = [
  { segment_code: 'perfumaria', architecture: 'PERFUME_PROFILE', label: 'Perfumaria e fragrâncias' },
  // wellness, nutrition, dentistry, aesthetics, fitness usam BLOCKER_DIAGNOSIS ou RISK_DIAGNOSIS (fallback)
]

/** Arquitetura padrão quando segmento não está no registry. */
export const DEFAULT_ARCHITECTURE: DiagnosisArchitecture = 'RISK_DIAGNOSIS'

/** Palavras-chave para inferir segment_code e architecture a partir do título. */
const PERFUMARIA_KEYWORDS = /perfume|fragrância|fragrancia|olfativo|perfumaria|perfil olfativo/i

const JOIAS_KEYWORDS =
  /joia|joias|semijoia|bijuter|pulseira|anel|colar|brinco|prata|ouro|acess[oó]rio/i

/**
 * Infere architecture e segment_code a partir do título (fallback quando meta está vazio).
 */
export function inferArchitectureFromTitle(title: string): {
  architecture: DiagnosisArchitecture
  segment_code?: string
} {
  const t = (title || '').trim()
  if (PERFUMARIA_KEYWORDS.test(t)) {
    return { architecture: 'PERFUME_PROFILE', segment_code: 'perfumaria' }
  }
  if (JOIAS_KEYWORDS.test(t)) {
    return { architecture: DEFAULT_ARCHITECTURE, segment_code: 'joias' }
  }
  return { architecture: DEFAULT_ARCHITECTURE }
}
