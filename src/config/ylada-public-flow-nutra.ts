import {
  NUTRA_QUIZ_LOGIN_HREF,
  NUTRA_QUIZ_QUESTIONS,
  NUTRA_QUIZ_RESULT_COPY,
  NUTRA_QUIZ_VER_PRATICA_HREF,
  getNutraQuizQuestionsForNicho,
} from '@/config/nutra-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { NUTRA_DEMO_CLIENTE_NICHOS } from '@/lib/nutra-demo-cliente-data'

function isValidNutraNicho(v: string | null): v is string {
  return !!v && NUTRA_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildNutraPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'nutra',
    pathPrefix: '/pt/nutra',
    sessionStorageKey: 'ylada_nutra_quiz_respostas_v1',
    homePath: '/pt/nutra/home',
    logoHref: '/pt',
    loginHref: NUTRA_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: NUTRA_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: NUTRA_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Qual é o foco do seu atendimento Nutra?',
    resultCopy: NUTRA_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'nutra_entrada_nicho',
      quizStep: 'nutra_quiz_step',
      quizConcluiu: 'nutra_quiz_concluiu',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidNutraNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getNutraQuizQuestionsForNicho(nicho)
      }
      return NUTRA_QUIZ_QUESTIONS
    },
  }
}
