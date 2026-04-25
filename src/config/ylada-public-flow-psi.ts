import {
  PSI_QUIZ_LOGIN_HREF,
  PSI_QUIZ_QUESTIONS,
  PSI_QUIZ_RESULT_COPY,
  PSI_QUIZ_VER_PRATICA_HREF,
  getPsiQuizQuestionsForNicho,
} from '@/config/psi-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { PSI_DEMO_CLIENTE_NICHOS } from '@/lib/psi-demo-cliente-data'

function isValidPsiNicho(v: string | null): v is string {
  return !!v && PSI_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildPsiPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'psi',
    pathPrefix: '/pt/psi',
    sessionStorageKey: 'ylada_psi_quiz_respostas_v1',
    homePath: '/pt/psi/home',
    logoHref: '/pt',
    loginHref: PSI_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: PSI_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: PSI_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual nicho você atua na psicologia?',
    resultCopy: PSI_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'psi_entrada_nicho',
      quizStep: 'psi_quiz_step',
      quizConcluiu: 'psi_quiz_concluiu',
      cadastroPromoCta: 'psi_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidPsiNicho,
    resolveQuestions: (entradaComNicho, nicho, _produtoLinha) => {
      if (entradaComNicho && nicho) {
        return getPsiQuizQuestionsForNicho(nicho)
      }
      return PSI_QUIZ_QUESTIONS
    },
  }
}
