/**
 * Quiz Joias & bijuterias — /pt/joias.
 * Nichos: semijoia, bijuteria, marca, loja online, equipe, iniciando.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { YLADA_QUIZ_POST_RESULT_COPY } from '@/config/ylada-quiz-result-post-copy'
import { JOIAS_DEMO_CLIENTE_NICHOS } from '@/lib/joias-demo-cliente-data'

export const JOIAS_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=joias'
export const JOIAS_QUIZ_VER_PRATICA_HREF = '/pt/joias/quiz/ver-pratica'
export const JOIAS_QUIZ_LOGIN_HREF = '/pt/joias/login'

const JOIAS_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  semijoia: 'semijoias e qualidade percebida',
  bijuteria: 'bijuterias e volume de opções',
  marca_propria: 'marca própria e posicionamento',
  loja_online: 'loja online e vitrine digital',
  equipe_revenda: 'equipe e revendedoras',
  iniciando: 'quem está começando no ramo',
}

export function getJoiasQuizLabelForNicho(nicho: string): string {
  return JOIAS_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Joias e bijuterias'
}

export function getJoiasQuizQuestionsForNicho(nicho: string) {
  const label = getJoiasQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, JOIAS_QUIZ_NICHO_CONTEXTO, nicho)
}

export const JOIAS_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const JOIAS_QUIZ_RESULT_COPY = { ...YLADA_QUIZ_POST_RESULT_COPY } as const
