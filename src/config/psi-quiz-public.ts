/**
 * Quiz profissional Psicologia — funil matriz /pt/psi (demonstração; não é avaliação clínica).
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { PSI_DEMO_CLIENTE_NICHOS } from '@/lib/psi-demo-cliente-data'

export const PSI_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=psi'
export const PSI_QUIZ_VER_PRATICA_HREF = '/pt/psi/quiz/ver-pratica'
export const PSI_QUIZ_LOGIN_HREF = '/pt/psi/login'

const PSI_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  ansiedade_rotina: 'ansiedade e rotina',
  humor_tristeza: 'humor e tristeza',
  relacionamentos: 'relacionamentos',
  trabalho_burnout: 'trabalho e esgotamento',
  autoestima: 'autoestima',
  luto_mudanca: 'luto e mudanças',
}

export function getPsiQuizLabelForNicho(nicho: string): string {
  return PSI_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Psicologia'
}

export function getPsiQuizQuestionsForNicho(nicho: string) {
  const label = getPsiQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, PSI_QUIZ_NICHO_CONTEXTO, nicho)
}

export const PSI_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const PSI_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar fechando mais primeiras sessões com menos troca vaga',
  subLines: [
    'Pare de explicar terapia só no WhatsApp',
    'Faça a pessoa chegar mais pronta pra conversar',
    'Você vai entender na hora quando ver',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro: 'Em seguida: onde você atua e o fluxo como a pessoa veria (demonstração)',
} as const
