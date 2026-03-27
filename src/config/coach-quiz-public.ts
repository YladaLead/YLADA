/**
 * Quiz profissional Coach — funil matriz /pt/coach.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { YLADA_QUIZ_POST_RESULT_COPY } from '@/config/ylada-quiz-result-post-copy'
import { COACH_DEMO_CLIENTE_NICHOS } from '@/lib/coach-demo-cliente-data'

export const COACH_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=coach'
export const COACH_QUIZ_VER_PRATICA_HREF = '/pt/coach/quiz/ver-pratica'
export const COACH_QUIZ_LOGIN_HREF = '/pt/coach/login'

const COACH_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  carreira_transicao: 'carreira e transição',
  habitos_bem_estar: 'hábitos e bem-estar',
  relacionamentos: 'relacionamentos',
  empreendedor: 'empreendedorismo',
  autoconfianca: 'autoconfiança',
  proposito: 'propósito e direção',
}

export function getCoachQuizLabelForNicho(nicho: string): string {
  return COACH_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Coach'
}

export function getCoachQuizQuestionsForNicho(nicho: string) {
  const label = getCoachQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, COACH_QUIZ_NICHO_CONTEXTO, nicho)
}

export const COACH_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const COACH_QUIZ_RESULT_COPY = { ...YLADA_QUIZ_POST_RESULT_COPY } as const
