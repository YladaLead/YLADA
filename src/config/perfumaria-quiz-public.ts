/**
 * Quiz profissional Perfumaria — funil matriz /pt/perfumaria.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { PERFUMARIA_DEMO_CLIENTE_NICHOS } from '@/lib/perfumaria-demo-cliente-data'

export const PERFUMARIA_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=perfumaria'
export const PERFUMARIA_QUIZ_VER_PRATICA_HREF = '/pt/perfumaria/quiz/ver-pratica'
export const PERFUMARIA_QUIZ_LOGIN_HREF = '/pt/perfumaria/login'

const PERFUMARIA_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  primeira_fragancia: 'primeira compra de fragrância',
  presente: 'presentes e consultoria',
  assinatura_dia: 'uso no dia a dia',
  pele_ou_alergia: 'pele sensível e alergia',
  ocasiao: 'ocasiões especiais',
  familias_olfativas: 'famílias olfativas',
}

export function getPerfumariaQuizLabelForNicho(nicho: string): string {
  return PERFUMARIA_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Perfumaria'
}

export function getPerfumariaQuizQuestionsForNicho(nicho: string) {
  const label = getPerfumariaQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, PERFUMARIA_QUIZ_NICHO_CONTEXTO, nicho)
}

export const PERFUMARIA_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const PERFUMARIA_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar vendendo mais com menos troca vaga',
  subLines: [
    'Pare de adivinhar gosto no WhatsApp',
    'Faça seu cliente chegar mais pronto pra fechar',
    'Você vai entender na hora quando ver',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro: 'Próximo passo: onde você atua, depois um exemplo do fluxo do seu cliente',
} as const
