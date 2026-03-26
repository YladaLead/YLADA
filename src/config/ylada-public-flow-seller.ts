import {
  SELLER_QUIZ_LOGIN_HREF,
  SELLER_QUIZ_QUESTIONS,
  SELLER_QUIZ_RESULT_COPY,
  SELLER_QUIZ_VER_PRATICA_HREF,
  getSellerQuizQuestionsForNicho,
} from '@/config/seller-quiz-public'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { SELLER_DEMO_CLIENTE_NICHOS } from '@/lib/seller-demo-cliente-data'

function isValidSellerNicho(v: string | null): v is string {
  return !!v && SELLER_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export function buildSellerPublicFlowConfig(): PublicFlowConfig {
  return {
    areaCodigo: 'seller',
    pathPrefix: '/pt/seller',
    sessionStorageKey: 'ylada_seller_quiz_respostas_v1',
    homePath: '/pt/seller/home',
    logoHref: '/pt',
    apresentacaoHref: '/pt/seller/apresentacao',
    loginHref: SELLER_QUIZ_LOGIN_HREF,
    verPraticaHrefBase: SELLER_QUIZ_VER_PRATICA_HREF,
    nichoQueryKey: 'nicho',
    nichos: SELLER_DEMO_CLIENTE_NICHOS,
    nichoPickerTitle: 'Qual destes cenários se parece mais com o jeito que você vende hoje?',
    resultCopy: SELLER_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'seller_entrada_nicho',
      quizStep: 'seller_quiz_step',
      quizConcluiu: 'seller_quiz_concluiu',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidSellerNicho,
    resolveQuestions: (entradaComNicho, nicho) => {
      if (entradaComNicho && nicho) {
        return getSellerQuizQuestionsForNicho(nicho)
      }
      return SELLER_QUIZ_QUESTIONS
    },
  }
}
