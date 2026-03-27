/**
 * Quiz profissional Odonto — funil matriz /pt/odonto (com nicho).
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { ODONTO_DEMO_CLIENTE_NICHOS } from '@/lib/odonto-demo-cliente-data'

export const ODONTO_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=odonto'
export const ODONTO_QUIZ_VER_PRATICA_HREF = '/pt/odonto/quiz/ver-pratica'
export const ODONTO_QUIZ_LOGIN_HREF = '/pt/odonto/login'

const ODONTO_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  clareamento: 'estética do sorriso e clareamento',
  implantes: 'implantes e reposição dentária',
  ortodontia: 'ortodontia e alinhamento',
  dor_urgencia: 'dor ou urgência odontológica',
  prevencao: 'prevenção e check-up',
  saude_bucal: 'gengiva, hálito e saúde bucal',
}

export function getOdontoQuizLabelForNicho(nicho: string): string {
  return ODONTO_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Odontologia'
}

export function getOdontoQuizQuestionsForNicho(nicho: string) {
  const label = getOdontoQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, ODONTO_QUIZ_NICHO_CONTEXTO, nicho)
}

export const ODONTO_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const ODONTO_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar preenchendo a agenda com mais tranquilidade',
  subLines: [
    'Pare de tentar conversar',
    'Faça seus pacientes chegarem prontos para fechar',
    'Você entende na hora ao ver seus links personalizados em ação',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro: 'Um exemplo de link personalizado na sequência.',
} as const
