import { getSupabaseAdmin } from '@/lib/supabase'
import {
  PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH,
  PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID,
} from '@/lib/pro-lideres-pre-diagnostico'

/**
 * Arte do diagnóstico pré-reunião (após pagamento) — Pro Líderes.
 * O pré-diagnóstico estratégico mantém `PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH`.
 */
export const PRO_LIDERES_DIAGNOSTICO_PRE_REUNIAO_POS_PAGAMENTO_OG_PATH =
  '/pro-lideres/diagnostico-pre-reuniao-pos-pagamento-og.png' as const

export async function resolveProLideresConsultoriaResponderOgImagePath(token: string): Promise<string> {
  const t = decodeURIComponent((token || '').trim())
  if (!t) return PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH
  const sb = getSupabaseAdmin()
  if (!sb) return PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH

  const { data: link } = await sb
    .from('pro_lideres_consultancy_share_links')
    .select('material_id')
    .eq('token', t)
    .maybeSingle()

  const mid = (link as { material_id?: string } | null)?.material_id
  if (mid === PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID) {
    return PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH
  }
  if (mid) {
    return PRO_LIDERES_DIAGNOSTICO_PRE_REUNIAO_POS_PAGAMENTO_OG_PATH
  }
  return PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH
}
