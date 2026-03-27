import {
  PERFUMARIA_QUIZ_LOGIN_HREF,
  PERFUMARIA_QUIZ_QUESTIONS,
  PERFUMARIA_QUIZ_RESULT_COPY,
  PERFUMARIA_QUIZ_VER_PRATICA_HREF,
  getPerfumariaQuizQuestionsForNicho,
} from '@/config/perfumaria-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { PERFUMARIA_DEMO_CLIENTE_NICHOS } from '@/lib/perfumaria-demo-cliente-data'

function isValidPerfumariaNicho(v: string | null): v is string {
  return !!v && PERFUMARIA_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildPerfumariaPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'perfumaria',
    pathPrefix: '/pt/perfumaria',
    sessionStorageKey: 'ylada_perfumaria_quiz_respostas_v1',
    homePath: '/pt/perfumaria/home',
    logoHref: '/pt',
    loginHref: PERFUMARIA_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: PERFUMARIA_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: PERFUMARIA_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual nicho você atua em perfumaria?',
    resultCopy: PERFUMARIA_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'perfumaria_entrada_nicho',
      quizStep: 'perfumaria_quiz_step',
      quizConcluiu: 'perfumaria_quiz_concluiu',
      cadastroPromoCta: 'perfumaria_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidPerfumariaNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getPerfumariaQuizQuestionsForNicho(nicho)
      }
      return PERFUMARIA_QUIZ_QUESTIONS
    },
  }
}
