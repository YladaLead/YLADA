/**
 * Área padrão da matriz central YLADA (motor de conversas).
 * Segmentos (perfil): seller, professional, clinic, coach, etc. — definidos no perfil, não na rota.
 * Nutri e Wellness são produtos separados em comercialização; migração para a matriz depois.
 * @see docs/MATRIZ-CENTRAL-CRONOGRAMA.md
 */
export type YladaSegmentCode = 'ylada' | 'med' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'nutri' | 'coach' | 'seller' | 'perfumaria' | 'estetica' | 'fitness'

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
  { codigo: 'med', segment_code: 'med', label: 'Médicos', pathPrefix: '/pt/med' },
  { codigo: 'psi', segment_code: 'psi', label: 'Psicologia', pathPrefix: '/pt/psi' },
  { codigo: 'psicanalise', segment_code: 'psicanalise', label: 'Psicanálise', pathPrefix: '/pt/psicanalise' },
  { codigo: 'odonto', segment_code: 'odonto', label: 'Odontologia', pathPrefix: '/pt/odonto' },
  { codigo: 'nutra', segment_code: 'nutra', label: 'Nutra', pathPrefix: '/pt/nutra' },
  { codigo: 'coach', segment_code: 'coach', label: 'Coach', pathPrefix: '/pt/coach' },
  { codigo: 'perfumaria', segment_code: 'perfumaria', label: 'Perfumaria', pathPrefix: '/pt/perfumaria' },
  { codigo: 'seller', segment_code: 'seller', label: 'Vendedores', pathPrefix: '/pt/seller' },
  { codigo: 'estetica', segment_code: 'estetica', label: 'Estética', pathPrefix: '/pt/estetica' },
  { codigo: 'fitness', segment_code: 'fitness', label: 'Fitness', pathPrefix: '/pt/fitness' },
  { codigo: 'nutri', segment_code: 'nutri', label: 'Nutri', pathPrefix: '/pt/nutri' },
]

/**
 * Menu enxuto: fluxo do dia em “Principal”, conteúdo em “Aprender” (inclui Academia).
 * Lab e Planejamento só para admin.
 */
export const YLADA_MENU_GROUPS = [
  {
    label: 'Principal',
    items: [
      { key: 'painel', label: 'Painel', path: 'painel', icon: '📊' },
      { key: 'home', label: 'Noel (mentor)', path: 'home', icon: '💬' },
      { key: 'links', label: 'Links de captação', path: 'links', icon: '🔗' },
      { key: 'leads', label: 'Leads', path: 'leads', icon: '👥' },
      { key: 'crescimento', label: 'Crescimento', path: 'crescimento', icon: '📈' },
    ],
  },
  {
    label: 'Aprender',
    items: [
      { key: 'biblioteca', label: 'Biblioteca', path: 'biblioteca', icon: '📚' },
      { key: 'metodo', label: 'Método YLADA', path: 'metodo', icon: '🚀' },
      { key: 'trilha', label: 'Academia YLADA', path: 'trilha', icon: '🎓' },
    ],
  },
  {
    label: 'Conta',
    items: [
      { key: 'perfil-empresarial', label: 'Perfil', path: 'perfil-empresarial', icon: '👤' },
      { key: 'assinatura', label: 'Assinatura', path: 'configuracao', icon: '📋', hash: 'assinatura' as const },
      { key: 'configuracao', label: 'Configurações', path: 'configuracao', icon: '⚙️' },
    ],
  },
  {
    label: 'Lab',
    items: [
      { key: 'perfis-simulados', label: 'Perfis para testes', path: 'perfis-simulados', icon: '🧪' },
      { key: 'ylada-lab', label: 'YLADA Lab', path: 'ylada-lab', icon: '🔬' },
    ],
  },
  {
    label: 'Sistema',
    items: [{ key: 'planejamento', label: 'Planejamento', path: 'planejamento', icon: '📋' }],
  },
] as const

/** Lista plana (retrocompatibilidade). */
export const YLADA_MENU_ITEMS = YLADA_MENU_GROUPS.flatMap((g) => g.items)

export function getYladaAreaPathPrefix(areaCodigo: string): string {
  return YLADA_AREAS.find((a) => a.codigo === areaCodigo)?.pathPrefix ?? `/pt/${areaCodigo}`
}

/** Path do menu Leads por área. Coach usa 'ylada-leads' pois /pt/coach/leads é o leads do Coach. */
export function getYladaLeadsPath(areaCodigo: string): string {
  return areaCodigo === 'coach' ? 'ylada-leads' : 'leads'
}

/** Retorna path prefix pelo segment_code (uso em Smart Links e APIs). */
export function getYladaSegmentPathPrefix(segmentCode: YladaSegmentCode): string {
  return YLADA_AREAS.find((a) => a.segment_code === segmentCode)?.pathPrefix ?? `/pt/${segmentCode}`
}

/** Lista de segment_code válidos para validação (ex.: body.segment na API Noel). */
export const YLADA_SEGMENT_CODES: YladaSegmentCode[] = ['ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'nutri', 'coach', 'seller', 'perfumaria', 'estetica', 'fitness']

/** Perfis permitidos nas APIs YLADA (Links, Templates, Biblioteca, etc.). */
export const YLADA_API_ALLOWED_PROFILES = [
  'ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller',
  'perfumaria', 'estetica', 'fitness', 'nutri', 'wellness', 'admin'
] as const
