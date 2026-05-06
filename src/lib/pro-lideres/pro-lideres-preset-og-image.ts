/**
 * Open Graph para presets Pro Líderes (`/l/pl-…`).
 * - Calculadoras espelhadas ao Wellness: mesma URL que `getOGImageUrl` em `/images/og/wellness/`
 *   (mesmas prévias no WhatsApp que em Meus Links Wellness; vendas e recrutamento usam o mesmo fluxo).
 * - Resto: assets em `/images/og/ylada/`.
 * Sem mapeamento → logo YLADA (`YLADA_OG_FALLBACK_LOGO_PATH`).
 */
import { getFullOGImageUrl } from '@/lib/og-image-map'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

const YLADA_OG_DIR = '/images/og/ylada'

/** `pro_lideres_fluxo_id` das calculadoras básicas → `template_slug` usado no mapa OG do Wellness. */
const WELLNESS_MIRROR_CALC_FLUXO_TO_TEMPLATE_SLUG: Record<string, string> = {
  agua: 'calc-hidratacao',
  'calc-hidratacao': 'calc-hidratacao',
  'calc-calorias': 'calc-calorias',
  'calc-proteina': 'calc-proteina',
  'calc-imc': 'calc-imc',
}

/** Nome de ficheiro em `public/images/og/ylada/` (ASCII, ficheiros reais no repo). */
const PRO_LIDERES_PRESET_OG_FILE: Record<string, string> = {
  // Quizzes vendas Wellness
  'energia-matinal': 'energia.jpg',
  'energia-tarde': 'energia.jpg',
  'troca-cafe': 'energia.jpg',
  'anti-cansaco': 'energia.jpg',
  'rotina-puxada': 'rotina-saudavel.png',
  'foco-concentracao': 'foco.jpg',
  motoristas: 'sono.jpg',
  'metabolismo-lento': 'metabolismo.jpg',
  'avaliacao-perfil-metabolico': 'metabolismo.jpg',
  'barriga-pesada': 'estetica-corporal.jpg',
  'retencao-inchaço': 'estetica-corporal.jpg',
  'desconforto-pos-refeicao': 'intestino.jpg',
  'inchaço-manha': 'estetica-corporal.jpg',
  'ansiedade-doce': 'psicologia-emocional.jpg',
  'mente-cansada': 'psicologia-ansiedade.jpg',
  'falta-disposicao-treinar': 'fitness-treino.jpg',
  'trabalho-noturno': 'sono.jpg',
  'rotina-estressante': 'estresse.jpg',
  'maes-ocupadas': 'rotina-saudavel.png',
  'fim-tarde-sem-energia': 'energia.jpg',
  sedentarismo: 'fitness-treino.jpg',

  // HYPE
  'energia-foco': 'energia.jpg',
  'pre-treino': 'fitness-treino.jpg',
  'rotina-produtiva': 'rotina-saudavel.png',
  constancia: 'foco.jpg',
  'consumo-cafeina': 'energia.jpg',
  'custo-energia': 'performance.jpg',

  // Recrutamento — quizzes
  'quiz-recrut-ganhos-prosperidade': 'vitalidade.png',
  'quiz-recrut-potencial-crescimento': 'performance.jpg',
  'quiz-recrut-proposito-equilibrio': 'coach-proposito.jpg',

  // Recrutamento — clássicos (mesma imagem “oportunidade” YLADA)
  'renda-extra-imediata': 'carreira.webp',
  'maes-trabalhar-casa': 'carreira.webp',
  'perderam-emprego-transicao': 'carreira.webp',
  'transformar-consumo-renda': 'carreira.webp',
  'jovens-empreendedores': 'carreira.webp',
  'ja-consome-bem-estar': 'vitalidade.png',
  'trabalhar-apenas-links': 'carreira.webp',
  'ja-usa-energia-acelera': 'vitalidade.png',
  'cansadas-trabalho-atual': 'carreira.webp',
  'ja-tentaram-outros-negocios': 'carreira.webp',
  'querem-trabalhar-digital': 'carreira.webp',
  'ja-empreendem': 'carreira.webp',
  'querem-emagrecer-renda': 'emagrecimento.png',
  'boas-venda-comercial': 'diagnostico-comunicacao.jpg',
}

export function getProLideresPresetOpenGraphImageUrl(fluxoId: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const trimmed = fluxoId.trim()
  const wellnessSlug = WELLNESS_MIRROR_CALC_FLUXO_TO_TEMPLATE_SLUG[trimmed]
  if (wellnessSlug) {
    return getFullOGImageUrl(wellnessSlug, base, 'wellness')
  }
  const file = PRO_LIDERES_PRESET_OG_FILE[trimmed]
  if (!file) {
    return `${base}${YLADA_OG_FALLBACK_LOGO_PATH}`
  }
  return `${base}${YLADA_OG_DIR}/${file}`
}
