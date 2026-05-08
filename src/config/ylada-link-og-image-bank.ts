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

/**
 * `og:image` por `template_id` — ficheiro em `public/images/og/pro-estetica-corporal/`.
 * Questionários: `quiz_<slug>.png` (slug alinhado ao fluxo; ver `ylada_link_templates.name` quando já começa por `quiz_`).
 * Calculadoras: `calc_<slug>.png` (= `name` do template). Placeholders cartão YLADA até trocares arte.
 * Fluxos do painel: `TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CORPORAL_PERMITIDOS` + migrações 348, **426** (b1000192–194).
 */
const PRO_ESTETICA_CORPORAL_OG_BY_TEMPLATE_ID: Record<string, string> = {
  'b1000025-0025-4000-8000-000000000025': 'calc_agua.png',
  'b1000026-0026-4000-8000-000000000026': 'calc_calorias.png',
  'b1000027-0027-4000-8000-000000000027': 'calc_imc.png',
  'b1000028-0028-4000-8000-000000000028': 'calc_proteina.png',
  'b1000031-0031-4000-8000-000000000031': 'calc_hidratacao_avancada.png',
  'b1000038-0038-4000-8000-000000000038': 'quiz_retencao_liquido.png',
  'b1000044-0044-4000-8000-000000000044': 'quiz_cuidados_pele_certos.png',
  'b1000046-0046-4000-8000-000000000046': 'quiz_causa_celulite.png',
  'b1000048-0048-4000-8000-000000000048': 'quiz_pele_hidratada.png',
  'b1000050-0050-4000-8000-000000000050': 'quiz_sinais_flacidez.png',
  'b1000119-0119-4000-8000-000000000119': 'quiz_prontidao_protocolo_corporal.png',
  'b1000120-0120-4000-8000-000000000120': 'quiz_mapa_zonas_corpo.png',
  'b1000121-0121-4000-8000-000000000121': 'quiz_drenagem_modeladora_tecnologia_corporal.png',
  'b1000122-0122-4000-8000-000000000122': 'quiz_qual_tecnologia_corporal.png',
  'b1000123-0123-4000-8000-000000000123': 'calc_expectativa_sessoes_corporal.png',
  'b1000124-0124-4000-8000-000000000124': 'quiz_protocolo_camadas_corporal.png',
  'b1000125-0125-4000-8000-000000000125': 'quiz_agenda_sessoes_corporal.png',
  'b1000126-0126-4000-8000-000000000126': 'quiz_alivio_corporal_retencao_habitos.png',
  'b1000127-0127-4000-8000-000000000127': 'quiz_perfil_massagem_estetica_corporal.png',
  'b1000142-0142-4000-8000-000000000142': 'quiz_drenagem_linfatica_indicacao_corporal.png',
  'b1000143-0143-4000-8000-000000000143': 'quiz_massagem_modeladora_expectativa_corporal.png',
  'b1000144-0144-4000-8000-000000000144': 'quiz_criolipolise_prontidao_corporal.png',
  'b1000145-0145-4000-8000-000000000145': 'quiz_radiofrequencia_corporal_protocolo.png',
  'b1000146-0146-4000-8000-000000000146': 'quiz_ultrassom_corporal_foco_corporal.png',
  'b1000147-0147-4000-8000-000000000147': 'quiz_lipocavitacao_indicacao_corporal.png',
  'b1000148-0148-4000-8000-000000000148': 'quiz_endermologia_celulite_corporal.png',
  'b1000149-0149-4000-8000-000000000149': 'quiz_celulite_flacidez_prioridade_corporal.png',
  'b1000150-0150-4000-8000-000000000150': 'quiz_gordura_localizada_primeiro_passo_corporal.png',
  'b1000151-0151-4000-8000-000000000151': 'quiz_detox_corporal_rotina_corporal.png',
  'b1000192-0192-4000-8000-000000000192': 'quiz_black_peel_hollywood_facial_corporal.png',
  'b1000193-0193-4000-8000-000000000193': 'quiz_despigmentacao_tatuagem_micro_corporal.png',
  'b1000194-0194-4000-8000-000000000194': 'quiz_clareamento_intimo_axilas_corporal.png',
}

export const PRO_ESTETICA_CORPORAL_OG_IMAGE_BANK: ProEsteticaOgImageBankEntry = {
  imageDir: '/images/og/pro-estetica-corporal',
  byTemplateId: PRO_ESTETICA_CORPORAL_OG_BY_TEMPLATE_ID,
  byNormalizedTheme: {},
}

export const PRO_ESTETICA_CAPILAR_OG_IMAGE_BANK: ProEsteticaOgImageBankEntry = {
  imageDir: '/images/og/pro-estetica-capilar',
  byTemplateId: {},
  byNormalizedTheme: {},
}
