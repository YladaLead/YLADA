import type { Metadata } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
} from '@/lib/estetica-consultoria-form-templates'

/**
 * Arte do diagnóstico pré-reunião (após pagamento) — terapia capilar.
 * Não confundir com cartões de pré-diagnóstico / pré-avaliação.
 */
export const ESTETICA_DIAGNOSTICO_PRE_REUNIAO_POS_PAGAMENTO_CAPILAR_OG_PATH =
  '/marketing/estetica-diagnostico-pre-reuniao-pos-pagamento-capilar.png' as const

/** Idem, linha estética corporal. */
export const ESTETICA_DIAGNOSTICO_PRE_REUNIAO_POS_PAGAMENTO_CORPORAL_OG_PATH =
  '/marketing/estetica-diagnostico-pre-reuniao-pos-pagamento-corporal.png' as const

export function esteticaDiagnosticoPosPagamentoOgPath(
  templateKey: string | null | undefined
): string | null {
  if (templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID) {
    return ESTETICA_DIAGNOSTICO_PRE_REUNIAO_POS_PAGAMENTO_CAPILAR_OG_PATH
  }
  if (templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID) {
    return ESTETICA_DIAGNOSTICO_PRE_REUNIAO_POS_PAGAMENTO_CORPORAL_OG_PATH
  }
  return null
}

/** Legado: PNG estático (não usado na meta quando existe `opengraph-image.tsx` na rota). */
export const ESTETICA_CONSULTORIA_RESPONDER_OG_PATH = '/marketing/estetica-consultoria-responder-og.png'

export function publicSiteOriginForEsteticaResponderOg(): string {
  const u =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.trim().replace(/\/$/, '') ||
    ''
  if (u) return u
  const v = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (v) return `https://${v}`
  return 'https://www.ylada.com'
}

/** Linha de contexto (WhatsApp / OG) — alinhada à imagem gerada em `opengraph-image.tsx`. */
export type EsteticaResponderOgBand = 'capilar' | 'corporal' | 'ambos' | 'unknown'

export type EsteticaConsultoriaResponderShareContext = {
  band: EsteticaResponderOgBand
  templateKey: string | null
}

export function templateKeyToResponderOgBand(templateKey: string | null | undefined): EsteticaResponderOgBand {
  if (!templateKey) return 'unknown'
  if (
    templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID ||
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID ||
    templateKey === TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID
  ) {
    return 'capilar'
  }
  if (templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID || templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID) {
    return 'corporal'
  }
  return 'unknown'
}

export function responderOgBandLabel(band: EsteticaResponderOgBand): string {
  switch (band) {
    case 'capilar':
      return 'Terapia capilar'
    case 'corporal':
      return 'Estética corporal'
    case 'ambos':
      return 'Terapia capilar e estética corporal'
    default:
      return 'Consultoria estética'
  }
}

function isDiagnosticoCompletoTemplate(templateKey: string | null | undefined): boolean {
  return templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID || templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID
}

/** Linha curta no cartão OG: diagnóstico longo vs pré — não confundir com Pro Líderes. */
export function responderOgFormKindLabel(templateKey: string | null | undefined): string {
  if (isDiagnosticoCompletoTemplate(templateKey)) {
    return 'Diagnóstico'
  }
  if (
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID ||
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID ||
    templateKey === TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID
  ) {
    return 'Pré-questionário YLADA'
  }
  return 'Questionário YLADA'
}

/** Título do link / OG — distingue diagnóstico completo, pré e linha (capilar vs corporal). */
export function buildEsteticaResponderShareTitle(
  band: EsteticaResponderOgBand,
  templateKey: string | null | undefined
): string {
  const area =
    band === 'capilar' || templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID
      ? 'terapia capilar'
      : band === 'corporal' || templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID
        ? 'estética corporal'
        : band === 'ambos'
          ? 'terapia capilar e estética corporal'
          : null

  if (templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID) {
    return 'Diagnóstico terapia capilar'
  }
  if (templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID) {
    return 'Diagnóstico estética corporal'
  }
  if (templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID) {
    return 'YLADA — Pré-diagnóstico (terapia capilar)'
  }
  if (templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID) {
    return 'YLADA — Pré-diagnóstico (estética corporal)'
  }
  if (templateKey === TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID) {
    return 'YLADA — Pré-avaliação capilar (cliente)'
  }
  if (area) {
    return `YLADA — Questionário (${area})`
  }
  return 'YLADA — Consultoria estética'
}

/** Cor de destaque na imagem OG (capilar vs corporal). */
export function responderOgAccentColor(templateKey: string | null | undefined, band: EsteticaResponderOgBand): string {
  const cap =
    templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID ||
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID ||
    templateKey === TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID ||
    band === 'capilar'
  if (cap) return '#0369a1'
  const corp =
    templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID ||
    templateKey === TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID ||
    band === 'corporal'
  if (corp) return '#047857'
  return '#0369a1'
}

/** Resolve band + template_key numa ida (token do link público). */
export async function resolveEsteticaConsultoriaResponderShareContext(
  token: string
): Promise<EsteticaConsultoriaResponderShareContext> {
  const t = decodeURIComponent((token || '').trim())
  if (!t) {
    return { band: 'unknown', templateKey: null }
  }
  const sb = getSupabaseAdmin()
  if (!sb) {
    return { band: 'unknown', templateKey: null }
  }

  const { data: link, error: linkErr } = await sb
    .from('ylada_estetica_consultancy_share_links')
    .select('material_id, estetica_consult_client_id')
    .eq('token', t)
    .maybeSingle()
  if (linkErr || !link) {
    return { band: 'unknown', templateKey: null }
  }

  const { data: mat, error: matErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('template_key')
    .eq('id', link.material_id as string)
    .maybeSingle()
  if (matErr || !mat) {
    return { band: 'unknown', templateKey: null }
  }

  const tk = (mat as { template_key?: string | null }).template_key ?? null
  const fromTpl = templateKeyToResponderOgBand(tk)
  if (fromTpl !== 'unknown') {
    return { band: fromTpl, templateKey: tk }
  }

  const cid = (link as { estetica_consult_client_id?: string | null }).estetica_consult_client_id
  if (!cid) {
    return { band: 'unknown', templateKey: tk }
  }
  const { data: cli } = await sb
    .from('ylada_estetica_consult_clients')
    .select('segment')
    .eq('id', cid)
    .maybeSingle()
  const seg = String((cli as { segment?: string | null })?.segment ?? '')
    .trim()
    .toLowerCase()
  if (seg === 'capilar') return { band: 'capilar', templateKey: tk }
  if (seg === 'corporal') return { band: 'corporal', templateKey: tk }
  if (seg === 'ambos') return { band: 'ambos', templateKey: tk }
  return { band: 'unknown', templateKey: tk }
}

/** @deprecated Preferir `resolveEsteticaConsultoriaResponderShareContext`. */
export async function resolveEsteticaConsultoriaResponderOgBand(token: string): Promise<EsteticaResponderOgBand> {
  const ctx = await resolveEsteticaConsultoriaResponderShareContext(token)
  return ctx.band
}

/** Texto do cartão (meta description = parágrafo principal na imagem OG). */
export function buildEsteticaResponderShareDescription(
  band: EsteticaResponderOgBand,
  templateKey: string | null | undefined
): string {
  const line = responderOgBandLabel(band)
  if (isDiagnosticoCompletoTemplate(templateKey)) {
    return 'Questionário confidencial. Responda com calma.'
  }
  return `${line} — questionário confidencial para o seu plano de acompanhamento. Responda com calma; as informações são confidenciais.`
}

/** Metadados OG/Twitter; título e descrição alinhados ao `template_key` do material. */
export function buildEsteticaConsultoriaResponderShareMetadata(
  band: EsteticaResponderOgBand,
  templateKey: string | null | undefined
): Metadata {
  const base = publicSiteOriginForEsteticaResponderOg()
  const title = buildEsteticaResponderShareTitle(band, templateKey)
  const description = buildEsteticaResponderShareDescription(band, templateKey)
  const diagOgPath = esteticaDiagnosticoPosPagamentoOgPath(templateKey)
  const diagOgAbs = diagOgPath ? new URL(diagOgPath, `${base}/`).toString() : null

  return {
    metadataBase: new URL(base),
    title,
    description,
    openGraph: {
      title,
      description,
      locale: 'pt_BR',
      type: 'website',
      ...(diagOgAbs
        ? {
            images: [{ url: diagOgAbs, width: 1200, height: 630, alt: title }],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(diagOgAbs ? { images: [diagOgAbs] } : {}),
    },
  }
}

/** Compat: título genérico antigo; não usar para novos fluxos. */
export const ESTETICA_RESPONDER_SHARE_TITLE = 'YLADA — Consultoria estética'
