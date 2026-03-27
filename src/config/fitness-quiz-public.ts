/**
 * Quiz profissional Fitness — funil matriz /pt/fitness.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { FITNESS_DEMO_CLIENTE_NICHOS } from '@/lib/fitness-demo-cliente-data'

export const FITNESS_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=fitness'
export const FITNESS_QUIZ_VER_PRATICA_HREF = '/pt/fitness/quiz/ver-pratica'
export const FITNESS_QUIZ_LOGIN_HREF = '/pt/fitness/login'

const FITNESS_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  emagrecimento: 'emagrecimento e treino',
  hipertrofia: 'hipertrofia e musculação',
  condicionamento: 'condicionamento físico',
  retorno_treino: 'retorno ao treino',
  mobilidade: 'mobilidade e movimento',
  esporte: 'esporte e performance',
}

export function getFitnessQuizLabelForNicho(nicho: string): string {
  return FITNESS_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Fitness'
}

export function getFitnessQuizQuestionsForNicho(nicho: string) {
  const label = getFitnessQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, FITNESS_QUIZ_NICHO_CONTEXTO, nicho)
}

export const FITNESS_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const FITNESS_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar fechando mais alunos com menos conversa vaga',
  subLines: [
    'Pare de tentar conversar',
    'Faça seus alunos chegarem mais prontos para fechar',
    'Você entende na hora ao ver seus links personalizados em ação',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro: 'Um exemplo de link personalizado na sequência.',
} as const
