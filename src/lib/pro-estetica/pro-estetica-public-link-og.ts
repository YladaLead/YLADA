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
 * Descrições que soam como nota interna (painel / “compartilhar”) — ruins na prévia do WhatsApp.
 */
export function isWeakOrInternalOgDescriptionForShare(description: string): boolean {
  const d = (description || '').trim()
  if (!d) return false
  const lower = d
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (/contexto\s+para\s+o\s+whatsapp/.test(lower)) return true
  if (/\bconteudo\s+para\s+compartilhar\b/.test(lower)) return true
  if (/\bbom\s+para\s+stories\b/.test(lower)) return true
  if (/\babre\s+conversa\s+tecnica\b/.test(lower)) return true
  if (/^hub:/.test(lower)) return true
  if (/—\s*contexto\.?\s*$/i.test(d)) return true
  if (/\beducacional\s+—\s+sem\s+diagnostico/.test(lower)) return true
  if (/\bsem\s+autodiagnostico\b/.test(lower) && d.length < 95) return true
  return false
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
  const descRaw = (input.bibliotecaDescription || '').trim().replace(/\s+/g, ' ')
  const descUsable =
    descRaw.length > 0 && !isWeakOrInternalOgDescriptionForShare(descRaw) ? descRaw : ''
  if (descUsable.length >= 40 && descUsable.length <= 220) {
    return descUsable.length <= 200 ? descUsable : `${descUsable.slice(0, 197)}…`
  }
  if (descUsable.length > 220) {
    const cut = descUsable.slice(0, 197).trim()
    const lastSpace = cut.lastIndexOf(' ')
    const head = lastSpace > 80 ? cut.slice(0, lastSpace) : cut
    return `${head}…`
  }
  const dor = (input.dorPrincipal || '').trim()
  if (dor.length >= 12) {
    const lead =
      input.vertical === 'capilar'
        ? 'Em poucos minutos você organiza o que está incomodando no cabelo ou no couro — para conversar com a profissional com clareza.'
        : 'Em poucos minutos você vê um primeiro recorte do que está incomodando no corpo — para falar com a profissional sem enrolação.'
    return `${lead} Foco: ${dor.length > 90 ? `${dor.slice(0, 87)}…` : dor}`
  }
  const obj = (input.objetivoPrincipal || '').trim()
  if (obj.length >= 12) {
    return `Quer ${obj.length > 70 ? `${obj.slice(0, 67)}…` : obj}? Responda em poucos minutos e receba um primeiro direcionamento só seu.`
  }
  const short = title.length > 56 ? `${title.slice(0, 53)}…` : title
  if (input.vertical === 'capilar') {
    return `Abra o link e responda em poucos minutos sobre «${short}» — couro, fios e rotina. Se fizer sentido, chame a profissional: você já leva o contexto na mão.`
  }
  return `Abra o link e responda em poucos minutos sobre «${short}» — corpo e hábitos. Depois, se quiser, siga com a profissional com tudo mais claro.`
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
    return `Abra o link, responda em poucos minutos e veja um primeiro recorte sobre «${short}» — foco em fios e couro cabeludo. Quando fizer sentido, é só chamar a profissional: você já chega com o contexto organizado.`
  }
  if (temaTextSuggestsCorporalBodyOg(blob)) {
    const short = title.length > 78 ? `${title.slice(0, 75)}…` : title.trim()
    return `Abra o link e responda em poucos minutos: um primeiro encaixe sobre «${short}» — corpo e hábitos, sem promessa vazia. Depois, se quiser continuar, fale com a profissional com tudo mais claro.`
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

/**
 * Cartão OG dinâmico (texto de gancho para WhatsApp) — rota `GET /l/[slug]/og/pro-estetica`.
 * Copy da imagem vem de `pro-estetica-og-dynamic-card-hooks.ts`, independente do texto do fluxo.
 */
export function getProEsteticaPublicDynamicOgCardImageUrl(baseUrl: string, slug: string): string {
  const root = baseUrl.replace(/\/$/, '')
  const seg = slug.trim()
  return `${root}/l/${seg}/og/pro-estetica`
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
  const keepExisting = existingOg.length > 0 && !isWeakOrInternalOgDescriptionForShare(existingOg)
  configJson.page = {
    ...pageExisting,
    og_description: keepExisting ? existingOg : og,
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
