/**
 * Quiz profissional Nutra — funil matriz /pt/nutra.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { NUTRA_DEMO_CLIENTE_NICHOS } from '@/lib/nutra-demo-cliente-data'

export const NUTRA_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=nutra'
export const NUTRA_QUIZ_VER_PRATICA_HREF = '/pt/nutra/quiz/ver-pratica'
export const NUTRA_QUIZ_LOGIN_HREF = '/pt/nutra/login'

const NUTRA_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  emagrecimento: 'emagrecimento e composição',
  hipertrofia: 'hipertrofia e suplementação',
  energia: 'energia e disposição',
  pele_cabelo: 'pele e cabelo',
  imunidade: 'imunidade e bem-estar',
  esporte: 'esporte e performance',
}

export function getNutraQuizLabelForNicho(nicho: string): string {
  return NUTRA_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Nutra'
}

export function getNutraQuizQuestionsForNicho(nicho: string) {
  const label = getNutraQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, NUTRA_QUIZ_NICHO_CONTEXTO, nicho)
}

export const NUTRA_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const NUTRA_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar fechando mais com contexto no Zap',
  subLines: [
    'Pare de explicar produto no vácuo',
    'Faça seu cliente chegar mais pronto pra decidir',
    'Você vai entender na hora quando ver',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro: 'Em seguida: onde você atua e o fluxo como seu cliente veria',
} as const
