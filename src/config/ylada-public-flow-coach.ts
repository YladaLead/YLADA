import {
  COACH_QUIZ_LOGIN_HREF,
  COACH_QUIZ_QUESTIONS,
  COACH_QUIZ_RESULT_COPY,
  COACH_QUIZ_VER_PRATICA_HREF,
  getCoachQuizQuestionsForNicho,
} from '@/config/coach-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { COACH_DEMO_CLIENTE_NICHOS } from '@/lib/coach-demo-cliente-data'

function isValidCoachNicho(v: string | null): v is string {
  return !!v && COACH_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildCoachPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'coach',
    pathPrefix: '/pt/coach',
    sessionStorageKey: 'ylada_coach_quiz_respostas_v1',
    homePath: '/pt/coach/home',
    logoHref: '/pt',
    loginHref: COACH_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: COACH_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: COACH_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Qual é o foco do seu coaching?',
    resultCopy: COACH_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'coach_entrada_nicho',
      quizStep: 'coach_quiz_step',
      quizConcluiu: 'coach_quiz_concluiu',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidCoachNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getCoachQuizQuestionsForNicho(nicho)
      }
      return COACH_QUIZ_QUESTIONS
    },
  }
}
