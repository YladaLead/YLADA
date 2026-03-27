import {
  FITNESS_QUIZ_LOGIN_HREF,
  FITNESS_QUIZ_QUESTIONS,
  FITNESS_QUIZ_RESULT_COPY,
  FITNESS_QUIZ_VER_PRATICA_HREF,
  getFitnessQuizQuestionsForNicho,
} from '@/config/fitness-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { FITNESS_DEMO_CLIENTE_NICHOS } from '@/lib/fitness-demo-cliente-data'

function isValidFitnessNicho(v: string | null): v is string {
  return !!v && FITNESS_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildFitnessPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'fitness',
    pathPrefix: '/pt/fitness',
    sessionStorageKey: 'ylada_fitness_quiz_respostas_v1',
    homePath: '/pt/fitness/home',
    logoHref: '/pt',
    loginHref: FITNESS_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: FITNESS_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: FITNESS_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual nicho você atua no fitness?',
    resultCopy: FITNESS_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'fitness_entrada_nicho',
      quizStep: 'fitness_quiz_step',
      quizConcluiu: 'fitness_quiz_concluiu',
      cadastroPromoCta: 'fitness_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidFitnessNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getFitnessQuizQuestionsForNicho(nicho)
      }
      return FITNESS_QUIZ_QUESTIONS
    },
  }
}
