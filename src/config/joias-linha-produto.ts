/**
 * Linha de produto Joias (separada do foco comercial no funil).
 * Reutiliza a mesma filosofia YLADA; só segmenta contexto para Noel e quiz.
 */

import type { PublicFlowNichoOption } from '@/config/ylada-public-flow-types'

export type JoiasLinhaProduto = 'joia_fina' | 'semijoia' | 'bijuteria'

export const JOIAS_LINHA_QUERY_KEY = 'linha' as const

export const JOIAS_LINHA_OPTIONS: PublicFlowNichoOption[] = [
  { value: 'joia_fina', label: 'Joia fina' },
  { value: 'semijoia', label: 'Semijoias' },
  { value: 'bijuteria', label: 'Bijuterias' },
]

/** Chaves persistidas em ylada_noel_profile.area_specific (segment joias). */
export const JOIAS_AREA_SPECIFIC_JEWELRY_LINE = 'jewelry_line' as const
export const JOIAS_AREA_SPECIFIC_FUNIL_FOCO = 'joias_funil_foco' as const

export function isValidJoiasLinhaProduto(v: string | null): v is JoiasLinhaProduto {
  return v === 'joia_fina' || v === 'semijoia' || v === 'bijuteria'
}

export function labelJoiasLinhaProduto(linha: string | null | undefined): string {
  if (!linha) return ''
  const o = JOIAS_LINHA_OPTIONS.find((x) => x.value === linha)
  return o?.label ?? linha
}

/** Trecho curto para personalização do quiz matriz (matrix-public-quiz-base). */
export function snippetJoiasLinhaParaQuiz(linha: JoiasLinhaProduto | string): string {
  const map: Record<string, string> = {
    joia_fina: 'joias finas e decisão com mais confiança e ticket',
    semijoia: 'semijoias e percepção de qualidade',
    bijuteria: 'bijuterias e volume de opções',
  }
  return map[linha] ?? 'joias e bijuterias'
}
