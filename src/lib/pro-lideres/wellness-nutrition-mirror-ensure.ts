import { supabaseAdmin } from '@/lib/supabase'
import {
  DIAGNOSTICO_TEMPLATE_ID,
  proLideresPresetSlug,
  wellnessFluxoToYladaConfigJson,
} from '@/lib/pro-lideres/wellness-fluxo-to-ylada-config'
import { buildWellnessNutritionMirrorExcludedSlugs } from '@/lib/pro-lideres/wellness-nutrition-mirror-slugs'
import {
  isPedindoDetoxNutritionRow,
  nutritionTemplateRowToFluxoCliente,
  type NutritionTemplateRow,
} from '@/lib/pro-lideres/wellness-nutrition-template-to-fluxo-cliente'

/**
 * Cria links `/l/pl-…` para cada template ativo em `templates_nutrition` que:
 * - tenha perguntas (ou campos) convertíveis;
 * - não seja duplicado dos fluxos TS / HYPE já espelhados.
 */
export async function ensureWellnessNutritionMirrorsAsProLideresLinks(
  ownerUserId: string,
  existingSlugs: Set<string>
): Promise<void> {
  if (!supabaseAdmin || !ownerUserId) return

  const excluded = buildWellnessNutritionMirrorExcludedSlugs()

  const { data: rows, error } = await supabaseAdmin
    .from('templates_nutrition')
    .select('slug, name, type, objective, title, description, content, is_active, profession')
    .eq('is_active', true)
    .eq('profession', 'wellness')

  if (error) {
    console.warn('[ensureWellnessNutritionMirrorsAsProLideresLinks]', error.message)
    return
  }

  for (const row of rows ?? []) {
    const typ = String(row.type ?? '').toLowerCase()
    if (typ !== 'quiz' && typ !== 'calculadora' && typ !== 'planilha') continue

    const slug = String(row.slug ?? '').trim().toLowerCase()
    if (!slug || excluded.has(slug)) continue

    const nutRow: NutritionTemplateRow = {
      slug: row.slug as string,
      name: row.name as string,
      type: row.type as string,
      objective: row.objective as string | null,
      title: row.title as string | null,
      description: row.description as string | null,
      content: row.content,
    }

    if (isPedindoDetoxNutritionRow(nutRow)) continue

    const fluxo = nutritionTemplateRowToFluxoCliente(nutRow)
    if (!fluxo) continue

    /** Presets TS cobrem recrutamento “clássico”; espelhos da BD são vendas (evita duplicar quiz-ganhos etc.). */
    const kind = 'sales' as const
    const plSlug = proLideresPresetSlug(ownerUserId, kind, fluxo.id)
    if (existingSlugs.has(plSlug)) continue

    const config_json = wellnessFluxoToYladaConfigJson(fluxo, kind)

    const { error: insertError } = await supabaseAdmin.from('ylada_links').insert({
      user_id: ownerUserId,
      template_id: DIAGNOSTICO_TEMPLATE_ID,
      slug: plSlug,
      title: fluxo.nome,
      segment: 'wellness',
      category: 'vendas',
      config_json,
      status: 'active',
    })

    if (insertError) {
      console.warn('[ensureWellnessNutritionMirrorsAsProLideresLinks] insert', plSlug, insertError.message)
      continue
    }
    existingSlugs.add(plSlug)
  }
}
