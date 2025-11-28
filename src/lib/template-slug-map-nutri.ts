/**
 * Mapeamento completo de slugs de templates para área Nutri
 * Garante que todas as variações de nomes apontem para o template correto
 * 
 * IMPORTANTE: Este mapeamento é específico para Nutri e cobre todas as variações
 * de slugs que podem existir no banco de dados
 */

export const NUTRI_TEMPLATE_SLUG_MAP: Record<string, string> = {
  // ============================================
  // CALCULADORAS
  // ============================================
  
  // Calculadora de IMC
  'calculadora-imc': 'calc-imc',
  'calculadora-de-imc': 'calc-imc',
  'calculadora imc': 'calc-imc',
  'calculadora de imc': 'calc-imc',
  'calc-imc': 'calc-imc',
  'imc': 'calc-imc',
  'calculadora-imc-nutri': 'calc-imc',
  'calculadora-de-imc-nutri': 'calc-imc',
  
  // Calculadora de Proteína
  'calculadora-proteina': 'calc-proteina',
  'calculadora-de-proteina': 'calc-proteina',
  'calculadora proteina': 'calc-proteina',
  'calculadora de proteina': 'calc-proteina',
  'calc-proteina': 'calc-proteina',
  'proteina': 'calc-proteina',
  'calculadora-proteina-nutri': 'calc-proteina',
  'calculadora-de-proteina-nutri': 'calc-proteina',
  
  // Calculadora de Água/Hidratação
  'calculadora-agua': 'calc-hidratacao',
  'calculadora-de-agua': 'calc-hidratacao',
  'calculadora agua': 'calc-hidratacao',
  'calculadora de agua': 'calc-hidratacao',
  'calculadora-hidratacao': 'calc-hidratacao',
  'calculadora-de-hidratacao': 'calc-hidratacao',
  'calculadora hidratacao': 'calc-hidratacao',
  'calculadora de hidratacao': 'calc-hidratacao',
  'calc-hidratacao': 'calc-hidratacao',
  'hidratacao': 'calc-hidratacao',
  'agua': 'calc-hidratacao',
  'calculadora-agua-nutri': 'calc-hidratacao',
  'calculadora-de-agua-nutri': 'calc-hidratacao',
  
  // Calculadora de Calorias
  'calculadora-calorias': 'calc-calorias',
  'calculadora-de-calorias': 'calc-calorias',
  'calculadora calorias': 'calc-calorias',
  'calculadora de calorias': 'calc-calorias',
  'calc-calorias': 'calc-calorias',
  'calorias': 'calc-calorias',
  'calculadora-calorias-nutri': 'calc-calorias',
  'calculadora-de-calorias-nutri': 'calc-calorias',
  
  // ============================================
  // QUIZZES
  // ============================================
  
  // Quiz Interativo
  'quiz-interativo': 'quiz-interativo',
  'quiz-interativo-nutri': 'quiz-interativo',
  'template-story-interativo': 'quiz-interativo',
  'story-interativo': 'quiz-interativo',
  
  // Quiz Ganhos
  'quiz-ganhos': 'quiz-ganhos',
  'quiz-ganhos-prosperidade': 'quiz-ganhos',
  'ganhos-prosperidade': 'quiz-ganhos',
  'quiz-ganhos-nutri': 'quiz-ganhos',
  
  // Quiz Potencial
  'quiz-potencial': 'quiz-potencial',
  'quiz-potencial-crescimento': 'quiz-potencial',
  'potencial-crescimento': 'quiz-potencial',
  'quiz-potencial-nutri': 'quiz-potencial',
  
  // Quiz Propósito
  'quiz-proposito': 'quiz-proposito',
  'quiz-proposito-equilibrio': 'quiz-proposito',
  'proposito-equilibrio': 'quiz-proposito',
  'quiz-proposito-nutri': 'quiz-proposito',
  
  // Quiz Alimentação
  'quiz-alimentacao': 'quiz-alimentacao',
  'quiz-alimentacao-saudavel': 'quiz-alimentacao',
  'quiz-alimentacao-nutri': 'quiz-alimentacao',
  'alimentacao-saudavel': 'quiz-alimentacao',
  'alimentacao-saudavel-nutri': 'quiz-alimentacao',
  
  // Quiz Bem-Estar
  'quiz-bem-estar': 'quiz-bem-estar',
  'quiz-bem-estar-nutri': 'quiz-bem-estar',
  'descoberta-perfil-bem-estar': 'quiz-bem-estar',
  
  // Quiz Detox
  'quiz-detox': 'quiz-detox',
  'quiz-detox-nutri': 'quiz-detox',
  'quiz-pedindo-detox': 'quiz-detox',
  
  // Quiz Energético
  'quiz-energetico': 'quiz-energetico',
  'quiz-energetico-nutri': 'quiz-energetico',
  
  // Quiz Perfil Nutricional
  'quiz-perfil-nutricional': 'quiz-perfil-nutricional',
  'quiz-nutrition-assessment': 'quiz-perfil-nutricional',
  
  // Quiz Tipo de Fome
  'quiz-tipo-fome': 'tipo-fome',
  'tipo-fome': 'tipo-fome',
  'quiz-fome-emocional': 'tipo-fome',
  'avaliacao-fome-emocional': 'tipo-fome',
  'avaliação-fome-emocional': 'tipo-fome',
  'fome-emocional': 'tipo-fome',
  
  // ============================================
  // AVALIAÇÕES
  // ============================================
  
  // Avaliação Inicial
  'avaliacao-inicial': 'avaliacao-inicial',
  'avaliacao-inicial-nutri': 'avaliacao-inicial',
  'avaliação-inicial': 'avaliacao-inicial',
  'template-avaliacao-inicial': 'avaliacao-inicial',
  
  // Avaliação de Intolerância
  'avaliacao-intolerancia': 'avaliacao-intolerancia',
  'avaliacao-intolerancia-nutri': 'avaliacao-intolerancia',
  'avaliação-intolerancia': 'avaliacao-intolerancia',
  'quiz-intolerancia': 'avaliacao-intolerancia',
  'intolerancia': 'avaliacao-intolerancia',
  
  // Avaliação Perfil Metabólico
  'avaliacao-perfil-metabolico': 'avaliacao-perfil-metabolico',
  'avaliacao-perfil-metabolico-nutri': 'avaliacao-perfil-metabolico',
  'avaliação-perfil-metabolico': 'avaliacao-perfil-metabolico',
  'quiz-perfil-metabolico': 'avaliacao-perfil-metabolico',
  'perfil-metabolico': 'avaliacao-perfil-metabolico',
  'perfil-metabólico': 'avaliacao-perfil-metabolico',
  
  // Avaliação Sono e Energia
  'avaliacao-sono-energia': 'avaliacao-sono-energia',
  'avaliacao-sono-energia-nutri': 'avaliacao-sono-energia',
  'quiz-sono-energia': 'avaliacao-sono-energia',
  
  // Avaliação Rotina Alimentar
  'avaliacao-rotina-alimentar': 'avaliacao-rotina-alimentar',
  'alimentacao-rotina': 'avaliacao-rotina-alimentar',
  'alimentacao-rotina-nutri': 'avaliacao-rotina-alimentar',
  'voce-alimentando-conforme-rotina': 'avaliacao-rotina-alimentar',
  
  // ============================================
  // DIAGNÓSTICOS
  // ============================================
  
  // Diagnóstico de Eletrólitos
  'diagnostico-eletrolitos': 'diagnostico-eletrolitos',
  'diagnostico-eletrolitos-nutri': 'diagnostico-eletrolitos',
  'diagnóstico-eletrolitos': 'diagnostico-eletrolitos',
  'quiz-eletrolitos': 'diagnostico-eletrolitos',
  'eletrolitos': 'diagnostico-eletrolitos',
  'eletrólitos': 'diagnostico-eletrolitos',
  
  // Diagnóstico de Sintomas Intestinais
  'diagnostico-sintomas-intestinais': 'diagnostico-sintomas-intestinais',
  'diagnostico-sintomas-intestinais-nutri': 'diagnostico-sintomas-intestinais',
  'diagnóstico-sintomas-intestinais': 'diagnostico-sintomas-intestinais',
  'quiz-sintomas-intestinais': 'diagnostico-sintomas-intestinais',
  'sintomas-intestinais': 'diagnostico-sintomas-intestinais',
  
  // Diagnóstico de Parasitose
  'diagnostico-parasitose': 'diagnostico-parasitose',
  'diagnóstico-parasitose': 'diagnostico-parasitose',
  'template-diagnostico-parasitose': 'diagnostico-parasitose',
  'quiz-parasitas': 'diagnostico-parasitose',
  
  // ============================================
  // TESTES E PERFIS
  // ============================================
  
  // Pronto para Emagrecer
  'pronto-emagrecer': 'pronto-emagrecer',
  'pronto-emagrecer-nutri': 'pronto-emagrecer',
  'quiz-pronto-emagrecer': 'pronto-emagrecer',
  'pronto para emagrecer': 'pronto-emagrecer',
  
  // Síndrome Metabólica
  'sindrome-metabolica': 'sindrome-metabolica',
  'sindrome-metabolica-nutri': 'sindrome-metabolica',
  'síndrome-metabolica': 'sindrome-metabolica',
  'risco-sindrome-metabolica': 'sindrome-metabolica',
  'metabolic-syndrome-risk': 'sindrome-metabolica',
  'metabolic-syndrome': 'sindrome-metabolica',
  
  // Retenção de Líquidos
  'retencao-liquidos': 'retencao-liquidos',
  'retencao-liquidos-nutri': 'retencao-liquidos',
  'retenção-liquidos': 'retencao-liquidos',
  'teste-retencao-liquidos': 'retencao-liquidos',
  'water-retention-test': 'retencao-liquidos',
  'water-retention': 'retencao-liquidos',
  
  // Conhece seu Corpo
  'conhece-seu-corpo': 'conhece-seu-corpo',
  'conhece-seu-corpo-nutri': 'conhece-seu-corpo',
  'voce-conhece-seu-corpo': 'conhece-seu-corpo',
  'body-awareness': 'conhece-seu-corpo',
  'autoconhecimento-corporal': 'conhece-seu-corpo',
  
  // Nutrido vs Alimentado
  'nutrido-vs-alimentado': 'nutrido-vs-alimentado',
  'nutrido-vs-alimentado-nutri': 'nutrido-vs-alimentado',
  'voce-nutrido-ou-apenas-alimentado': 'nutrido-vs-alimentado',
  'nourished-vs-fed': 'nutrido-vs-alimentado',
  'nutrido ou alimentado': 'nutrido-vs-alimentado',
  
  // Disciplinado ou Emocional
  'disciplinado-emocional': 'disciplinado-emocional',
  'disciplinado-emocional-nutri': 'disciplinado-emocional',
  'voce-disciplinado-ou-emocional': 'disciplinado-emocional',
  
  // Perfil de Intestino
  'perfil-intestino': 'perfil-intestino',
  'qual-e-seu-perfil-de-intestino': 'perfil-intestino',
  
  // ============================================
  // DESAFIOS
  // ============================================
  
  // Desafio 7 Dias
  'template-desafio-7dias': 'desafio-7-dias',
  'desafio-7-dias': 'desafio-7-dias',
  'desafio-7-dias-nutri': 'desafio-7-dias',
  
  // Desafio 21 Dias
  'template-desafio-21dias': 'desafio-21-dias',
  'desafio-21-dias': 'desafio-21-dias',
  'desafio-21-dias-nutri': 'desafio-21-dias',
  
  // ============================================
  // GUIAS
  // ============================================
  
  // Guia de Hidratação
  'guia-hidratacao': 'guia-hidratacao',
  'guia-de-hidratacao': 'guia-hidratacao',
  'guia hidratacao': 'guia-hidratacao',
  'guia hidratação': 'guia-hidratacao',
}

/**
 * Normaliza um slug de template Nutri para o slug canônico
 * @param slug - O slug a ser normalizado
 * @returns O slug canônico correspondente
 */
export function normalizeNutriTemplateSlug(slug: string | null | undefined): string {
  if (!slug) return ''
  
  // Normalizar: lowercase, trim, substituir espaços por hífens, remover múltiplos hífens
  let normalized = slug.toLowerCase().trim()
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-') // Múltiplos hífens para um único
    .replace(/^-|-$/g, '') // Remover hífens no início/fim
  
  // Remover sufixo -nutri se existir
  normalized = normalized.replace(/-nutri(?:-\d+)?$/, '')
  
  // Buscar no mapeamento
  if (NUTRI_TEMPLATE_SLUG_MAP[normalized]) {
    return NUTRI_TEMPLATE_SLUG_MAP[normalized]
  }
  
  // Se não encontrou, retornar normalizado
  return normalized
}

