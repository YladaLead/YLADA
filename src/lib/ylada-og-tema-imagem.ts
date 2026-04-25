/**
 * Mapeamento tema/segmento → imagem OG fixa para links YLADA (/l/[slug]).
 * Uma pasta única compartilhada: médico, nutricionista, etc. usam a mesma imagem por tema.
 * Ex: Calculadora de IMC → sempre usa peso-gordura.webp, independente de quem usa.
 * Quando o ficheiro seria default.jpg, usa o logotipo YLADA (marca estável no WhatsApp).
 * @see docs/CORRIGIR-IMAGENS-OG-WHATSAPP.md
 */

import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

/** Segmentos YLADA (alinhado com ylada_links.segment e meta.segment_code). */
export type YladaOgSegment =
  | 'nutrition'
  | 'perfumaria'
  | 'estetica'
  | 'fitness'
  | 'coach'
  | 'medicine'
  | 'psychology'
  | 'dentistry'
  | 'nutrition_vendedor'
  | 'joias'
  | 'ylada'

/** Pasta única compartilhada — todas as imagens em /images/og/ylada/ */
const OG_BASE = '/images/og/ylada'

/** Mapeamento tema/ferramenta normalizado → nome do arquivo de imagem.
 * Nomes de arquivo são descritivos para orientar qual imagem colocar.
 * Placeholders podem ser substituídos depois pelas imagens finais. */
const TEMA_TO_IMAGE: Record<string, string> = {
  // Calculadoras (compartilhadas entre todas as áreas)
  imc: 'peso-gordura.webp',
  calc_imc: 'peso-gordura.webp',
  calculadora_imc: 'peso-gordura.webp',
  proteina: 'peso-gordura.webp',
  calc_proteina: 'peso-gordura.webp',
  hidratacao: 'hidratacao.jpg',
  calc_hidratacao: 'hidratacao.jpg',
  calorias: 'alimentacao.png',
  calc_calorias: 'alimentacao.png',
  composicao: 'peso-gordura.webp',
  calc_composicao: 'peso-gordura.webp',
  // Nutrição / bem-estar geral
  emagrecimento: 'emagrecimento.png',
  intestino: 'intestino.jpg',
  digestao: 'intestino.jpg',
  metabolismo: 'metabolismo.jpg',
  energia: 'energia.jpg',
  alimentacao: 'alimentacao.png',
  peso_gordura: 'peso-gordura.webp',
  inchaço_retencao: 'inchaço-retencao.jpg',
  retencao: 'inchaço-retencao.jpg',
  rotina_saudavel: 'rotina-saudavel.png',
  sono: 'sono.jpg',
  estresse: 'estresse.jpg',
  foco_concentracao: 'foco.jpg',
  vitalidade_geral: 'vitalidade.png',
  detox: 'detox.jpg',
  performance: 'performance.jpg',
  saude: 'nutri-saude.png',
  saude_geral: 'nutri-saude.png',
  nutricao_saudavel: 'nutri-saude.png',

  // Perfumaria
  preferencias_olfativas: 'perfumaria-perfil.jpg',
  familia_olfativa: 'perfumaria-perfil.jpg',
  ocasiao_uso: 'perfumaria-perfil.jpg',
  personalidade_fragrancia: 'perfumaria-perfil.jpg',
  perfume_assinatura: 'perfumaria-perfil.jpg',
  perfil_olfativo: 'perfumaria-perfil.jpg',

  // Estética — nomes orientam tipo de imagem a colocar
  pele: 'estetica-pele-cuidados.jpg',
  pele_cuidados: 'estetica-pele-cuidados.jpg',
  cuidados_pele: 'estetica-pele-cuidados.jpg',
  autoestima: 'estetica-pele-cuidados.jpg',
  rotina_cuidados: 'estetica-pele-cuidados.jpg',
  manchas: 'estetica-pele-manchas.jpg',
  pele_manchas: 'estetica-pele-manchas.jpg',
  manchas_pele: 'estetica-pele-manchas.jpg',
  antienvelhecimento: 'estetica-pele-antienvelhecimento.jpg',
  pele_antienvelhecimento: 'estetica-pele-antienvelhecimento.jpg',
  rejuvenescimento: 'estetica-rejuvenescimento.png',
  unhas: 'estetica-unhas.jpg',
  cuidado_unhas: 'estetica-unhas.jpg',
  alongamento_unhas: 'estetica-unhas.jpg',
  cabelos: 'estetica-cabelos.png',
  cuidado_cabelos: 'estetica-cabelos.png',
  gordura_localizada: 'estetica-corporal-celulite.png',
  celulite: 'estetica-corporal-celulite.png',
  corporal_celulite: 'estetica-corporal-celulite.png',
  flacidez: 'estetica-corporal-flacidez.jpg',
  corporal_flacidez: 'estetica-corporal-flacidez.jpg',
  corporal: 'estetica-corporal.jpg',

  // Fitness
  treino: 'fitness-treino.jpg',
  recuperacao: 'fitness-treino.jpg',
  resistencia: 'fitness-treino.jpg',
  forca: 'fitness-treino.jpg',
  consistencia: 'fitness-treino.jpg',

  // Psicologia / Psicanálise
  ansiedade: 'psicologia-ansiedade.jpg',
  emocoes: 'psicologia-ansiedade.jpg',
  equilibrio_emocional: 'psicologia-ansiedade.jpg',
  depressao: 'psicologia-depressao.jpg',
  relacionamentos: 'psicologia-relacionamentos.jpg',
  autoconhecimento: 'psicologia-autoconhecimento.jpg',
  emocional: 'psicologia-emocional.jpg',
  saude_mental: 'psicologia-emocional.jpg',
  autoestima_psicologia: 'psicologia-autoestima.jpg',

  // Odontologia — nomes orientam imagem (ex: sorriso → foto de sorriso)
  sorriso: 'odonto-sorriso.webp',
  sorriso_saudavel: 'odonto-sorriso.webp',
  saude_bucal: 'odonto-saude-bucal.jpg',
  higiene_oral: 'odonto-saude-bucal.jpg',
  clareamento: 'odonto-clareamento.png',
  clareamento_dental: 'odonto-clareamento.png',
  halitose: 'odonto-halitose.jpg',
  mau_halito: 'odonto-halitose.jpg',
  implantes: 'odonto-implantes.png',
  implante_dental: 'odonto-implantes.png',
  ortodontia: 'odonto-ortodontia.jpg',
  aparelho: 'odonto-ortodontia.jpg',
  sensibilidade: 'odonto-sensibilidade.avif',
  sensibilidade_dental: 'odonto-sensibilidade.avif',
  estetica_dental: 'odonto-estetica.png',

  // Medicina
  prevencao: 'medicina-prevencao.jpg',
  qualidade_vida: 'medicina-prevencao.jpg',
  estilo_vida: 'medicina-prevencao.jpg',
  habitos: 'medicina-prevencao.jpg',
  vitalidade: 'medicina-prevencao.jpg',
  diabetes: 'medicina-diabetes.jpg',
  pressao: 'medicina-pressao.jpg',
  hipertensao: 'medicina-pressao.jpg',
  suplementacao: 'medicina-suplementacao.jpg',

  // Vendedor / Coach
  b12_vitaminas: 'vendedor-energia.png',
  bem_estar: 'vendedor-energia.png',
  carreira: 'carreira.webp',
  produtividade: 'carreira.webp',
  vendas: 'carreira.webp',
  proposito: 'coach-proposito.jpg',
  coach_proposito: 'coach-proposito.jpg',
}

/** Padrão por segmento quando tema não mapeia (todos na pasta compartilhada). */
const SEGMENT_DEFAULT_IMAGE: Record<YladaOgSegment, string> = {
  nutrition: 'emagrecimento.png',
  perfumaria: 'perfumaria-perfil.jpg',
  estetica: 'estetica-pele.png',
  fitness: 'fitness-treino.jpg',
  coach: 'coach-proposito.jpg',
  medicine: 'medicina-prevencao.jpg',
  psychology: 'psicologia-ansiedade.jpg',
  dentistry: 'odonto-saude.jpg',
  nutrition_vendedor: 'vendedor-energia.png',
  joias: 'vendedor-energia.png',
  ylada: 'default.jpg', // resolvido para logo em ogPathFromFilename
}

/** Normaliza segmento do meta/DB para YladaOgSegment. */
function normalizeSegment(segment: string | null | undefined): YladaOgSegment {
  if (!segment) return 'ylada'
  const s = String(segment).toLowerCase().trim()
  const map: Record<string, YladaOgSegment> = {
    nutrition: 'nutrition',
    nutri: 'nutrition',
    nutra: 'nutrition',
    perfumaria: 'perfumaria',
    estetica: 'estetica',
    aesthetics: 'estetica',
    fitness: 'fitness',
    joias: 'joias',
    coach: 'coach',
    med: 'medicine',
    medicine: 'medicine',
    psi: 'psychology',
    psicanalise: 'psychology',
    psychology: 'psychology',
    odonto: 'dentistry',
    dentistry: 'dentistry',
    seller: 'nutrition_vendedor',
    nutrition_vendedor: 'nutrition_vendedor',
    ylada: 'ylada',
  }
  return map[s] ?? 'ylada'
}

/** Normaliza tema para chave do mapeamento (lowercase, sem acentos, underscores). */
function normalizeTema(tema: string | null | undefined): string {
  if (!tema || typeof tema !== 'string') return ''
  return tema
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
}

/** Extrai palavras-chave do tema para busca (ex: "Emagrecimento com saúde" → emagrecimento). */
function extractTemaKeywords(tema: string): string[] {
  const n = normalizeTema(tema)
  if (!n) return []
  const keywords: string[] = [n]
  // Palavras comuns que podem ser o tema principal
  const common = [
    'emagrecimento', 'intestino', 'energia', 'pele', 'perfume', 'treino', 'ansiedade', 'metabolismo',
    'alimentacao', 'hidratacao', 'sono', 'estresse', 'detox', 'performance', 'perfil_olfativo', 'familia_olfativa',
    'sorriso', 'unhas', 'cabelos', 'celulite', 'flacidez', 'manchas', 'clareamento', 'halitose', 'implantes',
    'ortodontia', 'sensibilidade', 'depressao', 'relacionamentos', 'autoconhecimento', 'proposito', 'saude', 'diabetes', 'pressao'
  ]
  for (const c of common) {
    if (n.includes(c)) keywords.push(c)
  }
  return keywords
}

function ogPathFromFilename(filename: string): string {
  if (filename === 'default.jpg') return YLADA_OG_FALLBACK_LOGO_PATH
  return `${OG_BASE}/${filename}`
}

/**
 * Retorna o caminho da imagem OG para um link YLADA.
 * Pasta única compartilhada: médico, nutricionista, fitness etc. usam a mesma imagem por tema.
 * @param tema - Tema do quiz (meta.theme_raw, meta.theme, title)
 * @param segment - Segmento (para fallback quando tema não mapeia)
 * @returns Caminho relativo, ex: /images/og/ylada/emagrecimento.png
 */
export function getYladaOgImagePath(
  tema: string | null | undefined,
  segment: string | null | undefined
): string {
  const seg = normalizeSegment(segment)

  if (tema) {
    const normalized = normalizeTema(tema)
    const direct = TEMA_TO_IMAGE[normalized]
    if (direct) {
      return ogPathFromFilename(direct)
    }
    const keywords = extractTemaKeywords(tema)
    for (const kw of keywords) {
      const match = TEMA_TO_IMAGE[kw]
      if (match) {
        return ogPathFromFilename(match)
      }
    }
  }

  const segmentDefault = SEGMENT_DEFAULT_IMAGE[seg]
  return ogPathFromFilename(segmentDefault)
}

/**
 * Retorna URL absoluta da imagem OG (para WhatsApp).
 * @param baseUrl - URL base do site (ex: https://ylada.app)
 */
export function getYladaOgImageUrl(
  tema: string | null | undefined,
  segment: string | null | undefined,
  baseUrl: string = 'https://ylada.app'
): string {
  const path = getYladaOgImagePath(tema, segment)
  return `${baseUrl.replace(/\/$/, '')}${path}`
}
