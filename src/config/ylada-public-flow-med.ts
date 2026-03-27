import {
  MED_QUIZ_LOGIN_HREF,
  MED_QUIZ_QUESTIONS,
  MED_QUIZ_RESULT_COPY,
  MED_QUIZ_VER_PRATICA_HREF,
  getMedQuizQuestionsForNicho,
} from '@/config/med-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { MED_DEMO_CLIENTE_NICHOS } from '@/lib/med-demo-cliente-data'

function isValidMedNicho(v: string | null): v is string {
  return !!v && MED_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildMedPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'med',
    pathPrefix: '/pt/med',
    sessionStorageKey: 'ylada_med_quiz_respostas_v1',
    homePath: '/pt/med/home',
    logoHref: '/pt',
    loginHref: MED_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: MED_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: MED_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual nicho você atua na medicina?',
    resultCopy: MED_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'med_entrada_nicho',
      quizStep: 'med_quiz_step',
      quizConcluiu: 'med_quiz_concluiu',
      cadastroPromoCta: 'med_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidMedNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getMedQuizQuestionsForNicho(nicho)
      }
      return MED_QUIZ_QUESTIONS
    },
  }
}
