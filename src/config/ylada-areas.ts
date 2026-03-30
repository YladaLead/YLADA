/**
 * Área padrão da matriz central YLADA (motor de conversas).
 * Segmentos (perfil): seller, professional, clinic, coach, etc. — definidos no perfil, não na rota.
 *
 * Produto: **YLADA** = todos os segmentos abaixo + futuros (um motor: POST /api/ylada/noel + `area`).
 * **Wellness** (Herbalife) fica fora desta matriz — APIs em /api/wellness/*.
 * Nutri mantém `/api/nutri/*` para clientes, avaliações e fluxos legados; o **mentor na matriz** é o Noel (`POST /api/ylada/noel`).
 * @see docs/MATRIZ-CENTRAL-CRONOGRAMA.md
 */
export type YladaSegmentCode = 'ylada' | 'med' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'nutri' | 'coach' | 'seller' | 'perfumaria' | 'estetica' | 'fitness'

/**
 * Funil público na entrada da área (quiz matriz / ylada.com → área).
 * - `standard`: usa getPublicFlowConfig(codigo) + YladaPublicEntryFlow
 * - `custom`: fluxo próprio (ex.: Nutri)
 * - `none` ou omitido: sem funil unificado nesta fase
 */
export type YladaPublicEntryMode = 'none' | 'standard' | 'custom'

export interface YladaAreaConfig {
  /** Código da área (rota). */
  codigo: string
  /** Segment_code para APIs e perfil (ex.: ylada como padrão). */
  segment_code: YladaSegmentCode
  /** Label para menu e título */
  label: string
  /** Prefixo de path (matriz ylada: /pt; demais: /pt/{area}). */
  pathPrefix: string
  /** @see YladaPublicEntryMode */
  publicEntry?: YladaPublicEntryMode
}

/** Matriz central: pathPrefix /pt (idioma + funcionalidade; sem /ylada no path). */
export const YLADA_AREAS: YladaAreaConfig[] = [
  { codigo: 'ylada', segment_code: 'ylada', label: 'YLADA', pathPrefix: '/pt' },
  { codigo: 'med', segment_code: 'med', label: 'Médicos', pathPrefix: '/pt/med', publicEntry: 'standard' },
  { codigo: 'psi', segment_code: 'psi', label: 'Psicologia', pathPrefix: '/pt/psi', publicEntry: 'standard' },
  {
    codigo: 'psicanalise',
    segment_code: 'psicanalise',
    label: 'Psicanálise',
    pathPrefix: '/pt/psicanalise',
    publicEntry: 'standard',
  },
  { codigo: 'odonto', segment_code: 'odonto', label: 'Odontologia', pathPrefix: '/pt/odonto', publicEntry: 'standard' },
  { codigo: 'nutra', segment_code: 'nutra', label: 'Nutra', pathPrefix: '/pt/nutra', publicEntry: 'standard' },
  { codigo: 'coach', segment_code: 'coach', label: 'Coach', pathPrefix: '/pt/coach', publicEntry: 'standard' },
  {
    codigo: 'perfumaria',
    segment_code: 'perfumaria',
    label: 'Perfumaria',
    pathPrefix: '/pt/perfumaria',
    publicEntry: 'standard',
  },
  /** Funil imparcial para vendedores em geral. Segmentos com jornada própria (ex.: Wellness) usam rota dedicada. */
  { codigo: 'seller', segment_code: 'seller', label: 'Vendedores', pathPrefix: '/pt/seller', publicEntry: 'standard' },
  {
    codigo: 'estetica',
    segment_code: 'estetica',
    label: 'Estética',
    pathPrefix: '/pt/estetica',
    publicEntry: 'standard',
  },
  { codigo: 'fitness', segment_code: 'fitness', label: 'Fitness', pathPrefix: '/pt/fitness', publicEntry: 'standard' },
  {
    codigo: 'nutri',
    segment_code: 'nutri',
    label: 'Nutri',
    pathPrefix: '/pt/nutri',
    publicEntry: 'standard',
  },
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
      { key: 'links', label: 'Links', path: 'links', icon: '🔗' },
      { key: 'leads', label: 'Leads', path: 'leads', icon: '👥' },
      { key: 'suporte', label: 'Suporte', path: 'suporte', icon: '💬' },
    ],
  },
  {
    label: 'Aprender',
    items: [
      { key: 'como-usar', label: 'Como usar', path: 'como-usar', icon: '📖' },
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

export function getYladaAreaConfig(areaCodigo: string): YladaAreaConfig | undefined {
  return YLADA_AREAS.find((a) => a.codigo === areaCodigo)
}

/** Modo de entrada pública; omitido no registro = none. */
export function getYladaAreaPublicEntryMode(areaCodigo: string): YladaPublicEntryMode {
  return getYladaAreaConfig(areaCodigo)?.publicEntry ?? 'none'
}

/** Áreas com funil matriz registrado em getPublicFlowConfig (Fase 1+). */
export function getYladaAreasWithStandardPublicEntry(): YladaAreaConfig[] {
  return YLADA_AREAS.filter((a) => a.publicEntry === 'standard')
}

/**
 * URL do CTA “criar diagnóstico” no guia **Como usar** (in-app): abre o Noel na home da área,
 * onde a pessoa monta fluxo e diagnóstico no chat — não o quiz público de comunicação em /pt/diagnostico.
 */
export function getYladaDiagnosticoBuilderHref(areaCodigo: string): string {
  return `${getYladaAreaPathPrefix(areaCodigo)}/home`
}

/** Path do menu Leads por área. Coach usa 'ylada-leads' pois /pt/coach/leads é o leads do Coach. */
export function getYladaLeadsPath(areaCodigo: string): string {
  return areaCodigo === 'coach' ? 'ylada-leads' : 'leads'
}

/**
 * Rota da Nina (suporte in-app). Nutri e Coach já usam /suporte para outra página de ajuda.
 */
export function getYladaSuportePath(areaCodigo: string): string {
  return areaCodigo === 'nutri' || areaCodigo === 'coach' ? 'suporte/chat' : 'suporte'
}

/** Retorna path prefix pelo segment_code (uso em Smart Links e APIs). */
export function getYladaSegmentPathPrefix(segmentCode: YladaSegmentCode): string {
  return YLADA_AREAS.find((a) => a.segment_code === segmentCode)?.pathPrefix ?? `/pt/${segmentCode}`
}

/** Lista de segment_code válidos para validação (ex.: body.segment na API Noel). */
export const YLADA_SEGMENT_CODES: YladaSegmentCode[] = ['ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'nutri', 'coach', 'seller', 'perfumaria', 'estetica', 'fitness']

/** Perfis permitidos nas APIs YLADA (Links, Templates, Biblioteca, etc.). Wellness/coach-bem-estar ficam só em /api/wellness/*. */
export const YLADA_API_ALLOWED_PROFILES = [
  'ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller',
  'perfumaria', 'estetica', 'fitness', 'nutri', 'admin',
] as const
