/**
 * Mapeamento de template_slug para imagens Open Graph (OG)
 * Todas as imagens começam com o logo Wellness como padrão
 * O usuário pode substituir as imagens depois conforme necessário
 */

export const OG_IMAGE_MAP: Record<string, string> = {
  // Calculadoras
  'calc-imc': '/images/og/wellness/calc-imc.png',
  'calc-proteina': '/images/og/wellness/calc-proteina.png',
  'calc-hidratacao': '/images/og/wellness/calc-hidratacao.png',
  'calc-calorias': '/images/og/wellness/calc-calorias.png',
  'calc-composicao': '/images/og/wellness/calc-composicao.png',
  
  // Quizzes
  'quiz-ganhos': '/images/og/wellness/quiz-ganhos.png',
  'quiz-potencial': '/images/og/wellness/quiz-potencial.png',
  'quiz-proposito': '/images/og/wellness/quiz-proposito.png',
  'quiz-alimentacao': '/images/og/wellness/quiz-alimentacao.png',
  'quiz-wellness-profile': '/images/og/wellness/quiz-wellness-profile.png',
  'quiz-nutrition-assessment': '/images/og/wellness/quiz-nutrition-assessment.png',
  'quiz-personalizado': '/images/og/wellness/quiz-personalizado.png',
  
  // Desafios
  'template-desafio-7dias': '/images/og/wellness/template-desafio-7dias.png',
  'desafio-7-dias': '/images/og/wellness/template-desafio-7dias.png',
  'template-desafio-21dias': '/images/og/wellness/template-desafio-21dias.png',
  'desafio-21-dias': '/images/og/wellness/template-desafio-21dias.png',
  
  // Guias
  'guia-hidratacao': '/images/og/wellness/guia-hidratacao.png',
  
  // Avaliações
  'avaliacao-intolerancia': '/images/og/wellness/avaliacao-intolerancia.png',
  'avaliacao-perfil-metabolico': '/images/og/wellness/avaliacao-perfil-metabolico.png',
  'avaliacao-emocional': '/images/og/wellness/avaliacao-emocional.png',
  'template-avaliacao-inicial': '/images/og/wellness/template-avaliacao-inicial.png',
  'avaliacao-inicial': '/images/og/wellness/template-avaliacao-inicial.png',
  
  // Diagnósticos
  'diagnostico-eletrolitos': '/images/og/wellness/diagnostico-eletrolitos.png',
  'diagnostico-sintomas-intestinais': '/images/og/wellness/diagnostico-sintomas-intestinais.png',
  
  // Outros Quizzes
  'pronto-emagrecer': '/images/og/wellness/pronto-emagrecer.png',
  'tipo-fome': '/images/og/wellness/tipo-fome.png',
  'sindrome-metabolica': '/images/og/wellness/sindrome-metabolica.png',
  'retencao-liquidos': '/images/og/wellness/retencao-liquidos.png',
  'conhece-seu-corpo': '/images/og/wellness/conhece-seu-corpo.png',
  'nutrido-vs-alimentado': '/images/og/wellness/nutrido-vs-alimentado.png',
  'alimentacao-rotina': '/images/og/wellness/alimentacao-rotina.png',
  'template-story-interativo': '/images/og/wellness/template-story-interativo.png',
  'story-interativo': '/images/og/wellness/template-story-interativo.png',
  'quiz-interativo': '/images/og/wellness/template-story-interativo.png',
  
  // Planilhas
  'planilha-meal-planner': '/images/og/wellness/planilha-meal-planner.png',
  'planilha-diario-alimentar': '/images/og/wellness/planilha-diario-alimentar.png',
  'planilha-metas-semanais': '/images/og/wellness/planilha-metas-semanais.png',
  'cardapio-detox': '/images/og/wellness/cardapio-detox.png',
  
  // Portal
  'portal': '/images/og/wellness/portal.png',
  
  // Fallback padrão (logo Wellness)
  'default': '/images/og/wellness/default.png',
}

/**
 * Obtém a URL da imagem OG para um template_slug específico
 * Retorna a imagem padrão (logo Wellness) se não encontrar
 * Aceita tanto JPG quanto PNG (prioriza JPG se ambos existirem)
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

