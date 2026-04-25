/**
 * Quiz Joias & bijuterias — /pt/joias.
 * Linha de produto (URL `linha`): joia fina, semijoia, bijuteria.
 * Foco comercial (URL `nicho`): marca própria, loja online, equipe, iniciando.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { snippetJoiasLinhaParaQuiz } from '@/config/joias-linha-produto'
import { YLADA_QUIZ_POST_RESULT_COPY } from '@/config/ylada-quiz-result-post-copy'
import { JOIAS_DEMO_CLIENTE_NICHOS } from '@/lib/joias-demo-cliente-data'

export const JOIAS_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=joias'
export const JOIAS_QUIZ_VER_PRATICA_HREF = '/pt/joias/quiz/ver-pratica'
export const JOIAS_QUIZ_LOGIN_HREF = '/pt/joias/login'

const JOIAS_QUIZ_FOCO_CONTEXTO: Record<string, string> = {
  marca_propria: 'marca própria e posicionamento',
  loja_online: 'loja online e vitrine digital',
  equipe_revenda: 'equipe e revendedoras',
  iniciando: 'quem está começando no ramo',
}

export function getJoiasQuizLabelForNicho(nicho: string): string {
  return JOIAS_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Joias e bijuterias'
}

function mergeQuizContextSnippet(linhaProduto: string | null | undefined, foco: string): string {
  const focoPart = JOIAS_QUIZ_FOCO_CONTEXTO[foco] ?? 'joias e bijuterias'
  if (linhaProduto && (linhaProduto === 'joia_fina' || linhaProduto === 'semijoia' || linhaProduto === 'bijuteria')) {
    return `${snippetJoiasLinhaParaQuiz(linhaProduto)} — ${focoPart}`
  }
  return focoPart
}

export function getJoiasQuizQuestionsForNicho(foco: string, linhaProduto?: string | null) {
  const label = getJoiasQuizLabelForNicho(foco)
  const merged = mergeQuizContextSnippet(linhaProduto ?? null, foco)
  const ctxMap: Record<string, string> = { [foco]: merged }
  return personalizeMatrixPublicQuizForNicho(label, ctxMap, foco)
}

export const JOIAS_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const JOIAS_QUIZ_RESULT_COPY = { ...YLADA_QUIZ_POST_RESULT_COPY } as const
