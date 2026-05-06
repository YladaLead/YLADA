import { supabaseAdmin } from '@/lib/supabase'
import {
  DIAGNOSTICO_TEMPLATE_ID,
  proLideresPresetSlug,
  wellnessFluxoToYladaConfigJson,
} from '@/lib/pro-lideres/wellness-fluxo-to-ylada-config'
import { getProLideresRecruitmentPresetFluxos } from '@/lib/pro-lideres/pro-lideres-recruitment-preset-fluxos'
import { getProLideresSalesPresetFluxos } from '@/lib/pro-lideres/pro-lideres-sales-preset-fluxos'
import { getProLideresHypeQuizPresetFluxos } from '@/lib/pro-lideres/pro-lideres-hype-quiz-preset-fluxos'
import { getProLideresHypeCalculadoraPresetFluxos } from '@/lib/pro-lideres/pro-lideres-hype-calculadora-preset-fluxos'
import { ensureWellnessNutritionMirrorsAsProLideresLinks } from '@/lib/pro-lideres/wellness-nutrition-mirror-ensure'
import {
  getProLideresLegacyAguaPresetFluxo,
  isWellnessCalculadoraBasicaPresetFluxoId,
} from '@/lib/pro-lideres/pro-lideres-wellness-calculadoras-basicas-preset-fluxos'
import type { FluxoCliente } from '@/types/wellness-system'

/** Template biblioteca YLADA: calculadora IMC (peso, altura cm, idade, sexo → IMC). */
const CALC_IMC_YLADA_TEMPLATE_ID = 'b1000027-0027-4000-8000-000000000027' as const

type PresetPack = {
  kind: 'sales' | 'recruitment'
  fluxos: FluxoCliente[]
  segment: string
  category: string
}

/**
 * Garante biblioteca base do Pro Líderes em /l/…:
 * - Vendas: mesmos fluxos da área Wellness;
 * - Recrutamento: quizzes/presets Pro Líderes.
 * Sem duplicar slug. Service role; chamado ao montar o catálogo.
 */
export async function ensureProLideresPresetYladaLinks(ownerUserId: string): Promise<void> {
  if (!supabaseAdmin || !ownerUserId) return

  const packs: PresetPack[] = [
    {
      kind: 'sales',
      fluxos: getProLideresSalesPresetFluxos(),
      segment: 'wellness',
      category: 'vendas',
    },
    {
      kind: 'sales',
      fluxos: [...getProLideresHypeQuizPresetFluxos(), ...getProLideresHypeCalculadoraPresetFluxos()],
      segment: 'hype',
      /** Coluna `category` como vendas: HYPE fica no funil Vendas no catálogo Pro Líderes. */
      category: 'vendas',
    },
    {
      kind: 'recruitment',
      fluxos: getProLideresRecruitmentPresetFluxos(),
      segment: 'recrutamento',
      category: 'recrutamento',
    },
  ]

  const { data: imcTemplateRow } = await supabaseAdmin
    .from('ylada_link_templates')
    .select('schema_json')
    .eq('id', CALC_IMC_YLADA_TEMPLATE_ID)
    .maybeSingle()

  const imcSchemaJson = imcTemplateRow?.schema_json
  const imcCalculatorSchema: Record<string, unknown> | null =
    imcSchemaJson && typeof imcSchemaJson === 'object' && !Array.isArray(imcSchemaJson)
      ? { ...(imcSchemaJson as Record<string, unknown>) }
      : null

  if (!imcCalculatorSchema) {
    console.warn(
      '[ensureProLideresPresetYladaLinks] schema_json do template IMC não encontrado; preset calc-imc cairá no fluxo diagnóstico legado.'
    )
  }

  const { data: existingRows, error: listError } = await supabaseAdmin
    .from('ylada_links')
    .select('slug')
    .eq('user_id', ownerUserId)

  if (listError) {
    console.warn('[ensureProLideresPresetYladaLinks] list:', listError.message)
    return
  }

  const existingSlugs = new Set((existingRows ?? []).map((r) => r.slug as string))

  for (const pack of packs) {
    for (const fluxo of pack.fluxos) {
      const slug = proLideresPresetSlug(ownerUserId, pack.kind, fluxo.id)
      const useRealImcCalculator = fluxo.id === 'calc-imc' && imcCalculatorSchema !== null
      const config_json: Record<string, unknown> = useRealImcCalculator
        ? {
            ...imcCalculatorSchema,
            title: fluxo.nome,
            meta: {
              pro_lideres_preset: true,
              pro_lideres_fluxo_id: fluxo.id,
              pro_lideres_kind: pack.kind,
              objective: pack.kind === 'recruitment' ? 'propagar' : 'educar',
              area_profissional: 'wellness',
            },
          }
        : wellnessFluxoToYladaConfigJson(fluxo, pack.kind)

      /** Links já criados: atualiza `config_json` quando o preset canónico muda (vendas selecionados + todo recrutamento). */
      if (existingSlugs.has(slug)) {
        const refreshHypePresetConfig =
          pack.kind === 'sales' && pack.segment === 'hype' && !useRealImcCalculator
        const refreshSalesPresetConfig =
          pack.kind === 'sales' &&
          !useRealImcCalculator &&
          (refreshHypePresetConfig ||
            (pack.segment === 'wellness' &&
              (isWellnessCalculadoraBasicaPresetFluxoId(fluxo.id) || fluxo.id === 'avaliacao-perfil-metabolico')))
        const refreshRecruitmentPresetConfig = pack.kind === 'recruitment' && !useRealImcCalculator
        if (refreshSalesPresetConfig || refreshRecruitmentPresetConfig) {
          const { error: updateError } = await supabaseAdmin
            .from('ylada_links')
            .update({
              config_json,
              title: fluxo.nome,
              segment: pack.segment,
              category: pack.category,
            })
            .eq('user_id', ownerUserId)
            .eq('slug', slug)
          if (updateError) {
            console.warn('[ensureProLideresPresetYladaLinks] update preset', slug, updateError.message)
          }
        }
        continue
      }

      const { error: insertError } = await supabaseAdmin.from('ylada_links').insert({
        user_id: ownerUserId,
        template_id: useRealImcCalculator ? CALC_IMC_YLADA_TEMPLATE_ID : DIAGNOSTICO_TEMPLATE_ID,
        slug,
        title: fluxo.nome,
        segment: pack.segment,
        category: pack.category,
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

  /** Preset canónico é `calc-hidratacao`; quem ainda tem `…-v-agua` criado antes recebe o mesmo JSON novo. */
  const legacyAguaSlug = proLideresPresetSlug(ownerUserId, 'sales', 'agua')
  if (existingSlugs.has(legacyAguaSlug)) {
    const aguaFluxo = getProLideresLegacyAguaPresetFluxo()
    const legacyConfig = wellnessFluxoToYladaConfigJson(aguaFluxo, 'sales')
    const { error: legacyUp } = await supabaseAdmin
      .from('ylada_links')
      .update({
        config_json: legacyConfig,
        title: aguaFluxo.nome,
        segment: 'wellness',
        category: 'vendas',
      })
      .eq('user_id', ownerUserId)
      .eq('slug', legacyAguaSlug)
    if (legacyUp) {
      console.warn('[ensureProLideresPresetYladaLinks] update legacy agua', legacyAguaSlug, legacyUp.message)
    }
  }

  await ensureWellnessNutritionMirrorsAsProLideresLinks(ownerUserId, existingSlugs)
}
