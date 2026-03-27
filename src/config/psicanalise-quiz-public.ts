/**
 * Quiz profissional Psicanálise — funil matriz /pt/psicanalise.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { YLADA_QUIZ_POST_RESULT_COPY } from '@/config/ylada-quiz-result-post-copy'
import { PSICANALISE_DEMO_CLIENTE_NICHOS } from '@/lib/psicanalise-demo-cliente-data'

export const PSICANALISE_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=psicanalise'
export const PSICANALISE_QUIZ_VER_PRATICA_HREF = '/pt/psicanalise/quiz/ver-pratica'
export const PSICANALISE_QUIZ_LOGIN_HREF = '/pt/psicanalise/login'

const PSICANALISE_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  inicio_processo: 'início no processo analítico',
  inquietacao_sofrimento: 'inquietação e sofrimento',
  relacoes_vinculos: 'relações e vínculos',
  luto_mudanca: 'luto e mudanças',
  trabalho_sentido: 'trabalho e sentido',
  duvidas_formato: 'formato e frequência da análise',
}

export function getPsicanaliseQuizLabelForNicho(nicho: string): string {
  return PSICANALISE_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Psicanálise'
}

export function getPsicanaliseQuizQuestionsForNicho(nicho: string) {
  const label = getPsicanaliseQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, PSICANALISE_QUIZ_NICHO_CONTEXTO, nicho)
}

export const PSICANALISE_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const PSICANALISE_QUIZ_RESULT_COPY = { ...YLADA_QUIZ_POST_RESULT_COPY } as const
