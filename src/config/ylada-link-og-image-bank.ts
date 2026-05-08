/**
 * Banco de imagens Open Graph para links `/l/[slug]`.
 *
 * Pastas por produto (ficheiros em `public/images/og/…`):
 * - Pró Líderes: `PRO_LIDERES_OG_IMAGE_DIR` — `{stem}.jpg` por `pro_lideres_fluxo_id`.
 *   Sem `pro_lideres_fluxo_id`: `PRO_LIDERES_OG_DEFAULT_SAUDE_FILE` (vendas/saúde) ou `PRO_LIDERES_OG_DEFAULT_RECRUTAMENTO_FILE` (recrutamento), conforme `meta.pro_lideres_kind`.
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

/** OG genérica vendas/saúde (bem-estar, hábito, corpo) — substituir pela arte final em `public/…`. */
export const PRO_LIDERES_OG_DEFAULT_SAUDE_FILE = 'og-default-saude.jpg'

/** OG genérica recrutamento (oportunidade, conversa) — substituir pela arte final. */
export const PRO_LIDERES_OG_DEFAULT_RECRUTAMENTO_FILE = 'og-default-recrutamento.jpg'

/** `pro_lideres_kind` em `config_json.meta`: `sales` → saúde; `recruitment` → recrutamento; resto → saúde. */
export function proLideresOgDefaultFileForKind(kind: string | null | undefined): string {
  const k = (kind ?? '').trim().toLowerCase()
  if (k === 'recruitment') return PRO_LIDERES_OG_DEFAULT_RECRUTAMENTO_FILE
  return PRO_LIDERES_OG_DEFAULT_SAUDE_FILE
}

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
