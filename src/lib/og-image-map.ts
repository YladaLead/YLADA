/**
 * Mapeamento de template_slug para imagens Open Graph (OG)
 * Suporta diferentes áreas: wellness, coach, nutri
 * Todas as imagens começam com o logo da área como padrão
 * O usuário pode substituir as imagens depois conforme necessário
 */

import { normalizeTemplateSlug } from './template-slug-map'
import { normalizeNutriTemplateSlug } from './template-slug-map-nutri'

export type AreaType = 'wellness' | 'coach' | 'nutri'

// Mapeamento base de slugs para nomes de arquivos (sem área)
const OG_IMAGE_SLUG_MAP: Record<string, string> = {
  // Calculadoras
  'calc-imc': 'calc-imc.jpg',
  'calc-proteina': 'calc-proteina.jpg',
  'calc-hidratacao': 'calc-hidratacao.jpg',
  'calc-calorias': 'calc-calorias.jpg',
  'calc-composicao': 'calc-composicao.jpg',
  
  // Quizzes
  'quiz-ganhos': 'quiz-ganhos.jpg',
  'quiz-potencial': 'quiz-potencial.jpg',
  'quiz-proposito': 'quiz-proposito.jpg',
  'quiz-alimentacao': 'quiz-alimentacao.jpg',
  'quiz-wellness-profile': 'quiz-wellness-profile.jpg',
  'quiz-nutrition-assessment': 'quiz-nutrition-assessment.jpg',
  'quiz-personalizado': 'quiz-personalizado.jpg',
  
  // Desafios
  'template-desafio-7dias': 'template-desafio-7dias.jpg',
  'desafio-7-dias': 'template-desafio-7dias.jpg',
  'template-desafio-21dias': 'template-desafio-21dias.jpg',
  'desafio-21-dias': 'template-desafio-21dias.jpg',
  
  // Guias
  'guia-hidratacao': 'guia-hidratacao.jpg',
  'guia-de-hidratacao': 'guia-hidratacao.jpg',
  
  // Avaliações
  'avaliacao-intolerancia': 'avaliacao-intolerancia.jpg',
  'avaliacao-perfil-metabolico': 'avaliacao-perfil-metabolico.jpg',
  'avaliacao-emocional': 'avaliacao-emocional.jpg',
  'template-avaliacao-inicial': 'template-avaliacao-inicial.jpg',
  'avaliacao-inicial': 'template-avaliacao-inicial.jpg',
  
  // Diagnósticos
  'diagnostico-eletrolitos': 'diagnostico-eletrolitos.jpg',
  'diagnostico-sintomas-intestinais': 'diagnostico-sintomas-intestinais.jpg',
  
  // Outros Quizzes
  'pronto-emagrecer': 'pronto-emagrecer.jpg',
  'tipo-fome': 'tipo-fome.jpg',
  'sindrome-metabolica': 'sindrome-metabolica.jpg',
  'retencao-liquidos': 'retencao-liquidos.png',
  'retencao-inchaco-nas-pernas-e-rosto': 'retencao-liquidos.png',
  'retencao-inchaço': 'retencao-liquidos.png',
  'retencao-inchaco': 'retencao-liquidos.png',
  'retencao-inchaço-nas-pernas-e-rosto': 'retencao-liquidos.png',
  'fluxo-vendas-retencao-inchaço': 'retencao-liquidos.png',
  'fluxo-vendas-retencao-inchaco': 'retencao-liquidos.png',
  'fluxo-vendas-retencao-inchaço-nas-pernas-e-rosto': 'retencao-liquidos.png',
  'conhece-seu-corpo': 'conhece-seu-corpo.jpg',
  'nutrido-vs-alimentado': 'nutrido-vs-alimentado.jpg',
  'alimentacao-rotina': 'alimentacao-rotina.jpg',
  'template-story-interativo': 'template-story-interativo.jpg',
  'story-interativo': 'template-story-interativo.jpg',
  'quiz-interativo': 'template-story-interativo.jpg',
  
  // Planilhas
  'planilha-meal-planner': 'planilha-meal-planner.jpg',
  'planilha-diario-alimentar': 'planilha-diario-alimentar.jpg',
  'planilha-metas-semanais': 'planilha-metas-semanais.jpg',
  'cardapio-detox': 'cardapio-detox.jpg',
  
  // Portal
  'portal': 'portal.jpg',
  
  // Wellness System
  'system': 'default.jpg',
  'wellness-system': 'default.jpg',
  
  // HOM (Herbalife Opportunity Meeting)
  'hom': 'hom-bebidas-funcionais.png', // Imagem específica da HOM (PNG para melhor qualidade)
  
  // Fluxos Hype Drink
  'energia-foco': 'hype-energia-foco.jpg',
  'quiz-energia-foco': 'hype-energia-foco.jpg',
  'pre-treino': 'hype-pre-treino.jpg',
  'quiz-pre-treino': 'hype-pre-treino.jpg',
  'rotina-produtiva': 'hype-rotina-produtiva.jpeg',
  'quiz-rotina-produtiva': 'hype-rotina-produtiva.jpeg',
  'constancia': 'hype-constancia.jpg',
  'quiz-constancia': 'hype-constancia.jpg',
  'consumo-cafeina': 'hype-consumo-cafeina.jpg',
  'calc-consumo-cafeina': 'hype-consumo-cafeina.jpg',
  'calculadora-consumo-cafeina': 'hype-consumo-cafeina.jpg',
  'custo-energia': 'hype-custo-energia.jpeg',
  'calc-custo-energia': 'hype-custo-energia.jpeg',
  'calculadora-custo-energia': 'hype-custo-energia.jpeg',
  
  // Fallback padrão
  'default': 'default.jpg',
}

/**
 * Obtém a URL da imagem OG para um template_slug específico
 * @param templateSlug - Slug do template
 * @param area - Área da aplicação: 'wellness', 'coach' ou 'nutri' (padrão: 'wellness')
 * @returns Caminho da imagem OG
 */
export function getOGImageUrl(
  templateSlug: string | null | undefined,
  area: AreaType = 'wellness'
): string {
  if (!templateSlug) {
    console.log(`[OG Image] No template slug provided, using default for area: ${area}`)
    return `/images/og/${area}/${OG_IMAGE_SLUG_MAP.default}`
  }
  
  // Normalizar template_slug baseado na área
  let normalized: string
  if (area === 'nutri') {
    // Para Nutri, usar normalização específica
    normalized = normalizeNutriTemplateSlug(templateSlug)
  } else {
    // Para Wellness e Coach, usar normalização padrão
    normalized = normalizeTemplateSlug(templateSlug)
  }
  
  // ✅ Normalizar acentos para garantir que funcione mesmo com acentos no slug
  // Ex: "retencao-inchaço" -> "retencao-inchaco"
  const normalizedWithoutAccents = normalized
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  
  // Tentar primeiro com acentos, depois sem acentos
  const fileName = OG_IMAGE_SLUG_MAP[normalized] || 
                   OG_IMAGE_SLUG_MAP[normalizedWithoutAccents] || 
                   OG_IMAGE_SLUG_MAP.default
  
  // Construir caminho completo com área
  const imagePath = `/images/og/${area}/${fileName}`
  
  // Debug: log para verificar mapeamento
  console.log(`[OG Image] Looking for image (area: ${area}):`, {
    originalSlug: templateSlug,
    normalized,
    normalizedWithoutAccents,
    fileName,
    imagePath,
    hasMapping: !!OG_IMAGE_SLUG_MAP[normalized] || !!OG_IMAGE_SLUG_MAP[normalizedWithoutAccents],
  })
  
  return imagePath
}

/**
 * Obtém a URL completa da imagem OG (com domínio)
 * @param templateSlug - Slug do template
 * @param baseUrl - URL base do site (padrão: 'https://ylada.app')
 * @param area - Área da aplicação: 'wellness', 'coach' ou 'nutri' (padrão: 'wellness')
 * @returns URL completa da imagem OG
 */
export function getFullOGImageUrl(
  templateSlug: string | null | undefined,
  baseUrl: string = 'https://ylada.app',
  area: AreaType = 'wellness'
): string {
  const imagePath = getOGImageUrl(templateSlug, area)
  return `${baseUrl}${imagePath}`
}

/**
 * Lista todos os template_slug que precisam de imagens OG
 */
export function getAllTemplateSlugs(): string[] {
  return Object.keys(OG_IMAGE_SLUG_MAP).filter(slug => slug !== 'default')
}

