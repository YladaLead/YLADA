/**
 * Área padrão da matriz central YLADA (motor de conversas).
 * Segmentos (perfil): seller, professional, clinic, coach, etc. — definidos no perfil, não na rota.
 * Nutri e Wellness são produtos separados em comercialização; migração para a matriz depois.
 * @see docs/MATRIZ-CENTRAL-CRONOGRAMA.md
 */
export type YladaSegmentCode = 'ylada' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'coach' | 'seller'

export interface YladaAreaConfig {
  /** Código da área (rota). */
  codigo: string
  /** Segment_code para APIs e perfil (ex.: ylada como padrão). */
  segment_code: YladaSegmentCode
  /** Label para menu e título */
  label: string
  /** Prefixo de path (matriz ylada: /pt; demais: /pt/{area}). */
  pathPrefix: string
}

/** Matriz central: pathPrefix /pt (idioma + funcionalidade; sem /ylada no path). */
export const YLADA_AREAS: YladaAreaConfig[] = [
  { codigo: 'ylada', segment_code: 'ylada', label: 'YLADA', pathPrefix: '/pt' },
  { codigo: 'psi', segment_code: 'psi', label: 'Psicologia', pathPrefix: '/pt/psi' },
  { codigo: 'psicanalise', segment_code: 'psicanalise', label: 'Psicanálise', pathPrefix: '/pt/psicanalise' },
  { codigo: 'odonto', segment_code: 'odonto', label: 'Odontologia', pathPrefix: '/pt/odonto' },
  { codigo: 'nutra', segment_code: 'nutra', label: 'Nutra', pathPrefix: '/pt/nutra' },
  { codigo: 'coach', segment_code: 'coach', label: 'Coach', pathPrefix: '/pt/coach' },
]

/**
 * Menu: Noel; Links inteligentes; Leads; Trilha empresarial; Perfil empresarial; Configuração.
 * path 'trilha' alinha com a rota /pt/trilha.
 */
export const YLADA_MENU_ITEMS = [
  { key: 'home', label: 'Noel', path: 'home', icon: '💬' },
  { key: 'links', label: 'Links inteligentes', path: 'links', icon: '🔗' },
  { key: 'leads', label: 'Leads', path: 'leads', icon: '👥' },
  { key: 'trilha', label: 'Trilha empresarial', path: 'trilha', icon: '📚' },
  { key: 'perfil-empresarial', label: 'Perfil empresarial', path: 'perfil-empresarial', icon: '👤' },
  { key: 'perfis-simulados', label: 'Perfis para testes', path: 'perfis-simulados', icon: '🧪' },
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
export const YLADA_SEGMENT_CODES: YladaSegmentCode[] = ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller']
