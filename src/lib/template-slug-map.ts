/**
 * Mapeamento centralizado de slugs de templates
 * Garante que diferentes variações de nomes apontem para o mesmo template
 * 
 * IMPORTANTE: Use este mapeamento ao salvar template_slug em user_templates
 * para garantir consistência mesmo se o nome do template mudar no banco
 */

export const TEMPLATE_SLUG_MAP: Record<string, string> = {
  // Calculadora de Água/Hidratação - todas as variações apontam para calc-hidratacao
  'calculadora-de-agua': 'calc-hidratacao',
  'calculadora-de-hidratacao': 'calc-hidratacao',
  'calculadora-agua': 'calc-hidratacao',
  'calculadora-hidratacao': 'calc-hidratacao',
  'hidratacao': 'calc-hidratacao',
  'calc-hidratacao': 'calc-hidratacao',
  
  // Calculadora IMC
  'calculadora-imc': 'calc-imc',
  'calculadora-de-imc': 'calc-imc',
  'calc-imc': 'calc-imc',
  'imc': 'calc-imc',
  
  // Calculadora de Proteína
  'calculadora-proteina': 'calc-proteina',
  'calculadora-de-proteina': 'calc-proteina',
  'calc-proteina': 'calc-proteina',
  'proteina': 'calc-proteina',
  
  // Calculadora de Composição
  'calculadora-composicao': 'calc-composicao',
  'calculadora-de-composicao': 'calc-composicao',
  'calc-composicao': 'calc-composicao',
  'composicao-corporal': 'calc-composicao',
  
  // Quiz Ganhos
  'quiz-ganhos': 'quiz-ganhos',
  'quiz-ganhos-prosperidade': 'quiz-ganhos',
  'ganhos-prosperidade': 'quiz-ganhos',
  
  // Quiz Potencial
  'quiz-potencial': 'quiz-potencial',
  'quiz-potencial-crescimento': 'quiz-potencial',
  'potencial-crescimento': 'quiz-potencial',
  
  // Quiz Propósito
  'quiz-proposito': 'quiz-proposito',
  'quiz-proposito-equilibrio': 'quiz-proposito',
  'proposito-equilibrio': 'quiz-proposito',
  
  // Quiz Parasitas
  'quiz-parasitas': 'quiz-parasitas',
  
  // Quiz Alimentação
  'quiz-alimentacao': 'quiz-alimentacao',
  'quiz-alimentacao-saudavel': 'quiz-alimentacao',
  'alimentacao-saudavel': 'quiz-alimentacao',
  
  // Planilhas
  'planilha-meal-planner': 'planilha-meal-planner',
  'diario-alimentar': 'planilha-diario-alimentar',
  'planilha-diario-alimentar': 'planilha-diario-alimentar',
  'tabela-metas-semanais': 'planilha-metas-semanais',
  'planilha-metas-semanais': 'planilha-metas-semanais',
}

/**
 * Normaliza um slug de template para o slug canônico
 * Se não encontrar no mapeamento, retorna o slug original
 */
export function normalizeTemplateSlug(slug: string | null | undefined): string {
  if (!slug) return ''
  const normalized = slug.toLowerCase().trim()
  return TEMPLATE_SLUG_MAP[normalized] || normalized
}

/**
 * Lista de slugs canônicos válidos (para validação)
 */
export const CANONICAL_TEMPLATE_SLUGS = [
  'calc-imc',
  'calc-proteina',
  'calc-hidratacao',
  'calc-composicao',
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
  'quiz-parasitas',
  'quiz-alimentacao',
  'quiz-wellness-profile',
  'quiz-nutrition-assessment',
  'planilha-meal-planner',
  'planilha-diario-alimentar',
  'planilha-metas-semanais',
  'template-desafio-7dias',
  'template-desafio-21dias',
  'guia-hidratacao',
  'avaliacao-emocional',
  'avaliacao-intolerancia',
  'avaliacao-perfil-metabolico',
  'diagnostico-eletrolitos',
  'diagnostico-sintomas-intestinais',
  'pronto-emagrecer',
  'tipo-fome',
  'sindrome-metabolica',
  'retencao-liquidos',
  'conhece-seu-corpo',
  'nutrido-vs-alimentado',
  'alimentacao-rotina',
  'infografico-educativo',
  'template-receitas',
  'template-story-interativo',
  'cardapio-detox',
  'template-avaliacao-inicial',
  'formulario-recomendacao',
] as const

