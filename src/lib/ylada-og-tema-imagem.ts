/**
 * Mapeamento tema/segmento → imagem OG fixa para links YLADA (/l/[slug]).
 * Uma pasta única compartilhada: médico, nutricionista, etc. usam a mesma imagem por tema.
 * Ex: Calculadora de IMC → sempre usa peso-gordura.jpg, independente de quem usa.
 * @see docs/CORRIGIR-IMAGENS-OG-WHATSAPP.md
 */

/** Segmentos YLADA (alinhado com ylada_links.segment e meta.segment_code). */
export type YladaOgSegment =
  | 'nutrition'
  | 'perfumaria'
  | 'estetica'
  | 'fitness'
  | 'medicine'
  | 'psychology'
  | 'dentistry'
  | 'nutrition_vendedor'
  | 'ylada'

/** Pasta única compartilhada — todas as imagens em /images/og/ylada/ */
const OG_BASE = '/images/og/ylada'

/** Mapeamento tema/ferramenta normalizado → nome do arquivo de imagem. */
const TEMA_TO_IMAGE: Record<string, string> = {
  // Calculadoras (compartilhadas entre todas as áreas)
  imc: 'peso-gordura.jpg',
  calc_imc: 'peso-gordura.jpg',
  calculadora_imc: 'peso-gordura.jpg',
  proteina: 'peso-gordura.jpg',
  calc_proteina: 'peso-gordura.jpg',
  hidratacao: 'hidratacao.jpg',
  calc_hidratacao: 'hidratacao.jpg',
  calorias: 'alimentacao.jpg',
  calc_calorias: 'alimentacao.jpg',
  composicao: 'peso-gordura.jpg',
  calc_composicao: 'peso-gordura.jpg',
  // Nutrição / bem-estar geral
  emagrecimento: 'emagrecimento.jpg',
  intestino: 'intestino.jpg',
  digestao: 'intestino.jpg',
  metabolismo: 'metabolismo.jpg',
  energia: 'energia.jpg',
  alimentacao: 'alimentacao.jpg',
  peso_gordura: 'peso-gordura.jpg',
  inchaço_retencao: 'inchaço-retencao.jpg',
  retencao: 'inchaço-retencao.jpg',
  rotina_saudavel: 'rotina-saudavel.jpg',
  sono: 'sono.jpg',
  estresse: 'estresse.jpg',
  foco_concentracao: 'foco.jpg',
  vitalidade_geral: 'vitalidade.jpg',
  detox: 'detox.jpg',
  performance: 'performance.jpg',

  // Perfumaria
  preferencias_olfativas: 'perfumaria-perfil.jpg',
  familia_olfativa: 'perfumaria-perfil.jpg',
  ocasiao_uso: 'perfumaria-perfil.jpg',
  personalidade_fragrancia: 'perfumaria-perfil.jpg',
  perfume_assinatura: 'perfumaria-perfil.jpg',
  perfil_olfativo: 'perfumaria-perfil.jpg',

  // Estética
  pele: 'estetica-pele.jpg',
  autoestima: 'estetica-pele.jpg',
  rotina_cuidados: 'estetica-pele.jpg',
  rejuvenescimento: 'estetica-rejuvenescimento.jpg',
  gordura_localizada: 'estetica-corporal.jpg',
  celulite: 'estetica-corporal.jpg',
  flacidez: 'estetica-corporal.jpg',
  manchas: 'estetica-pele.jpg',
  antienvelhecimento: 'estetica-rejuvenescimento.jpg',
  corporal: 'estetica-corporal.jpg',
  cabelos: 'estetica-pele.jpg',

  // Fitness
  treino: 'fitness-treino.jpg',
  recuperacao: 'fitness-treino.jpg',
  resistencia: 'fitness-treino.jpg',
  forca: 'fitness-treino.jpg',
  consistencia: 'fitness-treino.jpg',

  // Psicologia
  ansiedade: 'psicologia-ansiedade.jpg',
  emocoes: 'psicologia-ansiedade.jpg',
  autoconhecimento: 'psicologia-ansiedade.jpg',
  relacionamentos: 'psicologia-ansiedade.jpg',
  equilibrio_emocional: 'psicologia-ansiedade.jpg',

  // Odontologia
  saude_bucal: 'odonto-saude.jpg',
  higiene_oral: 'odonto-saude.jpg',
  estetica_dental: 'odonto-estetica.jpg',
  halitose: 'odonto-saude.jpg',
  sensibilidade: 'odonto-saude.jpg',
  clareamento: 'odonto-estetica.jpg',
  implantes: 'odonto-estetica.jpg',
  ortodontia: 'odonto-estetica.jpg',

  // Medicina
  prevencao: 'medicina-prevencao.jpg',
  qualidade_vida: 'medicina-prevencao.jpg',
  estilo_vida: 'medicina-prevencao.jpg',
  habitos: 'medicina-prevencao.jpg',
  vitalidade: 'medicina-prevencao.jpg',
  pressao: 'medicina-prevencao.jpg',
  diabetes: 'medicina-prevencao.jpg',
  suplementacao: 'medicina-prevencao.jpg',

  // Vendedor
  b12_vitaminas: 'vendedor-energia.jpg',
  bem_estar: 'vendedor-energia.jpg',
  carreira: 'carreira.jpg',
  produtividade: 'carreira.jpg',
  vendas: 'carreira.jpg',
}

/** Padrão por segmento quando tema não mapeia (todos na pasta compartilhada). */
const SEGMENT_DEFAULT_IMAGE: Record<YladaOgSegment, string> = {
  nutrition: 'emagrecimento.jpg',
  perfumaria: 'perfumaria-perfil.jpg',
  estetica: 'estetica-pele.jpg',
  fitness: 'fitness-treino.jpg',
  medicine: 'medicina-prevencao.jpg',
  psychology: 'psicologia-ansiedade.jpg',
  dentistry: 'odonto-saude.jpg',
  nutrition_vendedor: 'vendedor-energia.jpg',
  ylada: 'default.jpg',
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
  const common = ['emagrecimento', 'intestino', 'energia', 'pele', 'perfume', 'treino', 'ansiedade', 'metabolismo', 'alimentacao', 'hidratacao', 'sono', 'estresse', 'detox', 'performance', 'perfil_olfativo', 'familia_olfativa']
  for (const c of common) {
    if (n.includes(c)) keywords.push(c)
  }
  return keywords
}

/**
 * Retorna o caminho da imagem OG para um link YLADA.
 * Pasta única compartilhada: médico, nutricionista, fitness etc. usam a mesma imagem por tema.
 * @param tema - Tema do quiz (meta.theme_raw, meta.theme, title)
 * @param segment - Segmento (para fallback quando tema não mapeia)
 * @returns Caminho relativo, ex: /images/og/ylada/emagrecimento.jpg
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
      return `${OG_BASE}/${direct}`
    }
    const keywords = extractTemaKeywords(tema)
    for (const kw of keywords) {
      const match = TEMA_TO_IMAGE[kw]
      if (match) {
        return `${OG_BASE}/${match}`
      }
    }
  }

  const segmentDefault = SEGMENT_DEFAULT_IMAGE[seg]
  return `${OG_BASE}/${segmentDefault}`
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
