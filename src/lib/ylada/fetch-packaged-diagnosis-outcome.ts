/**
 * Busca JSON de diagnóstico em `ylada_flow_diagnosis_outcomes` (por template ou flow + arquétipo).
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DiagnosisArchitecture, DiagnosisVertical } from '@/lib/ylada/diagnosis-types'

export async function fetchPackagedDiagnosisOutcome(
  supabase: SupabaseClient,
  params: {
    templateId: string | null | undefined
    flowId: string | null | undefined
    diagnosisVertical: DiagnosisVertical | undefined
    architecture: DiagnosisArchitecture
    archetypeCode: string
  },
): Promise<Record<string, unknown> | null> {
  const { templateId, flowId, diagnosisVertical, architecture, archetypeCode } = params
  const tid = typeof templateId === 'string' ? templateId.trim() : ''
  const fid = typeof flowId === 'string' ? flowId.trim() : ''

  const tryTemplate = async (): Promise<Record<string, unknown> | null> => {
    if (!tid) return null
    if (diagnosisVertical) {
      const { data, error } = await supabase
        .from('ylada_flow_diagnosis_outcomes')
        .select('content_json')
        .eq('template_id', tid)
        .eq('architecture', architecture)
        .eq('archetype_code', archetypeCode)
        .eq('active', true)
        .eq('diagnosis_vertical', diagnosisVertical)
        .maybeSingle()
      if (error && error.code !== 'PGRST116') console.warn('[fetchPackagedDiagnosisOutcome] template+v', error.message)
      const j = data?.content_json as Record<string, unknown> | undefined
      if (j && typeof j === 'object') return j
    }
    const { data, error } = await supabase
      .from('ylada_flow_diagnosis_outcomes')
      .select('content_json')
      .eq('template_id', tid)
      .eq('architecture', architecture)
      .eq('archetype_code', archetypeCode)
      .eq('active', true)
      .is('diagnosis_vertical', null)
      .maybeSingle()
    if (error && error.code !== 'PGRST116') console.warn('[fetchPackagedDiagnosisOutcome] template', error.message)
    const json = data?.content_json as Record<string, unknown> | undefined
    return json && typeof json === 'object' ? json : null
  }

  const tryFlow = async (): Promise<Record<string, unknown> | null> => {
    if (!fid) return null
    if (diagnosisVertical) {
      const { data, error } = await supabase
        .from('ylada_flow_diagnosis_outcomes')
        .select('content_json')
        .eq('flow_id', fid)
        .eq('architecture', architecture)
        .eq('archetype_code', archetypeCode)
        .eq('active', true)
        .eq('diagnosis_vertical', diagnosisVertical)
        .maybeSingle()
      if (error && error.code !== 'PGRST116') console.warn('[fetchPackagedDiagnosisOutcome] flow+v', error.message)
      const j = data?.content_json as Record<string, unknown> | undefined
      if (j && typeof j === 'object') return j
    }
    const { data, error } = await supabase
      .from('ylada_flow_diagnosis_outcomes')
      .select('content_json')
      .eq('flow_id', fid)
      .eq('architecture', architecture)
      .eq('archetype_code', archetypeCode)
      .eq('active', true)
      .is('diagnosis_vertical', null)
      .maybeSingle()
    if (error && error.code !== 'PGRST116') console.warn('[fetchPackagedDiagnosisOutcome] flow', error.message)
    const json = data?.content_json as Record<string, unknown> | undefined
    return json && typeof json === 'object' ? json : null
  }

  const fromTemplate = await tryTemplate()
  if (fromTemplate) return fromTemplate
  return tryFlow()
}
