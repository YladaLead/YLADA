/**
 * Contexto editorial do link para pós-processar diagnóstico (tom + funil).
 * Usado após pacote/arquétipo/motor — ver `normalizeDiagnosisDecisionForVisitor`.
 */

export type DiagnosisFunnel = 'wellness_sales' | 'recruitment' | 'generic'

export type DiagnosisVoiceProfile = 'pt_br_simple' | 'default'

export type DiagnosisContentContext = {
  funnel: DiagnosisFunnel
  voice: DiagnosisVoiceProfile
}

/**
 * Deriva funil a partir de `meta` do link (config_json.page.meta ou equivalente).
 * Pro Líderes: `pro_lideres_kind` sales | recruitment; `diagnosis_vertical` pro_lideres → vendas wellness por defeito.
 */
export function resolveDiagnosisContentContext(
  meta: Record<string, unknown> | undefined
): DiagnosisContentContext {
  if (!meta) return { funnel: 'generic', voice: 'default' }

  const pk = typeof meta.pro_lideres_kind === 'string' ? meta.pro_lideres_kind.trim().toLowerCase() : ''
  if (pk === 'recruitment') {
    return { funnel: 'recruitment', voice: 'pt_br_simple' }
  }
  if (pk === 'sales') {
    return { funnel: 'wellness_sales', voice: 'pt_br_simple' }
  }

  const dv = typeof meta.diagnosis_vertical === 'string' ? meta.diagnosis_vertical.trim().toLowerCase() : ''
  if (dv === 'pro_lideres') {
    return { funnel: 'wellness_sales', voice: 'pt_br_simple' }
  }

  const arch = typeof meta.architecture === 'string' ? meta.architecture.trim() : ''
  const segment = typeof meta.segment_code === 'string' ? meta.segment_code.trim().toLowerCase() : ''
  const wellnessish = new Set([
    'nutrition',
    'nutricao',
    'geral',
    'wellness',
    'medicine',
    'fitness',
    'metabolismo',
    'intestino',
    'peso',
    'energia',
    'alimentacao',
    'vitalidade_geral',
  ])
  if (arch === 'RISK_DIAGNOSIS' && wellnessish.has(segment)) {
    return { funnel: 'wellness_sales', voice: 'pt_br_simple' }
  }

  return { funnel: 'generic', voice: 'default' }
}
