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
  'agua': 'calc-hidratacao', // ✅ Adicionado mapeamento para slug 'agua'
  'calc-hidratacao': 'calc-hidratacao',
  
  // Calculadora IMC
  'calculadora-imc': 'calc-imc',
  'calculadora-de-imc': 'calc-imc',
  'calculadora imc': 'calc-imc',
  'calculadora de imc': 'calc-imc',
  'calc-imc': 'calc-imc',
  'imc': 'calc-imc',
  // Variações com números (ex: calculadora-de-imc1)
  'calculadora-de-imc1': 'calc-imc',
  'calculadora-imc1': 'calc-imc',
  'calculadora de imc1': 'calc-imc',
  
  // Calculadora de Proteína
  'calculadora-proteina': 'calc-proteina',
  'calculadora-de-proteina': 'calc-proteina',
  'calc-proteina': 'calc-proteina',
  'proteina': 'calc-proteina',
  
  // Calculadora de Composição
  'calculadora-composicao': 'calc-composicao',
  'calculadora-de-composicao': 'calc-composicao',
  'calculadora composicao': 'calc-composicao',
  'calculadora de composicao': 'calc-composicao',
  'calc-composicao': 'calc-composicao',
  'composicao-corporal': 'calc-composicao',
  
  // Calculadora de Calorias
  'calculadora-calorias': 'calc-calorias',
  'calculadora-de-calorias': 'calc-calorias',
  'calculadora calorias': 'calc-calorias',
  'calculadora de calorias': 'calc-calorias',
  'calc-calorias': 'calc-calorias',
  'calorias': 'calc-calorias',
  
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
  
  // Quiz Fome Emocional / Tipo de Fome
  'quiz-fome-emocional': 'tipo-fome',
  'avaliacao-fome-emocional': 'tipo-fome',
  'avaliação-fome-emocional': 'tipo-fome',
  'fome-emocional': 'tipo-fome',
  
  // Planilhas
  'planilha-meal-planner': 'planilha-meal-planner',
  'diario-alimentar': 'planilha-diario-alimentar',
  'planilha-diario-alimentar': 'planilha-diario-alimentar',
  'tabela-metas-semanais': 'planilha-metas-semanais',
  'planilha-metas-semanais': 'planilha-metas-semanais',
  
  // Guias
  'guia-de-hidratacao': 'guia-hidratacao',
  'guia-hidratacao': 'guia-hidratacao',
  'guia hidratacao': 'guia-hidratacao',
  'guia hidratação': 'guia-hidratacao',
}

/**
 * Normaliza um slug de template para o slug canônico
 * Se não encontrar no mapeamento, retorna o slug original
 * 
 * @param slug - O slug a ser normalizado
 * @param profession - A área/profissão ('nutri', 'wellness', 'coach') - opcional
 */
export function normalizeTemplateSlug(slug: string | null | undefined, profession?: string): string {
  if (!slug) return ''
  // Normalizar: lowercase, trim, substituir espaços por hífens, remover múltiplos hífens
  let normalized = slug.toLowerCase().trim()
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-') // Múltiplos hífens para um único
    .replace(/^-|-$/g, '') // Remover hífens no início/fim

  // Se for um slug duplicado para Nutri (ex: calc-imc-nutri ou calc-imc-nutri-2), remover o sufixo
  normalized = normalized.replace(/-nutri(?:-\d+)?$/, '')
  
  // ✅ ÁREA NUTRI: Manter slugs originais (não converter para padrão Wellness)
  if (profession === 'nutri') {
    // Para Nutri, manter os slugs como estão no banco (calculadora-imc, calculadora-proteina, etc)
    // Não aplicar conversões do TEMPLATE_SLUG_MAP que são para Wellness/Coach
    return normalized
  }
  
  // Para outras áreas (Wellness, Coach), aplicar o mapeamento
  if (TEMPLATE_SLUG_MAP[normalized]) {
    return TEMPLATE_SLUG_MAP[normalized]
  }
  
  // Se não encontrou, retornar normalizado (sem espaços)
  return normalized
}

/**
 * Lista de slugs canônicos válidos (para validação)
 * Inclui slugs de todas as áreas (Wellness, Nutri, Coach)
 */
export const CANONICAL_TEMPLATE_SLUGS = [
  // Slugs Wellness/Coach (formato curto)
  'calc-imc',
  'calc-proteina',
  'calc-hidratacao',
  'calc-composicao',
  'calc-calorias',
  // Slugs Nutri (formato completo)
  'calculadora-imc',
  'calculadora-proteina',
  'calculadora-agua',
  'calculadora-calorias',
  // Quizzes (comuns a todas as áreas)
  'quiz-interativo',
  'quiz-bem-estar',
  'quiz-perfil-nutricional',
  'quiz-detox',
  'quiz-energetico',
  'quiz-ganhos',
  'quiz-potencial',
  'quiz-proposito',
  'quiz-parasitas',
  'quiz-alimentacao',
  'quiz-alimentacao-saudavel',
  'quiz-alimentacao-nutri',
  'quiz-wellness-profile',
  'quiz-nutrition-assessment',
  'quiz-tipo-fome',
  'quiz-pedindo-detox',
  'quiz-sono-energia',
  'quiz-emocional',
  'quiz-intolerancia',
  'quiz-perfil-metabolico',
  'quiz-sintomas-intestinais',
  'quiz-eletrolitos',
  'quiz-pronto-emagrecer',
  // Avaliações
  'avaliacao-emocional',
  'avaliacao-inicial',
  'avaliacao-intolerancia',
  'avaliacao-perfil-metabolico',
  'avaliacao-sono-energia',
  'avaliacao-rotina-alimentar',
  // Diagnósticos
  'diagnostico-eletrolitos',
  'diagnostico-parasitose',
  'diagnostico-sintomas-intestinais',
  // Checklists
  'checklist-detox',
  'checklist-alimentar',
  // Desafios
  'template-desafio-7dias',
  'desafio-7-dias',
  'template-desafio-21dias',
  'desafio-21-dias',
  // Planilhas
  'planilha-meal-planner',
  'planilha-diario-alimentar',
  'planilha-metas-semanais',
  'tabela-comparativa',
  'tabela-substituicoes',
  'tabela-sintomas',
  'tabela-metas-semanais',
  'plano-alimentar-base',
  // Guias
  'guia-hidratacao',
  'guia-nutraceutico',
  'guia-proteico',
  // Outros
  'pronto-emagrecer',
  'tipo-fome',
  'perfil-intestino',
  'sindrome-metabolica',
  'retencao-liquidos',
  'teste-retencao-liquidos',
  'conhece-seu-corpo',
  'disciplinado-emocional',
  'nutrido-vs-alimentado',
  'alimentacao-rotina',
  'infografico-educativo',
  'template-receitas',
  'receitas',
  'template-story-interativo',
  'story-interativo',
  'cardapio-detox',
  'template-avaliacao-inicial',
  'formulario-recomendacao',
  'diario-alimentar',
  'planner-refeicoes',
  'rastreador-alimentar',
  'simulador-resultados',
  'mini-ebook',
] as const

