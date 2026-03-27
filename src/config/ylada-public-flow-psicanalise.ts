import {
  PSICANALISE_QUIZ_LOGIN_HREF,
  PSICANALISE_QUIZ_QUESTIONS,
  PSICANALISE_QUIZ_RESULT_COPY,
  PSICANALISE_QUIZ_VER_PRATICA_HREF,
  getPsicanaliseQuizQuestionsForNicho,
} from '@/config/psicanalise-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { PSICANALISE_DEMO_CLIENTE_NICHOS } from '@/lib/psicanalise-demo-cliente-data'

function isValidPsicanaliseNicho(v: string | null): v is string {
  return !!v && PSICANALISE_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildPsicanalisePublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'psicanalise',
    pathPrefix: '/pt/psicanalise',
    sessionStorageKey: 'ylada_psicanalise_quiz_respostas_v1',
    homePath: '/pt/psicanalise/home',
    logoHref: '/pt',
    loginHref: PSICANALISE_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: PSICANALISE_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: PSICANALISE_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual nicho você atua na psicanálise?',
    resultCopy: PSICANALISE_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'psicanalise_entrada_nicho',
      quizStep: 'psicanalise_quiz_step',
      quizConcluiu: 'psicanalise_quiz_concluiu',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidPsicanaliseNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getPsicanaliseQuizQuestionsForNicho(nicho)
      }
      return PSICANALISE_QUIZ_QUESTIONS
    },
  }
}
