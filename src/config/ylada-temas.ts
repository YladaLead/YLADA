/**
 * Temas por profissão — para Links: "Qual tema você quer trabalhar agora?"
 * Lista filtrada pelo perfil; profissional pode marcar no perfil os que atende.
 * @see docs/PLANO-IMPLANTACAO-DIRECAO-ESTRATEGICA.md
 */

export interface TemaOption {
  value: string
  label: string
}

/** Temas por profissão (principais temas que fazem sentido para cada uma). */
export const TEMAS_BY_PROFESSION: Record<string, TemaOption[]> = {
  medico: [
    { value: 'emagrecimento', label: 'Emagrecimento' },
    { value: 'intestino', label: 'Intestino / digestão' },
    { value: 'alimentacao', label: 'Alimentação saudável' },
    { value: 'pressao', label: 'Pressão e saúde cardiovascular' },
    { value: 'diabetes', label: 'Diabetes e metabolismo' },
    { value: 'energia', label: 'Energia e cansaço' },
    { value: 'sono', label: 'Sono' },
    { value: 'suplementacao', label: 'Vitaminas e suplementos' },
  ],
  nutricionista: [
    { value: 'emagrecimento', label: 'Emagrecimento' },
    { value: 'intestino', label: 'Intestino / digestão' },
    { value: 'alimentacao', label: 'Alimentação saudável' },
    { value: 'energia', label: 'Energia e cansaço' },
    { value: 'suplementacao', label: 'Vitaminas e suplementos (B12, etc.)' },
    { value: 'performance', label: 'Performance e esportes' },
    { value: 'gestacao', label: 'Gestação e maternidade' },
  ],
  vendedor_suplementos: [
    { value: 'b12_vitaminas', label: 'Vitamina B12 e vitaminas' },
    { value: 'energia', label: 'Energia e disposição' },
    { value: 'emagrecimento', label: 'Emagrecimento' },
    { value: 'intestino', label: 'Intestino e digestão' },
    { value: 'bem_estar', label: 'Bem-estar geral' },
    { value: 'suplementacao', label: 'Suplementação' },
  ],
  odonto: [
    { value: 'saude_bucal', label: 'Saúde bucal geral' },
    { value: 'clareamento', label: 'Clareamento' },
    { value: 'implantes', label: 'Implantes' },
    { value: 'ortodontia', label: 'Ortodontia' },
    { value: 'estetica_dental', label: 'Estética dental' },
  ],
  psi: [
    { value: 'ansiedade', label: 'Ansiedade' },
    { value: 'sono', label: 'Sono' },
    { value: 'autoconhecimento', label: 'Autoconhecimento' },
    { value: 'relacionamentos', label: 'Relacionamentos' },
    { value: 'carreira', label: 'Carreira e trabalho' },
  ],
  coach: [
    { value: 'carreira', label: 'Carreira e trabalho' },
    { value: 'produtividade', label: 'Produtividade' },
    { value: 'lideranca', label: 'Liderança' },
    { value: 'autoconhecimento', label: 'Autoconhecimento' },
    { value: 'vendas', label: 'Vendas e negócios' },
  ],
  estetica: [
    { value: 'pele', label: 'Cuidados com a pele' },
    { value: 'antienvelhecimento', label: 'Antienvelhecimento' },
    { value: 'corporal', label: 'Estética corporal' },
    { value: 'cabelos', label: 'Cabelos' },
  ],
  vendedor_cosmeticos: [
    { value: 'pele', label: 'Cuidados com a pele' },
    { value: 'antienvelhecimento', label: 'Antienvelhecimento' },
    { value: 'bem_estar', label: 'Bem-estar' },
  ],
  vendedor_servicos: [
    { value: 'produtividade', label: 'Produtividade' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'bem_estar', label: 'Bem-estar' },
  ],
  vendedor_produtos: [
    { value: 'bem_estar', label: 'Bem-estar' },
    { value: 'suplementacao', label: 'Suplementação' },
    { value: 'energia', label: 'Energia' },
  ],
  outro: [
    { value: 'emagrecimento', label: 'Emagrecimento' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'energia', label: 'Energia' },
    { value: 'bem_estar', label: 'Bem-estar' },
    { value: 'outro', label: 'Outro tema' },
  ],
}

/** Retorna temas para uma profissão (fallback para 'outro' se não houver). */
export function getTemasForProfession(profession: string | null | undefined): TemaOption[] {
  if (!profession) return TEMAS_BY_PROFESSION.outro
  const key = String(profession).toLowerCase().trim()
  return TEMAS_BY_PROFESSION[key] ?? TEMAS_BY_PROFESSION.outro
}

/** Overrides para temas comuns (padronização PT, ex.: skincare → Rotina de skincare). */
const TEMA_LABEL_OVERRIDES: Record<string, string> = {
  skincare: 'Rotina de skincare',
  autocuidado: 'Autocuidado',
  retencao: 'Retenção de clientes',
}

/** Retorna label de um tema pelo value. */
export function getTemaLabel(value: string): string {
  const key = String(value || '').toLowerCase().trim()
  if (TEMA_LABEL_OVERRIDES[key]) return TEMA_LABEL_OVERRIDES[key]
  for (const opts of Object.values(TEMAS_BY_PROFESSION)) {
    const found = opts.find((o) => o.value === value || o.value.toLowerCase() === key)
    if (found) return found.label
  }
  return value || 'Outro tema'
}

/** Valor especial para "Outro" — usuário digita. */
export const TEMA_OUTRO_VALUE = '_outro'

/** Ícones por tema (para melhor escaneabilidade na UI). */
export const TEMA_ICONS: Record<string, string> = {
  pele: '💆‍♀️',
  antienvelhecimento: '✨',
  corporal: '🌿',
  cabelos: '💇‍♀️',
  emagrecimento: '⚖️',
  intestino: '🫀',
  alimentacao: '🥗',
  energia: '⚡',
  sono: '😴',
  ansiedade: '🧘',
  carreira: '💼',
  produtividade: '📊',
  bem_estar: '🌿',
  saude_bucal: '🦷',
  clareamento: '✨',
  implantes: '🦷',
  estetica_dental: '✨',
  ortodontia: '🦷',
  autoconhecimento: '🔍',
  relacionamentos: '💬',
  vendas: '💰',
  suplementacao: '💊',
  skincare: '✨',
  autocuidado: '🌿',
  retencao: '🔁',
  b12_vitaminas: '💊',
  performance: '🏃',
  gestacao: '🤰',
}
