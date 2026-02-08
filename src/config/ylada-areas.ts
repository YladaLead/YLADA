/**
 * Segmentos YLADA (rota/mercado): med, psi, odonto, nutra, coach.
 * Usado por layout, sidebar, navegação e Links Inteligentes (segment_code).
 * Não confundir com: product (nutri/wellness/ylada) e profession (perfil do usuário).
 * @see docs/TRES-CAMADAS-PRODUCT-SEGMENT-PROFESSION.md
 */
export type YladaSegmentCode = 'med' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'coach'

export interface YladaAreaConfig {
  /** Código do segmento (rota/mercado). Preferir segmentCode em código novo. */
  codigo: YladaSegmentCode
  /** Alias: mesmo que codigo (para APIs e Smart Links usar segment_code). */
  segment_code: YladaSegmentCode
  /** Label para menu e título */
  label: string
  /** Prefixo de path: /pt/med */
  pathPrefix: string
}

export const YLADA_AREAS: YladaAreaConfig[] = [
  { codigo: 'med', segment_code: 'med', label: 'Medicina', pathPrefix: '/pt/med' },
  { codigo: 'psi', segment_code: 'psi', label: 'Psicologia', pathPrefix: '/pt/psi' },
  { codigo: 'psicanalise', segment_code: 'psicanalise', label: 'Psicanálise', pathPrefix: '/pt/psicanalise' },
  { codigo: 'odonto', segment_code: 'odonto', label: 'Odontologia', pathPrefix: '/pt/odonto' },
  { codigo: 'nutra', segment_code: 'nutra', label: 'Nutra', pathPrefix: '/pt/nutra' },
  { codigo: 'coach', segment_code: 'coach', label: 'Coach', pathPrefix: '/pt/coach' },
]

/**
 * Menu enxuto: Noel; Fluxos; Leads; Trilha empresarial (formação, mesma para todas as áreas); Configuração.
 * Noel usa as respostas da trilha para orientar. Leads = captação (preenchimentos + cliques WhatsApp).
 */
export const YLADA_MENU_ITEMS = [
  { key: 'home', label: 'Noel', path: 'home', icon: '💬' },
  { key: 'fluxos', label: 'Links inteligentes', path: 'fluxos', icon: '🔗' },
  { key: 'leads', label: 'Leads', path: 'leads', icon: '👥' },
  { key: 'formacao', label: 'Trilha empresarial', path: 'formacao', icon: '📚' },
  { key: 'perfil-empresarial', label: 'Perfil empresarial', path: 'perfil-empresarial', icon: '👤' },
  { key: 'configuracao', label: 'Configuração', path: 'configuracao', icon: '⚙️' },
] as const

export function getYladaAreaPathPrefix(areaCodigo: string): string {
  return YLADA_AREAS.find((a) => a.codigo === areaCodigo)?.pathPrefix ?? `/pt/${areaCodigo}`
}

/** Retorna path prefix pelo segment_code (uso em Smart Links e APIs). */
export function getYladaSegmentPathPrefix(segmentCode: YladaSegmentCode): string {
  return YLADA_AREAS.find((a) => a.segment_code === segmentCode)?.pathPrefix ?? `/pt/${segmentCode}`
}

/** Lista de segment_code válidos para validação (ex.: body.segment na API Noel). */
export const YLADA_SEGMENT_CODES: YladaSegmentCode[] = ['med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach']
