import {
  PRO_ESTETICA_CAPILAR_OG_IMAGE_BANK,
  PRO_ESTETICA_CORPORAL_OG_IMAGE_BANK,
  type ProEsteticaOgImageBankEntry,
  YLADA_LINK_OG_IMAGE_DIR,
} from '@/config/ylada-link-og-image-bank'
import {
  getYladaOgImagePath,
  normalizeYladaOgThemeKey,
  temaTextSuggestsCapilarOg,
  temaTextSuggestsCorporalBodyOg,
} from '@/lib/ylada-og-tema-imagem'
import { YLADA_OG_FALLBACK_LOGO_PATH, YLADA_OG_UNIFIED_SHARE_CARD_PATH } from '@/lib/ylada-og-fallback-logo'

const YLADA_OG_BASE = YLADA_LINK_OG_IMAGE_DIR
const ESTETICA_SEGMENT_FALLBACK_PATH = `${YLADA_OG_BASE}/estetica-pele.png`

export type ProEsteticaDiagnosisVertical = 'capilar' | 'corporal'

function proEsteticaOgPath(bank: ProEsteticaOgImageBankEntry, filename: string): string {
  return `${bank.imageDir}/${filename}`
}

/**
 * Texto curto para WhatsApp / Open Graph (prioridade sobre `page.subtitle` em `/l/[slug]`).
 */
export function buildProEsteticaLinkOgDescription(input: {
  vertical: ProEsteticaDiagnosisVertical
  linkTitle: string
  bibliotecaDescription?: string | null
  dorPrincipal?: string | null
  objetivoPrincipal?: string | null
}): string {
  const title = (input.linkTitle || '').trim()
  const desc = (input.bibliotecaDescription || '').trim().replace(/\s+/g, ' ')
  if (desc.length >= 40 && desc.length <= 220) {
    return desc.length <= 200 ? desc : `${desc.slice(0, 197)}…`
  }
  if (desc.length > 220) {
    const cut = desc.slice(0, 197).trim()
    const lastSpace = cut.lastIndexOf(' ')
    const head = lastSpace > 80 ? cut.slice(0, lastSpace) : cut
    return `${head}…`
  }
  const dor = (input.dorPrincipal || '').trim()
  if (dor.length >= 12) {
    const lead =
      input.vertical === 'capilar'
        ? 'Couro cabeludo, fios e rotina: em poucos minutos você organiza o relato com clareza.'
        : 'Corpo, hábitos e expectativa: em poucos minutos você vê um primeiro recorte do seu contexto.'
    return `${lead} Foco aqui: ${dor.length > 90 ? `${dor.slice(0, 87)}…` : dor}`
  }
  const obj = (input.objetivoPrincipal || '').trim()
  if (obj.length >= 12) {
    return `Quer ${obj.length > 70 ? `${obj.slice(0, 67)}…` : obj}? Responda em poucos minutos e receba um primeiro direcionamento só seu.`
  }
  const short = title.length > 56 ? `${title.slice(0, 53)}…` : title
  if (input.vertical === 'capilar') {
    return `Responda em poucos minutos e veja um primeiro recorte sobre «${short}» — couro cabeludo, fios e rotina, sem complicar.`
  }
  return `Responda em poucos minutos e veja um primeiro recorte sobre «${short}» — corpo, hábitos e próximo passo com calma.`
}

/** Quando o mapa genérico cai em pele, unhas, logo ou arte facial, força imagem alinhada à vertical Pro Estética. */
export function getProEsteticaPublicOpenGraphImagePath(
  vertical: ProEsteticaDiagnosisVertical,
  tema: string,
  segment: string | null | undefined,
  templateId?: string | null
): string {
  const bank = vertical === 'capilar' ? PRO_ESTETICA_CAPILAR_OG_IMAGE_BANK : PRO_ESTETICA_CORPORAL_OG_IMAGE_BANK
  const partnerOgFallback = YLADA_OG_UNIFIED_SHARE_CARD_PATH
  const tid = typeof templateId === 'string' ? templateId.trim() : ''
  if (tid && bank.byTemplateId[tid]) {
    return proEsteticaOgPath(bank, bank.byTemplateId[tid])
  }
  const themeKey = normalizeYladaOgThemeKey(tema)
  if (themeKey && bank.byNormalizedTheme[themeKey]) {
    return proEsteticaOgPath(bank, bank.byNormalizedTheme[themeKey])
  }

  const p = getYladaOgImagePath(tema, segment)
  if (vertical === 'capilar') {
    if (
      p === ESTETICA_SEGMENT_FALLBACK_PATH ||
      p === YLADA_OG_FALLBACK_LOGO_PATH ||
      /\/estetica-pele|\/estetica-unhas|\/estetica-rejuvenescimento/.test(p)
    ) {
      return partnerOgFallback
    }
  } else {
    if (
      p === ESTETICA_SEGMENT_FALLBACK_PATH ||
      p === YLADA_OG_FALLBACK_LOGO_PATH ||
      /\/estetica-pele|\/estetica-unhas/.test(p)
    ) {
      return partnerOgFallback
    }
  }

  if (p === YLADA_OG_FALLBACK_LOGO_PATH) {
    return partnerOgFallback
  }
  if (p.startsWith(`${YLADA_OG_BASE}/`)) {
    const basename = p.slice(YLADA_OG_BASE.length + 1)
    return proEsteticaOgPath(bank, basename)
  }
  return partnerOgFallback
}

/**
 * Descrição OG quando não há `page.og_description` (ex. links antigos fora do backfill SQL).
 * Só para segmento estética; evita o genérico «Faça o quiz…» em títulos capilar/corporal claros.
 */
export function buildEsteticaAestheticsOgDescriptionFallback(
  title: string,
  themeRaw?: string | null
): string | null {
  const blob = `${(title || '').trim()} ${(themeRaw || '').trim()}`.trim()
  if (!blob) return null
  if (temaTextSuggestsCapilarOg(blob)) {
    const short = title.length > 78 ? `${title.slice(0, 75)}…` : title.trim()
    return `Queda, couro ou rotina atrapalhando? Responda em poucos minutos e veja um primeiro recorte sobre «${short}» — foco fios e couro cabeludo, sem misturar com cuidados de pele do rosto.`
  }
  if (temaTextSuggestsCorporalBodyOg(blob)) {
    const short = title.length > 78 ? `${title.slice(0, 75)}…` : title.trim()
    return `Corpo e hábitos: responda em poucos minutos e receba um primeiro encaixe sobre «${short}» — sem promessa vazia, alinhado ao que você sente no dia a dia.`
  }
  return null
}

export function getProEsteticaPublicOpenGraphImageUrl(
  vertical: ProEsteticaDiagnosisVertical,
  tema: string,
  segment: string | null | undefined,
  baseUrl: string,
  templateId?: string | null
): string {
  const path = getProEsteticaPublicOpenGraphImagePath(vertical, tema, segment, templateId)
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

export function applyProEsteticaPublicLinkOgMetadata(
  configJson: Record<string, unknown>,
  input: {
    vertical: ProEsteticaDiagnosisVertical
    linkTitle: string
    bibliotecaDescription?: string | null
    dorPrincipal?: string | null
    objetivoPrincipal?: string | null
  }
): void {
  const og = buildProEsteticaLinkOgDescription(input)
  const pageExisting =
    configJson.page && typeof configJson.page === 'object' && !Array.isArray(configJson.page)
      ? (configJson.page as Record<string, unknown>)
      : {}
  const existingOg =
    typeof pageExisting.og_description === 'string' ? pageExisting.og_description.trim() : ''
  configJson.page = {
    ...pageExisting,
    og_description: existingOg || og,
  }
  const metaExisting =
    configJson.meta && typeof configJson.meta === 'object' && !Array.isArray(configJson.meta)
      ? (configJson.meta as Record<string, unknown>)
      : {}
  configJson.meta = {
    ...metaExisting,
    diagnosis_vertical: input.vertical,
  }
}
