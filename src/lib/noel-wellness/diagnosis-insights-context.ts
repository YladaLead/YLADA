/**
 * Contexto de insights coletivos (diagnosis_insights) para o Noel Analista.
 * Permite que o Noel use padrões observados em diagnósticos anteriores para enriquecer respostas.
 *
 * Uso: quando intent = diagnostico ou mensagem menciona resultado de diagnóstico.
 * Ver: docs/NOEL-MAPA-COMPLETO-BIBLIOTECA.md
 */

import { supabaseAdmin } from '@/lib/supabase'

const MAX_INSIGHTS = 3

/**
 * Busca insights por diagnostic_id, ordenados por conversion_rate (melhores primeiro).
 * Retorna texto formatado para o prompt ou null se não houver resultados.
 */
export async function getDiagnosisInsightsContext(diagnosticId: string): Promise<string | null> {
  if (!diagnosticId?.trim()) return null

  try {
    const { data, error } = await supabaseAdmin
      .from('diagnosis_insights')
      .select('insight_text')
      .eq('diagnostic_id', diagnosticId.trim())
      .order('conversion_rate', { ascending: false })
      .limit(MAX_INSIGHTS)

    if (error) {
      console.warn('[Noel] getDiagnosisInsightsContext query error:', error.message)
      return null
    }

    const texts = (data ?? []).map((row) => row.insight_text).filter((t): t is string => !!t?.trim())
    if (texts.length === 0) return null

    const lines = texts.map((t) => `- ${t.trim()}`).join('\n')
    return `Insights observados em diagnósticos semelhantes:\n\n${lines}`
  } catch (e) {
    console.warn('[Noel] getDiagnosisInsightsContext erro:', e)
    return null
  }
}

/** UUID fixo usado no seed 265 quando não há diagnostic_id na sessão (insights gerais). */
export const FALLBACK_DIAGNOSTIC_ID_INSIGHTS = '00000000-0000-0000-0000-000000000001'
