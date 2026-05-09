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
 * Nomes **sem** prefixos `quiz_` / `calc_`: slugs em ASCII (hífens) alinhados aos títulos do painel / lista de fluxos corporais (incl. migração **426**).
 * **JPEG 1200×630** (~80% qualidade): melhor para pré-visualização WhatsApp do que PNG pesado de fotografia.
 */
const PRO_ESTETICA_CORPORAL_OG_BY_TEMPLATE_ID: Record<string, string> = {
  'b1000025-0025-4000-8000-000000000025': 'agua-dia-a-dia-quanto-corpo-precisa.jpg',
  'b1000026-0026-4000-8000-000000000026': 'calorias-diarias-alinhe-energia-objetivo-corporal.jpg',
  'b1000027-0027-4000-8000-000000000027': 'imc-contexto-primeiro-passo-esteticista.jpg',
  'b1000028-0028-4000-8000-000000000028': 'proteina-diaria-base-definicao-recuperacao.jpg',
  'b1000031-0031-4000-8000-000000000031': 'hidratacao-treino-clima-meta-copos.jpg',
  'b1000038-0038-4000-8000-000000000038': 'retencao-liquido-corpo-sinais.jpg',
  'b1000044-0044-4000-8000-000000000044': 'pele-cuidados-certos.jpg',
  'b1000046-0046-4000-8000-000000000046': 'celulite-o-que-revela-sobre-corpo.jpg',
  'b1000048-0048-4000-8000-000000000048': 'pele-realmente-hidratada.jpg',
  'b1000050-0050-4000-8000-000000000050': 'sinais-flacidez-ainda-nao-percebeu.jpg',
  'b1000119-0119-4000-8000-000000000119': 'descubra-protocolo-corporal-ideal.jpg',
  'b1000120-0120-4000-8000-000000000120': 'qual-zona-corpo-atencao-primeiro.jpg',
  'b1000121-0121-4000-8000-000000000121': 'corpo-desinchar-definir-tecnologia-primeiro.jpg',
  'b1000122-0122-4000-8000-000000000122': 'gordura-localizada-ou-retencao-caminho.jpg',
  'b1000123-0123-4000-8000-000000000123': 'quantas-sessoes-meta-contorno.jpg',
  'b1000124-0124-4000-8000-000000000124': 'protocolo-corporal-certo-ou-misturando.jpg',
  'b1000125-0125-4000-8000-000000000125': 'tratamento-ajudando-resultado.jpg',
  'b1000126-0126-4000-8000-000000000126': 'corpo-mais-inchado-do-que-deveria.jpg',
  'b1000127-0127-4000-8000-000000000127': 'qual-massagem-corpo-precisa.jpg',
  'b1000142-0142-4000-8000-000000000142': 'drenagem-linfatica-faz-sentido-corpo.jpg',
  'b1000143-0143-4000-8000-000000000143': 'massagem-modeladora-expectativa-realista.jpg',
  'b1000144-0144-4000-8000-000000000144': 'criolipolise-prontidao-duvidas-consulta.jpg',
  'b1000145-0145-4000-8000-000000000145': 'radiofrequencia-corporal-firmeza-textura.jpg',
  'b1000146-0146-4000-8000-000000000146': 'ultrassom-corporal-onde-entra-objetivo.jpg',
  'b1000147-0147-4000-8000-000000000147': 'lipocavitacao-indicacao-expectativa-perfil.jpg',
  'b1000148-0148-4000-8000-000000000148': 'endermologia-textura-circulacao-contorno.jpg',
  'b1000149-0149-4000-8000-000000000149': 'celulite-flacidez-atacar-primeiro.jpg',
  'b1000150-0150-4000-8000-000000000150': 'gordura-localizada-primeiro-passo-esteticista.jpg',
  'b1000151-0151-4000-8000-000000000151': 'detox-corporal-rotina-sensacao-clinica.jpg',
  'b1000192-0192-4000-8000-000000000192': 'black-peel-peeling-hollywood-pele-objetivo.jpg',
  'b1000193-0193-4000-8000-000000000193': 'despigmentacao-tatuagem-micro-labios-expectativa.jpg',
  'b1000194-0194-4000-8000-000000000194': 'clareamento-intimo-axilas-proximo-passo-seguro.jpg',
}

export const PRO_ESTETICA_CORPORAL_OG_IMAGE_BANK: ProEsteticaOgImageBankEntry = {
  imageDir: '/images/og/pro-estetica-corporal',
  byTemplateId: PRO_ESTETICA_CORPORAL_OG_BY_TEMPLATE_ID,
  byNormalizedTheme: {},
}

/**
 * `og:image` por `template_id` — ficheiro em `public/images/og/pro-estetica-capilar/`.
 * Nomes **sem** prefixos `quiz_` / `quiz_capilar_`: slugs em ASCII (hífens) alinhados aos fluxos da biblioteca capilar (migrações **284**, **376–380**).
 * **JPEG 1200×630** para pré-visualização WhatsApp estável (ficheiros menores que PNG de foto).
 */
const PRO_ESTETICA_CAPILAR_OG_BY_TEMPLATE_ID: Record<string, string> = {
  'b1000103-0103-4000-8000-000000000103': 'cabelo-queda.jpg',
  'b1000104-0104-4000-8000-000000000104': 'cabelo-tipo-fio.jpg',
  'b1000105-0105-4000-8000-000000000105': 'couro-cabeludo.jpg',
  'b1000106-0106-4000-8000-000000000106': 'cabelo-hidratacao.jpg',
  'b1000107-0107-4000-8000-000000000107': 'cabelo-tintura.jpg',
  'b1000152-0152-4000-8000-000000000152': 'falhas-entradas-cabelo.jpg',
  'b1000153-0153-4000-8000-000000000153': 'caspa-coceira-couro.jpg',
  'b1000154-0154-4000-8000-000000000154': 'oleosidade-couro-fios.jpg',
  'b1000155-0155-4000-8000-000000000155': 'fios-fracos-quebradicos.jpg',
  'b1000156-0156-4000-8000-000000000156': 'crescimento-capilar-lento.jpg',
  'b1000157-0157-4000-8000-000000000157': 'pos-parto-hormonal-cabelo.jpg',
  'b1000158-0158-4000-8000-000000000158': 'estresse-queda-capilar.jpg',
  'b1000159-0159-4000-8000-000000000159': 'danos-quimicos-capilar.jpg',
  'b1000160-0160-4000-8000-000000000160': 'couro-sensivel-inflamacao.jpg',
  'b1000161-0161-4000-8000-000000000161': 'potencial-crescimento-comprimento.jpg',
  'b1000162-0162-4000-8000-000000000162': 'fortalecimento-preventivo-fios.jpg',
  'b1000163-0163-4000-8000-000000000163': 'terapia-capilar-preventiva.jpg',
  'b1000164-0164-4000-8000-000000000164': 'checkin-saude-couro-cabeludo.jpg',
  'b1000165-0165-4000-8000-000000000165': 'pos-quimica-recuperacao.jpg',
  'b1000166-0166-4000-8000-000000000166': 'rotina-salao-casa-alinhada.jpg',
  'b1000167-0167-4000-8000-000000000167': 'detox-capilar-expectativa.jpg',
  'b1000168-0168-4000-8000-000000000168': 'saude-real-fios-brilho.jpg',
  'b1000169-0169-4000-8000-000000000169': 'qual-terapia-capilar-hub.jpg',
  'b1000170-0170-4000-8000-000000000170': 'microagulhamento-capilar.jpg',
  'b1000171-0171-4000-8000-000000000171': 'laser-capilar.jpg',
  'b1000172-0172-4000-8000-000000000172': 'led-capilar.jpg',
  'b1000173-0173-4000-8000-000000000173': 'ozonioterapia-capilar.jpg',
  'b1000174-0174-4000-8000-000000000174': 'argila-oleos-capilar.jpg',
  'b1000175-0175-4000-8000-000000000175': 'alta-frequencia-capilar.jpg',
  'b1000176-0176-4000-8000-000000000176': 'detox-profundo-salao.jpg',
  'b1000177-0177-4000-8000-000000000177': 'terapia-combinada-capilar.jpg',
  'b1000178-0178-4000-8000-000000000178': 'mitos-queda-capilar.jpg',
  'b1000179-0179-4000-8000-000000000179': 'erros-rotina-capilar.jpg',
  'b1000180-0180-4000-8000-000000000180': 'produtos-uso-errado.jpg',
  'b1000181-0181-4000-8000-000000000181': 'frequencia-lavagem-capilar.jpg',
  'b1000182-0182-4000-8000-000000000182': 'habitos-prejudicam-fios.jpg',
  'b1000183-0183-4000-8000-000000000183': 'inflamacao-couro-educativo.jpg',
  'b1000184-0184-4000-8000-000000000184': 'hormonios-cabelo-educativo.jpg',
  'b1000185-0185-4000-8000-000000000185': 'tres-sinais-atencao-couro.jpg',
  'b1000186-0186-4000-8000-000000000186': 'queda-sazonal-capilar.jpg',
  'b1000187-0187-4000-8000-000000000187': 'pos-verao-capilar.jpg',
  'b1000188-0188-4000-8000-000000000188': 'pos-progressiva-alisamento.jpg',
  'b1000189-0189-4000-8000-000000000189': 'menopausa-cabelo.jpg',
  'b1000190-0190-4000-8000-000000000190': 'fim-ano-estresse-capilar.jpg',
  'b1000191-0191-4000-8000-000000000191': 'masculino-entradas-capilar.jpg',
}

export const PRO_ESTETICA_CAPILAR_OG_IMAGE_BANK: ProEsteticaOgImageBankEntry = {
  imageDir: '/images/og/pro-estetica-capilar',
  byTemplateId: PRO_ESTETICA_CAPILAR_OG_BY_TEMPLATE_ID,
  byNormalizedTheme: {},
}
