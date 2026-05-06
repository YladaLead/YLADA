/**
 * Catálogo HYPE exibido em Meus Links do Wellness (mesmos slugs em /pt/wellness/[slug]/[ferramenta]).
 * Fonte única para evitar divergência entre a página de links e presets Pro Líderes.
 */
export type WellnessHypeMeusLinkItem = {
  id: string
  nome: string
  slug: string
  type: 'quiz' | 'calculadora'
  description: string
  icon: string
}

export const WELLNESS_HYPE_MEUS_LINKS: WellnessHypeMeusLinkItem[] = [
  {
    id: 'hype-energia-foco',
    nome: 'Quiz: Energia & Foco',
    slug: 'energia-foco',
    type: 'quiz',
    description: 'Descubra como melhorar sua energia e foco ao longo do dia',
    icon: '⚡',
  },
  {
    id: 'hype-pre-treino',
    nome: 'Quiz: Pré-Treino Ideal',
    slug: 'pre-treino',
    type: 'quiz',
    description: 'Identifique o pré-treino ideal para você',
    icon: '🏋️',
  },
  {
    id: 'hype-rotina-produtiva',
    nome: 'Quiz: Rotina Produtiva',
    slug: 'rotina-produtiva',
    type: 'quiz',
    description: 'Descubra como melhorar sua produtividade e constância',
    icon: '📈',
  },
  {
    id: 'hype-constancia',
    nome: 'Quiz: Constância & Rotina',
    slug: 'constancia',
    type: 'quiz',
    description: 'Identifique como manter uma rotina saudável todos os dias',
    icon: '🎯',
  },
  {
    id: 'hype-consumo-cafeina',
    nome: 'Calculadora: Consumo de Cafeína',
    slug: 'consumo-cafeina',
    type: 'calculadora',
    description: 'Calcule seu consumo de cafeína e identifique alternativas',
    icon: '☕',
  },
  {
    id: 'hype-custo-energia',
    nome: 'Calculadora: Custo da Falta de Energia',
    slug: 'custo-energia',
    type: 'calculadora',
    description: 'Calcule o impacto da falta de energia na sua produtividade',
    icon: '💰',
  },
]
