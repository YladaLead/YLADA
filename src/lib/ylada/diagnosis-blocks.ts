/**
 * Blocos de diagnóstico para fábrica de diagnósticos.
 * O Noel combina blocos (theme + problem + audience + promise) para gerar diagnósticos automaticamente.
 * Ver: docs/BIBLIOTECA-INTELIGENTE-DIAGNOSTICOS-BLOCOS.md
 */

import { supabaseAdmin } from '@/lib/supabase'

export type DiagnosisBlockType = 'theme' | 'problem' | 'audience' | 'promise'

export interface DiagnosisBlocksByType {
  theme: string[]
  problem: string[]
  audience: string[]
  promise: string[]
}

/**
 * Busca blocos por segmento. Retorna blocos do segmento OU blocos genéricos (segment_code IS NULL).
 * Ordena por usage_count (mais usados primeiro) para priorizar combinações que funcionam.
 */
export async function getDiagnosisBlocksForSegment(
  segmentCode: string
): Promise<DiagnosisBlocksByType> {
  const empty: DiagnosisBlocksByType = {
    theme: [],
    problem: [],
    audience: [],
    promise: [],
  }

  if (!supabaseAdmin) return empty

  const { data, error } = await supabaseAdmin
    .from('diagnosis_blocks')
    .select('block_type, content')
    .or(`segment_code.eq.${segmentCode},segment_code.is.null`)
    .order('usage_count', { ascending: false })

  if (error) {
    console.warn('[diagnosis-blocks] getDiagnosisBlocksForSegment:', error)
    return empty
  }

  const result: DiagnosisBlocksByType = { ...empty }
  const seen = { theme: new Set<string>(), problem: new Set<string>(), audience: new Set<string>(), promise: new Set<string>() }

  for (const row of data ?? []) {
    const type = row.block_type as DiagnosisBlockType
    const content = row.content as string
    if (type in result && content && !seen[type].has(content)) {
      seen[type].add(content)
      result[type].push(content)
    }
  }

  return result
}

/**
 * Busca blocos por termos (tags). Útil quando o tema vem em texto livre.
 * Ex.: "estética facial" → blocos com tags ['pele','estetica','facial']
 */
export async function getDiagnosisBlocksByTags(
  searchTerms: string[]
): Promise<DiagnosisBlocksByType> {
  const empty: DiagnosisBlocksByType = {
    theme: [],
    problem: [],
    audience: [],
    promise: [],
  }

  if (!supabaseAdmin || searchTerms.length === 0) return empty

  const terms = searchTerms.map((t) => t.toLowerCase().trim()).filter((t) => t.length >= 2)
  if (terms.length === 0) return empty

  const { data, error } = await supabaseAdmin
    .from('diagnosis_blocks')
    .select('block_type, content')
    .overlaps('tags', terms as string[])
    .order('usage_count', { ascending: false })

  if (error) {
    console.warn('[diagnosis-blocks] getDiagnosisBlocksByTags:', error)
    return empty
  }

  const result: DiagnosisBlocksByType = { ...empty }
  const seen = { theme: new Set<string>(), problem: new Set<string>(), audience: new Set<string>(), promise: new Set<string>() }

  for (const row of data ?? []) {
    const type = row.block_type as DiagnosisBlockType
    const content = row.content as string
    if (type in result && content && !seen[type].has(content)) {
      seen[type].add(content)
      result[type].push(content)
    }
  }

  return result
}
