/**
 * Config do funil público Nutri (matriz) — paridade com Estética.
 */

import {
  NUTRI_QUIZ_LOGIN_HREF,
  NUTRI_QUIZ_QUESTIONS,
  NUTRI_QUIZ_RESULT_COPY,
  NUTRI_QUIZ_VER_PRATICA_HREF,
  getNutriQuizQuestionsForNicho,
} from '@/config/nutri-quiz-public'
import { NUTRI_DEMO_CLIENTE_NICHOS } from '@/lib/nutri-demo-cliente-data'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'

function isValidNutriNicho(v: string | null): v is string {
  return !!v && NUTRI_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildNutriPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'nutri',
    pathPrefix: '/pt/nutri',
    sessionStorageKey: 'ylada_nutri_quiz_respostas_v1',
    homePath: '/pt/nutri/home',
    logoHref: '/pt',
    loginHref: NUTRI_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: NUTRI_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: NUTRI_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual nicho você atua?',
    resultCopy: NUTRI_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'nutri_entrada_nicho',
      quizStep: 'nutri_quiz_step',
      quizConcluiu: 'nutri_quiz_concluiu',
      cadastroPromoCta: 'nutri_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidNutriNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getNutriQuizQuestionsForNicho(nicho)
      }
      return NUTRI_QUIZ_QUESTIONS
    },
  }
}
