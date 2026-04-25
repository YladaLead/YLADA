import {
  JOIAS_QUIZ_LOGIN_HREF,
  JOIAS_QUIZ_QUESTIONS,
  JOIAS_QUIZ_RESULT_COPY,
  JOIAS_QUIZ_VER_PRATICA_HREF,
  getJoiasQuizQuestionsForNicho,
} from '@/config/joias-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { JOIAS_DEMO_CLIENTE_NICHOS } from '@/lib/joias-demo-cliente-data'

function isValidJoiasNicho(v: string | null): v is string {
  return !!v && JOIAS_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildJoiasPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'joias',
    pathPrefix: '/pt/joias',
    sessionStorageKey: 'ylada_joias_quiz_respostas_v1',
    homePath: '/pt/joias/home',
    logoHref: '/pt',
    loginHref: JOIAS_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: JOIAS_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: JOIAS_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual foco você atua em joias e bijuterias?',
    resultCopy: JOIAS_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'joias_entrada_nicho',
      quizStep: 'joias_quiz_step',
      quizConcluiu: 'joias_quiz_concluiu',
      cadastroPromoCta: 'joias_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidJoiasNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getJoiasQuizQuestionsForNicho(nicho)
      }
      return JOIAS_QUIZ_QUESTIONS
    },
  }
}
