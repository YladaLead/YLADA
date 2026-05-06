import { getYladaOgImagePath } from '@/lib/ylada-og-tema-imagem'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

const OG_BASE = '/images/og/ylada'
const ESTETICA_SEGMENT_FALLBACK_PATH = `${OG_BASE}/estetica-pele.png`

export type ProEsteticaDiagnosisVertical = 'capilar' | 'corporal'

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

/** Quando o mapa genérico cai em pele ou logo, força arte alinhada à linha Pro Estética. */
export function getProEsteticaPublicOpenGraphImagePath(
  vertical: ProEsteticaDiagnosisVertical,
  tema: string,
  segment: string | null | undefined
): string {
  const p = getYladaOgImagePath(tema, segment)
  if (p === ESTETICA_SEGMENT_FALLBACK_PATH || p === YLADA_OG_FALLBACK_LOGO_PATH) {
    return vertical === 'capilar' ? `${OG_BASE}/estetica-cabelos.png` : `${OG_BASE}/estetica-corporal.jpg`
  }
  return p
}

export function getProEsteticaPublicOpenGraphImageUrl(
  vertical: ProEsteticaDiagnosisVertical,
  tema: string,
  segment: string | null | undefined,
  baseUrl: string
): string {
  const path = getProEsteticaPublicOpenGraphImagePath(vertical, tema, segment)
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
