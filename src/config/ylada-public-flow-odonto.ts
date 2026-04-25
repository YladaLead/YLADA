/**
 * Funil público Odonto — paridade Estética/Nutri.
 */

import {
  ODONTO_QUIZ_LOGIN_HREF,
  ODONTO_QUIZ_QUESTIONS,
  ODONTO_QUIZ_RESULT_COPY,
  ODONTO_QUIZ_VER_PRATICA_HREF,
  getOdontoQuizQuestionsForNicho,
} from '@/config/odonto-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { ODONTO_DEMO_CLIENTE_NICHOS } from '@/lib/odonto-demo-cliente-data'

function isValidOdontoNicho(v: string | null): v is string {
  return !!v && ODONTO_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildOdontoPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'odonto',
    pathPrefix: '/pt/odonto',
    sessionStorageKey: 'ylada_odonto_quiz_respostas_v1',
    homePath: '/pt/odonto/home',
    logoHref: '/pt',
    loginHref: ODONTO_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: ODONTO_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: ODONTO_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Em qual nicho você atua em odontologia?',
    resultCopy: ODONTO_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'odonto_entrada_nicho',
      quizStep: 'odonto_quiz_step',
      quizConcluiu: 'odonto_quiz_concluiu',
      cadastroPromoCta: 'odonto_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidOdontoNicho,
    resolveQuestions: (entradaComNicho, nicho, _produtoLinha) => {
      if (entradaComNicho && nicho) {
        return getOdontoQuizQuestionsForNicho(nicho)
      }
      return ODONTO_QUIZ_QUESTIONS
    },
  }
}
