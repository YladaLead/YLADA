/**
 * Quiz profissional Medicina — funil matriz /pt/med (demonstração; não é triagem clínica).
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { MED_DEMO_CLIENTE_NICHOS } from '@/lib/med-demo-cliente-data'

export const MED_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=med'
export const MED_QUIZ_VER_PRATICA_HREF = '/pt/med/quiz/ver-pratica'
export const MED_QUIZ_LOGIN_HREF = '/pt/med/login'

const MED_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  rotina: 'consulta de rotina',
  preventivo: 'prevenção e check-up',
  sintomas_leves: 'sintomas leves',
  cronico: 'condições crônicas',
  encaminhamento: 'exames e encaminhamento',
  familia: 'saúde da família',
}

export function getMedQuizLabelForNicho(nicho: string): string {
  return MED_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Medicina'
}

export function getMedQuizQuestionsForNicho(nicho: string) {
  const label = getMedQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, MED_QUIZ_NICHO_CONTEXTO, nicho)
}

export const MED_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const MED_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar organizando a agenda com menos ruído no WhatsApp',
  subLines: [
    'Pare de tentar conversar',
    'Faça seus pacientes chegarem prontos para fechar',
    'Você entende na hora ao ver seus links personalizados em ação',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro: 'Um exemplo de link personalizado na sequência.',
} as const
