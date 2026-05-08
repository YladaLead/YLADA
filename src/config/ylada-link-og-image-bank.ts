/**
 * Banco de imagens Open Graph para links `/l/[slug]`.
 *
 * Pastas por produto (ficheiros em `public/images/og/…`):
 * - Pró Líderes: `PRO_LIDERES_OG_IMAGE_DIR` — `{stem}.jpg` por `pro_lideres_fluxo_id`; defaults genéricos: ver `src/lib/pro-lideres/pro-lideres-og-default-assets.ts`.
 * - Pro Estética corporal / capilar: `imageDir` + mapas explícitos; fallback genérico = cartão OG YLADA (`YLADA_OG_UNIFIED_SHARE_CARD_PATH`).
 *
 * Guia: `docs/GUIA-BANCO-IMAGENS-OG-LINKS.md`.
 */

/** Pasta YLADA genérica (outros segmentos / resolução de tema antes de mapear para pasta de produto). */
export const YLADA_LINK_OG_IMAGE_DIR = '/images/og/ylada'

export type YladaLinkOgProductLine = 'pro_lideres' | 'pro_estetica_corporal' | 'pro_estetica_capilar'

/** Todas as OG dos presets Pro Líderes saem desta pasta (`/l/[slug]` com `pro_lideres_preset`). */
export const PRO_LIDERES_OG_IMAGE_DIR = '/images/og/pro-lideres'

/** Legado / seed: cartão logo até trocares (não usado no `og:image` quando há defaults por linha). */
export const PRO_LIDERES_OG_PLACEHOLDER_LOGO_FILE = 'og-placeholder-ylada.jpg'

/**
 * Stem ASCII do `pro_lideres_fluxo_id` para nome de ficheiro (`{stem}.jpg` por defeito).
 * Ex.: `retencao-inchaço` → `retencao-inchaco`.
 */
export function proLideresOgImageStemFromFluxoId(fluxoId: string): string {
  const s = fluxoId
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'sebo'
}

/** Quando o ficheiro deve chamar-se diferente do stem (ex.: `agua` = mesma arte que calculadora de hidratação). */
export const PRO_LIDERES_OG_IMAGE_STEM_OVERRIDE_BY_FLUXO_ID: Record<string, string> = {
  agua: 'calc-hidratacao',
}

/** Ficheiro completo (com extensão) por fluxo — prevalece sobre `{stem}.jpg`. */
export const PRO_LIDERES_OG_IMAGE_FILENAME_OVERRIDE_BY_FLUXO_ID: Record<string, string> = {}

export function proLideresOgImageRelativeFile(fluxoId: string): string {
  const trimmed = fluxoId.trim()
  const byFull = PRO_LIDERES_OG_IMAGE_FILENAME_OVERRIDE_BY_FLUXO_ID[trimmed]
  if (byFull) return byFull
  const stem = PRO_LIDERES_OG_IMAGE_STEM_OVERRIDE_BY_FLUXO_ID[trimmed] ?? proLideresOgImageStemFromFluxoId(trimmed)
  return `${stem}.jpg`
}

export type ProEsteticaOgImageBankEntry = {
  /** Pasta pública do produto, ex. `/images/og/pro-estetica-corporal`. */
  imageDir: string
  byTemplateId: Record<string, string>
  byNormalizedTheme: Record<string, string>
}

export const PRO_ESTETICA_CORPORAL_OG_IMAGE_BANK: ProEsteticaOgImageBankEntry = {
  imageDir: '/images/og/pro-estetica-corporal',
  byTemplateId: {},
  byNormalizedTheme: {},
}

export const PRO_ESTETICA_CAPILAR_OG_IMAGE_BANK: ProEsteticaOgImageBankEntry = {
  imageDir: '/images/og/pro-estetica-capilar',
  byTemplateId: {},
  byNormalizedTheme: {},
}
