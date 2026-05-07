/**
 * Etapa 1 — fonte canônica de fluxo para links públicos (`/l/[slug]`).
 *
 * Quando `config_json.meta.canonical_template_id` OU `meta.canonical_flow_id` estiver definido,
 * buscamos o `schema_json` em `ylada_link_templates` e mesclamos **apenas chaves ausentes ou vazias**
 * na instância do link (a instância continua mandando em conflito — zero risco para links legados).
 *
 * `canonical_flow_id` resolve via `ylada_biblioteca_itens.flow_id` → `template_id` (primeiro item ativo).
 *
 * @see fetchPublicLinkPayload em `src/app/l/[slug]/public-link-utils.ts`
 */
import type { SupabaseClient } from '@supabase/supabase-js'

function isEmptyConfigValue(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0
  return false
}

/**
 * Mescla valores canônicos só onde a instância não tem dado útil.
 * Não sobrescreve `meta` da instância (Pro Líderes, segmento, architecture, etc.).
 */
export function mergeMissingCanonicalSchemaIntoInstance(
  canonical: Record<string, unknown>,
  instance: Record<string, unknown>
): Record<string, unknown> {
  return mergeMissingCanonicalValues(canonical, instance) as Record<string, unknown>
}

function mergeMissingCanonicalValues(canonical: unknown, instance: unknown): unknown {
  if (canonical === undefined || canonical === null) return instance
  if (instance === undefined || instance === null) return canonical

  if (Array.isArray(canonical)) {
    if (!Array.isArray(instance) || instance.length === 0) return canonical
    return instance
  }

  if (typeof canonical !== 'object' || typeof instance !== 'object') {
    return isEmptyConfigValue(instance) ? canonical : instance
  }

  const c = canonical as Record<string, unknown>
  const i = instance as Record<string, unknown>
  const out: Record<string, unknown> = { ...i }

  for (const [key, canonicalVal] of Object.entries(c)) {
    if (key === 'meta') continue

    if (!(key in i) || isEmptyConfigValue(i[key])) {
      if (canonicalVal !== undefined) out[key] = canonicalVal
      continue
    }

    const instVal = i[key]
    if (
      canonicalVal !== null &&
      typeof canonicalVal === 'object' &&
      !Array.isArray(canonicalVal) &&
      instVal !== null &&
      typeof instVal === 'object' &&
      !Array.isArray(instVal)
    ) {
      out[key] = mergeMissingCanonicalValues(canonicalVal, instVal) as Record<string, unknown>
    }
  }

  return out
}

async function resolveTemplateIdFromBibliotecaFlowId(
  admin: SupabaseClient,
  flowId: string
): Promise<string | null> {
  const { data, error } = await admin
    .from('ylada_biblioteca_itens')
    .select('template_id')
    .eq('flow_id', flowId)
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.warn('[canonical-flow] Falha ao resolver flow_id na biblioteca:', flowId, error.message)
    return null
  }
  const tid = data?.template_id
  return typeof tid === 'string' && tid.trim() ? tid.trim() : null
}

/**
 * Enriquece `config_json` do link com schema canônico quando referenciado.
 * Sem referência canônica → retorna o mesmo objeto (referência estável).
 */
export async function resolvePublicLinkConfigJson(
  admin: SupabaseClient,
  instanceConfig: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const meta = (instanceConfig.meta as Record<string, unknown> | undefined) ?? {}
  const canonicalTemplateId =
    typeof meta.canonical_template_id === 'string' ? meta.canonical_template_id.trim() : ''
  const canonicalFlowId =
    typeof meta.canonical_flow_id === 'string' ? meta.canonical_flow_id.trim() : ''

  let templateId = canonicalTemplateId
  if (!templateId && canonicalFlowId) {
    templateId = (await resolveTemplateIdFromBibliotecaFlowId(admin, canonicalFlowId)) ?? ''
  }

  if (!templateId) return instanceConfig

  const { data: tmpl, error } = await admin
    .from('ylada_link_templates')
    .select('id, schema_json, active')
    .eq('id', templateId)
    .maybeSingle()

  if (error) {
    console.warn('[canonical-flow] Erro ao carregar template', templateId, error.message)
    return instanceConfig
  }
  if (!tmpl?.schema_json || tmpl.active === false) {
    console.warn('[canonical-flow] Template inexistente, sem schema ou inativo:', templateId)
    return instanceConfig
  }

  const canonical = tmpl.schema_json as Record<string, unknown>
  return mergeMissingCanonicalSchemaIntoInstance(canonical, instanceConfig)
}

/** Templates `ylada_link_templates` — mesma entrega que Coach / biblioteca em `/l/...` tipo calculadora. */
export const YLADA_TEMPLATE_CALC_AGUA_ID = 'b1000025-0025-4000-8000-000000000025'
export const YLADA_TEMPLATE_CALC_CALORIAS_ID = 'b1000026-0026-4000-8000-000000000026'
export const YLADA_TEMPLATE_CALC_IMC_ID = 'b1000027-0027-4000-8000-000000000027'
export const YLADA_TEMPLATE_CALC_PROTEINA_ID = 'b1000028-0028-4000-8000-000000000028'

/** Preset vendas Pro Líderes (`pro_lideres_fluxo_id`) → template calculadora da biblioteca (igual Coach). */
export const PRO_LIDERES_VENDAS_FLUXO_LIBRARY_CALC_TEMPLATE: Record<string, string> = {
  agua: YLADA_TEMPLATE_CALC_AGUA_ID,
  'calc-imc': YLADA_TEMPLATE_CALC_IMC_ID,
  'calc-calorias': YLADA_TEMPLATE_CALC_CALORIAS_ID,
  'calc-proteina': YLADA_TEMPLATE_CALC_PROTEINA_ID,
}

const CALCULATOR_INSTANCE_OPTIONAL_KEYS = [
  'ctaText',
  'ctaDefault',
  'introTitle',
  'introSubtitle',
  'introMicro',
  'introBadge',
  'calculatorIntroBadge',
] as const

function mergeLibraryCalculadoraSchemaIntoProLideresInstance(
  schema: Record<string, unknown>,
  config: Record<string, unknown>,
  meta: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...schema }
  merged.meta = { ...meta }

  if (config.page && typeof config.page === 'object') {
    merged.page = config.page
  }

  for (const k of CALCULATOR_INSTANCE_OPTIONAL_KEYS) {
    const v = config[k]
    if (typeof v === 'string' && v.trim()) merged[k] = v
  }

  const result = config.result as { cta?: { text?: string } } | undefined
  const ctaText = result?.cta?.text
  if (typeof ctaText === 'string' && ctaText.trim()) {
    merged.result = { cta: { text: ctaText.trim() } }
  }

  return merged
}

/**
 * Pro Líderes **vendas**: calculadoras básicas usam o mesmo `schema_json` da biblioteca / Coach
 * (`CalculatorBlock`), em vez de `RISK_DIAGNOSIS` / projeção com outro formulário.
 *
 * - Inclui: `agua`, `calc-imc`, `calc-calorias`, `calc-proteina`.
 * - **Não** inclui: `calc-hidratacao` (entrega narrativa por API), nem presets de **recrutamento**.
 */
export async function rewriteProLideresVendasCalculadoraPresetToLibraryTemplate(
  admin: SupabaseClient,
  config: Record<string, unknown>,
  type: 'diagnostico' | 'calculator'
): Promise<{ config: Record<string, unknown>; type: 'diagnostico' | 'calculator' }> {
  const meta = (config.meta as Record<string, unknown>) ?? {}
  if (meta.pro_lideres_preset !== true) return { config, type }

  const kind = typeof meta.pro_lideres_kind === 'string' ? meta.pro_lideres_kind.trim().toLowerCase() : ''
  if (kind === 'recruitment') return { config, type }

  const fid = typeof meta.pro_lideres_fluxo_id === 'string' ? meta.pro_lideres_fluxo_id.trim() : ''
  const templateId = PRO_LIDERES_VENDAS_FLUXO_LIBRARY_CALC_TEMPLATE[fid]
  if (!templateId) return { config, type }

  const { data: tmpl, error } = await admin
    .from('ylada_link_templates')
    .select('schema_json, active')
    .eq('id', templateId)
    .maybeSingle()

  if (error) {
    console.warn('[canonical-flow] rewrite vendas calculadora:', fid, error.message)
    return { config, type }
  }
  if (!tmpl?.schema_json || tmpl.active === false) {
    console.warn('[canonical-flow] rewrite vendas calculadora: template indisponível', templateId)
    return { config, type }
  }

  const schema = tmpl.schema_json as Record<string, unknown>
  return {
    config: mergeLibraryCalculadoraSchemaIntoProLideresInstance(schema, config, meta),
    type: 'calculator',
  }
}

/** @deprecated Use `rewriteProLideresVendasCalculadoraPresetToLibraryTemplate` (cobre água + IMC + calorias + proteína). */
export const rewriteProLideresAguaPresetToLibraryCalculator = rewriteProLideresVendasCalculadoraPresetToLibraryTemplate
