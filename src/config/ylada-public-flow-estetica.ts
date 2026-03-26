/**
 * Config do funil público Estética — usada por getPublicFlowConfig('estetica').
 * Perguntas e copy detalhados permanecem em estetica-quiz-public.ts e demo-cliente.
 */

import {
  ESTETICA_APRESENTACAO_HREF,
  ESTETICA_QUIZ_LOGIN_HREF,
  ESTETICA_QUIZ_QUESTIONS,
  ESTETICA_QUIZ_RESULT_COPY,
  ESTETICA_QUIZ_VER_PRATICA_HREF,
  getEsteticaQuizQuestionsForNicho,
} from '@/config/estetica-quiz-public'
import { ESTETICA_DEMO_CLIENTE_NICHOS } from '@/lib/estetica-demo-cliente-data'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'

function isValidProfNicho(v: string | null): v is string {
  return !!v && ESTETICA_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildEsteticaPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'estetica',
    pathPrefix: '/pt/estetica',
    sessionStorageKey: 'ylada_estetica_quiz_respostas_v1',
    homePath: '/pt/estetica/home',
    logoHref: '/pt',
    apresentacaoHref: ESTETICA_APRESENTACAO_HREF,
    loginHref: ESTETICA_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: ESTETICA_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: ESTETICA_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Qual é o seu foco em estética?',
    resultCopy: ESTETICA_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'estetica_entrada_nicho',
      quizStep: 'estetica_quiz_step',
      quizConcluiu: 'estetica_quiz_concluiu',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidProfNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getEsteticaQuizQuestionsForNicho(nicho)
      }
      return ESTETICA_QUIZ_QUESTIONS
    },
  }
}
