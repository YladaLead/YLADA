import {
  JOIAS_QUIZ_LOGIN_HREF,
  JOIAS_QUIZ_QUESTIONS,
  JOIAS_QUIZ_RESULT_COPY,
  JOIAS_QUIZ_VER_PRATICA_HREF,
  getJoiasQuizQuestionsForNicho,
} from '@/config/joias-quiz-public'
import {
  JOIAS_LINHA_OPTIONS,
  JOIAS_LINHA_QUERY_KEY,
  isValidJoiasLinhaProduto,
} from '@/config/joias-linha-produto'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { JOIAS_DEMO_CLIENTE_NICHOS, isJoiasFunilFoco } from '@/lib/joias-demo-cliente-data'

function isValidJoiasFunilFoco(v: string | null): v is string {
  return !!v && isJoiasFunilFoco(v)
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
    nichoPickerTitle: 'E como você vende hoje?',
    produtoLinhaStep: {
      queryKey: JOIAS_LINHA_QUERY_KEY,
      options: JOIAS_LINHA_OPTIONS,
      pickerTitle: 'Primeiro: qual linha de produto é o centro do seu negócio?',
      isValidLinha: isValidJoiasLinhaProduto,
      entradaLinha: 'joias_entrada_linha',
    },
    resultCopy: JOIAS_QUIZ_RESULT_COPY,
    analytics: {
      entradaNicho: 'joias_entrada_nicho',
      entradaLinha: 'joias_entrada_linha',
      quizStep: 'joias_quiz_step',
      quizConcluiu: 'joias_quiz_concluiu',
      cadastroPromoCta: 'joias_cadastro_promo_cta',
    },
    rootExtraClassName:
      'estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]',
    mainExtraClassName: 'estetica-safe-main-bottom',
    isValidNicho: isValidJoiasFunilFoco,
    resolveQuestions: (entradaComNicho, nicho, produtoLinha) => {
      if (entradaComNicho && nicho) {
        return getJoiasQuizQuestionsForNicho(nicho, produtoLinha ?? null)
      }
      return JOIAS_QUIZ_QUESTIONS
    },
  }
}
