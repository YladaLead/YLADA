/**
 * Quiz profissional Coach — funil matriz /pt/coach.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
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

export const COACH_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar fechando mais processos com menos explicação',
  subLines: [
    'Pare de vender coaching no escuro',
    'Faça a pessoa chegar mais pronta pra fechar',
    'Você vai entender na hora quando ver',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro: 'Em seguida: onde você atua e o fluxo como a pessoa veria',
} as const
