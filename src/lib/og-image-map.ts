/**
 * Mapeamento de template_slug para imagens Open Graph (OG)
 * Todas as imagens começam com o logo Wellness como padrão
 * O usuário pode substituir as imagens depois conforme necessário
 */

export const OG_IMAGE_MAP: Record<string, string> = {
  // Calculadoras
  'calc-imc': '/images/og/wellness/calc-imc.jpg',
  'calc-proteina': '/images/og/wellness/calc-proteina.jpg',
  'calc-hidratacao': '/images/og/wellness/calc-hidratacao.jpg',
  'calc-calorias': '/images/og/wellness/calc-calorias.jpg',
  'calc-composicao': '/images/og/wellness/calc-composicao.jpg',
  
  // Quizzes
  'quiz-ganhos': '/images/og/wellness/quiz-ganhos.jpg',
  'quiz-potencial': '/images/og/wellness/quiz-potencial.jpg',
  'quiz-proposito': '/images/og/wellness/quiz-proposito.jpg',
  'quiz-alimentacao': '/images/og/wellness/quiz-alimentacao.jpg',
  'quiz-wellness-profile': '/images/og/wellness/quiz-wellness-profile.jpg',
  'quiz-nutrition-assessment': '/images/og/wellness/quiz-nutrition-assessment.jpg',
  'quiz-personalizado': '/images/og/wellness/quiz-personalizado.jpg',
  
  // Desafios
  'template-desafio-7dias': '/images/og/wellness/template-desafio-7dias.jpg',
  'desafio-7-dias': '/images/og/wellness/template-desafio-7dias.jpg',
  'template-desafio-21dias': '/images/og/wellness/template-desafio-21dias.jpg',
  'desafio-21-dias': '/images/og/wellness/template-desafio-21dias.jpg',
  
  // Guias
  'guia-hidratacao': '/images/og/wellness/guia-hidratacao.jpg',
  
  // Avaliações
  'avaliacao-intolerancia': '/images/og/wellness/avaliacao-intolerancia.jpg',
  'avaliacao-perfil-metabolico': '/images/og/wellness/avaliacao-perfil-metabolico.jpg',
  'avaliacao-emocional': '/images/og/wellness/avaliacao-emocional.jpg',
  'template-avaliacao-inicial': '/images/og/wellness/template-avaliacao-inicial.jpg',
  'avaliacao-inicial': '/images/og/wellness/template-avaliacao-inicial.jpg',
  
  // Diagnósticos
  'diagnostico-eletrolitos': '/images/og/wellness/diagnostico-eletrolitos.jpg',
  'diagnostico-sintomas-intestinais': '/images/og/wellness/diagnostico-sintomas-intestinais.jpg',
  
  // Outros Quizzes
  'pronto-emagrecer': '/images/og/wellness/pronto-emagrecer.jpg',
  'tipo-fome': '/images/og/wellness/tipo-fome.jpg',
  'sindrome-metabolica': '/images/og/wellness/sindrome-metabolica.jpg',
  'retencao-liquidos': '/images/og/wellness/retencao-liquidos.jpg',
  'conhece-seu-corpo': '/images/og/wellness/conhece-seu-corpo.jpg',
  'nutrido-vs-alimentado': '/images/og/wellness/nutrido-vs-alimentado.jpg',
  'alimentacao-rotina': '/images/og/wellness/alimentacao-rotina.jpg',
  'template-story-interativo': '/images/og/wellness/template-story-interativo.jpg',
  'story-interativo': '/images/og/wellness/template-story-interativo.jpg',
  'quiz-interativo': '/images/og/wellness/template-story-interativo.jpg',
  
  // Planilhas
  'planilha-meal-planner': '/images/og/wellness/planilha-meal-planner.jpg',
  'planilha-diario-alimentar': '/images/og/wellness/planilha-diario-alimentar.jpg',
  'planilha-metas-semanais': '/images/og/wellness/planilha-metas-semanais.jpg',
  'cardapio-detox': '/images/og/wellness/cardapio-detox.jpg',
  
  // Portal
  'portal': '/images/og/wellness/portal.jpg',
  
  // Fallback padrão (logo Wellness)
  'default': '/images/og/wellness/default.jpg',
}

/**
 * Obtém a URL da imagem OG para um template_slug específico
 * Retorna a imagem padrão (logo Wellness) se não encontrar
 * Formato: JPG (recomendado para melhor performance e processamento mais rápido pelo Facebook)
 */
export function getOGImageUrl(templateSlug: string | null | undefined): string {
  if (!templateSlug) {
    return OG_IMAGE_MAP.default
  }
  
  // Normalizar o slug
  const normalized = templateSlug.toLowerCase().trim()
  
  // Tentar encontrar no mapeamento
  if (OG_IMAGE_MAP[normalized]) {
    return OG_IMAGE_MAP[normalized]
  }
  
  // Fallback para imagem padrão
  return OG_IMAGE_MAP.default
}

/**
 * Obtém a URL completa da imagem OG (com domínio)
 */
export function getFullOGImageUrl(templateSlug: string | null | undefined, baseUrl: string = 'https://ylada.app'): string {
  const imagePath = getOGImageUrl(templateSlug)
  return `${baseUrl}${imagePath}`
}

/**
 * Lista todos os template_slug que precisam de imagens OG
 */
export function getAllTemplateSlugs(): string[] {
  return Object.keys(OG_IMAGE_MAP).filter(slug => slug !== 'default')
}

