/**
 * Contexto de dados de intenção (ylada_diagnosis_answers) para o Noel.
 * Permite que o Noel use padrões reais da plataforma para enriquecer respostas.
 * Ex.: "60% das pessoas que querem emagrecer relatam ansiedade como principal dificuldade"
 *
 * @see docs/DADOS-INTENCAO-YLADA.md
 */

import { supabaseAdmin } from '@/lib/supabase'

const MAX_INSIGHTS = 5
const MIN_ANSWERS = 10

/**
 * Busca top respostas por segmento e categoria de intenção.
 * Retorna texto formatado para o prompt ou null se não houver dados suficientes.
 */
export async function getIntentInsightsContext(segment?: string): Promise<string | null> {
  try {
    let query = supabaseAdmin
      .from('v_intent_top_by_segment')
      .select('segment, intent_category, answer_display, cnt, rank')
      .lte('rank', 3)
      .gte('cnt', MIN_ANSWERS)

    if (segment?.trim()) {
      query = query.eq('segment', segment.trim())
    }

    const { data, error } = await query.order('segment').order('intent_category').order('rank')

    if (error) {
      console.warn('[Noel] getIntentInsightsContext query error:', error.message)
      return null
    }

    const rows = (data ?? []).slice(0, MAX_INSIGHTS * 3)
    if (rows.length === 0) return null

    const bySegment = new Map<string, Array<{ category: string; answer: string; cnt: number }>>()
    for (const r of rows) {
      const seg = (r.segment as string) || 'geral'
      if (!bySegment.has(seg)) bySegment.set(seg, [])
      bySegment.get(seg)!.push({
        category: r.intent_category as string,
        answer: String(r.answer_display ?? '').slice(0, 80),
        cnt: (r.cnt as number) ?? 0,
      })
    }

    const lines: string[] = []
    const categoryLabels: Record<string, string> = {
      dificuldade: 'maior dificuldade',
      objetivo: 'objetivo',
      sintoma: 'sintoma',
      barreira: 'barreira',
      tentativa: 'o que já tentou',
      causa: 'causa provável',
      preferencia: 'preferência',
    }

    for (const [seg, items] of bySegment) {
      const segLabel = seg === 'geral' ? 'na plataforma' : `em ${seg}`
      const top = items.slice(0, 3)
      const parts = top.map((i) => {
        const label = categoryLabels[i.category] || i.category
        return `${label} mais citada: "${i.answer}" (${i.cnt} respostas)`
      })
      if (parts.length > 0) {
        lines.push(`Em ${segLabel}: ${parts.join('; ')}.`)
      }
    }

    if (lines.length === 0) return null

    return `Dados de intenção observados na plataforma (baseado em diagnósticos respondidos):\n\n${lines.join('\n')}`
  } catch (e) {
    console.warn('[Noel] getIntentInsightsContext erro:', e)
    return null
  }
}
