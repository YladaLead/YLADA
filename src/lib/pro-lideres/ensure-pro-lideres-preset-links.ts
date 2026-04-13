import { supabaseAdmin } from '@/lib/supabase'
import {
  DIAGNOSTICO_TEMPLATE_ID,
  proLideresPresetSlug,
  wellnessFluxoToYladaConfigJson,
} from '@/lib/pro-lideres/wellness-fluxo-to-ylada-config'
import { getProLideresRecruitmentPresetFluxos } from '@/lib/pro-lideres/pro-lideres-recruitment-preset-fluxos'

/**
 * Garante links YLADA (/l/…) de recrutamento para o dono (3 quizzes + 2 fluxos Wellness),
 * iguais aos outros diagnósticos: template diagnóstico, RISK_DIAGNOSIS, perguntas e resultado.
 * Sem duplicar slug. Service role; chamado ao montar o catálogo Pro Líderes.
 */
export async function ensureProLideresPresetYladaLinks(ownerUserId: string): Promise<void> {
  if (!supabaseAdmin || !ownerUserId) return

  const fluxos = getProLideresRecruitmentPresetFluxos()
  if (!fluxos.length) return

  const { data: existingRows, error: listError } = await supabaseAdmin
    .from('ylada_links')
    .select('slug')
    .eq('user_id', ownerUserId)

  if (listError) {
    console.warn('[ensureProLideresPresetYladaLinks] list:', listError.message)
    return
  }

  const existingSlugs = new Set((existingRows ?? []).map((r) => r.slug as string))

  for (const fluxo of fluxos) {
    const slug = proLideresPresetSlug(ownerUserId, 'recruitment', fluxo.id)
    if (existingSlugs.has(slug)) continue

    const config_json = wellnessFluxoToYladaConfigJson(fluxo, 'recruitment')

    const { error: insertError } = await supabaseAdmin.from('ylada_links').insert({
      user_id: ownerUserId,
      template_id: DIAGNOSTICO_TEMPLATE_ID,
      slug,
      title: fluxo.nome,
      segment: 'recrutamento',
      category: 'recrutamento',
      config_json,
      status: 'active',
    })

    if (insertError) {
      console.warn('[ensureProLideresPresetYladaLinks] insert', slug, insertError.message)
      continue
    }
    existingSlugs.add(slug)
  }
}
