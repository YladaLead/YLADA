import type { Metadata } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
  TEMPLATE_PRE_AVALIACAO_CAPILAR_CLIENTE_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_PRE_DIAGNOSTICO_CORPORAL_ID,
} from '@/lib/estetica-consultoria-form-templates'

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

/** Resolve capilar / corporal / ambos pelo token do link (material fixo ou segmento da clínica). */
export async function resolveEsteticaConsultoriaResponderOgBand(token: string): Promise<EsteticaResponderOgBand> {
  const t = decodeURIComponent((token || '').trim())
  if (!t) return 'unknown'
  const sb = getSupabaseAdmin()
  if (!sb) return 'unknown'

  const { data: link, error: linkErr } = await sb
    .from('ylada_estetica_consultancy_share_links')
    .select('material_id, estetica_consult_client_id')
    .eq('token', t)
    .maybeSingle()
  if (linkErr || !link) return 'unknown'

  const { data: mat, error: matErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('template_key')
    .eq('id', link.material_id as string)
    .maybeSingle()
  if (matErr || !mat) return 'unknown'

  const tk = (mat as { template_key?: string | null }).template_key ?? null
  const fromTpl = templateKeyToResponderOgBand(tk)
  if (fromTpl !== 'unknown') return fromTpl

  const cid = (link as { estetica_consult_client_id?: string | null }).estetica_consult_client_id
  if (!cid) return 'unknown'
  const { data: cli } = await sb
    .from('ylada_estetica_consult_clients')
    .select('segment')
    .eq('id', cid)
    .maybeSingle()
  const seg = String((cli as { segment?: string | null })?.segment ?? '')
    .trim()
    .toLowerCase()
  if (seg === 'capilar') return 'capilar'
  if (seg === 'corporal') return 'corporal'
  if (seg === 'ambos') return 'ambos'
  return 'unknown'
}

/** Título único no cartão WhatsApp / OG (igual ao texto principal da imagem gerada). */
export const ESTETICA_RESPONDER_SHARE_TITLE = 'YLADA Pré-diagnóstico'

/** Texto do cartão (meta description = parágrafo principal na imagem OG). */
export function buildEsteticaResponderShareDescription(band: EsteticaResponderOgBand): string {
  const line = responderOgBandLabel(band)
  return `${line} — questionário confidencial para o seu plano de acompanhamento. Responda com calma; as informações são confidenciais.`
}

/** Metadados OG/Twitter; título fixo. A imagem vem de `opengraph-image.tsx` (mesmo texto). */
export function buildEsteticaConsultoriaResponderShareMetadata(band: EsteticaResponderOgBand): Metadata {
  const base = publicSiteOriginForEsteticaResponderOg()
  const description = buildEsteticaResponderShareDescription(band)

  return {
    metadataBase: new URL(base),
    title: ESTETICA_RESPONDER_SHARE_TITLE,
    description,
    openGraph: {
      title: ESTETICA_RESPONDER_SHARE_TITLE,
      description,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ESTETICA_RESPONDER_SHARE_TITLE,
      description,
    },
  }
}
